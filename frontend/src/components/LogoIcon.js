import React from 'react';

const LogoIcon = ({ className = "w-16 h-16", color = "#1e40af" }) => {
  return (
    <svg 
      className={className} 
      viewBox="0 0 64 64" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Background Circle */}
      <circle cx="32" cy="32" r="30" fill={color} opacity="0.1" stroke={color} strokeWidth="2"/>
      
      {/* Calendar Icon */}
      <rect x="16" y="20" width="32" height="24" rx="2" fill={color} opacity="0.9"/>
      <rect x="16" y="16" width="32" height="6" rx="2" fill={color}/>
      
      {/* Calendar Lines */}
      <line x1="20" y1="18" x2="22" y2="18" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="26" y1="18" x2="28" y2="18" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="32" y1="18" x2="34" y2="18" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="38" y1="18" x2="40" y2="18" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="44" y1="18" x2="46" y2="18" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
      
      {/* Calendar Grid */}
      <line x1="20" y1="26" x2="44" y2="26" stroke="white" strokeWidth="1" opacity="0.3"/>
      <line x1="20" y1="32" x2="44" y2="32" stroke="white" strokeWidth="1" opacity="0.3"/>
      <line x1="20" y1="38" x2="44" y2="38" stroke="white" strokeWidth="1" opacity="0.3"/>
      <line x1="26" y1="26" x2="26" y2="42" stroke="white" strokeWidth="1" opacity="0.3"/>
      <line x1="32" y1="26" x2="32" y2="42" stroke="white" strokeWidth="1" opacity="0.3"/>
      <line x1="38" y1="26" x2="38" y2="42" stroke="white" strokeWidth="1" opacity="0.3"/>
      
      {/* Social Media Icons */}
      <circle cx="22" cy="30" r="1.5" fill="white" opacity="0.8"/>
      <circle cx="28" cy="30" r="1.5" fill="white" opacity="0.8"/>
      <circle cx="34" cy="30" r="1.5" fill="white" opacity="0.8"/>
      <circle cx="40" cy="30" r="1.5" fill="white" opacity="0.8"/>
      
      {/* Clock Hands */}
      <circle cx="32" cy="36" r="3" fill="white" opacity="0.9"/>
      <line x1="32" y1="36" x2="32" y2="33" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="32" y1="36" x2="34" y2="36" stroke={color} strokeWidth="1" strokeLinecap="round"/>
      
      {/* Decorative Elements */}
      <circle cx="48" cy="16" r="2" fill={color} opacity="0.6"/>
      <circle cx="52" cy="20" r="1.5" fill={color} opacity="0.4"/>
      <circle cx="16" cy="48" r="1.5" fill={color} opacity="0.4"/>
      <circle cx="20" cy="52" r="1" fill={color} opacity="0.3"/>
    </svg>
  );
};

export default LogoIcon; 