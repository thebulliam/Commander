import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { MENU_CATEGORIES, getMenuByCategory, ALLERGEN_EMOJI } from '../data/menu';
import { getTableLabel } from '../data/tables';
import { MenuItem, OrderItem } from '../types';

interface OrderPanelProps {
  tableId: string | number;
  onClose: () => void;
  onClientNotes: () => void;
}

const OrderPanel: React.FC<OrderPanelProps> = ({ tableId, onClose, onClientNotes }) => {
  const { sendOrder, state } = useApp();
  const [cat, setCat] = useState(MENU_CATEGORIES[0]);
  const [items, setItems] = useState<OrderItem[]>([]);
  const [note, setNote] = useState('');
  const [allergenAlert, setAllergenAlert] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const menuByCat = getMenuByCategory();
  const label = getTableLabel(tableId);

  // Cargar comanda existente si hay
  useEffect(() => {
    const existing = state.orders[String(tableId)];
    if (existing) setItems(existing.items.map(i => ({ ...i })));
  }, [tableId, state.orders]);

  const addItem = (item: MenuItem) => {
    if (item.allergens.length > 0) {
      const msg = `${item.name} contiene: ${item.allergens.map(a => `${ALLERGEN_EMOJI[a] || ''} ${a}`).join(', ')}`;
      setAllergenAlert(msg);
      setTimeout(() => setAllergenAlert(null), 4000);
    }
    setItems(prev => {
      const ex = prev.find(i => i.id === item.id);
      if (ex) return prev.map(i => i.id === item.id ? { ...i, qty: i.qty + 1 } : i);
      return [...prev, { ...item, qty: 1 }];
    });
  };

  const changeQty = (id: string, delta: number) => {
    setItems(prev => {
      const next = prev.map(i => i.id === id ? { ...i, qty: i.qty + delta } : i).filter(i => i.qty > 0);
      return next;
    });
  };

  const total = items.reduce((s, i) => s + i.price * i.qty, 0);

  const handleSend = async () => {
    if (items.length === 0) return;
    setSending(true);
    await sendOrder(tableId, items, note);
    setSending(false);
    onClose();
  };

  return (
    <div style={s.overlay} className="animate-fade-in">
      {/* Header */}
      <div style={s.header}>
        <button style={s.backBtn} onClick={onClose}>←</button>
        <div style={s.headerInfo}>
          <div style={s.headerTitle}>{label}</div>
          {items.length > 0 && <div style={s.headerSub}>{items.reduce((a,i)=>a+i.qty,0)} platos · {total.toFixed(2)}€</div>}
        </div>
        <button style={s.clientBtn} onClick={onClientNotes} title="Notas del cliente">👤</button>
      </div>

      {/* Alerta alérgenos */}
      {allergenAlert && (
        <div style={s.allergenBanner} className="animate-slide-up">
          ⚠️ Alérgenos: {allergenAlert}
        </div>
      )}

      {/* Tabs categorías */}
      <div style={s.catTabs}>
        {MENU_CATEGORIES.map(c => (
          <button key={c} style={{ ...s.catTab, ...(c === cat ? s.catTabActive : {}) }} onClick={() => setCat(c)}>
            {c}
          </button>
        ))}
      </div>

      {/* Grid de carta */}
      <div style={s.menuGrid}>
        {(menuByCat[cat] || []).map(item => {
          const inOrder = items.find(i => i.id === item.id);
          return (
            <button
              key={item.id}
              style={{
                ...s.menuItem,
                borderColor: inOrder ? 'var(--fire)' : item.allergens.length ? 'var(--red)' : 'var(--border)',
                background: inOrder ? 'var(--fire-dim)' : 'var(--surface)',
              }}
              onClick={() => addItem(item)}
            >
              {inOrder && <div style={s.inOrderBadge}>{inOrder.qty}</div>}
              <div style={s.itemName}>{item.name}</div>
              <div style={s.itemPrice}>{item.price.toFixed(2)}€</div>
              {item.allergens.length > 0 && (
                <div style={s.itemAllergens}>
                  {item.allergens.map(a => ALLERGEN_EMOJI[a] || '').join('')}
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Resumen comanda */}
      {items.length > 0 && (
        <div style={s.summary}>
          <div style={s.orderLines}>
            {items.map(item => (
              <div key={item.id} style={s.line}>
                <button style={s.qtyBtn} onClick={() => changeQty(item.id, -1)}>−</button>
                <span style={s.qty}>{item.qty}</span>
                <button style={s.qtyBtn} onClick={() => changeQty(item.id, +1)}>+</button>
                <span style={s.lineName}>{item.name}</span>
                {item.allergens.length > 0 && <span title={item.allergens.join(', ')}>⚠️</span>}
                <span style={s.linePrice}>{(item.price * item.qty).toFixed(2)}€</span>
              </div>
            ))}
            <div style={s.totalRow}>
              <span style={{ color: 'var(--text-muted)', fontSize: 13 }}>Total estimado</span>
              <span style={s.totalValue}>{total.toFixed(2)}€</span>
            </div>
          </div>

          {/* Nota */}
          <input
            style={s.noteInput}
            placeholder="Nota para cocina (punto del chuletón, sin cebolla...)"
            value={note}
            onChange={e => setNote(e.target.value)}
          />

          {/* Botón enviar */}
          <button style={s.sendBtn} onClick={handleSend} disabled={sending || items.length === 0}>
            {sending ? 'Enviando...' : `🔥 Enviar comanda a cocina`}
          </button>
        </div>
      )}

      {items.length === 0 && (
        <div style={s.emptySummary}>Toca un plato para añadirlo</div>
      )}
    </div>
  );
};

const s: Record<string, React.CSSProperties> = {
  overlay:   { position: 'fixed', inset: 0, background: 'var(--bg)', zIndex: 100, display: 'flex', flexDirection: 'column', overflow: 'hidden' },
  header:    { display: 'flex', alignItems: 'center', gap: 10, padding: '12px 14px', background: 'var(--surface)', borderBottom: '1px solid var(--border)', flexShrink: 0 },
  backBtn:   { width: 36, height: 36, borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)', background: 'var(--surface2)', fontSize: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' },
  headerInfo:{ flex: 1 },
  headerTitle: { fontSize: 18, fontWeight: 800 },
  headerSub: { fontSize: 12, color: 'var(--fire)', fontWeight: 600 },
  clientBtn: { width: 36, height: 36, borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)', background: 'var(--surface2)', fontSize: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' },
  allergenBanner: { background: 'var(--red)', color: '#fff', padding: '10px 14px', fontSize: 13, fontWeight: 600, flexShrink: 0 },
  catTabs:   { display: 'flex', gap: 6, padding: '8px 12px', overflowX: 'auto', background: 'var(--surface)', borderBottom: '1px solid var(--border)', flexShrink: 0 },
  catTab:    { padding: '6px 13px', borderRadius: 20, border: '1.5px solid var(--border)', background: 'transparent', color: 'var(--text-muted)', fontSize: 13, fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap', transition: 'all .15s' },
  catTabActive: { background: 'var(--fire-dim)', borderColor: 'var(--fire)', color: 'var(--fire)' },
  menuGrid:  { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, padding: '10px 12px', overflowY: 'auto', flex: 1 },
  menuItem:  { background: 'var(--surface)', border: '1.5px solid var(--border)', borderRadius: 'var(--radius)', padding: '12px 10px', cursor: 'pointer', textAlign: 'left', transition: 'all .15s', position: 'relative' },
  inOrderBadge: { position: 'absolute', top: 7, right: 7, background: 'var(--fire)', color: '#fff', fontSize: 11, fontWeight: 800, width: 20, height: 20, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  itemName:  { fontSize: 13, fontWeight: 700, marginBottom: 4 },
  itemPrice: { fontSize: 13, color: 'var(--fire)', fontWeight: 700 },
  itemAllergens: { fontSize: 14, marginTop: 3 },
  summary:   { background: 'var(--surface)', borderTop: '1px solid var(--border)', padding: '10px 12px', flexShrink: 0, maxHeight: '42vh', overflowY: 'auto' },
  orderLines:{ display: 'flex', flexDirection: 'column', gap: 2, marginBottom: 8 },
  line:      { display: 'flex', alignItems: 'center', gap: 6, padding: '5px 0', borderBottom: '1px solid var(--border)' },
  qtyBtn:    { width: 26, height: 26, borderRadius: 6, border: '1px solid var(--border)', background: 'var(--surface2)', fontSize: 15, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--text)', flexShrink: 0 },
  qty:       { fontSize: 15, fontWeight: 800, minWidth: 22, textAlign: 'center' },
  lineName:  { flex: 1, fontSize: 13, fontWeight: 500 },
  linePrice: { fontSize: 13, color: 'var(--fire)', fontWeight: 700 },
  totalRow:  { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0 4px', borderTop: '1px solid var(--border)', marginTop: 4 },
  totalValue:{ fontSize: 17, fontWeight: 900, color: 'var(--fire)' },
  noteInput: { width: '100%', background: 'var(--surface2)', border: '1.5px solid var(--border)', borderRadius: 'var(--radius-sm)', padding: '9px 12px', color: 'var(--text)', fontSize: 13, marginBottom: 8, fontFamily: 'inherit' },
  sendBtn:   { width: '100%', padding: '15px', background: 'var(--fire)', border: 'none', borderRadius: 'var(--radius)', color: '#fff', fontSize: 16, fontWeight: 800, cursor: 'pointer', transition: 'background .15s' },
  emptySummary: { padding: 20, textAlign: 'center', color: 'var(--text-muted)', fontSize: 14 },
};

export default OrderPanel;
