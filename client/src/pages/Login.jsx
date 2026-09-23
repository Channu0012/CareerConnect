// Login Page: Authentication gateway with convenient one-click demo credentials for examiners
import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Briefcase, Lock, Mail, AlertCircle, ArrowRight, Sparkles } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const sessionExpired = queryParams.get('expired');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const userData = await login(email, password);

      // Route dynamically to appropriate role dashboard
      if (userData.role === 'admin') {
        navigate('/admin');
      } else if (userData.role === 'recruiter') {
        navigate('/recruiter');
      } else {
        navigate('/candidate');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  // Quick-fill helper for examiners / demo testers
  const fillDemoCredentials = (demoEmail, demoPassword) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    setError('');
  };

  return (
    <div style={{ padding: '3.5rem 0', minHeight: '80vh', display: 'flex', alignItems: 'center' }}>
      <div className="container" style={{ maxWidth: '480px' }}>
        <div className="card" style={{ padding: '2.25rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
            <div
              style={{
                width: '50px',
                height: '50px',
                background: 'linear-gradient(135deg, var(--primary), var(--accent))',
                borderRadius: 'var(--radius-md)',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                marginBottom: '0.75rem'
              }}
            >
              <Briefcase size={26} />
            </div>
            <h1 style={{ fontSize: '1.6rem', marginBottom: '0.25rem' }}>Welcome Back</h1>
            <p style={{ color: 'var(--gray-500)', fontSize: '0.9rem' }}>
              Sign in to manage recruitment or job applications
            </p>
          </div>

          {sessionExpired && (
            <div className="alert alert-info">
              Your session expired. Please log in again to continue.
            </div>
          )}

          {error && (
            <div className="alert alert-danger">
              <AlertCircle size={18} />
              <span>{error}</span>
            </div>
          )}

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
                  type="password"
                  className="form-control"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{ paddingLeft: '2.4rem' }}
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-block btn-lg"
              disabled={loading}
              style={{ marginTop: '0.5rem', marginBottom: '1.25rem' }}
            >
              {loading ? 'Authenticating...' : 'Sign In'}
            </button>
          </form>

          {/* Quick Demo Credentials Panel for Viva/Evaluation */}
          <div
            style={{
              background: 'var(--gray-50)',
              border: '1px dashed var(--gray-300)',
              borderRadius: 'var(--radius-md)',
              padding: '1rem',
              marginBottom: '1.5rem'
            }}
          >
            <p
              style={{
                fontSize: '0.8rem',
                fontWeight: 700,
                color: 'var(--gray-700)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
                marginBottom: '0.6rem'
              }}
            >
              <Sparkles size={14} color="var(--primary)" /> Demo Test Accounts (Click to fill):
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <button
                type="button"
                className="btn btn-outline btn-sm"
                style={{ justifyContent: 'flex-start', fontSize: '0.8rem', padding: '0.35rem 0.65rem' }}
                onClick={() => fillDemoCredentials('candidate@careerconnect.com', 'password123')}
              >
                <strong>Candidate:</strong> candidate@careerconnect.com
              </button>
              <button
                type="button"
                className="btn btn-outline btn-sm"
                style={{ justifyContent: 'flex-start', fontSize: '0.8rem', padding: '0.35rem 0.65rem' }}
                onClick={() => fillDemoCredentials('recruiter@techflow.com', 'password123')}
              >
                <strong>Recruiter:</strong> recruiter@techflow.com
              </button>
              <button
                type="button"
                className="btn btn-outline btn-sm"
                style={{ justifyContent: 'flex-start', fontSize: '0.8rem', padding: '0.35rem 0.65rem' }}
                onClick={() => fillDemoCredentials('admin@careerconnect.com', 'password123')}
              >
                <strong>Admin:</strong> admin@careerconnect.com
              </button>
            </div>
          </div>

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
