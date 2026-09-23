// Register Page: Registration portal for Candidates and Recruiters
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Briefcase, Lock, Mail, User, AlertCircle, CheckCircle } from 'lucide-react';

const Register = () => {
  const [role, setRole] = useState('candidate');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      return setError('Passwords do not match');
    }

    if (password.length < 6) {
      return setError('Password must be at least 6 characters long');
    }

    setLoading(true);

    try {
      const userData = await register(name, email, password, role);

      if (userData.role === 'recruiter') {
        navigate('/recruiter');
      } else {
        navigate('/candidate');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please check your details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '3.5rem 0', minHeight: '80vh', display: 'flex', alignItems: 'center' }}>
      <div className="container" style={{ maxWidth: '520px' }}>
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
            <h1 style={{ fontSize: '1.6rem', marginBottom: '0.25rem' }}>Create Your Account</h1>
            <p style={{ color: 'var(--gray-500)', fontSize: '0.9rem' }}>
              Join CareerConnect to browse jobs or hire top tech professionals
            </p>
          </div>

          {error && (
            <div className="alert alert-danger">
              <AlertCircle size={18} />
              <span>{error}</span>
            </div>
          )}

          {/* Role Choice Radio Tiles */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label className="form-label" style={{ marginBottom: '0.6rem' }}>Select Your Purpose</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <button
                type="button"
                onClick={() => setRole('candidate')}
                style={{
                  padding: '0.85rem',
                  borderRadius: 'var(--radius-md)',
                  border: role === 'candidate' ? '2px solid var(--primary)' : '1px solid var(--gray-300)',
                  background: role === 'candidate' ? 'var(--primary-light)' : 'var(--white)',
                  color: role === 'candidate' ? 'var(--primary-dark)' : 'var(--gray-700)',
                  fontWeight: 600,
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                  textAlign: 'center',
                  transition: 'var(--transition)'
                }}
              >
                I'm a Candidate
                <span style={{ display: 'block', fontSize: '0.75rem', fontWeight: 400, color: 'var(--gray-500)', marginTop: '0.2rem' }}>
                  Looking for jobs
                </span>
              </button>

              <button
                type="button"
                onClick={() => setRole('recruiter')}
                style={{
                  padding: '0.85rem',
                  borderRadius: 'var(--radius-md)',
                  border: role === 'recruiter' ? '2px solid var(--primary)' : '1px solid var(--gray-300)',
                  background: role === 'recruiter' ? 'var(--primary-light)' : 'var(--white)',
                  color: role === 'recruiter' ? 'var(--primary-dark)' : 'var(--gray-700)',
                  fontWeight: 600,
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                  textAlign: 'center',
                  transition: 'var(--transition)'
                }}
              >
                I'm a Recruiter
                <span style={{ display: 'block', fontSize: '0.75rem', fontWeight: 400, color: 'var(--gray-500)', marginTop: '0.2rem' }}>
                  Hiring candidates
                </span>
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <div style={{ position: 'relative' }}>
                <User
                  size={16}
                  color="var(--gray-400)"
                  style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }}
                />
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. Rahul Sharma"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  style={{ paddingLeft: '2.4rem' }}
                  required
                />
              </div>
            </div>

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
                  placeholder="At least 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{ paddingLeft: '2.4rem' }}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Confirm Password</label>
              <div style={{ position: 'relative' }}>
                <Lock
                  size={16}
                  color="var(--gray-400)"
                  style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }}
                />
                <input
                  type="password"
                  className="form-control"
                  placeholder="Re-enter your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  style={{ paddingLeft: '2.4rem' }}
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-block btn-lg"
              disabled={loading}
              style={{ marginTop: '0.75rem', marginBottom: '1.25rem' }}
            >
              {loading ? 'Creating Account...' : 'Complete Registration'}
            </button>
          </form>

          <div style={{ textAlign: 'center', fontSize: '0.9rem', color: 'var(--gray-600)' }}>
            Already registered?{' '}
            <Link to="/login" style={{ fontWeight: 600 }}>
              Sign In Instead
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
