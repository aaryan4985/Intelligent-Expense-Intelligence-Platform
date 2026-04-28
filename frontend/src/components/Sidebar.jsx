import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { LayoutDashboard, Wallet, CreditCard, LogOut, Activity } from 'lucide-react';

export default function Sidebar() {
  const { user, logout } = useContext(AuthContext);

  return (
    <div className="sidebar glass-panel" style={{ borderRadius: '0 16px 16px 0', borderLeft: 'none' }}>
      <div className="flex items-center gap-2" style={{ marginBottom: '3rem', color: 'var(--accent)' }}>
        <Activity size={28} />
        <h2 style={{ fontSize: '1.2rem', fontWeight: '700' }}>FinShield AI</h2>
      </div>

      <div style={{ marginBottom: '2rem' }}>
        <div style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: '1rem', letterSpacing: '1px' }}>Menu</div>
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-4" style={{ padding: '0.75rem', background: 'rgba(99, 102, 241, 0.1)', color: 'var(--accent)', borderRadius: '8px', cursor: 'pointer' }}>
            <LayoutDashboard size={20} />
            <span style={{ fontWeight: '500' }}>Dashboard</span>
          </div>
          <div className="flex items-center gap-4" style={{ padding: '0.75rem', color: 'var(--text-secondary)', borderRadius: '8px', cursor: 'pointer', transition: 'all 0.2s' }} onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--text-primary)'; e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}} onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-secondary)'; e.currentTarget.style.background = 'transparent'}}>
            <Wallet size={20} />
            <span style={{ fontWeight: '500' }}>Transactions</span>
          </div>
          <div className="flex items-center gap-4" style={{ padding: '0.75rem', color: 'var(--text-secondary)', borderRadius: '8px', cursor: 'pointer', transition: 'all 0.2s' }} onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--text-primary)'; e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}} onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-secondary)'; e.currentTarget.style.background = 'transparent'}}>
            <CreditCard size={20} />
            <span style={{ fontWeight: '500' }}>Cards</span>
          </div>
        </div>
      </div>

      <div style={{ marginTop: 'auto' }}>
        <div style={{ padding: '1rem', background: 'rgba(15, 23, 42, 0.5)', borderRadius: '8px', marginBottom: '1rem' }}>
          <div style={{ fontWeight: '600', marginBottom: '0.25rem' }}>{user?.name}</div>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{user?.email}</div>
        </div>
        <button onClick={logout} className="flex items-center justify-center gap-2 w-full" style={{ background: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)' }}>
          <LogOut size={18} />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
}
