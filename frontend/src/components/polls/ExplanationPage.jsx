import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, CheckCircle } from 'lucide-react';
import { usePoll } from '../../hooks/usePoll';

const ExplanationPage = () => {
  const { shareId } = useParams();
  const { poll, loading } = usePoll(shareId);

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="text-center text-zinc-400">Loading...</div>
      </div>
    );
  }

  if (!poll) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-zinc-100 mb-4">Poll not found</h2>
          <Link to="/" className="btn-primary">Back to Home</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <Link
        to={`/poll/${poll.shareId}`}
        className="inline-flex items-center gap-2 text-zinc-400 hover:text-zinc-300 mb-6"
      >
        <ArrowLeft size={20} />
        Back to Poll
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Panel - Poll Results */}
        <div className="card">
          <h2 className="text-2xl font-bold text-zinc-100 mb-6">
            {poll.question}
          </h2>

          <div className="space-y-3">
            {poll.options.map((option, index) => {
              const isCorrect = index === poll.correctOptionIndex;
              const totalVotes = poll.options.reduce((sum, opt) => sum + opt.voteCount, 0);
              const percentage = totalVotes > 0 ? (option.voteCount / totalVotes) * 100 : 0;

              return (
                <div
                  key={index}
                  className={`p-4 rounded-lg border ${
                    isCorrect ? 'option-correct' : 'option-default'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      {isCorrect && (
                        <CheckCircle className="text-emerald-500" size={20} />
                      )}
                      <span className="font-medium">{option.text}</span>
                    </div>
                    <span className="text-zinc-400">{percentage.toFixed(1)}%</span>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-2 bg-zinc-700 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${
                          isCorrect ? 'bg-emerald-500' : 'bg-zinc-500'
                        }`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="text-sm text-zinc-400">{option.voteCount} votes</span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-6 pt-6 border-t border-zinc-700">
            <div className="flex justify-between text-zinc-400">
              <span>Total Votes: {poll.options.reduce((sum, opt) => sum + opt.voteCount, 0)}</span>
              <span>Created by {poll.createdBy?.name}</span>
            </div>
          </div>
        </div>

        {/* Right Panel - Explanation */}
        <div className="card">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-2 h-8 bg-emerald-500 rounded-full" />
            <h2 className="text-2xl font-bold text-zinc-100">Answer Explanation</h2>
          </div>

          {poll.explanationNote ? (
            <div className="prose prose-invert max-w-none">
              <div className="text-zinc-300 whitespace-pre-wrap leading-relaxed">
                {poll.explanationNote}
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-zinc-400 mb-4">No explanation provided for this poll.</p>
              <p className="text-sm text-zinc-500">
                The creator didn't add an explanation note.
              </p>
            </div>
          )}

          <div className="mt-8 p-4 bg-zinc-800/50 rounded-lg border border-zinc-700">
            <h3 className="font-semibold text-zinc-100 mb-2">Why Explanations Matter</h3>
            <p className="text-sm text-zinc-400">
              Explanations help learners understand why an answer is correct, 
              turning quizzes into valuable learning experiences.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExplanationPage;