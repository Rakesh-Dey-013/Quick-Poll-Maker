import express from 'express';
import protect from '../middlewares/auth.js';
import { submitVote } from '../controllers/voteController.js';

const router = express.Router();

router.post('/:id/vote', protect, submitVote);

export default router;