import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import Sidebar from '../components/Sidebar';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line
} from 'recharts';
import { ArrowUpRight, ArrowDownRight, DollarSign, Trash2 } from 'lucide-react';

export default function Dashboard() {
  const { api } = useContext(AuthContext);
  const [summary, setSummary] = useState({ totalIncome: 0, totalExpense: 0, balance: 0 });
  const [transactions, setTransactions] = useState([]);
  
  // Form State
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
      await api.post('/transactions', {
        amount: parseFloat(amount),
        type,
        category,
        description,
        date
      });
      setAmount('');
      setCategory('');
      setDescription('');
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

  const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];
  
  // Aggregate for Pie Chart
  const categoryData = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {});
    
  const pieData = Object.keys(categoryData).map(key => ({ name: key, value: categoryData[key] }));

  return (
    <div className="app-container">
      <Sidebar />
      <div className="main-content">
        <div className="flex justify-between items-center" style={{ marginBottom: '2rem' }}>
          <div>
            <h1 style={{ fontSize: '2rem', fontWeight: '700' }}>Dashboard Overview</h1>
            <p style={{ color: 'var(--text-secondary)' }}>Welcome back to FinShield AI command center.</p>
          </div>
        </div>

        {/* Summary Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
          <div className="glass-panel p-6 flex flex-col gap-2">
            <div className="flex justify-between items-center text-secondary">
              <span>Total Balance</span>
              <DollarSign size={20} color="var(--accent)" />
            </div>
            <div style={{ fontSize: '2.5rem', fontWeight: '700' }}>${summary.balance.toFixed(2)}</div>
          </div>
          
          <div className="glass-panel p-6 flex flex-col gap-2">
            <div className="flex justify-between items-center text-secondary">
              <span>Total Income</span>
              <ArrowUpRight size={20} color="var(--success)" />
            </div>
            <div style={{ fontSize: '2.5rem', fontWeight: '700', color: 'var(--success)' }}>+${summary.totalIncome.toFixed(2)}</div>
          </div>

          <div className="glass-panel p-6 flex flex-col gap-2">
            <div className="flex justify-between items-center text-secondary">
              <span>Total Expenses</span>
              <ArrowDownRight size={20} color="var(--danger)" />
            </div>
            <div style={{ fontSize: '2.5rem', fontWeight: '700', color: 'var(--danger)' }}>-${summary.totalExpense.toFixed(2)}</div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
          {/* Add Transaction Form */}
          <div className="glass-panel p-6">
            <h3 style={{ fontSize: '1.2rem', fontWeight: '600', marginBottom: '1.5rem' }}>Add Transaction</h3>
            <form onSubmit={handleAddTransaction}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <input type="number" placeholder="Amount" value={amount} onChange={e => setAmount(e.target.value)} required />
                <select value={type} onChange={e => setType(e.target.value)}>
                  <option value="expense">Expense</option>
                  <option value="income">Income</option>
                </select>
                <input type="text" placeholder="Category" value={category} onChange={e => setCategory(e.target.value)} required />
                <input type="date" value={date} onChange={e => setDate(e.target.value)} required />
              </div>
              <input type="text" placeholder="Description" value={description} onChange={e => setDescription(e.target.value)} style={{ marginTop: '0', marginBottom: '1rem' }} />
              <button type="submit" className="btn-primary w-full">Save Transaction</button>
            </form>
          </div>

          {/* Chart */}
          <div className="glass-panel p-6 flex flex-col">
            <h3 style={{ fontSize: '1.2rem', fontWeight: '600', marginBottom: '1.5rem' }}>Expenses by Category</h3>
            <div style={{ flex: 1, minHeight: '250px' }}>
              {pieData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <RechartsTooltip contentStyle={{ background: 'rgba(15, 23, 42, 0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }} />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full text-secondary">No expense data</div>
              )}
            </div>
          </div>
        </div>

        {/* Transactions List */}
        <div className="glass-panel p-6">
          <h3 style={{ fontSize: '1.2rem', fontWeight: '600', marginBottom: '1.5rem' }}>Recent Transactions</h3>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--panel-border)', color: 'var(--text-secondary)' }}>
                  <th style={{ padding: '1rem 0.5rem' }}>Date</th>
                  <th style={{ padding: '1rem 0.5rem' }}>Description</th>
                  <th style={{ padding: '1rem 0.5rem' }}>Category</th>
                  <th style={{ padding: '1rem 0.5rem' }}>Type</th>
                  <th style={{ padding: '1rem 0.5rem' }}>Amount</th>
                  <th style={{ padding: '1rem 0.5rem', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {transactions.length > 0 ? transactions.sort((a,b) => new Date(b.date) - new Date(a.date)).map(t => (
                  <tr key={t.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <td style={{ padding: '1rem 0.5rem' }}>{t.date}</td>
                    <td style={{ padding: '1rem 0.5rem' }}>{t.description}</td>
                    <td style={{ padding: '1rem 0.5rem' }}>{t.category}</td>
                    <td style={{ padding: '1rem 0.5rem' }}>
                      <span style={{ 
                        padding: '0.25rem 0.75rem', 
                        borderRadius: '999px', 
                        fontSize: '0.8rem',
                        background: t.type === 'income' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                        color: t.type === 'income' ? 'var(--success)' : 'var(--danger)'
                      }}>
                        {t.type}
                      </span>
                    </td>
                    <td style={{ padding: '1rem 0.5rem', fontWeight: '600', color: t.type === 'income' ? 'var(--success)' : 'var(--danger)' }}>
                      {t.type === 'income' ? '+' : '-'}${t.amount.toFixed(2)}
                    </td>
                    <td style={{ padding: '1rem 0.5rem', textAlign: 'right' }}>
                      <button onClick={() => handleDelete(t.id)} style={{ padding: '0.5rem', background: 'transparent', color: 'var(--danger)' }}>
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="6" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>No transactions found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
