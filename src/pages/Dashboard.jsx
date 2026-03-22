import { useState, useEffect } from 'react';
import { ArrowUpRight, ArrowDownRight, Wallet, Activity } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import './Dashboard.css';

const data = [
  { name: 'Jan', value: 4000 },
  { name: 'Feb', value: 3000 },
  { name: 'Mar', value: 5000 },
  { name: 'Apr', value: 4500 },
  { name: 'May', value: 6000 },
  { name: 'Jun', value: 5500 },
  { name: 'Jul', value: 7500 },
];

const transactions = [
  { id: 1, name: 'Apple Store', category: 'Shopping', amount: -1299.00, date: 'Today, 2:45 PM', status: 'completed' },
  { id: 2, name: 'Inflow from Upwork', category: 'Income', amount: 3450.00, date: 'Yesterday, 9:00 AM', status: 'completed' },
  { id: 3, name: 'Uber Rides', category: 'Transport', amount: -24.50, date: 'Mar 15, 6:30 PM', status: 'completed' },
  { id: 4, name: 'Netflix Subscription', category: 'Entertainment', amount: -15.99, date: 'Mar 14, 10:00 AM', status: 'completed' },
];

const Dashboard = () => {
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;
  const firstName = user?.full_name ? user.full_name.split(' ')[0] : (user?.email?.split('@')[0] || 'User');

  const [balance, setBalance] = useState(user?.balance || 0);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;
        const res = await fetch('/api/user', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setBalance(data.balance);
          if (user) {
              const updatedUser = { ...user, balance: data.balance };
              localStorage.setItem('user', JSON.stringify(updatedUser));
          }
        }
      } catch (err) {}
    };
    fetchUserData();
  }, []);

  return (
    <div className="dashboard">
      <header className="dashboard-header animate-fade-in">
        <div>
          <h1 className="text-gradient">Welcome back, {firstName}</h1>
          <p className="text-muted">Here is your financial overview for this month.</p>
        </div>
        <button className="btn-primary">
          <ArrowUpRight size={18} />
          Send Money
        </button>
      </header>

      <section className="summary-cards animate-fade-in" style={{ animationDelay: '0.1s' }}>
        <div className="card glass-panel summary-card">
          <div className="card-icon blue">
            <Wallet size={24} />
          </div>
          <div className="card-info">
            <p className="card-label">Total Balance</p>
            <h2 className="card-value">{balance.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</h2>
            <p className="card-trend positive">+2.4% from last month</p>
          </div>
        </div>
        <div className="card glass-panel summary-card">
          <div className="card-icon green">
            <ArrowDownRight size={24} />
          </div>
          <div className="card-info">
            <p className="card-label">Total Income</p>
            <h2 className="card-value">$8,240.50</h2>
            <p className="card-trend positive">+12.5% from last month</p>
          </div>
        </div>
        <div className="card glass-panel summary-card">
          <div className="card-icon red">
            <ArrowUpRight size={24} />
          </div>
          <div className="card-info">
            <p className="card-label">Total Expenses</p>
            <h2 className="card-value">$3,420.20</h2>
            <p className="card-trend negative">-4.2% from last month</p>
          </div>
        </div>
      </section>

      <div className="dashboard-grid animate-fade-in" style={{ animationDelay: '0.2s' }}>
        <section className="chart-section glass-panel">
          <div className="section-header">
            <h3>Analytics Overview</h3>
            <span className="badge-outline">This Year</span>
          </div>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" stroke="#a3a3a3" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#a3a3a3" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e1e1e', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff' }}
                  itemStyle={{ color: '#3b82f6' }}
                />
                <Area type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="transactions-section glass-panel">
          <div className="section-header">
            <h3>Recent Transactions</h3>
            <button className="btn-text">View All</button>
          </div>
          <div className="transactions-list">
            {transactions.map((tx) => (
              <div key={tx.id} className="transaction-item">
                <div className="tx-icon">
                  <Activity size={18} />
                </div>
                <div className="tx-details">
                  <p className="tx-name">{tx.name}</p>
                  <p className="tx-cat">{tx.category} • {tx.date}</p>
                </div>
                <div className="tx-amount">
                  <span className={tx.amount > 0 ? 'text-success' : ''}>
                    {tx.amount > 0 ? '+' : ''}{tx.amount.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Dashboard;
