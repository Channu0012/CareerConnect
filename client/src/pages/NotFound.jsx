// NotFound: 404 Route Fallback
import React from 'react';
import { Link } from 'react-router-dom';
import { AlertCircle, Home } from 'lucide-react';

const NotFound = () => {
  return (
    <div style={{ textAlign: 'center', padding: '5rem 1.5rem', minHeight: '70vh' }}>
      <AlertCircle size={48} color="var(--primary)" style={{ marginBottom: '1.25rem' }} />
      <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>404 - Page Not Found</h1>
      <p style={{ color: 'var(--gray-600)', maxWidth: '450px', margin: '0 auto 2rem' }}>
        The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
      </p>
      <Link to="/" className="btn btn-primary">
        <Home size={16} />
        <span>Return to Home</span>
      </Link>
    </div>
  );
};

export default NotFound;
