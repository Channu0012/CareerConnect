import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Lock, Mail, AlertCircle, Eye, EyeOff } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { login, user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const sessionExpired = queryParams.get('expired');
  const quickRole = queryParams.get('quick');

  useEffect(() => {
    if (quickRole === 'admin') {
      setEmail('admin@careerconnect.com');
      setPassword('password123');
    } else if (quickRole === 'recruiter') {
      setEmail('recruiter@techflow.com');
      setPassword('password123');
    } else if (quickRole === 'candidate') {
      setEmail('candidate@careerconnect.com');
      setPassword('password123');
    }
  }, [quickRole]);

  // If already authenticated, redirect immediately to role dashboard
  useEffect(() => {
    if (isAuthenticated && user) {
      if (user.role === 'admin') navigate('/admin', { replace: true });
      else if (user.role === 'recruiter') navigate('/recruiter', { replace: true });
      else navigate('/candidate', { replace: true });
    }
  }, [isAuthenticated, user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const sanitizedEmail = email.trim().toLowerCase();
      const userData = await login(sanitizedEmail, password);

      // Route dynamically to appropriate role dashboard
      if (userData.role === 'admin') {
        navigate('/admin');
      } else if (userData.role === 'recruiter') {
        navigate('/recruiter');
      } else {
        navigate('/candidate');
      }
    } catch (err) {
      if (!err.response) {
        setError('Cannot connect to server. Please ensure the backend is running on http://localhost:5000');
      } else {
        setError(
          err.response.data?.message ||
          'Authentication failed. Please verify your email and password.'
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '4rem 0', minHeight: '80vh', display: 'flex', alignItems: 'center' }}>
      <div className="container" style={{ maxWidth: '440px' }}>
        <div className="card" style={{ padding: '2.5rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <img
              src="/logo.png"
              alt="CareerConnect Logo"
              style={{
                width: '60px',
                height: '60px',
                borderRadius: '16px',
                objectFit: 'cover',
                marginBottom: '1rem',
                boxShadow: '0 8px 24px -4px rgba(37, 99, 235, 0.3)',
                display: 'inline-block'
              }}
            />
            <h1 style={{ fontSize: '1.65rem', marginBottom: '0.35rem' }}>Sign In to CareerConnect</h1>
            <p style={{ color: 'var(--gray-500)', fontSize: '0.9rem' }}>
              Enter your credentials to access your account
            </p>
          </div>

          {sessionExpired && (
            <div className="alert alert-info">
              Your session has expired. Please sign in again.
            </div>
          )}

          {error && (
            <div className="alert alert-danger">
              <AlertCircle size={18} style={{ flexShrink: 0 }} />
              <span>{error}</span>
            </div>
          )}

          {/* Quick 1-Click Demo Accounts Selector */}
          <div style={{ marginBottom: '1.25rem', background: '#f8fafc', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid #e2e8f0' }}>
            <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--gray-500)', textTransform: 'uppercase', marginBottom: '0.5rem', textAlign: 'center', letterSpacing: '0.05em' }}>
              ⚡ Quick 1-Click Demo Login
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.35rem' }}>
              <button
                type="button"
                onClick={() => {
                  setEmail('admin@careerconnect.com');
                  setPassword('password123');
                  setError('');
                }}
                className="btn btn-outline btn-sm"
                style={{
                  fontSize: '0.75rem',
                  padding: '0.35rem 0.25rem',
                  background: email === 'admin@careerconnect.com' ? '#eff6ff' : '#ffffff',
                  borderColor: email === 'admin@careerconnect.com' ? 'var(--primary)' : '#cbd5e1',
                  fontWeight: email === 'admin@careerconnect.com' ? 700 : 500
                }}
                title="Log in as System Administrator (/admin)"
              >
                👑 Admin
              </button>
              <button
                type="button"
                onClick={() => {
                  setEmail('recruiter@techflow.com');
                  setPassword('password123');
                  setError('');
                }}
                className="btn btn-outline btn-sm"
                style={{
                  fontSize: '0.75rem',
                  padding: '0.35rem 0.25rem',
                  background: email === 'recruiter@techflow.com' ? '#eff6ff' : '#ffffff',
                  borderColor: email === 'recruiter@techflow.com' ? 'var(--primary)' : '#cbd5e1',
                  fontWeight: email === 'recruiter@techflow.com' ? 700 : 500
                }}
                title="Log in as Recruiter (/recruiter)"
              >
                🏢 Recruiter
              </button>
              <button
                type="button"
                onClick={() => {
                  setEmail('candidate@careerconnect.com');
                  setPassword('password123');
                  setError('');
                }}
                className="btn btn-outline btn-sm"
                style={{
                  fontSize: '0.75rem',
                  padding: '0.35rem 0.25rem',
                  background: email === 'candidate@careerconnect.com' ? '#eff6ff' : '#ffffff',
                  borderColor: email === 'candidate@careerconnect.com' ? 'var(--primary)' : '#cbd5e1',
                  fontWeight: email === 'candidate@careerconnect.com' ? 700 : 500
                }}
                title="Log in as Candidate (/candidate)"
              >
                🎓 Candidate
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <div style={{ position: 'relative' }}>
                <Mail
                  size={16}
                  color="var(--gray-400)"
                  style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }}
                />
                <input
                  type="email"
                  className="form-control"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{ paddingLeft: '2.4rem' }}
                  required
                  autoComplete="email"
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <div style={{ position: 'relative' }}>
                <Lock
                  size={16}
                  color="var(--gray-400)"
                  style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }}
                />
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="form-control"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{ paddingLeft: '2.4rem', paddingRight: '2.5rem' }}
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: '2px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: showPassword ? 'var(--primary)' : 'var(--gray-400)',
                    transition: 'color 0.15s ease'
                  }}
                  title={showPassword ? 'Hide password' : 'Show password'}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-block btn-lg"
              disabled={loading}
              style={{ marginTop: '0.75rem', marginBottom: '1.5rem' }}
            >
              {loading ? 'Verifying Credentials...' : 'Sign In'}
            </button>
          </form>

          <div style={{ textAlign: 'center', fontSize: '0.9rem', color: 'var(--gray-600)' }}>
            Don't have an account?{' '}
            <Link to="/register" style={{ fontWeight: 600 }}>
              Create Account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
