import Poll from '../models/Poll.js';
import Vote from '../models/Vote.js';

// @desc    Submit a vote
// @route   POST /api/polls/:id/vote
// @access  Private
export const submitVote = async (req, res, next) => {
  try {
    const poll = await Poll.findById(req.params.id);

    if (!poll) {
      return res.status(404).json({
        success: false,
        error: 'Poll not found'
      });
    }

    // Check if poll is active
    if (!poll.isActive || new Date() > poll.expiresAt) {
      return res.status(400).json({
        success: false,
        error: 'Poll has expired'
      });
    }

    const { selectedOptionIndex } = req.body;

    // Validate option index
    if (
      selectedOptionIndex < 0 ||
      selectedOptionIndex >= poll.options.length
    ) {
      return res.status(400).json({
        success: false,
        error: 'Invalid option index'
      });
    }

    // Check if user has already voted
    const existingVote = await Vote.findOne({
      userId: req.user._id,      // ✅ FIXED
      pollId: poll._id
    });

    if (existingVote) {
      return res.status(400).json({
        success: false,
        error: 'You have already voted on this poll'
      });
    }

    // Check if answer is correct
    const isCorrect = selectedOptionIndex === poll.correctOptionIndex;

    // Create vote
    const vote = await Vote.create({
      userId: req.user._id,      // ✅ FIXED
      pollId: poll._id,
      selectedOptionIndex,
      isCorrect
    });

    // Update poll vote count
    poll.options[selectedOptionIndex].voteCount += 1;
    await poll.save();

    res.status(201).json({
      success: true,
      data: {
        vote,
        isCorrect,
        correctOptionIndex: poll.correctOptionIndex
      }
    });

  } catch (err) {
    next(err);
  }
};