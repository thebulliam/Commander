import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { getTableLabel } from '../data/tables';

interface ClientNotesModalProps {
  tableId: string | number;
  onClose: () => void;
}

const ClientNotesModal: React.FC<ClientNotesModalProps> = ({ tableId, onClose }) => {
  const { state, addClientNote } = useApp();
  const [newNote, setNewNote] = useState('');
  const notes = state.clientNotes[String(tableId)] || [];
  const label = getTableLabel(tableId);

  const handleSave = async () => {
    if (!newNote.trim()) return;
    await addClientNote(tableId, newNote.trim());
    setNewNote('');
  };

  return (
    <div style={s.overlay} onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={s.sheet} className="animate-slide-up">
        <div style={s.handle} />
        <div style={s.title}>{label} – Notas del cliente</div>

        {notes.length === 0 ? (
          <div style={s.empty}>Sin notas para esta mesa</div>
        ) : (
          <div style={s.noteList}>
            {notes.map((note, i) => (
              <div key={i} style={s.noteCard}>
                <div style={s.noteTag}>Nota {i + 1}</div>
                <div style={s.noteText}>{note}</div>
              </div>
            ))}
          </div>
        )}

        <input
          style={s.input}
          placeholder="Añadir nota (sin gluten, alergia a frutos secos...)"
          value={newNote}
          onChange={e => setNewNote(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSave()}
          autoFocus
        />
        <button style={s.saveBtn} onClick={handleSave} disabled={!newNote.trim()}>
          💾 Guardar nota
        </button>
        <button style={s.closeBtn} onClick={onClose}>Cerrar</button>
      </div>
    </div>
  );
};

const s: Record<string, React.CSSProperties> = {
  overlay:  { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 300, display: 'flex', alignItems: 'flex-end' },
  sheet:    { background: 'var(--surface)', borderRadius: '20px 20px 0 0', padding: 20, width: '100%', maxHeight: '75vh', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 10 },
  handle:   { width: 40, height: 4, background: 'var(--border)', borderRadius: 2, margin: '0 auto 8px' },
  title:    { fontSize: 18, fontWeight: 800 },
  empty:    { color: 'var(--text-muted)', fontSize: 14, textAlign: 'center', padding: '8px 0' },
  noteList: { display: 'flex', flexDirection: 'column', gap: 8 },
  noteCard: { background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', padding: 12 },
  noteTag:  { fontSize: 11, fontWeight: 700, color: 'var(--fire)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 },
  noteText: { fontSize: 14 },
  input:    { background: 'var(--surface2)', border: '1.5px solid var(--border)', borderRadius: 'var(--radius-sm)', padding: '10px 14px', color: 'var(--text)', fontSize: 14, fontFamily: 'inherit', outline: 'none' },
  saveBtn:  { padding: 13, background: 'var(--fire)', border: 'none', borderRadius: 'var(--radius)', color: '#fff', fontSize: 14, fontWeight: 700, cursor: 'pointer' },
  closeBtn: { padding: 13, background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', color: 'var(--text)', fontSize: 14, fontWeight: 600, cursor: 'pointer' },
};

export default ClientNotesModal;
