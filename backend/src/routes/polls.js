import express from "express";
import {
  createPoll,
  getPolls,
  getPoll,
  deletePoll,
  getMyPolls,
  getVotedPolls
} from "../controllers/pollController.js";

import protect from '../middlewares/auth.js';
import optionalAuth from "../middlewares/optionalAuth.js";

const router = express.Router();

router.route('/')
  .get(optionalAuth, getPolls)
  .post(protect, createPoll);

router.route('/:id')
  .get(optionalAuth, getPoll)
  .delete(protect, deletePoll);

router.get('/me/created', protect, getMyPolls);
router.get('/me/voted', protect, getVotedPolls);


export default router;
