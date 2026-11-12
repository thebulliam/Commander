import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { AppState, Role, Order, OrderItem, ChatMessage, Incident, IncidentType } from '../types';

const API = process.env.REACT_APP_API_URL || 'http://localhost:3001';

interface AppContextType {
  role: Role | null;
  state: AppState;
  connected: boolean;
  setRole: (r: Role) => void;
  sendOrder: (tableId: string | number, items: OrderItem[], note: string) => Promise<void>;
  advanceTicket: (tableId: string | number) => Promise<void>;
  sendChat: (text: string) => Promise<void>;
  addIncident: (type: IncidentType, desc: string, table?: string) => Promise<void>;
  addClientNote: (tableId: string | number, note: string) => Promise<void>;
  exportShift: () => void;
  resetShift: () => Promise<void>;
  pendingQueue: Order[];
}

const defaultState: AppState = {
  orders: {},
  tickets: [],
  chat: [],
  incidents: [],
  clientNotes: {},
  shiftStart: new Date().toISOString(),
};

const AppContext = createContext<AppContextType | null>(null);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRoleState] = useState<Role | null>(null);
  const [state, setState] = useState<AppState>(defaultState);
  const [connected, setConnected] = useState(false);
  const [pendingQueue, setPendingQueue] = useState<Order[]>([]);
  const wsRef = useRef<WebSocket | null>(null);
  const pollRef = useRef<NodeJS.Timeout | null>(null);

  // Polling fallback cuando no hay WS
  const fetchState = useCallback(async () => {
    try {
      const res = await fetch(`${API}/api/state`);
      if (res.ok) {
        const data = await res.json();
        setState(data);
        setConnected(true);
        // Sincronizar pendientes
        if (pendingQueue.length > 0) {
          await fetch(`${API}/api/orders/sync`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(pendingQueue),
          });
          setPendingQueue([]);
        }
      }
    } catch {
      setConnected(false);
    }
  }, [pendingQueue]);

  useEffect(() => {
    fetchState();
    pollRef.current = setInterval(fetchState, 3000);
    return () => { if (pollRef.current) clearInterval(pollRef.current); };
  }, [fetchState]);

  const setRole = (r: Role) => setRoleState(r);

  const sendOrder = useCallback(async (tableId: string | number, items: OrderItem[], note: string) => {
    const order = {
      id: `local-${Date.now()}`,
      tableId: String(tableId),
      items,
      note,
      status: 'waiting' as const,
      sentAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    };

    // Optimistic update
    setState(prev => ({
      ...prev,
      orders: { ...prev.orders, [String(tableId)]: order },
    }));

    try {
      await fetch(`${API}/api/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tableId: String(tableId), items, note }),
      });
    } catch {
      // Offline: guardar en cola
      setPendingQueue(prev => [...prev.filter(o => o.tableId !== String(tableId)), order]);
    }
  }, []);

  const advanceTicket = useCallback(async (tableId: string | number) => {
    const tid = String(tableId);
    // Optimistic
    setState(prev => {
      const flow: Record<string, string> = { waiting: 'cooking', cooking: 'ready', ready: 'done' };
      const order = prev.orders[tid];
      if (!order) return prev;
      const next = flow[order.status];
      if (next === 'done') {
        const { [tid]: _, ...rest } = prev.orders;
        return { ...prev, orders: rest, tickets: prev.tickets.filter(t => t.tableId !== tid) };
      }
      return {
        ...prev,
        orders: { ...prev.orders, [tid]: { ...order, status: next as any } },
        tickets: prev.tickets.map(t => t.tableId === tid ? { ...t, status: next as any } : t),
      };
    });

    try {
      await fetch(`${API}/api/tickets/${tid}/advance`, { method: 'PATCH' });
    } catch {}
  }, []);

  const sendChat = useCallback(async (text: string) => {
    if (!role) return;
    const roleNames = { waiter: 'Sala', kitchen: 'Cocina', bar: 'Barra' };
    try {
      await fetch(`${API}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, from: roleNames[role], role }),
      });
    } catch {}
  }, [role]);

  const addIncident = useCallback(async (type: IncidentType, desc: string, table?: string) => {
    try {
      await fetch(`${API}/api/incidents`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, desc, table }),
      });
    } catch {}
  }, []);

  const addClientNote = useCallback(async (tableId: string | number, note: string) => {
    setState(prev => ({
      ...prev,
      clientNotes: {
        ...prev.clientNotes,
        [String(tableId)]: [...(prev.clientNotes[String(tableId)] || []), note],
      },
    }));
    try {
      await fetch(`${API}/api/client-notes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tableId: String(tableId), note }),
      });
    } catch {}
  }, []);

  const exportShift = useCallback(() => {
    window.open(`${API}/api/export`, '_blank');
  }, []);

  const resetShift = useCallback(async () => {
    await fetch(`${API}/api/shift/reset`, { method: 'POST' });
    setState(defaultState);
  }, []);

  return (
    <AppContext.Provider value={{
      role, state, connected, setRole,
      sendOrder, advanceTicket, sendChat,
      addIncident, addClientNote, exportShift, resetShift,
      pendingQueue,
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp fuera de AppProvider');
  return ctx;
};
