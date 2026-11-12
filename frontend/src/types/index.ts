export type Role = 'waiter' | 'kitchen' | 'bar';

export type OrderStatus = 'pending' | 'waiting' | 'cooking' | 'ready' | 'done';

export type IncidentType = 'devuelto' | 'error' | 'queja' | 'otro';

export interface MenuItem {
  id: string;
  name: string;
  price: number;
  allergens: string[];
  section: 'kitchen' | 'bar';
  category: string;
}

export interface OrderItem extends MenuItem {
  qty: number;
}

export interface Order {
  id: string;
  tableId: string | number;
  items: OrderItem[];
  note: string;
  status: OrderStatus;
  sentAt: string;
  createdAt: string;
}

export interface Ticket {
  id: string;
  tableId: string | number;
  items: OrderItem[];
  status: OrderStatus;
  sentAt: string;
  note: string;
}

export interface ChatMessage {
  id: string;
  text: string;
  from: string;
  role: Role;
  time: string;
  createdAt: string;
}

export interface Incident {
  id: string;
  type: IncidentType;
  desc: string;
  table?: string;
  time: string;
  createdAt: string;
}

export interface AppState {
  orders: Record<string, Order>;
  tickets: Ticket[];
  chat: ChatMessage[];
  incidents: Incident[];
  clientNotes: Record<string, string[]>;
  shiftStart: string;
}

export interface Table {
  id: string | number;
  label: string;
  zone: 'interior' | 'terraza' | 'evento';
}
