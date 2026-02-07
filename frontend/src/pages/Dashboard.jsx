import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { pollAPI } from '../services/api';
import { User, BarChart3, Clock, CheckCircle, XCircle, Edit, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('created');
  const [createdPolls, setCreatedPolls] = useState([]);
  const [votedPolls, setVotedPolls] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, [activeTab]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      if (activeTab === 'created') {
        const response = await pollAPI.getMyPolls();
        if (response.data.success) {
          setCreatedPolls(response.data.data);
        }
      } else {
        const response = await pollAPI.getMyVotes();
        if (response.data.success) {
          setVotedPolls(response.data.data);
        }
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePoll = async (pollId) => {
    if (window.confirm('Are you sure you want to delete this poll?')) {
      try {
        await pollAPI.delete(pollId);
        setCreatedPolls(createdPolls.filter(poll => poll._id !== pollId));
      } catch (error) {
        alert('Failed to delete poll');
      }
    }
  };

  const getTimeRemaining = (expiresAt) => {
    const now = new Date();
    const expiry = new Date(expiresAt);
    const diffHours = Math.floor((expiry - now) / (1000 * 60 * 60));
    
    if (diffHours <= 0) return 'Expired';
    if (diffHours < 24) return `${diffHours}h`;
    return `${Math.floor(diffHours / 24)}d`;
  };

  if (!user) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-zinc-100 mb-4">Please login to view dashboard</h2>
          <Link to="/login" className="btn-primary">Sign In</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="card mb-8">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 bg-emerald-900/30 rounded-full flex items-center justify-center">
            <User className="text-emerald-500" size={32} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-zinc-100">{user.name}</h1>
            <p className="text-zinc-400">{user.email}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-zinc-800/50 rounded-lg border border-zinc-700">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-900/30 rounded-lg">
                <BarChart3 className="text-emerald-500" size={24} />
              </div>
              <div>
                <p className="text-sm text-zinc-400">Polls Created</p>
                <p className="text-2xl font-bold text-zinc-100">{createdPolls.length}</p>
              </div>
            </div>
          </div>

          <div className="p-4 bg-zinc-800/50 rounded-lg border border-zinc-700">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-900/30 rounded-lg">
                <CheckCircle className="text-blue-500" size={24} />
              </div>
              <div>
                <p className="text-sm text-zinc-400">Correct Votes</p>
                <p className="text-2xl font-bold text-zinc-100">
                  {votedPolls.filter(vote => vote.isCorrect).length}
                </p>
              </div>
            </div>
          </div>

          <div className="p-4 bg-zinc-800/50 rounded-lg border border-zinc-700">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-900/30 rounded-lg">
                <Clock className="text-purple-500" size={24} />
              </div>
              <div>
                <p className="text-sm text-zinc-400">Total Votes</p>
                <p className="text-2xl font-bold text-zinc-100">{votedPolls.length}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-zinc-700 mb-6">
        <button
          onClick={() => setActiveTab('created')}
          className={`px-6 py-3 font-medium transition-colors ${
            activeTab === 'created'
              ? 'text-emerald-500 border-b-2 border-emerald-500'
              : 'text-zinc-400 hover:text-zinc-300'
          }`}
        >
          My Polls
        </button>
        <button
          onClick={() => setActiveTab('voted')}
          className={`px-6 py-3 font-medium transition-colors ${
            activeTab === 'voted'
              ? 'text-emerald-500 border-b-2 border-emerald-500'
              : 'text-zinc-400 hover:text-zinc-300'
          }`}
        >
          My Attempts
        </button>
      </div>

      {/* Content */}
      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-emerald-500"></div>
        </div>
      ) : activeTab === 'created' ? (
        <div className="space-y-4">
          {createdPolls.length === 0 ? (
            <div className="text-center py-12 card">
              <BarChart3 className="mx-auto text-zinc-400 mb-4" size={48} />
              <h3 className="text-xl font-semibold text-zinc-100 mb-2">No polls created yet</h3>
              <p className="text-zinc-400 mb-4">Create your first quiz-style poll!</p>
              <Link to="/create" className="btn-primary">Create Poll</Link>
            </div>
          ) : (
            createdPolls.map((poll) => (
              <div key={poll._id} className="card">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-zinc-100 mb-2 line-clamp-1">
                      {poll.question}
                    </h3>
                    <div className="flex items-center gap-4 text-sm text-zinc-400">
                      <span className="flex items-center gap-1">
                        <Clock size={14} />
                        Created {new Date(poll.createdAt).toLocaleDateString()}
                      </span>
                      <span className="flex items-center gap-1">
                        <BarChart3 size={14} />
                        {poll.options.reduce((sum, opt) => sum + opt.voteCount, 0)} votes
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                      new Date(poll.expiresAt) > new Date()
                        ? 'bg-emerald-900/30 text-emerald-300'
                        : 'bg-red-900/30 text-red-300'
                    }`}>
                      {getTimeRemaining(poll.expiresAt)}
                    </div>
                    <div className="flex gap-2">
                      {new Date(poll.expiresAt) > new Date() && (
                        <button
                          onClick={() => {/* Edit functionality */}}
                          className="p-2 hover:bg-zinc-700 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit size={18} className="text-zinc-400" />
                        </button>
                      )}
                      <button
                        onClick={() => handleDeletePoll(poll._id)}
                        className="p-2 hover:bg-red-900/30 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <Trash2 size={18} className="text-red-400" />
                      </button>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between pt-4 border-t border-zinc-700">
                  <div className="text-sm text-zinc-400">
                    Correct answer: <span className="font-medium text-emerald-300">
                      {poll.options[poll.correctOptionIndex]?.text}
                    </span>
                  </div>
                  <Link
                    to={`/poll/${poll.shareId}`}
                    className="text-sm text-emerald-500 hover:text-emerald-400 font-medium"
                  >
                    View Poll →
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {votedPolls.length === 0 ? (
            <div className="text-center py-12 card">
              <CheckCircle className="mx-auto text-zinc-400 mb-4" size={48} />
              <h3 className="text-xl font-semibold text-zinc-100 mb-2">No votes yet</h3>
              <p className="text-zinc-400">Start voting on polls to see your attempts here!</p>
            </div>
          ) : (
            votedPolls.map((vote) => (
              <div key={vote._id} className="card">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-zinc-100 mb-2">
                      {vote.pollId?.question}
                    </h3>
                    <p className="text-sm text-zinc-400">
                      Created by {vote.pollId?.createdBy?.name}
                    </p>
                  </div>
                  
                  <div className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2 ${
                    vote.isCorrect
                      ? 'bg-emerald-900/30 text-emerald-300'
                      : 'bg-red-900/30 text-red-300'
                  }`}>
                    {vote.isCorrect ? (
                      <CheckCircle size={16} />
                    ) : (
                      <XCircle size={16} />
                    )}
                    {vote.isCorrect ? 'Correct' : 'Wrong'}
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-zinc-400 mb-1">Your Answer</p>
                    <p className={`p-3 rounded-lg ${
                      vote.isCorrect ? 'option-correct' : 'option-wrong'
                    }`}>
                      {vote.pollId?.options[vote.selectedOptionIndex]?.text}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-zinc-400 mb-1">Correct Answer</p>
                    <p className="p-3 rounded-lg option-correct">
                      {vote.pollId?.options[vote.pollId?.correctOptionIndex]?.text}
                    </p>
                  </div>
                </div>
                
                <div className="flex justify-between items-center pt-4 border-t border-zinc-700">
                  <span className="text-sm text-zinc-400">
                    Voted on {new Date(vote.votedAt).toLocaleDateString()}
                  </span>
                  <Link
                    to={`/poll/${vote.pollId?.shareId}`}
                    className="text-sm text-emerald-500 hover:text-emerald-400 font-medium"
                  >
                    View Poll →
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default Dashboard;