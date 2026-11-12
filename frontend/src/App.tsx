import React, { useState } from 'react';
import { useApp } from './context/AppContext';
import RoleScreen from './components/RoleScreen';
import Topbar from './components/Topbar';
import TablesView from './components/TablesView';
import OrderPanel from './components/OrderPanel';
import KitchenBoard from './components/KitchenBoard';
import ChatPanel from './components/ChatPanel';
import StatsView from './components/StatsView';
import IncidentsView from './components/IncidentsView';
import ShiftClose from './components/ShiftClose';
import ClientNotesModal from './components/ClientNotesModal';

type Tab = 'mesas' | 'board' | 'stats' | 'incidents' | 'close';

const WAITER_TABS: { id: Tab; label: string }[] = [
  { id: 'mesas',     label: '🪑 Mesas' },
  { id: 'incidents', label: '⚠️ Incidencias' },
  { id: 'stats',     label: '📊 Stats' },
  { id: 'close',     label: '📁 Cierre' },
];

const KITCHEN_TABS: { id: Tab; label: string }[] = [
  { id: 'board',     label: '📋 Tablero' },
  { id: 'stats',     label: '📊 Stats' },
  { id: 'incidents', label: '⚠️ Incidencias' },
];

const App: React.FC = () => {
  const { role, setRole, pendingQueue } = useApp();
  const [tab, setTab] = useState<Tab>(role === 'waiter' ? 'mesas' : 'board');
  const [activeTable, setActiveTable] = useState<string | number | null>(null);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatPrefill, setChatPrefill] = useState('');
  const [clientNotesTable, setClientNotesTable] = useState<string | number | null>(null);

  if (!role) return <RoleScreen />;

  const tabs = role === 'waiter' ? WAITER_TABS : KITCHEN_TABS;
  const defaultTab = role === 'waiter' ? 'mesas' : 'board';

  const handleRoleChange = () => {
    setRole(null as any);
    setTab(defaultTab);
    setActiveTable(null);
  };

  const handleOpenChat = (prefill = '') => {
    setChatPrefill(prefill);
    setChatOpen(true);
  };

  const renderContent = () => {
    switch (tab) {
      case 'mesas':     return <TablesView onSelectTable={setActiveTable} />;
      case 'board':     return <KitchenBoard onChat={handleOpenChat} />;
      case 'stats':     return <StatsView />;
      case 'incidents': return <IncidentsView />;
      case 'close':     return <ShiftClose />;
      default:          return null;
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
      <Topbar
        onChat={() => handleOpenChat()}
        onBack={handleRoleChange}
        pendingCount={pendingQueue.length}
      />

      {/* Tabs */}
      <div style={tabsStyle}>
        {tabs.map(t => (
          <button
            key={t.id}
            style={{ ...tabBtn, ...(t.id === tab ? tabBtnActive : {}) }}
            onClick={() => setTab(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Contenido */}
      <div style={{ flex: 1, overflow: 'hidden' }}>
        {renderContent()}
      </div>

      {/* Panel comanda (camarero) */}
      {activeTable !== null && role === 'waiter' && (
        <OrderPanel
          tableId={activeTable}
          onClose={() => setActiveTable(null)}
          onClientNotes={() => setClientNotesTable(activeTable)}
        />
      )}

      {/* Chat */}
      <ChatPanel
        open={chatOpen}
        onClose={() => { setChatOpen(false); setChatPrefill(''); }}
        prefill={chatPrefill}
      />

      {/* Modal notas cliente */}
      {clientNotesTable !== null && (
        <ClientNotesModal
          tableId={clientNotesTable}
          onClose={() => setClientNotesTable(null)}
        />
      )}
    </div>
  );
};

const tabsStyle: React.CSSProperties = {
  display: 'flex', gap: 6, padding: '8px 10px', background: 'var(--surface)',
  borderBottom: '1px solid var(--border)', overflowX: 'auto', flexShrink: 0,
};
const tabBtn: React.CSSProperties = {
  padding: '7px 13px', borderRadius: 8, border: '1.5px solid transparent',
  background: 'transparent', color: 'var(--text-muted)', fontSize: 13, fontWeight: 600,
  cursor: 'pointer', whiteSpace: 'nowrap', transition: 'all .15s',
};
const tabBtnActive: React.CSSProperties = {
  background: 'var(--fire)', color: '#fff', borderColor: 'var(--fire)',
};

export default App;
