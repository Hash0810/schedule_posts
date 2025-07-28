import React from 'react';
import LogoIcon from './LogoIcon';

const LogoTest = () => {
  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h2>Logo Test Component</h2>
      <p>Testing the new professional logo:</p>
      
      <div style={{ margin: '20px 0' }}>
        <h3>Small Logo (32x32):</h3>
        <LogoIcon className="w-8 h-8" />
      </div>
      
      <div style={{ margin: '20px 0' }}>
        <h3>Medium Logo (64x64):</h3>
        <LogoIcon className="w-16 h-16" />
      </div>
      
      <div style={{ margin: '20px 0' }}>
        <h3>Large Logo (128x128):</h3>
        <LogoIcon className="w-32 h-32" />
      </div>
      
      <div style={{ margin: '20px 0' }}>
        <h3>Custom Color (Green):</h3>
        <LogoIcon className="w-16 h-16" color="#10b981" />
      </div>
      
      <p style={{ marginTop: '20px', color: '#666' }}>
        If you can see calendar icons with social media dots and clock hands, the logo is working correctly!
      </p>
    </div>
  );
};

export default LogoTest; 