import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';

interface ChatPanelProps {
  open: boolean;
  onClose: () => void;
  prefill?: string;
}

const ChatPanel: React.FC<ChatPanelProps> = ({ open, onClose, prefill }) => {
  const { state, sendChat, role } = useApp();
  const [text, setText] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      if (prefill) setText(prefill);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open, prefill]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [state.chat]);

  const handleSend = async () => {
    if (!text.trim()) return;
    await sendChat(text.trim());
    setText('');
  };

  const roleName = role === 'waiter' ? 'Sala' : role === 'kitchen' ? 'Cocina' : 'Barra';

  if (!open) return null;

  return (
    <div style={s.overlay} className="animate-fade-in">
      <div style={s.header}>
        <button style={s.backBtn} onClick={onClose}>←</button>
        <span style={s.title}>Chat Sala ↔ Cocina</span>
      </div>

      <div style={s.messages}>
        {state.chat.length === 0 && (
          <div style={s.empty}>Sin mensajes aún</div>
        )}
        {state.chat.map(msg => {
          const isMine = msg.from === roleName;
          return (
            <div key={msg.id} style={{ display: 'flex', justifyContent: isMine ? 'flex-end' : 'flex-start' }}>
              <div style={{ ...s.bubble, ...(isMine ? s.bubbleMine : s.bubbleOther) }}>
                <div>{msg.text}</div>
                <div style={s.meta}>{msg.from} · {msg.time}</div>
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      <div style={s.inputRow}>
        <input
          ref={inputRef}
          style={s.input}
          value={text}
          onChange={e => setText(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSend()}
          placeholder="Escribe un mensaje..."
        />
        <button style={s.sendBtn} onClick={handleSend}>➤</button>
      </div>
    </div>
  );
};

const s: Record<string, React.CSSProperties> = {
  overlay:  { position: 'fixed', inset: 0, background: 'var(--bg)', zIndex: 200, display: 'flex', flexDirection: 'column' },
  header:   { display: 'flex', alignItems: 'center', gap: 10, padding: '12px 14px', background: 'var(--surface)', borderBottom: '1px solid var(--border)', flexShrink: 0 },
  backBtn:  { width: 36, height: 36, borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)', background: 'var(--surface2)', fontSize: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' },
  title:    { fontSize: 16, fontWeight: 800 },
  messages: { flex: 1, overflowY: 'auto', padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: 10 },
  empty:    { textAlign: 'center', color: 'var(--text-muted)', fontSize: 14, marginTop: 40 },
  bubble:   { maxWidth: '78%', padding: '10px 14px', borderRadius: 12, fontSize: 14, fontWeight: 500 },
  bubbleMine:  { background: 'var(--fire)', color: '#fff' },
  bubbleOther: { background: 'var(--surface2)', border: '1px solid var(--border)', color: 'var(--text)' },
  meta:     { fontSize: 11, opacity: 0.7, marginTop: 4 },
  inputRow: { display: 'flex', gap: 8, padding: 12, background: 'var(--surface)', borderTop: '1px solid var(--border)' },
  input:    { flex: 1, background: 'var(--surface2)', border: '1.5px solid var(--border)', borderRadius: 'var(--radius-sm)', padding: '10px 14px', color: 'var(--text)', fontSize: 14, fontFamily: 'inherit', outline: 'none' },
  sendBtn:  { width: 44, height: 44, background: 'var(--fire)', border: 'none', borderRadius: 'var(--radius-sm)', color: '#fff', fontSize: 18, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
};

export default ChatPanel;
