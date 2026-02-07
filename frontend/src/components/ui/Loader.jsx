import React from 'react';

const Loader = ({ size = 'md', variant = 'primary' }) => {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  const variants = {
    primary: 'border-emerald-500',
    secondary: 'border-zinc-400',
    white: 'border-white',
  };

  return (
    <div className="flex items-center justify-center">
      <div
        className={`
          ${sizes[size]}
          border-2 ${variants[variant]} border-t-transparent
          rounded-full animate-spin
        `}
      />
    </div>
  );
};

export const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="text-center">
      <Loader size="lg" />
      <p className="mt-4 text-zinc-400">Loading...</p>
    </div>
  </div>
);

export const Skeleton = ({ className = '', count = 1 }) => {
  const items = Array.from({ length: count }, (_, i) => i);
  
  return (
    <>
      {items.map((item) => (
        <div
          key={item}
          className={`bg-zinc-800 animate-pulse rounded ${className}`}
        />
      ))}
    </>
  );
};

export default Loader;