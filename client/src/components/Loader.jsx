// Loader Component: Loading indicator with customizable text
import React from 'react';

const Loader = ({ message = 'Loading details...' }) => {
  return (
    <div className="spinner-container">
      <div className="spinner"></div>
      <p style={{ fontSize: '0.9rem', fontWeight: 500 }}>{message}</p>
    </div>
  );
};

export default Loader;
