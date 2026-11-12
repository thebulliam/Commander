import React from 'react';
import { useApp } from '../context/AppContext';
import { TABLES } from '../data/tables';
import { Table } from '../types';

interface TablesViewProps {
  onSelectTable: (tableId: string | number) => void;
}

type TableStatus = 'libre' | 'ocupada' | 'urgente' | 'lista';

const TablesView: React.FC<TablesViewProps> = ({ onSelectTable }) => {
  const { state } = useApp();

  const getStatus = (tableId: string | number): TableStatus => {
    const o = state.orders[String(tableId)];
    if (!o) return 'libre';
    if (o.status === 'ready') return 'lista';
    const mins = (Date.now() - new Date(o.sentAt).getTime()) / 60000;
    if (mins > 20) return 'urgente';
    return 'ocupada';
  };

  const interior = TABLES.filter(t => t.zone === 'interior');
  const terraza  = TABLES.filter(t => t.zone === 'terraza');

  const renderZone = (label: string, tables: Table[]) => (
    <div style={s.zone} key={label}>
      <div style={s.zoneLabel}>{label}</div>
      <div style={s.grid}>
        {tables.map(t => {
          const status = getStatus(t.id);
          const order  = state.orders[String(t.id)];
          const hasAllergen = order?.items.some(i => i.allergens.length > 0);
          const hasNote     = (state.clientNotes[String(t.id)] || []).length > 0;
          const totalItems  = order?.items.reduce((a, i) => a + i.qty, 0) || 0;
          const mins = order ? Math.floor((Date.now() - new Date(order.sentAt).getTime()) / 60000) : 0;

          return (
            <button
              key={String(t.id)}
              style={{
                ...s.card,
                borderColor: status === 'urgente' ? 'var(--red)' :
                             status === 'lista'   ? 'var(--green)' :
                             status === 'ocupada' ? 'var(--yellow)' : 'var(--border)',
                animation: status === 'urgente' ? 'pulse-border 1.5s infinite' : undefined,
              }}
              onClick={() => onSelectTable(t.id)}
            >
              {/* Badges top */}
              <div style={s.badges}>
                {hasAllergen && <span title="Contiene alérgenos">⚠️</span>}
                {hasNote && <span title="Nota de cliente">👤</span>}
                {totalItems > 0 && <span style={s.countBadge}>{totalItems}</span>}
              </div>

              {/* Número de mesa */}
              <div style={s.tableNum}>
                {typeof t.id === 'number' ? t.id : t.id.toString().replace('T', '')}
              </div>
              <div style={s.tableZone}>{t.zone === 'terraza' ? 'terraza' : 'interior'}</div>

              {/* Estado */}
              <div style={{
                ...s.statusText,
                color: status === 'urgente' ? 'var(--red)' :
                       status === 'lista'   ? 'var(--green)' :
                       status === 'ocupada' ? 'var(--yellow)' : 'var(--text-muted)',
              }}>
                {status === 'libre'   && 'Libre'}
                {status === 'ocupada' && `En curso · ${mins}min`}
                {status === 'urgente' && `¡Urgente! ${mins}min`}
                {status === 'lista'   && 'Lista ✓'}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );

  return (
    <div style={s.wrap}>
      {renderZone('Interior', interior)}
      {renderZone('Terraza', terraza)}
    </div>
  );
};

const s: Record<string, React.CSSProperties> = {
  wrap:      { padding: 12, overflowY: 'auto', height: '100%' },
  zone:      { marginBottom: 18 },
  zoneLabel: { fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', letterSpacing: 1.5, marginBottom: 8, textTransform: 'uppercase' },
  grid:      { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: 10 },
  card: {
    background: 'var(--surface)', border: '2px solid var(--border)',
    borderRadius: 'var(--radius)', padding: '14px 12px', cursor: 'pointer',
    textAlign: 'center', transition: 'border-color .15s', position: 'relative',
    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
  },
  badges:    { position: 'absolute', top: 7, left: 7, display: 'flex', gap: 3, fontSize: 13 },
  countBadge: {
    background: 'var(--fire)', color: '#fff', fontSize: 11, fontWeight: 700,
    borderRadius: '50%', width: 18, height: 18, display: 'flex',
    alignItems: 'center', justifyContent: 'center',
  },
  tableNum:  { fontSize: 30, fontWeight: 900, lineHeight: 1 },
  tableZone: { fontSize: 10, color: 'var(--text-muted)', fontWeight: 500 },
  statusText: { fontSize: 11, fontWeight: 600, marginTop: 2 },
};

export default TablesView;
