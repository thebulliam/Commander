import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { getTableLabel } from '../data/tables';
import { Ticket, OrderStatus } from '../types';

interface KitchenBoardProps {
  onChat: (prefill: string) => void;
}

type ColStatus = 'waiting' | 'cooking' | 'ready';

const COLS: { status: ColStatus; label: string; icon: string; color: string }[] = [
  { status: 'waiting', label: 'Pendiente', icon: '⏳', color: 'var(--yellow)' },
  { status: 'cooking', label: 'Preparando', icon: '🔥', color: 'var(--fire)' },
  { status: 'ready',   label: 'Listo',      icon: '✅', color: 'var(--green)' },
];

const ADVANCE_LABEL: Record<string, string> = {
  waiting: '🔥 Cocinar',
  cooking: '✅ Listo',
  ready:   '🍽️ Servido',
};

const KitchenBoard: React.FC<KitchenBoardProps> = ({ onChat }) => {
  const { state, advanceTicket, role } = useApp();
  const [, forceUpdate] = useState(0);

  // Actualizar temporizadores cada 30s
  useEffect(() => {
    const id = setInterval(() => forceUpdate(n => n + 1), 30000);
    return () => clearInterval(id);
  }, []);

  const getElapsed = (sentAt: string) =>
    Math.floor((Date.now() - new Date(sentAt).getTime()) / 60000);

  const getTimerColor = (mins: number, status: OrderStatus) => {
    if (status === 'ready') return 'var(--green)';
    if (mins > 20) return 'var(--red)';
    if (mins > 10) return 'var(--yellow)';
    return 'var(--green)';
  };

  // Filtrar tickets según el rol
  const filterItems = (ticket: Ticket) => {
    if (role === 'bar') return ticket.items.filter(i => i.section === 'bar');
    if (role === 'kitchen') return ticket.items.filter(i => i.section === 'kitchen');
    return ticket.items;
  };

  const tickets = state.tickets
    .map(t => ({ ...t, items: filterItems(t) }))
    .filter(t => t.items.length > 0);

  return (
    <div style={s.board}>
      {COLS.map(col => {
        const colTickets = tickets.filter(t => t.status === col.status);
        return (
          <div key={col.status} style={s.col}>
            <div style={{ ...s.colHeader, borderBottomColor: col.color, background: col.color + '15' }}>
              <span style={{ ...s.colTitle, color: col.color }}>{col.icon} {col.label}</span>
              <span style={{ ...s.colCount, color: col.color }}>{colTickets.length}</span>
            </div>
            <div style={s.ticketList}>
              {colTickets.length === 0 && (
                <div style={s.empty}>Sin {col.label.toLowerCase()}</div>
              )}
              {colTickets.map(ticket => {
                const mins = getElapsed(ticket.sentAt);
                const timerColor = getTimerColor(mins, ticket.status);
                const isUrgent = mins > 20 && ticket.status !== 'ready';
                return (
                  <div key={ticket.id} style={{
                    ...s.ticket,
                    borderColor: isUrgent ? 'var(--red)' : 'var(--border)',
                    animation: isUrgent ? 'pulse-border 1.5s infinite' : undefined,
                  }} className="animate-slide-up">
                    {/* Header del ticket */}
                    <div style={s.ticketHeader}>
                      <span style={s.ticketTable}>{getTableLabel(ticket.tableId)}</span>
                      <span style={{ ...s.timer, color: timerColor, background: timerColor + '18' }}>
                        {mins}min
                      </span>
                    </div>

                    {/* Items */}
                    <div style={s.itemList}>
                      {ticket.items.map((item, idx) => (
                        <div key={idx} style={s.ticketItem}>
                          <span style={s.ticketQty}>{item.qty}×</span>
                          <span style={s.ticketName}>{item.name}</span>
                          {item.allergens.length > 0 && (
                            <span style={s.allergenIcon} title={item.allergens.join(', ')}>⚠️</span>
                          )}
                        </div>
                      ))}
                    </div>

                    {/* Nota */}
                    {ticket.note && (
                      <div style={s.note}>📝 {ticket.note}</div>
                    )}

                    {/* Acciones */}
                    <div style={s.actions}>
                      <button
                        style={{
                          ...s.actionBtn,
                          background: col.status === 'ready' ? 'var(--green)' : 'var(--fire)',
                        }}
                        onClick={() => advanceTicket(ticket.tableId)}
                      >
                        {ADVANCE_LABEL[col.status]}
                      </button>
                      <button
                        style={s.chatBtn}
                        onClick={() => onChat(`${getTableLabel(ticket.tableId)} – `)}
                      >
                        💬
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
};

const s: Record<string, React.CSSProperties> = {
  board:      { display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, padding: 10, height: '100%', overflowY: 'auto', alignItems: 'start' },
  col:        { background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', overflow: 'hidden' },
  colHeader:  { padding: '10px 12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid', flexShrink: 0 },
  colTitle:   { fontSize: 12, fontWeight: 700 },
  colCount:   { fontSize: 20, fontWeight: 900 },
  ticketList: { padding: 8, display: 'flex', flexDirection: 'column', gap: 8, minHeight: 60 },
  empty:      { padding: '16px 0', textAlign: 'center', color: 'var(--text-muted)', fontSize: 12 },
  ticket:     { background: 'var(--surface2)', border: '1.5px solid var(--border)', borderRadius: 'var(--radius-sm)', padding: 10, transition: 'border-color .2s' },
  ticketHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  ticketTable:  { fontSize: 14, fontWeight: 800 },
  timer:      { fontSize: 11, fontWeight: 700, padding: '2px 7px', borderRadius: 4, fontVariantNumeric: 'tabular-nums' },
  itemList:   { display: 'flex', flexDirection: 'column', gap: 4, marginBottom: 8 },
  ticketItem: { display: 'flex', alignItems: 'center', gap: 5, fontSize: 13 },
  ticketQty:  { fontWeight: 800, color: 'var(--fire)', minWidth: 20 },
  ticketName: { flex: 1 },
  allergenIcon: { fontSize: 12 },
  note:       { fontSize: 12, color: 'var(--text-muted)', background: 'var(--border)', padding: '4px 8px', borderRadius: 4, marginBottom: 8, fontStyle: 'italic' },
  actions:    { display: 'flex', gap: 6 },
  actionBtn:  { flex: 1, padding: '7px 4px', borderRadius: 'var(--radius-sm)', border: 'none', fontSize: 12, fontWeight: 700, cursor: 'pointer', color: '#fff' },
  chatBtn:    { width: 34, height: 34, borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)', background: 'var(--surface)', cursor: 'pointer', fontSize: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
};

export default KitchenBoard;
