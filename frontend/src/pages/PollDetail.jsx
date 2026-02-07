import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { pollAPI } from '../services/api';
import PollVote from '../components/polls/PollVote';
import Loader from '../components/ui/Loader';
import { ArrowLeft, AlertCircle } from 'lucide-react';

const PollDetail = () => {
  const { shareId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [poll, setPoll] = useState(null);
  const [userVote, setUserVote] = useState(null);
  const [hasVoted, setHasVoted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchPoll();
  }, [shareId]);

  const fetchPoll = async () => {
    try {
      setLoading(true);
      const response = await pollAPI.getOne(shareId);
      
      if (response.data.success) {
        setPoll(response.data.data.poll);
        setUserVote(response.data.data.userVote);
        setHasVoted(response.data.data.hasVoted);
      } else {
        setError('Poll not found');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load poll');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  if (error || !poll) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12">
        <div className="card text-center">
          <AlertCircle className="mx-auto text-red-500 mb-4" size={48} />
          <h2 className="text-2xl font-bold text-zinc-100 mb-4">
            {error || 'Poll not found'}
          </h2>
          <button
            onClick={() => navigate('/')}
            className="btn-primary inline-flex items-center gap-2"
          >
            <ArrowLeft size={20} />
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  const isExpired = new Date(poll.expiresAt) < new Date();
  const totalVotes = poll.options.reduce((sum, option) => sum + option.voteCount, 0);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <button
        onClick={() => navigate('/')}
        className="inline-flex items-center gap-2 text-zinc-400 hover:text-zinc-300 mb-6"
      >
        <ArrowLeft size={20} />
        Back to Polls
      </button>

      <PollVote
        poll={poll}
        userVote={userVote}
        hasVoted={hasVoted}
      />

      {/* Poll Stats */}
      <div className="card mt-6">
        <h3 className="text-lg font-semibold text-zinc-100 mb-4">Poll Statistics</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 bg-zinc-800/30 rounded-lg">
            <p className="text-sm text-zinc-400 mb-1">Total Votes</p>
            <p className="text-2xl font-bold text-zinc-100">{totalVotes}</p>
          </div>
          
          <div className="p-4 bg-zinc-800/30 rounded-lg">
            <p className="text-sm text-zinc-400 mb-1">Correct Rate</p>
            <p className="text-2xl font-bold text-zinc-100">
              {totalVotes > 0 
                ? `${Math.round((poll.options[poll.correctOptionIndex]?.voteCount / totalVotes) * 100)}%`
                : '0%'
              }
            </p>
          </div>
          
          <div className="p-4 bg-zinc-800/30 rounded-lg">
            <p className="text-sm text-zinc-400 mb-1">Status</p>
            <p className={`text-2xl font-bold ${
              isExpired ? 'text-red-400' : 'text-emerald-400'
            }`}>
              {isExpired ? 'Expired' : 'Active'}
            </p>
          </div>
          
          <div className="p-4 bg-zinc-800/30 rounded-lg">
            <p className="text-sm text-zinc-400 mb-1">Time Remaining</p>
            <p className="text-2xl font-bold text-zinc-100">
              {isExpired 
                ? 'Expired'
                : `${Math.floor((new Date(poll.expiresAt) - new Date()) / (1000 * 60 * 60))}h`
              }
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PollDetail;