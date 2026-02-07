import Poll from "../models/Poll.js";
import Vote from "../models/Vote.js";
import crypto from "crypto";

/*
 * @desc    Create a new poll
 * @route   POST /api/polls
 * @access  Private
 */
const createPoll = async (req, res, next) => {
    try {
        req.body.createdBy = req.user.id;

        // Validate correct option index
        if (req.body.correctOptionIndex >= req.body.options.length) {
            return res.status(400).json({
                success: false,
                error: 'Correct option index is out of bounds'
            });
        }

        const poll = await Poll.create(req.body);

        res.status(201).json({
            success: true,
            data: poll
        });
    } catch (err) {
        next(err);
    }
};

/*
 * @desc    Get all active polls
 * @route   GET /api/polls
 * @access  Public
 */
const getPolls = async (req, res, next) => {
    try {
        const { page = 1, limit = 10, search, tag, sort = '-createdAt' } = req.query;

        let query = { isActive: true, expiresAt: { $gt: new Date() } };

        if (search) {
            query.$or = [
                { question: { $regex: search, $options: 'i' } },
                { 'tags': { $regex: search, $options: 'i' } }
            ];
        }

        if (tag) {
            query.tags = tag;
        }

        const polls = await Poll.find(query)
            .sort(sort)
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .populate('createdBy', 'name')
            .exec();

        const total = await Poll.countDocuments(query);

        res.status(200).json({
            success: true,
            count: polls.length,
            total,
            data: polls
        });
    } catch (err) {
        next(err);
    }
};


/*
 * @desc    Get single poll by ID or shareId
 * @route   GET /api/polls/:id
 * @access  Public
 */
const getPoll = async (req, res, next) => {
    try {
        let poll;

        // Check if it's a shareId or ObjectId
        if (req.params.id.length === 8) {
            poll = await Poll.findOne({ shareId: req.params.id })
                .populate('createdBy', 'name');
        } else {
            poll = await Poll.findById(req.params.id)
                .populate('createdBy', 'name');
        }

        if (!poll) {
            return res.status(404).json({
                success: false,
                error: 'Poll not found'
            });
        }

        // Check if poll is expired
        if (new Date() > poll.expiresAt) {
            poll.isActive = false;
            await poll.save();
        }

        // Check if user has voted
        let userVote = null;
        if (req.user) {
            userVote = await Vote.findOne({
                userId: req.user.id,
                pollId: poll._id
            });
        }
        res.status(200).json({
            success: true,
            data: {
                poll,
                userVote,
                hasVoted: !!userVote
            }
        });
    } catch (err) {
        next(err);
    }
};


/*
 * @desc    Delete poll (creator only)
 * @route   DELETE /api/polls/:id
 * @access  Private
 */
const deletePoll = async (req, res, next) => {
    try {
        const poll = await Poll.findById(req.params.id);

        if (!poll) {
            return res.status(404).json({
                success: false,
                error: 'Poll not found'
            });
        }

        // Make sure user is poll owner
        if (poll.createdBy.toString() !== req.user.id) {
            return res.status(401).json({
                success: false,
                error: 'Not authorized to delete this poll'
            });
        }

        // Delete associated votes
        await Vote.deleteMany({ pollId: poll._id });

        // Delete poll
        await poll.deleteOne();

        res.status(200).json({
            success: true,
            data: {}
        });
    } catch (err) {
        next(err);
    }
};


// @desc    Get user's created polls
// @route   GET /api/polls/me/created
// @access  Private
const getMyPolls = async (req, res, next) => {
    try {
        const polls = await Poll.find({ createdBy: req.user.id })
            .sort('-createdAt')
            .populate('createdBy', 'name');

        res.status(200).json({
            success: true,
            count: polls.length,
            data: polls
        });
    } catch (err) {
        next(err);
    }
};


// @desc    Get polls user has voted on
// @route   GET /api/polls/me/voted
// @access  Private
const getVotedPolls = async (req, res, next) => {
    try {
        const votes = await Vote.find({ userId: req.user.id })
            .sort('-votedAt')
            .populate({
                path: 'pollId',
                populate: {
                    path: 'createdBy',
                    select: 'name'
                }
            });

        res.status(200).json({
            success: true,
            count: votes.length,
            data: votes
        });
    } catch (err) {
        next(err);
    }
};

export {
    createPoll, getPolls, getPoll, deletePoll, getVotedPolls, getMyPolls
};
