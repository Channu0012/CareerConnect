// Footer Component
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Briefcase, Heart } from 'lucide-react';

const Footer = () => {
  const { user, isAuthenticated } = useAuth();
  const dashboardPath = user?.role === 'admin' ? '/admin' : user?.role === 'recruiter' ? '/recruiter' : '/candidate';

  return (
    <footer className="footer">
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '2rem' }}>
          <div>
            <div className="brand-logo" style={{ marginBottom: '1rem' }}>
              <img src="/logo.png" alt="CareerConnect" className="brand-logo-img" style={{ width: '32px', height: '32px' }} />
              <span>CareerConnect</span>
            </div>
            <p style={{ color: 'var(--gray-500)', fontSize: '0.9rem', maxWidth: '300px' }}>
              A full-stack recruitment platform connecting ambitious candidates, top recruiters, and modern companies.
            </p>
          </div>

          <div>
            <h4 style={{ fontSize: '0.95rem', marginBottom: '1rem', color: 'var(--gray-900)' }}>Quick Links</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.9rem' }}>
              <li><Link to="/jobs" style={{ color: 'var(--gray-600)' }}>Browse All Jobs</Link></li>
              {isAuthenticated ? (
                <>
                  <li><Link to={dashboardPath} style={{ color: 'var(--gray-600)' }}>My Dashboard</Link></li>
                  {user?.role === 'candidate' && (
                    <li><Link to="/candidate/applications" style={{ color: 'var(--gray-600)' }}>My Applications</Link></li>
                  )}
                  {user?.role === 'recruiter' && (
                    <li><Link to="/recruiter/jobs/new" style={{ color: 'var(--gray-600)' }}>Post a New Job</Link></li>
                  )}
                </>
              ) : (
                <>
                  <li><Link to="/login" style={{ color: 'var(--gray-600)' }}>Sign In</Link></li>
                  <li><Link to="/register" style={{ color: 'var(--gray-600)' }}>Create Account</Link></li>
                </>
              )}
            </ul>
          </div>

          <div>
            <h4 style={{ fontSize: '0.95rem', marginBottom: '1rem', color: 'var(--gray-900)' }}>Role Portals</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.9rem' }}>
              <li><Link to="/candidate" style={{ color: 'var(--gray-600)' }}>Candidate Dashboard</Link></li>
              <li><Link to="/recruiter" style={{ color: 'var(--gray-600)' }}>Recruiter Dashboard</Link></li>
              <li><Link to="/admin" style={{ color: 'var(--gray-600)' }}>Administrator Console</Link></li>
            </ul>
          </div>

          <div>
            <h4 style={{ fontSize: '0.95rem', marginBottom: '1rem', color: 'var(--gray-900)' }}>Architecture & Tech</h4>
            <p style={{ color: 'var(--gray-500)', fontSize: '0.85rem' }}>
              Built with MongoDB, Express.js, React 19, Node.js, Mongoose, and JWT authentication.
            </p>
          </div>
        </div>

        <div className="footer-bottom">
          <p>
            &copy; {new Date().getFullYear()} CareerConnect MERN Final Internship Project. Built with{' '}
            <Heart size={14} color="#ef4444" style={{ display: 'inline', verticalAlign: 'middle' }} /> for engineering excellence.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
