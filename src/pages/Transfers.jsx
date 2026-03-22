import { useState, useEffect } from 'react';
import { ArrowRight, Users, Plus, Building, UserCircle } from 'lucide-react';
import './Transfers.css';

const recentContacts = [
  { id: 1, name: 'Sarah Jenkins', initial: 'SJ', color: '#8b5cf6' },
  { id: 2, name: 'Michael Chen', initial: 'MC', color: '#10b981' },
  { id: 3, name: 'Ava Smith', initial: 'AS', color: '#f59e0b' },
];

const routingDatabase = {
  '051000017': 'Bank of America',
  '122100024': 'JPMorgan Chase Bank',
  '021001088': 'HSBC Bank USA',
  '125200057': 'Wells Fargo Bank',
  '071004200': 'U.S. Bank',
  '031309945': 'ACNB Bank',
  '026008811': 'Popular Bank',
  '031000011': 'TD Bank',
  '121000248': 'Wells Fargo Bank (CA)',
  '031100649': 'Discover Bank',
  '031101279': 'Chime (The Bancorp Bank)',
  '103100195': 'Chime (Stride Bank)',
  '124003116': 'Ally Bank',
  '051405515': 'Capital One',
  '043000096': 'PNC Bank',
  '061000104': 'Truist Bank',
  '042000314': 'Fifth Third Bank',
  '011500355': 'Citizens Bank',
  '041201085': 'KeyBank',
  '071000288': 'BMO Harris Bank'
};

const getBankByRouting = (routingStr) => {
  if (!routingStr || routingStr.length < 9) return '';
  return routingDatabase[routingStr] || 'Unknown Routing Number';
};

const Transfers = () => {
  const [balance, setBalance] = useState(JSON.parse(localStorage.getItem('user') || '{}')?.balance || 0);
  const [transferType, setTransferType] = useState('internal');
  const [routingNumber, setRoutingNumber] = useState('');
  const [bankName, setBankName] = useState('');

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
  
  // Real-time routing lookup
  useEffect(() => {
    if (routingNumber.length >= 9) {
      setBankName(getBankByRouting(routingNumber));
    } else {
      setBankName('');
    }
  }, [routingNumber]);

  return (
    <div className="transfers-page">
      <header className="page-header animate-fade-in">
        <div>
          <h1 className="text-gradient">Transfers & Payments</h1>
          <p className="text-muted">Move money securely between internal and external accounts.</p>
        </div>
      </header>

      <div className="transfer-layout animate-fade-in" style={{ animationDelay: '0.1s' }}>
        <section className="transfer-form-section glass-panel">
          <div className="transfer-tabs">
            <button 
              className={`tab-btn ${transferType === 'internal' ? 'active' : ''}`}
              onClick={() => setTransferType('internal')}
            >
              Internal Transfer
            </button>
            <button 
              className={`tab-btn ${transferType === 'external' ? 'active' : ''}`}
              onClick={() => setTransferType('external')}
            >
              Interbank Transfer
            </button>
            <button 
              className={`tab-btn ${transferType === 'billpay' ? 'active' : ''}`}
              onClick={() => setTransferType('billpay')}
            >
              Pay Bills
            </button>
          </div>

          <form className="transfer-form">
            <div className="form-group">
              <label>From Account</label>
              <select className="form-input">
                <option>Everyday Checking (**** 4598) - {balance.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</option>
                <option>High Yield Savings (**** 8821) - $15,200.50</option>
              </select>
            </div>

            {transferType === 'internal' && (
              <div className="form-group">
                <label>To Account</label>
                <select className="form-input">
                  <option>High Yield Savings (**** 8821)</option>
                  <option>Everyday Checking (**** 4598)</option>
                  <option>Platinum Rewards Card (**** 1029)</option>
                </select>
              </div>
            )}

            {transferType === 'external' && (
              <>
                <div className="form-group">
                  <label>Recipient Name</label>
                  <div className="input-with-icon">
                    <UserCircle size={18} className="input-icon" />
                    <input type="text" className="form-input pl-10" placeholder="John Doe" />
                  </div>
                </div>
                
                <div className="form-group">
                  <label>Routing Number</label>
                  <div className="input-with-icon">
                    <Building size={18} className="input-icon" />
                    <input 
                      type="text" 
                      className="form-input pl-10" 
                      placeholder="9-digit routing number" 
                      maxLength={9}
                      value={routingNumber}
                      onChange={(e) => setRoutingNumber(e.target.value.replace(/\D/g, ''))}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Bank Name</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    placeholder="Auto-populates from routing" 
                    value={bankName}
                    disabled
                    style={{ backgroundColor: 'var(--bg-base)', opacity: 0.8 }}
                  />
                </div>
                
                <div className="form-group">
                  <label>Account Number</label>
                  <input type="text" className="form-input" placeholder="Recipient's account number" />
                </div>
              </>
            )}

            {transferType === 'billpay' && (
              <div className="form-group">
                <label>Select Biller</label>
                <select className="form-input">
                  <option>Edison Electric</option>
                  <option>Comcast Internet</option>
                  <option>State Farm Insurance</option>
                </select>
              </div>
            )}

            <div className="form-group amount-group mt-4">
              <label>Amount</label>
              <div className="amount-input-wrapper">
                <span className="currency-symbol">$</span>
                <input type="number" className="form-input amount-input" placeholder="0.00" />
              </div>
            </div>

            <div className="form-group">
              <label>Date</label>
              <input type="date" className="form-input" defaultValue={new Date().toISOString().split('T')[0]} />
            </div>

            <div className="form-group">
              <label>Memo (Optional)</label>
              <input type="text" className="form-input" placeholder="What is this for?" />
            </div>

            <button type="button" className="btn-primary w-full mt-4 justify-center">
              Review Transfer <ArrowRight size={18} />
            </button>
          </form>
        </section>

        <aside className="transfer-sidebar">
          {transferType === 'external' ? (
             <div className="contacts-section glass-panel">
               <div className="section-header">
                 <h3>Recent Contacts</h3>
                 <button className="icon-btn-small">
                   <Users size={18} />
                 </button>
               </div>
               
               <div className="contacts-grid">
                 <button className="contact-btn new-contact">
                   <div className="contact-avatar add-avatar">
                     <Plus size={20} />
                   </div>
                   <span>New</span>
                 </button>
                 
                 {recentContacts.map(contact => (
                   <button key={contact.id} className="contact-btn">
                     <div className="contact-avatar" style={{ backgroundColor: contact.color }}>
                       {contact.initial}
                     </div>
                     <span>{contact.name.split(' ')[0]}</span>
                   </button>
                 ))}
               </div>
             </div>
          ) : (
            <div className="glass-panel p-4 rounded-md">
               <h3 className="section-title mb-2">Transfer Limits</h3>
               <p className="text-sm text-muted mb-4">Internal transfers happen instantly and do not count against your daily wire limits.</p>
               <div className="progress-bar mb-1">
                 <div className="progress-fill" style={{ width: '15%' }}></div>
               </div>
               <p className="text-sm text-right font-semibold">$1,500 / $10,000 Daily Limit</p>
            </div>
          )}

          <div className="scheduled-transfers glass-panel mt-4 relative">
            <h3 className="section-title mb-4">Scheduled</h3>
            <div className="empty-state">
              <p className="text-muted text-sm">No upcoming transfers scheduled.</p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default Transfers;
