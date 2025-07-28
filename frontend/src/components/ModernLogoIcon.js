import React from 'react';

const ModernLogoIcon = ({ className = "w-16 h-16", color = "#1e40af" }) => {
  return (
    <svg 
      className={className} 
      viewBox="0 0 64 64" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Background */}
      <rect x="8" y="8" width="48" height="48" rx="12" fill={color} opacity="0.1"/>
      
      {/* Main Icon - Social Media Post Scheduler */}
      <g transform="translate(16, 16)">
        {/* Calendar Base */}
        <rect x="0" y="8" width="32" height="24" rx="4" fill={color} opacity="0.9"/>
        <rect x="0" y="0" width="32" height="10" rx="4" fill={color}/>
        
        {/* Calendar Header Lines */}
        <line x1="4" y1="5" x2="6" y2="5" stroke="white" strokeWidth="2" strokeLinecap="round"/>
        <line x1="10" y1="5" x2="12" y2="5" stroke="white" strokeWidth="2" strokeLinecap="round"/>
        <line x1="16" y1="5" x2="18" y2="5" stroke="white" strokeWidth="2" strokeLinecap="round"/>
        <line x1="22" y1="5" x2="24" y2="5" stroke="white" strokeWidth="2" strokeLinecap="round"/>
        <line x1="28" y1="5" x2="30" y2="5" stroke="white" strokeWidth="2" strokeLinecap="round"/>
        
        {/* Social Media Dots */}
        <circle cx="8" cy="16" r="2" fill="white" opacity="0.9"/>
        <circle cx="16" cy="16" r="2" fill="white" opacity="0.9"/>
        <circle cx="24" cy="16" r="2" fill="white" opacity="0.9"/>
        
        {/* Clock */}
        <circle cx="16" cy="24" r="4" fill="white" opacity="0.9"/>
        <line x1="16" y1="24" x2="16" y2="20" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
        <line x1="16" y1="24" x2="19" y2="24" stroke={color} strokeWidth="1" strokeLinecap="round"/>
      </g>
      
      {/* Decorative Elements */}
      <circle cx="48" cy="12" r="3" fill={color} opacity="0.3"/>
      <circle cx="12" cy="48" r="2" fill={color} opacity="0.2"/>
      <circle cx="52" cy="52" r="1.5" fill={color} opacity="0.2"/>
    </svg>
  );
};

export default ModernLogoIcon; 