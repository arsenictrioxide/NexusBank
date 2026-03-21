import { useState } from 'react';
import { Lock, Mail } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Login failed');

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      
      // Force reload to update Layout state cleanly
      window.location.href = '/';
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
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
          {error && <div style={{color: '#ef4444', marginTop: '10px', fontSize: '0.9rem', textAlign: 'center'}}>{error}</div>}
        </div>

        <form className="login-form" onSubmit={handleLogin}>
          <div className="form-group">
            <label>Email Address</label>
            <div className="input-with-icon">
              <Mail size={18} className="input-icon" />
              <input type="email" required className="form-input" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
          </div>

          <div className="form-group mt-4">
            <div className="flex justify-between items-center mb-1">
              <label>Password</label>
              <a href="#" className="forgot-link">Forgot Password?</a>
            </div>
            <div className="input-with-icon">
              <Lock size={18} className="input-icon" />
              <input type="password" required className="form-input" placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
          </div>

          <button type="submit" className="btn-primary w-full mt-6 justify-center" disabled={loading}>
            {loading ? 'Authenticating...' : 'Sign In'}
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
