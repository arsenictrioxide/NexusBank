import { Lock, Mail } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const Login = () => {
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    // Simulate auth
    navigate('/');
  };

  return (
    <div className="login-container">
      {/* Decorative background blocks */}
      <div className="decoration shape-1"></div>
      <div className="decoration shape-2"></div>
      
      <div className="login-box glass-panel animate-fade-in">
        <div className="login-brand">
          <div className="logo-placeholder-lg">
             <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
               <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
             </svg>
          </div>
          <h2>Nexus Bank</h2>
          <p className="text-muted">Welcome back. Please login to your account.</p>
        </div>

        <form className="login-form" onSubmit={handleLogin}>
          <div className="form-group">
            <label>Email Address</label>
            <div className="input-with-icon">
              <Mail size={18} className="input-icon" />
              <input type="email" required className="form-input" placeholder="Enter your email" defaultValue="alex@example.com" />
            </div>
          </div>

          <div className="form-group mt-4">
            <div className="flex justify-between items-center mb-1">
              <label>Password</label>
              <a href="#" className="forgot-link">Forgot Password?</a>
            </div>
            <div className="input-with-icon">
              <Lock size={18} className="input-icon" />
              <input type="password" required className="form-input" placeholder="Enter your password" defaultValue="password" />
            </div>
          </div>

          <button type="submit" className="btn-primary w-full mt-6 justify-center">
            Sign In
          </button>
        </form>

        <div className="login-footer">
          <p className="text-muted">
            Don't have an account? <a href="#" className="signup-link">Open an account</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
