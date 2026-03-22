import { useState, useEffect } from 'react';
import { Plus, MoreHorizontal, ArrowUpRight, ArrowDownRight, CreditCard } from 'lucide-react';
import './Accounts.css';

const accountsList = [
  { id: 1, type: 'Checking', name: 'Everyday Checking', balance: 8450.00, number: '**** **** **** 4598', trend: '+1.2%' },
  { id: 2, type: 'Savings', name: 'High Yield Savings', balance: 15200.50, number: '**** **** **** 8821', trend: '+5.0%' },
  { id: 3, type: 'Credit', name: 'Platinum Rewards Card', balance: -910.20, number: '**** **** **** 1029', limit: 10000 },
];

const statementData = [
  { id: 'ST-001', date: 'Mar 1, 2026 - Mar 31, 2026', type: 'Checking Statement', size: '124 KB' },
  { id: 'ST-002', date: 'Feb 1, 2026 - Feb 28, 2026', type: 'Checking Statement', size: '118 KB' },
  { id: 'ST-003', date: 'Jan 1, 2026 - Jan 31, 2026', type: 'Checking Statement', size: '132 KB' },
];

const Accounts = () => {
  const [balance, setBalance] = useState(JSON.parse(localStorage.getItem('user') || '{}')?.balance || 0);

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
        }
      } catch (err) {}
    };
    fetchUserData();
  }, []);

  const dynamicAccounts = [
    { id: 1, type: 'Checking', name: 'Everyday Checking', balance: balance, number: '**** **** **** 4598', trend: '+1.2%' },
    { id: 2, type: 'Savings', name: 'High Yield Savings', balance: 15200.50, number: '**** **** **** 8821', trend: '+5.0%' },
    { id: 3, type: 'Credit', name: 'Platinum Rewards Card', balance: -910.20, number: '**** **** **** 1029', limit: 10000 },
  ];

  return (
    <div className="accounts-page">
      <header className="page-header animate-fade-in">
        <div>
          <h1 className="text-gradient">Accounts</h1>
          <p className="text-muted">Manage your active accounts and view statements.</p>
        </div>
        <button className="btn-secondary">
          <Plus size={18} />
          Open New Account
        </button>
      </header>

      <div className="accounts-grid animate-fade-in" style={{ animationDelay: '0.1s' }}>
        {dynamicAccounts.map((acc) => (
          <div key={acc.id} className="account-card glass-panel">
            <div className="acc-header">
              <div className="acc-icon">
                <CreditCard size={24} />
              </div>
              <button className="icon-btn-small">
                <MoreHorizontal size={18} />
              </button>
            </div>
            <div className="acc-body">
              <p className="acc-type">{acc.type} • {acc.number}</p>
              <h3 className="acc-name">{acc.name}</h3>
              <h2 className="acc-balance">
                {acc.balance < 0 ? '-' : ''}{Math.abs(acc.balance).toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
              </h2>
              {acc.limit && <p className="acc-limit">Available Credit: {(acc.limit + acc.balance).toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</p>}
            </div>
            <div className="acc-footer">
              <button className="btn-text">
                <ArrowUpRight size={16} /> Send
              </button>
              <button className="btn-text">
                <ArrowDownRight size={16} /> Receive
              </button>
            </div>
          </div>
        ))}
      </div>

      <section className="statements-section animate-fade-in" style={{ animationDelay: '0.2s' }}>
        <h3 className="section-title">Recent Statements</h3>
        <div className="statements-list glass-panel">
          {statementData.map((stmt) => (
            <div key={stmt.id} className="statement-item">
              <div className="stmt-info">
                <h4>{stmt.date}</h4>
                <p>{stmt.type}</p>
              </div>
              <div className="stmt-actions">
                <span className="stmt-size">{stmt.size}</span>
                <button className="btn-outline">Download PDF</button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Accounts;
