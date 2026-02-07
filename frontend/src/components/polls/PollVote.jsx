import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { pollAPI } from '../../services/api';
import { CheckCircle, XCircle, Share2 } from 'lucide-react';

const PollVote = ({ poll, userVote, hasVoted }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [selectedOption, setSelectedOption] = useState(null);
  const [voting, setVoting] = useState(false);
  const [voteResult, setVoteResult] = useState(null);
  const [showResults, setShowResults] = useState(hasVoted);

  useEffect(() => {
    if (userVote) {
      setSelectedOption(userVote.selectedOptionIndex);
      setVoteResult({
        isCorrect: userVote.isCorrect,
        correctOptionIndex: poll.correctOptionIndex
      });
      setShowResults(true);
    }
  }, [userVote, poll]);

  const handleVote = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (selectedOption === null) {
      alert('Please select an option');
      return;
    }

    setVoting(true);
    try {
      const response = await pollAPI.vote(poll._id, selectedOption);
      
      if (response.data.success) {
        setVoteResult(response.data.data);
        setShowResults(true);
        
        // Update poll data
        poll.options[selectedOption].voteCount += 1;
      }
    } catch (error) {
      alert(error.response?.data?.error || 'Failed to submit vote');
    } finally {
      setVoting(false);
    }
  };

  const copyShareLink = () => {
    const shareUrl = `${window.location.origin}/poll/${poll.shareId}`;
    navigator.clipboard.writeText(shareUrl);
    alert('Share link copied to clipboard!');
  };

  const totalVotes = poll.options.reduce((sum, option) => sum + option.voteCount, 0);
  const isExpired = new Date(poll.expiresAt) < new Date();

  return (
    <div className="card max-w-2xl mx-auto">
      {/* Poll header */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-2xl font-bold text-zinc-100 mb-2">
            {poll.question}
          </h1>
          <p className="text-sm text-zinc-400">
            Created by {poll.createdBy?.name} • {totalVotes} votes
          </p>
        </div>
        
        <button
          onClick={copyShareLink}
          className="p-2 hover:bg-zinc-700 rounded-lg transition-colors"
          title="Share poll"
        >
          <Share2 size={20} className="text-zinc-400" />
        </button>
      </div>

      {/* Options */}
      <div className="space-y-3 mb-8">
        {poll.options.map((option, index) => {
          let optionClass = 'option-default';
          
          if (showResults) {
            if (index === poll.correctOptionIndex) {
              optionClass = 'option-correct';
            } else if (index === selectedOption && voteResult && !voteResult.isCorrect) {
              optionClass = 'option-wrong';
            } else if (selectedOption !== null) {
              optionClass = 'option-disabled';
            }
          }

          return (
            <button
              key={index}
              onClick={() => !showResults && !isExpired && setSelectedOption(index)}
              disabled={showResults || isExpired}
              className={`w-full p-4 rounded-lg border text-left transition-all duration-200 ${optionClass} ${
                selectedOption === index && !showResults ? 'ring-2 ring-emerald-500' : ''
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center ${
                    selectedOption === index && !showResults
                      ? 'border-emerald-500 bg-emerald-500/20'
                      : 'border-zinc-600'
                  }`}>
                    {String.fromCharCode(65 + index)}
                  </div>
                  <span className="font-medium">{option.text}</span>
                </div>
                
                {showResults && index === poll.correctOptionIndex && (
                  <CheckCircle className="text-emerald-500" size={24} />
                )}
                
                {showResults && index === selectedOption && !voteResult?.isCorrect && (
                  <XCircle className="text-red-500" size={24} />
                )}
              </div>
              
              {showResults && totalVotes > 0 && (
                <div className="mt-3">
                  <div className="flex justify-between text-sm text-zinc-400 mb-1">
                    <span>{option.voteCount} votes</span>
                    <span>{((option.voteCount / totalVotes) * 100).toFixed(1)}%</span>
                  </div>
                  <div className="h-2 bg-zinc-700 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${
                        index === poll.correctOptionIndex ? 'bg-emerald-500' : 'bg-zinc-500'
                      }`}
                      style={{ width: `${(option.voteCount / totalVotes) * 100}%` }}
                    />
                  </div>
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Feedback message */}
      {voteResult && (
        <div className={`p-4 rounded-lg mb-6 ${
          voteResult.isCorrect
            ? 'bg-emerald-900/30 border border-emerald-500'
            : 'bg-red-900/30 border border-red-500'
        }`}>
          <div className="flex items-center gap-3">
            {voteResult.isCorrect ? (
              <>
                <CheckCircle className="text-emerald-500" size={24} />
                <div>
                  <h3 className="font-bold text-emerald-100">Correct! 🎉</h3>
                  <p className="text-emerald-200 text-sm">Great job! You got it right.</p>
                </div>
              </>
            ) : (
              <>
                <XCircle className="text-red-500" size={24} />
                <div>
                  <h3 className="font-bold text-red-100">Wrong Answer ❌</h3>
                  <p className="text-red-200 text-sm">Better luck next time!</p>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Action buttons */}
      <div className="flex gap-4">
        {!showResults && !isExpired ? (
          <button
            onClick={handleVote}
            disabled={voting || selectedOption === null}
            className="btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {voting ? 'Submitting...' : 'Submit Vote'}
          </button>
        ) : (
          <>
            {poll.explanationNote && (
              <button
                onClick={() => navigate(`/poll/${poll.shareId}/explanation`)}
                className="btn-secondary flex-1"
              >
                Read Explanation
              </button>
            )}
            
            <button
              onClick={() => navigate('/')}
              className="btn-primary flex-1"
            >
              Browse More Polls
            </button>
          </>
        )}
      </div>

      {/* Expired message */}
      {isExpired && (
        <div className="mt-4 p-3 bg-red-900/30 border border-red-500 rounded-lg text-center">
          <p className="text-red-100">This poll has expired and is no longer accepting votes.</p>
        </div>
      )}
    </div>
  );
};

export default PollVote;