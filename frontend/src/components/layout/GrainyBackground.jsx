import React from 'react';

const GrainyBackground = ({ children }) => {
  return (
    <div className="relative min-h-screen">
      {/* Grainy noise overlay */}
      <div 
        className="fixed inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            radial-gradient(circle at 25% 25%, rgba(255, 255, 255, 0.05) 1px, transparent 1px),
            radial-gradient(circle at 75% 75%, rgba(255, 255, 255, 0.05) 1px, transparent 1px)
          `,
          backgroundSize: '100px 100px, 150px 150px',
          backgroundPosition: '0 0, 50px 50px',
          opacity: 0.3,
          zIndex: -1
        }}
      />
      
      {/* Dark base background */}
      <div className="fixed inset-0 bg-linear-to-br from-zinc-900 via-zinc-900 to-black -z-10" />
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

export default GrainyBackground;