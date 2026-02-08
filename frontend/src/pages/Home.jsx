import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { pollAPI } from '../services/api';
import PollCard from '../components/polls/PollCard';
import Loader from '../components/ui/Loader';
import { Search, Filter, Sparkles, TrendingUp } from 'lucide-react';

const Home = () => {
  const { user } = useAuth();
  const [polls, setPolls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('-createdAt');
  const [activeFilter, setActiveFilter] = useState('all');

  useEffect(() => {
    fetchPolls();
  }, [search, sort, activeFilter]);

  const fetchPolls = async () => {
    try {
      setLoading(true);
      let params = { search, sort };
      
      if (activeFilter === 'active') {
        params.expired = false;
      } else if (activeFilter === 'trending') {
        params.sort = '-options.voteCount';
      }
      
      const response = await pollAPI.getAll(params);
      if (response.data.success) {
        setPolls(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching polls:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-linear-to-r from-emerald-900/20 to-emerald-800/10 border border-emerald-700/30 rounded-full mb-4">
          <Sparkles size={16} className="text-emerald-400" />
          <span className="text-sm bg-linear-to-r from-emerald-400 to-blue-500 bg-clip-text text-transparent font-medium">Quiz-Style Polls</span>
        </div>
        
        <h1 className="text-4xl md:text-5xl font-bold text-zinc-100 mb-4">
          Test Your Knowledge
          <span className="block text-emerald-400 mt-3">With Quick Polls</span>
        </h1>
        
        <p className="text-lg text-zinc-400 max-w-2xl mx-auto mb-8">
          Create and participate in quiz-style polls with instant feedback. 
          Share with friends and see who gets the highest score!
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <div className="relative max-w-md w-full">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-zinc-500" size={20} />
            <input
              type="text"
              placeholder="Search polls, tags, or questions..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-zinc-800/50 border border-zinc-700/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 text-zinc-100 placeholder-zinc-500"
            />
          </div>
          
          {user && (
            <Link
              to="/create"
              className="inline-flex items-center justify-center px-6 py-3 bg-linear-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white font-medium rounded-xl transition-all duration-200 hover:shadow-lg hover:shadow-emerald-500/20 whitespace-nowrap"
            >
              Create New Poll
            </Link>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeFilter === 'all'
                ? 'bg-linear-to-r from-blue-700 to-violet-700 text-white'
                : 'bg-zinc-800/50 text-zinc-400 hover:text-zinc-300 hover:bg-zinc-700/50'
            }`}
          >
            All Polls
          </button>
          <button
            onClick={() => setActiveFilter('active')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeFilter === 'active'
                ? 'bg-linear-to-r from-violet-700 to-emerald-500 text-white'
                : 'bg-zinc-800/50 text-zinc-400 hover:text-zinc-300 hover:bg-zinc-700/50'
            }`}
          >
            Active Only
          </button>
          <button
            onClick={() => setActiveFilter('trending')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
              activeFilter === 'trending'
                ? 'bg-linear-to-r from-blue-700 to-emerald-500 text-white'
                : 'bg-zinc-800/50 text-zinc-400 hover:text-zinc-300 hover:bg-zinc-700/50'
            }`}
          >
            <TrendingUp size={14} className='text-emerald-400'/>
            Trending
          </button>
        </div>
        
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="px-4 py-2 bg-zinc-800 border border-zinc-700/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/30 text-zinc-100 text-sm"
        >
          <option value="-createdAt">Newest First</option>
          <option value="createdAt">Oldest First</option>
          <option value="-options.voteCount">Most Popular</option>
          <option value="expiresAt">Expiring Soon</option>
        </select>
      </div>

      {/* Masonry Layout */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="bg-zinc-800/30 border border-zinc-700/50 rounded-xl p-4 animate-pulse">
              <div className="h-4 bg-zinc-700 rounded mb-3"></div>
              <div className="space-y-2 mb-3">
                <div className="h-3 bg-zinc-700 rounded"></div>
                <div className="h-3 bg-zinc-700 rounded"></div>
              </div>
              <div className="h-2 bg-zinc-700 rounded mb-4"></div>
              <div className="h-3 bg-zinc-700 rounded"></div>
            </div>
          ))}
        </div>
      ) : polls.length === 0 ? (
        <div className="text-center py-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-zinc-800/50 rounded-full mb-4">
            <Search className="text-zinc-400" size={24} />
          </div>
          <h3 className="text-xl font-semibold text-zinc-100 mb-2">No polls found</h3>
          <p className="text-zinc-400 mb-6">
            {search ? 'Try a different search term' : 'Be the first to create a poll!'}
          </p>
          {user ? (
            <Link to="/create" className="btn-primary">
              Create First Poll
            </Link>
          ) : (
            <Link to="/register" className="btn-primary">
              Sign Up to Create
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4">
          {polls.map((poll) => (
            <PollCard key={poll._id} poll={poll} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;