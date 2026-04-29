import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { LayoutDashboard, Wallet, CreditCard, LogOut, Activity } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Sidebar() {
  const { user, logout } = useContext(AuthContext);

  const containerVariants = {
    hidden: { x: -50, opacity: 0 },
    visible: { 
      x: 0, opacity: 1,
      transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1], staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 }
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="sidebar glass-panel" 
      style={{ borderRadius: '0 20px 20px 0', borderLeft: 'none', background: 'rgba(9, 9, 11, 0.7)' }}
    >
      <motion.div variants={itemVariants} className="flex items-center gap-3" style={{ marginBottom: '3.5rem', color: 'var(--accent-light)' }}>
        <Activity size={32} />
        <h2 style={{ fontSize: '1.4rem', fontWeight: '700', letterSpacing: '-0.03em' }}>FinShield</h2>
      </motion.div>

      <motion.div variants={itemVariants} style={{ marginBottom: '2rem' }}>
        <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: '1.25rem', letterSpacing: '1.5px', fontWeight: '600' }}>Main Menu</div>
        <div className="flex flex-col gap-2">
          <motion.div whileHover={{ scale: 1.02, x: 5 }} whileTap={{ scale: 0.98 }} className="flex items-center gap-4" style={{ padding: '0.875rem 1rem', background: 'linear-gradient(90deg, rgba(139, 92, 246, 0.1) 0%, transparent 100%)', color: 'var(--accent-light)', borderRadius: '12px', cursor: 'pointer', borderLeft: '3px solid var(--accent)' }}>
            <LayoutDashboard size={20} />
            <span style={{ fontWeight: '500' }}>Dashboard</span>
          </motion.div>
          <motion.div whileHover={{ scale: 1.02, x: 5, backgroundColor: 'rgba(255,255,255,0.03)' }} whileTap={{ scale: 0.98 }} className="flex items-center gap-4" style={{ padding: '0.875rem 1rem', color: 'var(--text-secondary)', borderRadius: '12px', cursor: 'pointer', transition: 'color 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.color = 'var(--text-primary)'} onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}>
            <Wallet size={20} />
            <span style={{ fontWeight: '500' }}>Transactions</span>
          </motion.div>
          <motion.div whileHover={{ scale: 1.02, x: 5, backgroundColor: 'rgba(255,255,255,0.03)' }} whileTap={{ scale: 0.98 }} className="flex items-center gap-4" style={{ padding: '0.875rem 1rem', color: 'var(--text-secondary)', borderRadius: '12px', cursor: 'pointer', transition: 'color 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.color = 'var(--text-primary)'} onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}>
            <CreditCard size={20} />
            <span style={{ fontWeight: '500' }}>Cards</span>
          </motion.div>
        </div>
      </motion.div>

      <motion.div variants={itemVariants} style={{ marginTop: 'auto' }}>
        <div style={{ padding: '1.25rem', background: 'rgba(255, 255, 255, 0.03)', borderRadius: '16px', marginBottom: '1.25rem', border: '1px solid var(--border-color)' }}>
          <div className="flex items-center gap-3">
            <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--accent), #4f46e5)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '1.2rem' }}>
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <div style={{ fontWeight: '600', fontSize: '0.95rem' }}>{user?.name}</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{user?.email}</div>
            </div>
          </div>
        </div>
        <motion.button 
          whileHover={{ scale: 1.02, backgroundColor: 'rgba(239, 68, 68, 0.15)' }}
          whileTap={{ scale: 0.98 }}
          onClick={logout} 
          className="flex items-center justify-center gap-2 w-full" 
          style={{ background: 'rgba(239, 68, 68, 0.08)', color: 'var(--danger)', borderRadius: '12px', padding: '0.875rem' }}
        >
          <LogOut size={18} />
          <span style={{ fontWeight: '600' }}>Logout</span>
        </motion.button>
      </motion.div>
    </motion.div>
  );
}
