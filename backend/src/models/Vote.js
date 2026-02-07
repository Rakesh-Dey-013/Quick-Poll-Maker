import mongoose from "mongoose";

const voteSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  pollId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Poll',
    required: true
  },
  selectedOptionIndex: {
    type: Number,
    required: true,
    min: 0
  },
  isCorrect: {
    type: Boolean,
    required: true
  },
  votedAt: {
    type: Date,
    default: Date.now
  }
});

// Prevent duplicate votes
voteSchema.index({ userId: 1, pollId: 1 }, { unique: true });

const Vote = mongoose.model("Vote", voteSchema);
export default Vote;
