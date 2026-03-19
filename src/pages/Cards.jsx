import { useState } from 'react';
import { CreditCard, Eye, EyeOff, Lock, Unlock, Settings2, ShieldCheck, Globe } from 'lucide-react';
import './Cards.css';

const myCards = [
  { id: 1, type: 'Debit', network: 'Visa', last4: '4598', expiry: '12/28', vcc: '***', color: 'blue', isFrozen: false },
  { id: 2, type: 'Credit', network: 'Mastercard', last4: '1029', expiry: '05/27', vcc: '***', color: 'purple', isFrozen: true },
];

const Cards = () => {
  const [activeCardId, setActiveCardId] = useState(1);
  const [showDetails, setShowDetails] = useState(false);
  const [cards, setCards] = useState(myCards);

  const activeCard = cards.find(c => c.id === activeCardId) || cards[0];

  const handleToggleFreeze = () => {
    setCards(cards.map(c => 
      c.id === activeCardId ? { ...c, isFrozen: !c.isFrozen } : c
    ));
  };

  return (
    <div className="cards-page">
      <header className="page-header animate-fade-in">
        <div>
          <h1 className="text-gradient">Cards Management</h1>
          <p className="text-muted">Manage your physical and virtual cards securely.</p>
        </div>
      </header>

      <div className="cards-layout animate-fade-in" style={{ animationDelay: '0.1s' }}>
        <section className="cards-visual-section">
          {/* Card Carousel Placeholder */}
          <div className="cards-carousel">
            {cards.map((card) => (
              <div 
                key={card.id}
                className={`credit-card ${card.color} ${activeCardId === card.id ? 'active' : ''} ${card.isFrozen ? 'frozen' : ''}`}
                onClick={() => setActiveCardId(card.id)}
              >
                {card.isFrozen && (
                  <div className="frozen-overlay">
                    <Lock size={32} />
                    <span>Card Frozen</span>
                  </div>
                )}
                <div className="card-top">
                  <span className="card-type">{card.type}</span>
                  <span className="card-network font-bold italic">{card.network}</span>
                </div>
                <div className="card-chip">
                  <div className="chip-inner"></div>
                </div>
                <div className="card-number">
                  {showDetails ? (
                    <span>4111 2222 3333 {card.last4}</span>
                  ) : (
                    <span>**** **** **** {card.last4}</span>
                  )}
                </div>
                <div className="card-bottom">
                  <div className="card-info-group">
                    <span className="info-label">Card Holder</span>
                    <span className="info-value">ALEX MORGAN</span>
                  </div>
                  <div className="card-info-group">
                    <span className="info-label">Expires</span>
                    <span className="info-value">{card.expiry}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <button 
            className="btn-outline w-full mt-4 justify-center"
            onClick={() => setShowDetails(!showDetails)}
          >
            {showDetails ? <EyeOff size={18} /> : <Eye size={18} />}
            {showDetails ? 'Hide Details' : 'Show Details'}
          </button>
        </section>

        <section className="card-settings-section glass-panel">
          <h3 className="section-title mb-4">Card Settings</h3>
          
          <div className="settings-list">
            <div className="setting-item">
              <div className="setting-info">
                <div className="setting-icon">
                  {activeCard.isFrozen ? <Lock size={20} /> : <Unlock size={20} />}
                </div>
                <div>
                  <h4>Freeze Card</h4>
                  <p>Temporarily disable this card.</p>
                </div>
              </div>
              <label className="toggle-switch">
                <input 
                  type="checkbox" 
                  checked={activeCard.isFrozen} 
                  onChange={handleToggleFreeze}
                />
                <span className="slider"></span>
              </label>
            </div>

            <div className="setting-item">
              <div className="setting-info">
                <div className="setting-icon">
                  <Globe size={20} />
                </div>
                <div>
                  <h4>International Usage</h4>
                  <p>Enable transactions abroad.</p>
                </div>
              </div>
              <label className="toggle-switch">
                <input type="checkbox" defaultChecked />
                <span className="slider"></span>
              </label>
            </div>

            <div className="setting-item">
              <div className="setting-info">
                <div className="setting-icon">
                  <ShieldCheck size={20} />
                </div>
                <div>
                  <h4>Online Transactions</h4>
                  <p>Allow internet purchases.</p>
                </div>
              </div>
              <label className="toggle-switch">
                <input type="checkbox" defaultChecked />
                <span className="slider"></span>
              </label>
            </div>
          </div>

          <div className="limits-section mt-4 pt-4" style={{ borderTop: '1px solid var(--border-light)' }}>
            <div className="flex justify-between items-center mb-2">
              <h4 className="font-semibold">Monthly Spending Limit</h4>
              <span className="text-primary font-bold">$2,000 / $5,000</span>
            </div>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: '40%' }}></div>
            </div>
            <button className="btn-text mt-4 w-full justify-center">
              <Settings2 size={16} /> Adjust Limits
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Cards;
