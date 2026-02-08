import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, Users, Tag, Share2, BarChart3, TrendingUp, ChevronRight, CheckCircle  } from 'lucide-react';

const PollCard = ({ poll }) => {
  const isExpired = new Date(poll.expiresAt) < new Date();
  const totalVotes = poll.options.reduce((sum, option) => sum + option.voteCount, 0);
  const timeRemaining = Math.max(0, Math.floor((new Date(poll.expiresAt) - new Date()) / (1000 * 60 * 60)));
  const hasVoted = poll.hasVoted || false;

  const copyShareLink = async (e) => {
    e.stopPropagation();
    e.preventDefault();
    const shareUrl = `${window.location.origin}/poll/${poll.shareId}`;
    try {
      await navigator.clipboard.writeText(shareUrl);
      // You could add a toast notification here
      alert('Share link copied!');
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  // Determine if poll is trending
  const isTrending = totalVotes > 50 && timeRemaining > 24;

  return (
    <Link
      to={`/poll/${poll.shareId}`}
      className="group block relative bg-linear-to-b from-zinc-800/40 to-zinc-900/30 backdrop-blur-sm border border-zinc-700/40 rounded-xl p-4 hover:border-zinc-600/60 hover:bg-zinc-800/50 transition-all duration-200 hover:shadow-lg hover:shadow-emerald-500/5 active:scale-[0.98]"
    >
      {/* Status Badge */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${isExpired ? 'bg-red-500' : 'bg-emerald-500'}`} />
          <span className={`text-xs font-medium ${isExpired ? 'text-red-300' : 'text-emerald-300'}`}>
            {isExpired ? 'EXPIRED' : `Expired in ${timeRemaining}h`}
          </span>

          {/* Show Voted badge if user has voted */}
          {hasVoted && !isExpired && (
            <div className="flex items-center gap-1 px-2 py-1 bg-emerald-900/30 border border-emerald-700/40 rounded-lg ml-3">
              <CheckCircle size={13} className="text-emerald-400" />
              <span className="text-xs text-emerald-300 font-medium">Voted</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          {isTrending && (
            <div className="flex items-center gap-1 px-2 py-1 bg-linear-to-r from-amber-900/20 to-amber-800/10 border border-amber-700/30 rounded-lg">
              <TrendingUp size={10} className="text-amber-400" />
              <span className="text-xs text-amber-300 font-medium">Trending</span>
            </div>
          )}



          <button
            onClick={copyShareLink}
            className="p-1.5 hover:bg-zinc-700/50 rounded-lg transition-colors"
            title="Share"
          >
            <Share2 size={14} className="text-zinc-400 group-hover:text-zinc-300" />
          </button>
        </div>
      </div>

      {/* Poll Question - Compact */}
      <h3 className="text-sl font-semibold text-zinc-100 mb-3 line-clamp-2 leading-snug group-hover:text-white">
        {poll.question}
      </h3>

      {/* Options Preview - Minimal */}
      <div className="space-y-2.5 mb-5">
        {poll.options.slice(0, 4).map((option, index) => {
          const percentage = totalVotes > 0 ? (option.voteCount / totalVotes) * 100 : 0;

          return (
            <div
              key={index}
              className="flex items-center gap-2 p-2 rounded-lg bg-zinc-800/30 hover:bg-zinc-800/50 transition-colors"
            >
              <div className="w-6 h-6 rounded-md bg-zinc-700 border border-zinc-600 flex items-center justify-center text-xs font-medium text-zinc-300 shrink-0">
                {String.fromCharCode(65 + index)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-zinc-300 truncate">
                    {option.text}
                  </span>
                  {totalVotes > 0 && (
                    <span className="text-xs text-zinc-400 font-medium ml-2 shrink-0">
                      {percentage.toFixed(0)}%
                    </span>
                  )}
                </div>

                {totalVotes > 0 && (
                  <div className="relative h-1 bg-zinc-700/50 rounded-full overflow-hidden">
                    <div
                      className="absolute inset-y-0 left-0 bg-linear-to-r from-emerald-400 to-blue-600 rounded-full"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {poll.options.length > 4 && (
          <div className="text-center pt-1">
            <span className="text-xs text-emerald-500">
              + {poll.options.length - 4} more
            </span>
          </div>
        )}
      </div>

      {/* Stats Row */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <Users size={12} className="text-zinc-400" />
            <span className="text-xs text-zinc-300 font-medium">{totalVotes}</span>
          </div>

          <div className="flex items-center gap-1.5">
            <BarChart3 size={12} className="text-zinc-400" />
            <span className="text-xs text-zinc-300 font-medium">
              {poll.options.length} opts
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-medium">
          <span>Vote Now</span>
          <ChevronRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
        </div>
      </div>

      {/* Tags & Creator */}
      <div className="pt-3 border-t border-zinc-700/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            {poll.tags.slice(0, 2).map((tag, index) => (
              <span
                key={index}
                className="px-2 py-0.5 bg-zinc-800/50 text-zinc-400 text-[10px] font-medium rounded-md border border-zinc-700/50"
              >
                #{tag}
              </span>
            ))}
            {poll.tags.length > 2 && (
              <span className="text-[10px] text-zinc-500">+{poll.tags.length - 2}</span>
            )}
          </div>

          {poll.createdBy?.name && (
            <div className="text-[10px] text-zinc-500 truncate max-w-20">
              by <span className="text-emerald-300">{poll.createdBy.name.split(' ')[0]}</span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
};

export default PollCard;