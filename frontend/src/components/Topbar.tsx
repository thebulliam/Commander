import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';

interface TopbarProps {
  onChat: () => void;
  onBack: () => void;
  pendingCount: number;
}

const ROLE_LABELS: Record<string, string> = {
  waiter: '🛎️ Sala',
  kitchen: '🔥 Cocina',
  bar: '🍺 Barra',
};

const Topbar: React.FC<TopbarProps> = ({ onChat, onBack, pendingCount }) => {
  const { role, connected, state } = useApp();
  const [time, setTime] = useState('');

  useEffect(() => {
    const tick = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }));
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  const unreadChat = state.chat.length > 0;

  return (
    <div style={s.bar}>
      <div style={s.left}>
        <span style={s.logoText}>Com<span style={{ color: 'var(--fire)' }}>mander</span></span>
        {role && <span style={s.roleBadge}>{ROLE_LABELS[role]}</span>}
        {pendingCount > 0 && (
          <span style={s.offlineBadge} title="Comandas pendientes de sincronizar">
            📡 {pendingCount} offline
          </span>
        )}
      </div>
      <div style={s.right}>
        <span style={{ ...s.dot, background: connected ? 'var(--green)' : 'var(--red)' }} title={connected ? 'Conectado' : 'Sin conexión – modo offline'} />
        <span style={s.clock}>{time}</span>
        <button style={s.iconBtn} onClick={onChat} title="Chat sala ↔ cocina">
          <span>💬</span>
          {unreadChat && <span style={s.chatDot} />}
        </button>
        <button style={s.iconBtn} onClick={onBack} title="Cambiar rol">⚙️</button>
      </div>
    </div>
  );
};

const s: Record<string, React.CSSProperties> = {
  bar: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '0 14px', height: 54, background: 'var(--surface)',
    borderBottom: '1px solid var(--border)', flexShrink: 0,
  },
  left: { display: 'flex', alignItems: 'center', gap: 10 },
  logoText: { fontSize: 19, fontWeight: 900, letterSpacing: -0.5 },
  roleBadge: {
    fontSize: 11, fontWeight: 700, background: 'var(--fire-dim)',
    color: 'var(--fire)', padding: '3px 8px', borderRadius: 5,
  },
  offlineBadge: {
    fontSize: 11, fontWeight: 700, background: 'var(--yellow-dim)',
    color: 'var(--yellow)', padding: '3px 8px', borderRadius: 5,
  },
  right: { display: 'flex', alignItems: 'center', gap: 10 },
  dot: { width: 7, height: 7, borderRadius: '50%', display: 'inline-block' },
  clock: { fontSize: 13, fontWeight: 700, color: 'var(--text-dim)', fontVariantNumeric: 'tabular-nums' },
  iconBtn: {
    width: 36, height: 36, borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)',
    background: 'var(--surface2)', cursor: 'pointer', display: 'flex', alignItems: 'center',
    justifyContent: 'center', fontSize: 16, position: 'relative',
  },
  chatDot: {
    position: 'absolute', top: 5, right: 5, width: 7, height: 7,
    background: 'var(--red)', borderRadius: '50%', border: '1.5px solid var(--surface)',
  },
};

export default Topbar;
