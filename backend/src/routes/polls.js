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

const router = express.Router();

router.route('/')
  .get(getPolls)
  .post(protect, createPoll);

router.route('/:id')
  .get(getPoll)
  .delete(protect, deletePoll);

router.get('/me/created', protect, getMyPolls);
router.get('/me/voted', protect, getVotedPolls);


export default router;
