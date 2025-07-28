import React from 'react';
import LogoIcon from './LogoIcon';
import ModernLogoIcon from './ModernLogoIcon';

const LogoSelector = ({ 
  variant = "classic", 
  className = "w-16 h-16", 
  color = "#1e40af" 
}) => {
  switch (variant) {
    case "modern":
      return <ModernLogoIcon className={className} color={color} />;
    case "classic":
    default:
      return <LogoIcon className={className} color={color} />;
  }
};

export default LogoSelector; 