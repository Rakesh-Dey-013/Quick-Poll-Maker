import React from 'react';

const Card = ({ children, className = '', variant = 'default', ...props }) => {
  const baseClasses = 'rounded-xl border shadow-xl';
  
  const variants = {
    default: 'bg-zinc-800/50 backdrop-blur-sm border-zinc-700',
    elevated: 'bg-zinc-800/80 backdrop-blur-sm border-zinc-600 shadow-2xl',
    subtle: 'bg-zinc-800/30 border-zinc-700',
    success: 'bg-emerald-900/20 border-emerald-700',
    warning: 'bg-yellow-900/20 border-yellow-700',
    danger: 'bg-red-900/20 border-red-700',
  };

  return (
    <div
      className={`${baseClasses} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

Card.Header = ({ children, className = '' }) => (
  <div className={`px-6 py-4 border-b border-inherit ${className}`}>
    {children}
  </div>
);

Card.Body = ({ children, className = '' }) => (
  <div className={`p-6 ${className}`}>
    {children}
  </div>
);

Card.Footer = ({ children, className = '' }) => (
  <div className={`px-6 py-4 border-t border-inherit ${className}`}>
    {children}
  </div>
);

export default Card;