// Navbar Component: Responsive top navigation bar with role-based links
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Briefcase,
  LogOut,
  User,
  LayoutDashboard,
  Menu,
  X,
  Home,
  FileText
} from 'lucide-react';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getDashboardPath = () => {
    if (!user) return '/login';
    if (user.role === 'admin') return '/admin';
    if (user.role === 'recruiter') return '/recruiter';
    return '/candidate';
  };

  const getProfilePath = () => {
    if (!user) return '/login';
    if (user.role === 'candidate') return '/candidate/profile';
    if (user.role === 'recruiter') return '/recruiter';
    if (user.role === 'admin') return '/admin';
    return '/';
  };

  return (
    <header className="navbar">
      <div className="container navbar-inner">
        <Link to="/" className="brand-logo" onClick={() => setMobileMenuOpen(false)}>
          <img src="/logo.png" alt="CareerConnect" className="brand-logo-img" />
          <span>CareerConnect</span>
        </Link>

        {/* Desktop Navigation Links */}
        <nav>
          <ul className="nav-links">
            <li>
              <Link to="/" className="nav-link">
                Home
              </Link>
            </li>
            <li>
              <Link to="/jobs" className="nav-link">
                Find Jobs
              </Link>
            </li>
          </ul>
        </nav>

        {/* Desktop Actions */}
        <div className="nav-actions">
          {isAuthenticated ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              {/* User Profile Pill - Leads directly to Candidate Profile or Account */}
              <Link
                to={getProfilePath()}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.4rem 0.85rem',
                  background: 'var(--gray-100)',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  color: 'inherit',
                  textDecoration: 'none',
                  transition: 'background 0.15s ease'
                }}
                title={user?.role === 'candidate' ? 'View & Edit Candidate Profile' : 'Account Details'}
              >
                <User size={15} color="var(--primary)" />
                <span>{user?.name}</span>
                <span
                  style={{
                    fontSize: '0.7rem',
                    padding: '0.15rem 0.5rem',
                    background: 'var(--primary)',
                    color: '#fff',
                    borderRadius: 'var(--radius-full)',
                    textTransform: 'uppercase'
                  }}
                >
                  {user?.role === 'candidate' ? 'Profile' : user?.role}
                </span>
              </Link>

              {/* Single Dedicated Dashboard Button */}
              <Link to={getDashboardPath()} className="btn btn-primary btn-sm">
                <LayoutDashboard size={15} />
                <span>Dashboard</span>
              </Link>

              <button
                onClick={handleLogout}
                className="btn btn-outline btn-sm"
                title="Log Out"
              >
                <LogOut size={16} />
                <span>Logout</span>
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <Link to="/login" className="btn btn-outline btn-sm">
                Sign In
              </Link>
              <Link to="/register" className="btn btn-primary btn-sm">
                Get Started
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Hamburger Toggle Button */}
        <button
          type="button"
          className="mobile-menu-toggle"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
        >
          {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile Drawer */}
      <div className={`mobile-drawer ${mobileMenuOpen ? 'open' : ''}`}>
        <Link
          to="/"
          className="mobile-drawer-link"
          onClick={() => setMobileMenuOpen(false)}
        >
          <Home size={18} />
          <span>Home</span>
        </Link>

        <Link
          to="/jobs"
          className="mobile-drawer-link"
          onClick={() => setMobileMenuOpen(false)}
        >
          <Briefcase size={18} />
          <span>Find Jobs</span>
        </Link>

        {isAuthenticated ? (
          <>
            <div className="mobile-drawer-divider" />
            <Link
              to={getDashboardPath()}
              className="mobile-drawer-link"
              onClick={() => setMobileMenuOpen(false)}
            >
              <LayoutDashboard size={18} color="var(--primary)" />
              <span>
                {user?.role === 'admin'
                  ? 'Admin Console'
                  : user?.role === 'recruiter'
                  ? 'Recruiter Dashboard'
                  : 'Candidate Dashboard'}
              </span>
            </Link>

            {user?.role === 'candidate' && (
              <>
                <Link
                  to="/candidate/profile"
                  className="mobile-drawer-link"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <User size={18} />
                  <span>My Profile & Resume</span>
                </Link>
                <Link
                  to="/candidate/applications"
                  className="mobile-drawer-link"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <FileText size={18} />
                  <span>My Applications</span>
                </Link>
              </>
            )}

            {user?.role === 'recruiter' && (
              <Link
                to="/recruiter/jobs/new"
                className="mobile-drawer-link"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Briefcase size={18} />
                <span>Post New Job</span>
              </Link>
            )}

            <div className="mobile-drawer-divider" />
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.5rem 0.5rem'
              }}
            >
              <Link
                to={getProfilePath()}
                onClick={() => setMobileMenuOpen(false)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  color: 'inherit',
                  textDecoration: 'none'
                }}
                title={user?.role === 'candidate' ? 'View My Profile' : 'Account Details'}
              >
                <User size={16} color="var(--primary)" />
                <span>{user?.name}</span>
                <span
                  style={{
                    fontSize: '0.65rem',
                    padding: '0.1rem 0.4rem',
                    background: 'var(--primary)',
                    color: '#fff',
                    borderRadius: 'var(--radius-full)',
                    textTransform: 'uppercase'
                  }}
                >
                  {user?.role === 'candidate' ? 'Profile' : user?.role}
                </span>
              </Link>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleLogout();
                }}
                className="btn btn-outline btn-sm"
                style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem' }}
              >
                <LogOut size={14} />
                <span>Logout</span>
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="mobile-drawer-divider" />
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.5rem',
                marginTop: '0.25rem'
              }}
            >
              <Link
                to="/login"
                className="btn btn-outline btn-block"
                onClick={() => setMobileMenuOpen(false)}
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="btn btn-primary btn-block"
                onClick={() => setMobileMenuOpen(false)}
              >
                Get Started
              </Link>
            </div>
          </>
        )}
      </div>
    </header>
  );
};

export default Navbar;
