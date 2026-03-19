import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Wallet, ArrowRightLeft, CreditCard, Settings, LogOut, ShieldAlert } from 'lucide-react';
import './Sidebar.css';

const Sidebar = () => {
  const navItems = [
    { name: 'Dashboard', path: '/', icon: <LayoutDashboard size={20} /> },
    { name: 'Accounts', path: '/accounts', icon: <Wallet size={20} /> },
    { name: 'Transfers', path: '/transfers', icon: <ArrowRightLeft size={20} /> },
    { name: 'Cards', path: '/cards', icon: <CreditCard size={20} /> },
    { name: 'Settings', path: '/settings', icon: <Settings size={20} /> },
    { name: 'Admin Portal', path: '/admin', icon: <ShieldAlert size={20} /> },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div className="logo-placeholder">
           <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
             <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
           </svg>
        </div>
        <h2 className="text-gradient">Nexus</h2>
      </div>
      
      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <NavLink 
            key={item.name} 
            to={item.path}
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
          >
            {item.icon}
            <span>{item.name}</span>
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        <NavLink to="/login" className="nav-item text-danger">
          <LogOut size={20} />
          <span>Logout</span>
        </NavLink>
      </div>
    </aside>
  );
};

export default Sidebar;
