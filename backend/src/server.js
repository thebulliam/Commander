const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const fs = require('fs');

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

app.use(cors());
app.use(express.json());

// ─── ESTADO EN MEMORIA ───────────────────────────────────────
let state = {
  orders: {},       // { tableId: Order }
  tickets: [],      // Ticket[]
  chat: [],         // ChatMessage[]
  incidents: [],    // Incident[]
  clientNotes: {},  // { tableId: string[] }
  shiftStart: new Date().toISOString(),
};

// ─── API REST ─────────────────────────────────────────────────

// Health check
app.get('/api/health', (req, res) => res.json({ ok: true, time: new Date() }));

// Estado completo
app.get('/api/state', (req, res) => res.json(state));

// Crear / actualizar comanda
app.post('/api/orders', (req, res) => {
  const { tableId, items, note } = req.body;
  const order = {
    id: uuidv4(),
    tableId,
    items,
    note: note || '',
    status: 'waiting',
    sentAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
  };
  state.orders[tableId] = order;
  addTicket(order);
  io.emit('order:new', order);
  io.emit('state:update', state);
  res.json(order);
});

// Avanzar estado de ticket
app.patch('/api/tickets/:tableId/advance', (req, res) => {
  const { tableId } = req.params;
  const order = state.orders[tableId];
  if (!order) return res.status(404).json({ error: 'No encontrado' });

  const flow = { waiting: 'cooking', cooking: 'ready', ready: 'done' };
  const next = flow[order.status];

  if (next === 'done') {
    delete state.orders[tableId];
    state.tickets = state.tickets.filter(t => t.tableId !== tableId);
  } else {
    order.status = next;
    const ticket = state.tickets.find(t => t.tableId === tableId);
    if (ticket) ticket.status = next;
  }

  io.emit('ticket:advanced', { tableId, status: next });
  io.emit('state:update', state);
  res.json({ tableId, status: next });
});

// Chat
app.post('/api/chat', (req, res) => {
  const { text, from, role } = req.body;
  const msg = {
    id: uuidv4(),
    text,
    from,
    role,
    time: new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
    createdAt: new Date().toISOString(),
  };
  state.chat.push(msg);
  io.emit('chat:message', msg);
  res.json(msg);
});

// Incidencias
app.post('/api/incidents', (req, res) => {
  const { type, desc, table } = req.body;
  const incident = {
    id: uuidv4(),
    type,
    desc,
    table,
    time: new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
    createdAt: new Date().toISOString(),
  };
  state.incidents.push(incident);
  io.emit('incident:new', incident);
  io.emit('state:update', state);
  res.json(incident);
});

// Notas de cliente
app.post('/api/client-notes', (req, res) => {
  const { tableId, note } = req.body;
  if (!state.clientNotes[tableId]) state.clientNotes[tableId] = [];
  state.clientNotes[tableId].push(note);
  io.emit('state:update', state);
  res.json({ tableId, notes: state.clientNotes[tableId] });
});

// Exportar turno a JSON
app.get('/api/export', (req, res) => {
  const allItems = {};
  Object.values(state.orders).forEach(o => {
    o.items.forEach(i => { allItems[i.name] = (allItems[i.name] || 0) + i.qty; });
  });

  const export_data = {
    app: 'Commander',
    version: '1.0.0',
    fecha: new Date().toLocaleDateString('es-ES'),
    hora_cierre: new Date().toLocaleTimeString('es-ES'),
    turno_inicio: state.shiftStart,
    comandas: Object.values(state.orders).map(o => ({
      mesa: o.tableId,
      estado: o.status,
      items: o.items,
      nota: o.note,
      total: o.items.reduce((s, i) => s + i.price * i.qty, 0).toFixed(2),
      enviada_a: o.sentAt,
    })),
    incidencias: state.incidents,
    notas_clientes: state.clientNotes,
    estadisticas: {
      total_comandas: Object.keys(state.orders).length,
      facturacion_estimada: Object.values(state.orders)
        .reduce((sum, o) => sum + o.items.reduce((s, i) => s + i.price * i.qty, 0), 0)
        .toFixed(2) + '€',
      platos_mas_pedidos: Object.entries(allItems)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10)
        .map(([name, qty]) => ({ nombre: name, cantidad: qty })),
      total_incidencias: state.incidents.length,
    },
  };

  res.setHeader('Content-Disposition', `attachment; filename=commander_${new Date().toLocaleDateString('es-ES').replace(/\//g, '-')}.json`);
  res.json(export_data);
});

// Nuevo turno
app.post('/api/shift/reset', (req, res) => {
  state = {
    orders: {},
    tickets: [],
    chat: [],
    incidents: [],
    clientNotes: {},
    shiftStart: new Date().toISOString(),
  };
  io.emit('shift:reset');
  io.emit('state:update', state);
  res.json({ ok: true });
});

// ─── SOCKET.IO ─────────────────────────────────────────────────
io.on('connection', (socket) => {
  console.log(`[Commander] Cliente conectado: ${socket.id}`);

  // Enviar estado actual al conectarse
  socket.emit('state:update', state);

  socket.on('disconnect', () => {
    console.log(`[Commander] Cliente desconectado: ${socket.id}`);
  });

  // Offline queue: reenviar comandas pendientes
  socket.on('order:sync', (pendingOrders) => {
    pendingOrders.forEach(order => {
      if (!state.orders[order.tableId]) {
        state.orders[order.tableId] = order;
        addTicket(order);
      }
    });
    io.emit('state:update', state);
  });
});

// ─── HELPERS ──────────────────────────────────────────────────
function addTicket(order) {
  state.tickets = state.tickets.filter(t => t.tableId !== order.tableId);
  state.tickets.push({
    id: order.id,
    tableId: order.tableId,
    items: order.items,
    status: order.status,
    sentAt: order.sentAt,
    note: order.note,
  });
}

// ─── INICIO ───────────────────────────────────────────────────
const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`\n🔥 Commander Server corriendo en http://localhost:${PORT}`);
  console.log(`   API:    http://localhost:${PORT}/api`);
  console.log(`   Export: http://localhost:${PORT}/api/export\n`);
});
