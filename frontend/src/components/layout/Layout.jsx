import React from 'react';
import Navbar from './Navbar';

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="pt-16">
        {children}
      </main>

      <footer className="mt-16 border-t border-zinc-800 py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <h3 className="text-xl font-bold text-zinc-100 mb-2">Quick Poll Maker</h3>
              <p className="text-zinc-400">Create quiz-style polls with instant feedback</p>
            </div>
            <div className="text-sm text-zinc-500">
              <p className='mb-3'>Created by &nbsp;<a href="https://www.linkedin.com/in/rakeshdey007/" target='_blank'><span className='text-emerald-500'>Rakesh Kr. Dey.</span></a>
                </p>
              <p>© {new Date().getFullYear()} Quick Poll Maker. All rights reserved.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;