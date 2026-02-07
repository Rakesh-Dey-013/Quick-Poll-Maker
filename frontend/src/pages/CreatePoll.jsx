import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { pollAPI } from '../services/api';

const CreatePoll = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    question: '',
    options: ['', ''],
    correctOptionIndex: 0,
    tags: '',
    explanationNote: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleOptionChange = (index, value) => {
    const newOptions = [...formData.options];
    newOptions[index] = value;
    setFormData({ ...formData, options: newOptions });
  };

  const addOption = () => {
    if (formData.options.length < 6) {
      setFormData({
        ...formData,
        options: [...formData.options, '']
      });
    }
  };

  const removeOption = (index) => {
    if (formData.options.length > 2) {
      const newOptions = formData.options.filter((_, i) => i !== index);
      const newCorrectIndex = formData.correctOptionIndex >= index
        ? Math.max(0, formData.correctOptionIndex - 1)
        : formData.correctOptionIndex;

      setFormData({
        ...formData,
        options: newOptions,
        correctOptionIndex: newCorrectIndex
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Validate
      if (!formData.question.trim()) {
        throw new Error('Question is required');
      }

      const validOptions = formData.options.filter(opt => opt.trim() !== '');
      if (validOptions.length < 2) {
        throw new Error('At least 2 options are required');
      }

      if (formData.correctOptionIndex < 0 || formData.correctOptionIndex >= validOptions.length) {
        throw new Error('Please select a correct answer');
      }

      const pollData = {
        question: formData.question,
        options: validOptions.map(text => ({ text, voteCount: 0 })),
        correctOptionIndex: formData.correctOptionIndex,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
        explanationNote: formData.explanationNote
      };

      const response = await pollAPI.create(pollData);

      if (response.data.success) {
        navigate(`/poll/${response.data.data.shareId}`);
      }
    } catch (err) {
      setError(err.response?.data?.error || err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    navigate('/login');
    return null;
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="card">
        <h1 className="text-3xl font-bold text-zinc-100 mb-6">Create New Poll</h1>

        {error && (
          <div className="mb-6 p-4 bg-red-900/30 border border-red-500 rounded-lg text-red-100">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Question */}
          <div className="mb-6">
            <label className="block text-zinc-300 mb-2">Question *</label>
            <textarea
              value={formData.question}
              onChange={(e) => setFormData({ ...formData, question: e.target.value })}
              className="input-field h-32"
              placeholder="Enter your poll question..."
              required
            />
          </div>

          {/* Options */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-4">
              <label className="block text-zinc-300">Options * (2-6)</label>
              <button
                type="button"
                onClick={addOption}
                disabled={formData.options.length >= 6}
                className="btn-secondary text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                + Add Option
              </button>
            </div>

            {formData.options.map((option, index) => (
              <div key={index} className="flex items-center gap-2 mb-3">
                <input
                  type="radio"
                  name="correctOption"
                  checked={formData.correctOptionIndex === index}
                  onChange={() => setFormData({ ...formData, correctOptionIndex: index })}
                  className="w-5 h-5 text-emerald-500 bg-zinc-700 border-zinc-600"
                />

                <input
                  type="text"
                  value={option}
                  onChange={(e) => handleOptionChange(index, e.target.value)}
                  className="input-field flex-1"
                  placeholder={`Option ${index + 1}`}
                  required
                />

                {formData.options.length > 2 && (
                  <button
                    type="button"
                    onClick={() => removeOption(index)}
                    className="px-3 py-2 bg-red-900/30 hover:bg-red-900/50 text-red-300 rounded-lg transition-colors"
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Tags */}
          <div className="mb-6">
            <label className="block text-zinc-300 mb-2">Tags (comma separated)</label>
            <input
              type="text"
              value={formData.tags}
              onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
              className="input-field"
              placeholder="quiz, knowledge, fun"
            />
          </div>

          {/* Explanation */}
          <div className="mb-8">
            <label className="block text-zinc-300 mb-2">Explanation Note (Optional)</label>
            <textarea
              value={formData.explanationNote}
              onChange={(e) => setFormData({ ...formData, explanationNote: e.target.value })}
              className="input-field h-48"
              placeholder="Explain why the correct answer is right..."
            />
            <p className="text-sm text-zinc-400 mt-2">
              This explanation will be shown to users after they vote.
            </p>
          </div>

          {/* Submit */}
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="btn-secondary flex-1"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating...' : 'Create Poll'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePoll;