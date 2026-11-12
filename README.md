# 🔥 Commander – Sistema de Gestión de Comandas

> App web local para bares, chiringuitos y restaurantes pequeños. Sin suscripción, sin nube, sin datos en servidores externos.

---

## ✨ Funcionalidades

### Camarero (móvil)
- ✅ Mesas con estado visual en tiempo real (libre / en curso / urgente / lista)
- ✅ Alerta automática de alérgenos al añadir platos
- ✅ Notas de cliente por mesa (memoria entre servicios)
- ✅ Nota de texto libre para cocina (punto de carne, sin cebolla...)
- ✅ Cola offline – las comandas se guardan si cae el WiFi y se sincronizan solas

### Cocina / Barra (tablet)
- ✅ Tablero Kanban: Pendiente → Preparando → Listo
- ✅ Temporizador visual por ticket (verde / amarillo / rojo)
- ✅ Alertas de alérgenos visibles en cada ticket
- ✅ Chat contextual sala ↔ cocina
- ✅ Avance de estado con un toque

### Gestión
- ✅ Estadísticas en tiempo real del turno
- ✅ Registro de incidencias (platos devueltos, errores, quejas)
- ✅ Exportación JSON al cierre del turno
- ✅ Nuevo turno limpio con un botón
- ✅ Funciona 100% en LAN local sin internet

---

## 🛠️ Stack técnico

| Capa      | Tecnología                          |
|-----------|-------------------------------------|
| Frontend  | React 18 + TypeScript               |
| Estilos   | CSS custom properties (sin librerías)|
| Tiempo real | Polling cada 3s (Socket.io ready) |
| Backend   | Node.js + Express + Socket.io       |
| Datos     | En memoria (JSON export al cierre)  |
| Red       | LAN local, sin dependencias cloud   |

---

## 🚀 Instalación y uso

### Requisitos
- Node.js 18+
- npm 9+
- Red WiFi local compartida entre dispositivos

### Backend (servidor – PC o Raspberry Pi del local)

```bash
cd backend
npm install
npm start
# → Servidor en http://localhost:3001
```

### Frontend (interfaz web)

```bash
cd frontend
npm install
npm start
# → App en http://localhost:3000
```

### En producción (misma red)

```bash
# Build del frontend
cd frontend
npm run build

# El backend sirve el build estático
# Edita backend/src/server.js y añade al final:
# app.use(express.static(path.join(__dirname, '../../frontend/build')));
```

Luego cada dispositivo abre el navegador en `http://IP-DEL-SERVIDOR:3001`

---

## 📱 Dispositivos recomendados

| Dispositivo | Rol |
|-------------|-----|
| Móvil (camarero) | Sala – tomar comandas |
| Tablet 10" (cocina) | Cocina – tablero Kanban |
| Tablet 10" (barra) | Barra – bebidas y cafés |

---

## 📁 Estructura del proyecto

```
commander/
├── backend/
│   ├── src/
│   │   └── server.js          # Servidor Express + Socket.io
│   └── package.json
├── frontend/
│   ├── public/
│   │   └── index.html
│   └── src/
│       ├── components/
│       │   ├── RoleScreen.tsx       # Pantalla selección de rol
│       │   ├── Topbar.tsx           # Barra superior con reloj
│       │   ├── TablesView.tsx       # Vista de mesas (camarero)
│       │   ├── OrderPanel.tsx       # Panel de toma de comanda
│       │   ├── KitchenBoard.tsx     # Tablero Kanban cocina/barra
│       │   ├── ChatPanel.tsx        # Chat sala ↔ cocina
│       │   ├── StatsView.tsx        # Estadísticas del turno
│       │   ├── IncidentsView.tsx    # Incidencias
│       │   ├── ShiftClose.tsx       # Cierre y exportación JSON
│       │   └── ClientNotesModal.tsx # Notas por cliente/mesa
│       ├── context/
│       │   └── AppContext.tsx       # Estado global + API calls
│       ├── data/
│       │   ├── menu.ts              # Carta completa con alérgenos
│       │   └── tables.ts            # Configuración de mesas
│       ├── types/
│       │   └── index.ts             # Tipos TypeScript
│       ├── App.tsx                  # App principal
│       └── index.tsx                # Entry point
└── README.md
```

---

## 🗺️ Hoja de ruta (próximas versiones)

### V2
- [ ] Comanda por voz offline (Whisper local)
- [ ] Cuenta dividida inteligente por comensal
- [ ] QR de mesa con autocomanda asistida
- [ ] Carga de trabajo por estación de cocina

### V3
- [ ] Modo evento / terraza temporal configurable
- [ ] Backup automático en papel (impresión)
- [ ] Histórico entre turnos
- [ ] App móvil nativa (Capacitor/Expo)

---

## 💶 Modelo de negocio sugerido

- **Pago único por local**: 49–99€ (instalación incluida)
- **Soporte anual opcional**: 20–30€/año
- **Versión evento**: 5–10€/día de uso

---

*Commander · The Bulliam · v1.0.0*
