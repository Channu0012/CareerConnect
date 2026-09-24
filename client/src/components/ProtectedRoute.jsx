import React from 'react';
import { Navigate, Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Loader from './Loader';
import { ShieldAlert, LogOut, LayoutDashboard, Home } from 'lucide-react';

const ProtectedRoute = ({ allowedRoles }) => {
  const { user, isAuthenticated, loading, logout } = useAuth();
  const navigate = useNavigate();

  if (loading) {
    return <Loader message="Verifying authentication session..." />;
  }

  // Not authenticated -> redirect to login with callback
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  // Role not allowed -> provide clear role resolution instead of silent redirect
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    const targetRoleName = allowedRoles.includes('admin')
      ? 'Administrator'
      : allowedRoles.includes('recruiter')
      ? 'Recruiter'
      : 'Candidate';

    const userDashboardPath =
      user.role === 'admin'
        ? '/admin'
        : user.role === 'recruiter'
        ? '/recruiter'
        : '/candidate';

    return (
      <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem 1.5rem', background: 'var(--gray-50)' }}>
        <div className="card" style={{ maxWidth: '540px', width: '100%', textAlign: 'center', padding: '2.5rem', boxShadow: 'var(--shadow-lg)' }}>
          <div
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              background: '#fef2f2',
              color: 'var(--danger)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1.25rem'
            }}
          >
            <ShieldAlert size={32} />
          </div>

          <h2 style={{ fontSize: '1.6rem', marginBottom: '0.5rem', fontWeight: 800 }}>
            {targetRoleName} Access Required
          </h2>

          <p style={{ color: 'var(--gray-600)', marginBottom: '1.5rem', lineHeight: 1.6, fontSize: '0.95rem' }}>
            You are currently signed in as <strong>{user.name}</strong> with the role{' '}
            <span
              style={{
                background: 'var(--primary)',
                color: '#fff',
                padding: '0.15rem 0.5rem',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.75rem',
                textTransform: 'uppercase',
                fontWeight: 700
              }}
            >
              {user.role}
            </span>.
            <br />
            This portal is restricted exclusively to <strong>{targetRoleName}</strong> accounts.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {allowedRoles.includes('admin') && (
              <button
                type="button"
                onClick={() => {
                  logout();
                  navigate('/login?quick=admin');
                }}
                className="btn btn-primary btn-block btn-lg"
                style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
              >
                <LogOut size={16} />
                <span>Switch to Admin Account</span>
              </button>
            )}

            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.25rem' }}>
              <Link
                to={userDashboardPath}
                className="btn btn-outline btn-block"
                style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
              >
                <LayoutDashboard size={16} />
                <span>Go to My Dashboard</span>
              </Link>

              <Link
                to="/"
                className="btn btn-secondary btn-block"
                style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
              >
                <Home size={16} />
                <span>Home</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return <Outlet />;
};

export default ProtectedRoute;
