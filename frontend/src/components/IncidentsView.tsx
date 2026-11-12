import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { IncidentType } from '../types';

const IncidentsView: React.FC = () => {
  const { state, addIncident } = useApp();
  const [showForm, setShowForm] = useState(false);
  const [type, setType] = useState<IncidentType>('error');
  const [desc, setDesc] = useState('');
  const [table, setTable] = useState('');

  const handleAdd = async () => {
    if (!desc.trim()) return;
    await addIncident(type, desc.trim(), table.trim() || undefined);
    setDesc(''); setTable(''); setShowForm(false);
  };

  const typeStyles: Record<IncidentType, React.CSSProperties> = {
    devuelto: { background: 'var(--red-dim)', color: 'var(--red)' },
    error:    { background: 'var(--yellow-dim)', color: 'var(--yellow)' },
    queja:    { background: 'var(--red-dim)', color: 'var(--red)' },
    otro:     { background: 'var(--blue-dim)', color: 'var(--blue)' },
  };

  const typeLabel: Record<IncidentType, string> = {
    devuelto: '↩️ Devuelto',
    error:    '⚠️ Error comanda',
    queja:    '😤 Queja',
    otro:     '📝 Otro',
  };

  return (
    <div style={s.wrap}>
      <div style={s.topRow}>
        <div style={s.heading}>Incidencias del turno</div>
        <button style={s.addBtn} onClick={() => setShowForm(v => !v)}>
          {showForm ? 'Cancelar' : '+ Nueva'}
        </button>
      </div>

      {showForm && (
        <div style={s.form} className="animate-slide-up">
          <select style={s.select} value={type} onChange={e => setType(e.target.value as IncidentType)}>
            <option value="error">⚠️ Error de comanda</option>
            <option value="devuelto">↩️ Plato devuelto</option>
            <option value="queja">😤 Queja del cliente</option>
            <option value="otro">📝 Otro</option>
          </select>
          <input style={s.input} placeholder="Mesa (opcional)" value={table} onChange={e => setTable(e.target.value)} />
          <textarea
            style={s.textarea}
            placeholder="Describe la incidencia..."
            value={desc}
            onChange={e => setDesc(e.target.value)}
            rows={3}
          />
          <button style={s.saveBtn} onClick={handleAdd} disabled={!desc.trim()}>Guardar incidencia</button>
        </div>
      )}

      {state.incidents.length === 0 ? (
        <div style={s.empty}>Sin incidencias hoy 🎉</div>
      ) : (
        <div style={s.list}>
          {[...state.incidents].reverse().map(inc => (
            <div key={inc.id} style={s.card}>
              <div style={s.cardHeader}>
                <span style={{ ...s.badge, ...typeStyles[inc.type] }}>{typeLabel[inc.type]}</span>
                <span style={s.time}>{inc.time}</span>
                {inc.table && <span style={s.tableTag}>{inc.table}</span>}
              </div>
              <div style={s.incDesc}>{inc.desc}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const s: Record<string, React.CSSProperties> = {
  wrap:      { overflowY: 'auto', padding: 12, height: '100%', display: 'flex', flexDirection: 'column', gap: 10 },
  topRow:    { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  heading:   { fontSize: 16, fontWeight: 800 },
  addBtn:    { padding: '7px 14px', background: 'var(--red)', border: 'none', borderRadius: 'var(--radius-sm)', color: '#fff', fontSize: 13, fontWeight: 700, cursor: 'pointer' },
  form:      { background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: 14, display: 'flex', flexDirection: 'column', gap: 8 },
  select:    { background: 'var(--surface2)', border: '1.5px solid var(--border)', borderRadius: 'var(--radius-sm)', padding: '9px 12px', color: 'var(--text)', fontSize: 14, fontFamily: 'inherit', outline: 'none' },
  input:     { background: 'var(--surface2)', border: '1.5px solid var(--border)', borderRadius: 'var(--radius-sm)', padding: '9px 12px', color: 'var(--text)', fontSize: 14, fontFamily: 'inherit', outline: 'none' },
  textarea:  { background: 'var(--surface2)', border: '1.5px solid var(--border)', borderRadius: 'var(--radius-sm)', padding: '9px 12px', color: 'var(--text)', fontSize: 14, fontFamily: 'inherit', outline: 'none', resize: 'vertical' },
  saveBtn:   { padding: '11px', background: 'var(--red)', border: 'none', borderRadius: 'var(--radius-sm)', color: '#fff', fontSize: 14, fontWeight: 700, cursor: 'pointer' },
  empty:     { textAlign: 'center', color: 'var(--text-muted)', fontSize: 15, marginTop: 40 },
  list:      { display: 'flex', flexDirection: 'column', gap: 8 },
  card:      { background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: 14 },
  cardHeader:{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, flexWrap: 'wrap' },
  badge:     { fontSize: 12, fontWeight: 700, padding: '3px 8px', borderRadius: 4 },
  time:      { fontSize: 12, color: 'var(--text-muted)' },
  tableTag:  { fontSize: 12, fontWeight: 600, background: 'var(--fire-dim)', color: 'var(--fire)', padding: '2px 7px', borderRadius: 4 },
  incDesc:   { fontSize: 14, color: 'var(--text)' },
};

export default IncidentsView;
