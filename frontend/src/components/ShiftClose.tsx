import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

const ShiftClose: React.FC = () => {
  const { state, exportShift, resetShift } = useApp();
  const [confirming, setConfirming] = useState(false);

  const totalRevenue = Object.values(state.orders)
    .reduce((sum, o) => sum + o.items.reduce((s, i) => s + i.price * i.qty, 0), 0);

  const allItems: Record<string, number> = {};
  Object.values(state.orders).forEach(o =>
    o.items.forEach(i => { allItems[i.name] = (allItems[i.name] || 0) + i.qty; })
  );
  const topItem = Object.entries(allItems).sort((a, b) => b[1] - a[1])[0];

  const handleReset = async () => {
    await resetShift();
    setConfirming(false);
  };

  return (
    <div style={s.wrap}>
      {/* Resumen */}
      <div style={s.section}>
        <div style={s.sectionTitle}>Resumen del turno</div>
        <div style={s.rows}>
          <div style={s.row}><span style={s.rowLabel}>Mesas atendidas</span><span style={s.rowValue}>{Object.keys(state.orders).length}</span></div>
          <div style={s.row}><span style={s.rowLabel}>Facturación estimada</span><span style={{ ...s.rowValue, color: 'var(--fire)' }}>{totalRevenue.toFixed(2)}€</span></div>
          <div style={s.row}><span style={s.rowLabel}>Incidencias</span><span style={{ ...s.rowValue, color: state.incidents.length > 0 ? 'var(--red)' : 'var(--green)' }}>{state.incidents.length}</span></div>
          <div style={s.row}><span style={s.rowLabel}>Mensajes de chat</span><span style={s.rowValue}>{state.chat.length}</span></div>
          {topItem && <div style={s.row}><span style={s.rowLabel}>Plato estrella</span><span style={{ ...s.rowValue, fontSize: 13 }}>{topItem[0]} ({topItem[1]}×)</span></div>}
          <div style={s.row}><span style={s.rowLabel}>Inicio turno</span><span style={{ ...s.rowValue, fontSize: 12 }}>{new Date(state.shiftStart).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}</span></div>
          <div style={s.row}><span style={s.rowLabel}>Ahora</span><span style={{ ...s.rowValue, fontSize: 12 }}>{new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}</span></div>
        </div>
      </div>

      {/* Exportar JSON */}
      <div style={s.section}>
        <div style={s.sectionTitle}>📁 Exportar datos</div>
        <div style={s.desc}>Descarga un JSON completo con todas las comandas, estadísticas, incidencias y notas del turno.</div>
        <button style={s.exportBtn} onClick={exportShift}>
          ⬇️ Descargar JSON del turno
        </button>
      </div>

      {/* Nuevo turno */}
      <div style={{ ...s.section, borderColor: 'var(--red)' }}>
        <div style={s.sectionTitle}>🔄 Nuevo turno</div>
        <div style={s.desc}>Limpia todas las comandas activas para empezar fresco. Exporta antes si quieres guardar los datos.</div>

        {!confirming ? (
          <button style={s.resetBtn} onClick={() => setConfirming(true)}>
            Iniciar nuevo turno
          </button>
        ) : (
          <div style={s.confirmBox}>
            <div style={s.confirmText}>¿Seguro? Se borrarán todas las comandas activas.</div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button style={s.confirmYes} onClick={handleReset}>Sí, nuevo turno</button>
              <button style={s.confirmNo} onClick={() => setConfirming(false)}>Cancelar</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const s: Record<string, React.CSSProperties> = {
  wrap:        { overflowY: 'auto', padding: 12, height: '100%', display: 'flex', flexDirection: 'column', gap: 10 },
  section:     { background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: 16 },
  sectionTitle:{ fontSize: 15, fontWeight: 800, marginBottom: 12 },
  rows:        { display: 'flex', flexDirection: 'column', gap: 0 },
  row:         { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '9px 0', borderBottom: '1px solid var(--border)' },
  rowLabel:    { fontSize: 14, color: 'var(--text-muted)' },
  rowValue:    { fontSize: 15, fontWeight: 700 },
  desc:        { fontSize: 13, color: 'var(--text-muted)', marginBottom: 12, lineHeight: 1.5 },
  exportBtn:   { width: '100%', padding: 14, background: 'var(--green)', border: 'none', borderRadius: 'var(--radius)', color: '#fff', fontSize: 15, fontWeight: 700, cursor: 'pointer' },
  resetBtn:    { width: '100%', padding: 14, background: 'var(--surface2)', border: '1.5px solid var(--red)', borderRadius: 'var(--radius)', color: 'var(--red)', fontSize: 15, fontWeight: 700, cursor: 'pointer' },
  confirmBox:  { display: 'flex', flexDirection: 'column', gap: 10 },
  confirmText: { fontSize: 14, color: 'var(--text)', fontWeight: 600 },
  confirmYes:  { flex: 1, padding: 12, background: 'var(--red)', border: 'none', borderRadius: 'var(--radius-sm)', color: '#fff', fontSize: 14, fontWeight: 700, cursor: 'pointer' },
  confirmNo:   { flex: 1, padding: 12, background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', color: 'var(--text)', fontSize: 14, fontWeight: 700, cursor: 'pointer' },
};

export default ShiftClose;
