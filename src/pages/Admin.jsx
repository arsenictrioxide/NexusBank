import { useState } from 'react';
import { UserPlus, Search, Edit3, DollarSign } from 'lucide-react';
import './Admin.css';

// Mock database for admin view
const initialUsers = [
  { id: '1001', name: 'Alex Morgan', email: 'alex@example.com', accounts: [{ type: 'Checking', balance: 8450.00 }] },
  { id: '1002', name: 'Sarah Jenkins', email: 'sarah@example.com', accounts: [{ type: 'Checking', balance: 1240.20 }] },
  { id: '1003', name: 'Michael Chen', email: 'michael@example.com', accounts: [{ type: 'Savings', balance: 45000.00 }] },
];

const Admin = () => {
  const [users, setUsers] = useState(initialUsers);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Registration Form State
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newBalance, setNewBalance] = useState('');

  // Update Balance State
  const [selectedUser, setSelectedUser] = useState(null);
  const [updateBalanceAmount, setUpdateBalanceAmount] = useState('');

  const handleRegisterUser = (e) => {
    e.preventDefault();
    if (!newName || !newEmail || !newBalance) return;
    
    const newUser = {
      id: Math.floor(1000 + Math.random() * 9000).toString(),
      name: newName,
      email: newEmail,
      accounts: [{ type: 'Checking', balance: parseFloat(newBalance) }]
    };
    
    setUsers([...users, newUser]);
    setNewName('');
    setNewEmail('');
    setNewBalance('');
    alert('User registered successfully');
  };

  const handleUpdateBalance = (e) => {
    e.preventDefault();
    if (!selectedUser || !updateBalanceAmount) return;
    
    const amount = parseFloat(updateBalanceAmount);
    
    setUsers(users.map(u => {
      if (u.id === selectedUser.id) {
        return {
          ...u,
          accounts: [{ ...u.accounts[0], balance: amount }]
        };
      }
      return u;
    }));
    
    setSelectedUser(null);
    setUpdateBalanceAmount('');
    alert('Balance updated successfully');
  };

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    u.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="admin-page">
      <header className="page-header animate-fade-in">
        <div>
          <h1 className="text-gradient">Admin Dashboard</h1>
          <p className="text-muted">Register new accounts and update user balances.</p>
        </div>
      </header>

      <div className="admin-layout animate-fade-in" style={{ animationDelay: '0.1s' }}>
        <section className="admin-section register-section glass-panel">
          <div className="section-header">
            <h3><UserPlus size={20} className="inline-icon" /> Register New User</h3>
          </div>
          
          <form className="admin-form" onSubmit={handleRegisterUser}>
            <div className="form-group">
              <label>Full Name</label>
              <input 
                type="text" 
                className="form-input" 
                placeholder="John Doe" 
                value={newName} 
                onChange={(e) => setNewName(e.target.value)}
                required 
              />
            </div>
            
            <div className="form-group">
              <label>Email Address</label>
              <input 
                type="email" 
                className="form-input" 
                placeholder="john@example.com" 
                value={newEmail} 
                onChange={(e) => setNewEmail(e.target.value)}
                required 
              />
            </div>
            
            <div className="form-group">
              <label>Initial Checking Balance</label>
              <div className="input-with-icon">
                <DollarSign size={16} className="input-icon" />
                <input 
                  type="number" 
                  className="form-input pl-8" 
                  placeholder="0.00" 
                  step="0.01" 
                  value={newBalance} 
                  onChange={(e) => setNewBalance(e.target.value)}
                  required 
                />
              </div>
            </div>
            
            <button type="submit" className="btn-primary mt-4 w-full justify-center">
              Create Account
            </button>
          </form>
        </section>

        <section className="admin-section users-section glass-panel">
          <div className="section-header">
            <h3>User Directory & Balance Management</h3>
          </div>
          
          <div className="admin-search mb-4">
            <Search size={18} className="search-icon" />
            <input 
              type="text" 
              className="form-input w-full pl-10" 
              placeholder="Search users..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="users-list">
            {filteredUsers.map(user => (
              <div key={user.id} className="user-admin-card">
                <div className="user-admin-info">
                  <div className="user-admin-avatar">
                    {user.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-semibold">{user.name}</h4>
                    <p className="text-sm text-muted">{user.email} • ID: {user.id}</p>
                    <p className="font-bold text-primary mt-1">
                      {user.accounts[0].balance.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
                    </p>
                  </div>
                </div>
                
                {selectedUser?.id === user.id ? (
                  <form className="quick-update-form" onSubmit={handleUpdateBalance}>
                    <input 
                      type="number" 
                      className="form-input input-sm" 
                      placeholder="New Balance" 
                      step="0.01"
                      value={updateBalanceAmount}
                      onChange={(e) => setUpdateBalanceAmount(e.target.value)}
                      required 
                      autoFocus
                    />
                    <button type="submit" className="icon-btn-update text-success">
                      Save
                    </button>
                    <button type="button" className="icon-btn-update text-danger" onClick={() => setSelectedUser(null)}>
                      Cancel
                    </button>
                  </form>
                ) : (
                  <button className="btn-outline btn-sm" onClick={() => {
                    setSelectedUser(user);
                    setUpdateBalanceAmount(user.accounts[0].balance.toString());
                  }}>
                    <Edit3 size={16} /> Edit Balance
                  </button>
                )}
              </div>
            ))}
            {filteredUsers.length === 0 && (
              <p className="text-center text-muted mt-4">No users found.</p>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Admin;
