import { User, Shield, Bell, Smartphone } from 'lucide-react';
import './Settings.css';

const Settings = () => {
  return (
    <div className="settings-page">
      <header className="page-header animate-fade-in">
        <div>
          <h1 className="text-gradient">Settings</h1>
          <p className="text-muted">Manage your profile, security, and notification preferences.</p>
        </div>
      </header>

      <div className="settings-layout animate-fade-in" style={{ animationDelay: '0.1s' }}>
        <nav className="settings-sidebar glass-panel">
          <button className="settings-tab active">
            <User size={18} /> Profile Information
          </button>
          <button className="settings-tab">
            <Shield size={18} /> Security
          </button>
          <button className="settings-tab">
            <Bell size={18} /> Notifications
          </button>
          <button className="settings-tab">
            <Smartphone size={18} /> Connected Devices
          </button>
        </nav>

        <section className="settings-content glass-panel">
          <div className="settings-section">
            <h3 className="section-title mb-4">Profile Information</h3>
            
            <div className="profile-edit-header mb-4">
              <div className="avatar-large">
                <User size={32} />
              </div>
              <button className="btn-outline">Change Avatar</button>
            </div>

            <form className="settings-form">
              <div className="form-row">
                <div className="form-group w-full">
                  <label>First Name</label>
                  <input type="text" className="form-input" defaultValue="Alex" />
                </div>
                <div className="form-group w-full">
                  <label>Last Name</label>
                  <input type="text" className="form-input" defaultValue="Morgan" />
                </div>
              </div>

              <div className="form-group">
                <label>Email Address</label>
                <input type="email" className="form-input" defaultValue="alex.morgan@example.com" />
              </div>

              <div className="form-group">
                <label>Phone Number</label>
                <input type="tel" className="form-input" defaultValue="+1 (555) 123-4567" />
              </div>

              <div className="form-group mt-4">
                <button type="button" className="btn-primary w-fit">Save Changes</button>
              </div>
            </form>
          </div>

          <div className="settings-separator"></div>

          <div className="settings-section">
            <h3 className="section-title mb-4">Security</h3>
            
            <div className="security-option">
              <div>
                <h4>Change Password</h4>
                <p className="text-muted text-sm">Update your password regularly to keep your account secure.</p>
              </div>
              <button className="btn-secondary">Update</button>
            </div>

            <div className="security-option mt-4">
              <div>
                <h4>Two-Factor Authentication (2FA)</h4>
                <p className="text-muted text-sm">Add an extra layer of security to your account.</p>
              </div>
              <label className="toggle-switch">
                <input type="checkbox" defaultChecked />
                <span className="slider"></span>
              </label>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Settings;
