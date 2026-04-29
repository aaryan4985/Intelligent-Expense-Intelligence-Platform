import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import Sidebar from '../components/Sidebar';
import { 
  PieChart, Pie, Cell, Tooltip as RechartsTooltip, ResponsiveContainer
} from 'recharts';
import { ArrowUpRight, ArrowDownRight, DollarSign, Trash2, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Dashboard() {
  const { api } = useContext(AuthContext);
  const [summary, setSummary] = useState({ totalIncome: 0, totalExpense: 0, balance: 0 });
  const [transactions, setTransactions] = useState([]);
  
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('expense');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const fetchData = async () => {
    try {
      const sumRes = await api.get('/transactions/summary');
      setSummary(sumRes.data);
      const transRes = await api.get('/transactions');
      setTransactions(transRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddTransaction = async (e) => {
    e.preventDefault();
    try {
      await api.post('/transactions', { amount: parseFloat(amount), type, category, description, date });
      setAmount(''); setCategory(''); setDescription('');
      fetchData();
    } catch (error) {
      console.error('Error adding transaction:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/transactions/${id}`);
      fetchData();
    } catch (error) {
      console.error('Error deleting transaction:', error);
    }
  };

  const COLORS = ['#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#3b82f6'];
  
  const categoryData = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {});
    
  const pieData = Object.keys(categoryData).map(key => ({ name: key, value: categoryData[key] }));

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
  };

  return (
    <div className="app-container">
      <Sidebar />
      <motion.div 
        className="main-content"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants} className="flex justify-between items-center" style={{ marginBottom: '3rem' }}>
          <div>
            <h1 style={{ fontSize: '2.5rem', fontWeight: '700', letterSpacing: '-0.02em', marginBottom: '0.25rem' }}>Dashboard</h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>Welcome to your financial command center.</p>
          </div>
        </motion.div>

        {/* Summary Cards */}
        <motion.div variants={itemVariants} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
          <motion.div whileHover={{ y: -5 }} className="glass-panel p-8 flex flex-col gap-3 relative overflow-hidden">
            <div style={{ position: 'absolute', top: '-20px', right: '-20px', background: 'rgba(139, 92, 246, 0.1)', width: '100px', height: '100px', borderRadius: '50%', filter: 'blur(20px)' }}></div>
            <div className="flex justify-between items-center text-secondary">
              <span style={{ fontWeight: '500' }}>Total Balance</span>
              <div style={{ background: 'rgba(139, 92, 246, 0.15)', padding: '0.5rem', borderRadius: '10px' }}><DollarSign size={20} color="var(--accent-light)" /></div>
            </div>
            <div style={{ fontSize: '3rem', fontWeight: '700', letterSpacing: '-0.03em' }}>${summary.balance.toLocaleString(undefined, {minimumFractionDigits: 2})}</div>
          </motion.div>
          
          <motion.div whileHover={{ y: -5 }} className="glass-panel p-8 flex flex-col gap-3 relative overflow-hidden">
            <div style={{ position: 'absolute', top: '-20px', right: '-20px', background: 'rgba(16, 185, 129, 0.1)', width: '100px', height: '100px', borderRadius: '50%', filter: 'blur(20px)' }}></div>
            <div className="flex justify-between items-center text-secondary">
              <span style={{ fontWeight: '500' }}>Total Income</span>
              <div style={{ background: 'rgba(16, 185, 129, 0.15)', padding: '0.5rem', borderRadius: '10px' }}><ArrowUpRight size={20} color="var(--success)" /></div>
            </div>
            <div style={{ fontSize: '3rem', fontWeight: '700', color: 'var(--success)', letterSpacing: '-0.03em' }}>+${summary.totalIncome.toLocaleString(undefined, {minimumFractionDigits: 2})}</div>
          </motion.div>

          <motion.div whileHover={{ y: -5 }} className="glass-panel p-8 flex flex-col gap-3 relative overflow-hidden">
            <div style={{ position: 'absolute', top: '-20px', right: '-20px', background: 'rgba(239, 68, 68, 0.1)', width: '100px', height: '100px', borderRadius: '50%', filter: 'blur(20px)' }}></div>
            <div className="flex justify-between items-center text-secondary">
              <span style={{ fontWeight: '500' }}>Total Expenses</span>
              <div style={{ background: 'rgba(239, 68, 68, 0.15)', padding: '0.5rem', borderRadius: '10px' }}><ArrowDownRight size={20} color="var(--danger)" /></div>
            </div>
            <div style={{ fontSize: '3rem', fontWeight: '700', color: 'var(--danger)', letterSpacing: '-0.03em' }}>-${summary.totalExpense.toLocaleString(undefined, {minimumFractionDigits: 2})}</div>
          </motion.div>
        </motion.div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '2rem', marginBottom: '2.5rem' }}>
          {/* Add Transaction Form */}
          <motion.div variants={itemVariants} className="glass-panel p-8">
            <div className="flex items-center gap-3" style={{ marginBottom: '2rem' }}>
              <div style={{ background: 'rgba(139, 92, 246, 0.15)', padding: '0.5rem', borderRadius: '10px' }}><Plus size={20} color="var(--accent)" /></div>
              <h3 style={{ fontSize: '1.4rem', fontWeight: '600' }}>New Transaction</h3>
            </div>
            <form onSubmit={handleAddTransaction}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
                <input type="number" placeholder="Amount ($)" value={amount} onChange={e => setAmount(e.target.value)} required />
                <select value={type} onChange={e => setType(e.target.value)}>
                  <option value="expense">Expense</option>
                  <option value="income">Income</option>
                </select>
                <input type="text" placeholder="Category (e.g. Food)" value={category} onChange={e => setCategory(e.target.value)} required />
                <input type="date" value={date} onChange={e => setDate(e.target.value)} required />
              </div>
              <input type="text" placeholder="Description / Note" value={description} onChange={e => setDescription(e.target.value)} style={{ marginTop: '0', marginBottom: '1.5rem' }} />
              <motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }} type="submit" className="btn-primary w-full">Record Transaction</motion.button>
            </form>
          </motion.div>

          {/* Chart */}
          <motion.div variants={itemVariants} className="glass-panel p-8 flex flex-col">
            <h3 style={{ fontSize: '1.4rem', fontWeight: '600', marginBottom: '2rem' }}>Expense Breakdown</h3>
            <div style={{ flex: 1, minHeight: '300px' }}>
              {pieData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={pieData} cx="50%" cy="50%" innerRadius={75} outerRadius={105} paddingAngle={5} dataKey="value" stroke="none">
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <RechartsTooltip 
                      contentStyle={{ background: 'rgba(9, 9, 11, 0.95)', border: '1px solid var(--border-color)', borderRadius: '12px', boxShadow: '0 10px 30px rgba(0,0,0,0.3)' }} 
                      itemStyle={{ color: '#fff', fontWeight: 500 }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full text-secondary" style={{ fontSize: '1.1rem' }}>No expense data to display</div>
              )}
            </div>
          </motion.div>
        </div>

        {/* Transactions List */}
        <motion.div variants={itemVariants} className="glass-panel p-8">
          <h3 style={{ fontSize: '1.4rem', fontWeight: '600', marginBottom: '2rem' }}>Recent History</h3>
          <div style={{ overflowX: 'auto' }}>
            <table className="modern-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Description</th>
                  <th>Category</th>
                  <th>Type</th>
                  <th>Amount</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {transactions.length > 0 ? transactions.sort((a,b) => new Date(b.date) - new Date(a.date)).map(t => (
                    <motion.tr 
                      key={t.id}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -20, transition: { duration: 0.2 } }}
                    >
                      <td style={{ color: 'var(--text-secondary)' }}>{t.date}</td>
                      <td style={{ fontWeight: '500' }}>{t.description}</td>
                      <td>
                        <span style={{ background: 'rgba(255,255,255,0.05)', padding: '0.4rem 0.8rem', borderRadius: '8px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                          {t.category}
                        </span>
                      </td>
                      <td>
                        <span style={{ 
                          padding: '0.4rem 0.8rem', 
                          borderRadius: '8px', 
                          fontSize: '0.85rem',
                          fontWeight: '600',
                          background: t.type === 'income' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                          color: t.type === 'income' ? 'var(--success)' : 'var(--danger)'
                        }}>
                          {t.type.toUpperCase()}
                        </span>
                      </td>
                      <td style={{ fontWeight: '700', fontSize: '1.1rem', color: t.type === 'income' ? 'var(--success)' : 'var(--text-primary)' }}>
                        {t.type === 'income' ? '+' : '-'}${t.amount.toLocaleString(undefined, {minimumFractionDigits: 2})}
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <motion.button 
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleDelete(t.id)} 
                          style={{ padding: '0.5rem', background: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)', borderRadius: '8px' }}
                        >
                          <Trash2 size={18} />
                        </motion.button>
                      </td>
                    </motion.tr>
                  )) : (
                    <tr>
                      <td colSpan="6" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-secondary)' }}>No transactions found. Log your first expense above.</td>
                    </tr>
                  )}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
