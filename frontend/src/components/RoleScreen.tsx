import React from 'react';
import { Role } from '../types';
import { useApp } from '../context/AppContext';

const roles: { id: Role; icon: string; title: string; desc: string }[] = [
  { id: 'waiter',  icon: '🛎️', title: 'Sala / Camarero',  desc: 'Tomar comandas y enviarlas a cocina o barra' },
  { id: 'kitchen', icon: '🔥', title: 'Cocina',            desc: 'Ver y gestionar platos en preparación' },
  { id: 'bar',     icon: '🍺', title: 'Barra',             desc: 'Bebidas, cafés y platos de barra' },
];

const RoleScreen: React.FC = () => {
  const { setRole } = useApp();

  return (
    <div style={styles.wrap}>
      <div style={styles.logo}>
        <div style={styles.logoIcon}>🔥</div>
        <div>
          <div style={styles.logoText}>
            Com<span style={{ color: 'var(--fire)' }}>mander</span>
          </div>
          <div style={styles.logoSub}>Sistema de comandas</div>
        </div>
      </div>

      <div style={styles.cards}>
        {roles.map(r => (
          <button key={r.id} style={styles.card} onClick={() => setRole(r.id)}
            onMouseEnter={e => {
              (e.currentTarget as HTMLElement).style.borderColor = 'var(--fire)';
              (e.currentTarget as HTMLElement).style.background = 'var(--fire-dim)';
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)';
              (e.currentTarget as HTMLElement).style.background = 'var(--surface)';
            }}
          >
            <span style={styles.cardIcon}>{r.icon}</span>
            <div style={styles.cardInfo}>
              <div style={styles.cardTitle}>{r.title}</div>
              <div style={styles.cardDesc}>{r.desc}</div>
            </div>
            <span style={{ color: 'var(--text-muted)', fontSize: 20 }}>›</span>
          </button>
        ))}
      </div>

      <div style={styles.version}>Commander v1.0 · The Bulliam</div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  wrap: {
    display: 'flex', flexDirection: 'column', alignItems: 'center',
    justifyContent: 'center', height: '100%', gap: 14, padding: 24,
    background: 'var(--bg)',
  },
  logo: { display: 'flex', alignItems: 'center', gap: 14, marginBottom: 12 },
  logoIcon: {
    width: 56, height: 56, background: 'var(--fire)', borderRadius: 14,
    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28,
    boxShadow: 'var(--shadow-fire)',
  },
  logoText: { fontSize: 34, fontWeight: 900, letterSpacing: -1 },
  logoSub: { fontSize: 12, color: 'var(--text-muted)', fontWeight: 500, marginTop: 2 },
  cards: { display: 'flex', flexDirection: 'column', gap: 10, width: '100%', maxWidth: 380 },
  card: {
    display: 'flex', alignItems: 'center', gap: 14, padding: '18px 20px',
    background: 'var(--surface)', border: '1.5px solid var(--border)',
    borderRadius: 'var(--radius-lg)', cursor: 'pointer', textAlign: 'left',
    transition: 'border-color .15s, background .15s', width: '100%',
  },
  cardIcon: { fontSize: 28, flexShrink: 0 },
  cardInfo: { flex: 1 },
  cardTitle: { fontSize: 16, fontWeight: 700, color: 'var(--text)', marginBottom: 3 },
  cardDesc: { fontSize: 13, color: 'var(--text-muted)' },
  version: { fontSize: 11, color: 'var(--text-muted)', marginTop: 8 },
};

export default RoleScreen;
