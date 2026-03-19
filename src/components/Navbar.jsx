import { Bell, Search, User } from 'lucide-react';
import './Navbar.css';

const Navbar = () => {
  return (
    <header className="navbar">
      <div className="nav-search">
        <Search size={18} className="search-icon" />
        <input type="text" placeholder="Search transactions, accounts..." />
      </div>
      
      <div className="nav-actions">
        <button className="icon-btn">
          <Bell size={20} />
          <span className="badge">3</span>
        </button>
        
        <div className="user-profile">
          <div className="avatar">
            <User size={20} />
          </div>
          <div className="user-info">
            <span className="user-name">Alex Morgan</span>
            <span className="user-type">Premium</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
