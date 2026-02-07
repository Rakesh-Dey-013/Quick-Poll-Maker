import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Menu, X, Home, PlusCircle, BarChart3, User, LogOut } from 'lucide-react';
import PollIng from '../../assets/poll.png'

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMenuOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 bg-zinc-900/90 backdrop-blur-md border-b border-zinc-800 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center">
              {/* <span className="font-bold text-white">Q</span> */}
              <img src={PollIng} alt="" />
            </div>
            <span className="text-xl font-extrabold hidden sm:inline bg-linear-to-r from-emerald-400 to-blue-500 bg-clip-text text-transparent">
              Quick Poll Maker
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <Link to="/" className="text-zinc-300 hover:text-emerald-400 transition-colors">
              Home
            </Link>

            {user ? (
              <>
                <Link to="/create" className="text-zinc-300 hover:text-emerald-400 transition-colors">
                  Create Poll
                </Link>
                <Link to="/dashboard" className="text-zinc-300 hover:text-emerald-400 transition-colors">
                  Dashboard
                </Link>
                <div className="relative group">
                  <button className="flex items-center gap-2 text-zinc-300 hover:text-emerald-400 transition-colors">
                    <div className="w-8 h-8 bg-emerald-900/30 rounded-full flex items-center justify-center">
                      <User size={18} />
                    </div>
                    <span>{user.name}</span>
                  </button>
                  <div className="absolute right-0 top-full mt-2 w-48 bg-zinc-800 border border-zinc-700 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                    <button
                      onClick={handleLogout}
                      className="w-full px-4 py-3 text-left text-zinc-300 hover:bg-zinc-700 flex items-center gap-2"
                    >
                      <LogOut size={18} />
                      Logout
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-4">
                <Link to="/login" className="text-zinc-300 hover:text-emerald-400 transition-colors">
                  Login
                </Link>
                <Link to="/register" className="btn-primary">
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-zinc-400 hover:text-zinc-300"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-zinc-800 py-4">
            <div className="flex flex-col gap-4">
              <Link
                to="/"
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center gap-3 text-zinc-300 hover:text-emerald-400 p-2"
              >
                <Home size={20} />
                Home
              </Link>

              {user ? (
                <>
                  <Link
                    to="/create"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center gap-3 text-zinc-300 hover:text-emerald-400 p-2"
                  >
                    <PlusCircle size={20} />
                    Create Poll
                  </Link>
                  <Link
                    to="/dashboard"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center gap-3 text-zinc-300 hover:text-emerald-400 p-2"
                  >
                    <BarChart3 size={20} />
                    Dashboard
                  </Link>
                  <div className="p-4 border-t border-zinc-800">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 bg-emerald-900/30 rounded-full flex items-center justify-center">
                        <User size={20} />
                      </div>
                      <div>
                        <p className="font-medium text-zinc-100">{user.name}</p>
                        <p className="text-sm text-zinc-400">{user.email}</p>
                      </div>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 text-red-400 hover:text-red-300 p-2"
                    >
                      <LogOut size={20} />
                      Logout
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center gap-3 text-zinc-300 hover:text-emerald-400 p-2"
                  >
                    <User size={20} />
                    Login
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setIsMenuOpen(false)}
                    className="btn-primary text-center"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;