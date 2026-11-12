import React from 'react';
import { useApp } from '../context/AppContext';

const StatsView: React.FC = () => {
  const { state } = useApp();

  const allItems: Record<string, number> = {};
  Object.values(state.orders).forEach(o =>
    o.items.forEach(i => { allItems[i.name] = (allItems[i.name] || 0) + i.qty; })
  );
  const topItems = Object.entries(allItems).sort((a, b) => b[1] - a[1]).slice(0, 6);
  const maxQty = topItems[0]?.[1] || 1;

  const totalRevenue = Object.values(state.orders)
    .reduce((sum, o) => sum + o.items.reduce((s, i) => s + i.price * i.qty, 0), 0);
  const activeTables = Object.keys(state.orders).length;
  const readyCount = Object.values(state.orders).filter(o => o.status === 'ready').length;

  const statCards = [
    { label: 'Mesas activas', value: activeTables, color: 'var(--fire)', sub: 'en curso' },
    { label: 'Facturación',   value: `${totalRevenue.toFixed(0)}€`, color: 'var(--green)', sub: 'estimada' },
    { label: 'Listos',        value: readyCount,   color: 'var(--yellow)', sub: 'para servir' },
    { label: 'Incidencias',   value: state.incidents.length, color: state.incidents.length > 0 ? 'var(--red)' : 'var(--green)', sub: 'este turno' },
  ];

  return (
    <div style={s.wrap}>
      <div style={s.grid}>
        {statCards.map(c => (
          <div key={c.label} style={s.card}>
            <div style={s.cardLabel}>{c.label}</div>
            <div style={{ ...s.cardValue, color: c.color }}>{c.value}</div>
            <div style={s.cardSub}>{c.sub}</div>
          </div>
        ))}
      </div>

      {/* Top platos */}
      <div style={s.section}>
        <div style={s.sectionTitle}>Platos más pedidos</div>
        {topItems.length === 0 ? (
          <div style={s.empty}>Sin datos aún</div>
        ) : (
          <div style={s.barList}>
            {topItems.map(([name, qty]) => (
              <div key={name} style={s.barItem}>
                <div style={s.barName}>{name}</div>
                <div style={s.barTrack}>
                  <div style={{ ...s.barFill, width: `${Math.round(qty / maxQty * 100)}%` }} />
                </div>
                <div style={s.barCount}>{qty}×</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Resumen por estado */}
      <div style={s.section}>
        <div style={s.sectionTitle}>Estado de mesas</div>
        {Object.entries(state.orders).length === 0 ? (
          <div style={s.empty}>Sin comandas activas</div>
        ) : (
          Object.entries(state.orders).map(([tid, order]) => {
            const mins = Math.floor((Date.now() - new Date(order.sentAt).getTime()) / 60000);
            const statusColor = order.status === 'ready' ? 'var(--green)' : order.status === 'cooking' ? 'var(--fire)' : 'var(--yellow)';
            const total = order.items.reduce((s, i) => s + i.price * i.qty, 0);
            return (
              <div key={tid} style={s.tableRow}>
                <span style={s.tableRowName}>{isNaN(Number(tid)) ? `Terraza ${tid.slice(1)}` : `Mesa ${tid}`}</span>
                <span style={{ ...s.tableRowStatus, color: statusColor }}>
                  {order.status === 'waiting' ? 'Pendiente' : order.status === 'cooking' ? 'Cocinando' : 'Lista'}
                </span>
                <span style={s.tableRowTime}>{mins}min</span>
                <span style={s.tableRowTotal}>{total.toFixed(2)}€</span>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

const s: Record<string, React.CSSProperties> = {
  wrap:    { overflowY: 'auto', padding: 12, height: '100%', display: 'flex', flexDirection: 'column', gap: 12 },
  grid:    { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 },
  card:    { background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: 16 },
  cardLabel: { fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6 },
  cardValue: { fontSize: 28, fontWeight: 900 },
  cardSub:   { fontSize: 12, color: 'var(--text-muted)', marginTop: 2 },
  section:   { background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: 14 },
  sectionTitle: { fontSize: 13, fontWeight: 700, color: 'var(--text-dim)', marginBottom: 12 },
  empty:     { fontSize: 14, color: 'var(--text-muted)', textAlign: 'center', padding: '12px 0' },
  barList:   { display: 'flex', flexDirection: 'column', gap: 10 },
  barItem:   { display: 'flex', alignItems: 'center', gap: 10 },
  barName:   { fontSize: 13, fontWeight: 500, minWidth: 120, maxWidth: 120, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
  barTrack:  { flex: 1, height: 6, background: 'var(--border)', borderRadius: 3, overflow: 'hidden' },
  barFill:   { height: '100%', background: 'var(--fire)', borderRadius: 3, transition: 'width .4s ease' },
  barCount:  { fontSize: 13, fontWeight: 700, color: 'var(--fire)', minWidth: 28, textAlign: 'right' },
  tableRow:  { display: 'flex', alignItems: 'center', gap: 10, padding: '7px 0', borderBottom: '1px solid var(--border)', fontSize: 13 },
  tableRowName:   { flex: 1, fontWeight: 600 },
  tableRowStatus: { fontWeight: 700, fontSize: 12 },
  tableRowTime:   { color: 'var(--text-muted)', minWidth: 36 },
  tableRowTotal:  { color: 'var(--fire)', fontWeight: 700, minWidth: 50, textAlign: 'right' },
};

export default StatsView;
