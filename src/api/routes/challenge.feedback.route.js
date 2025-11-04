import express from 'express';
import {
  getFeedbackListController,
  getFeedbackDetailController,
  createFeedbackController,
  updateFeedbackController,
  deleteFeedbackController,
} from '../controllers/challenge.feedback.controller.js';

const router = express.Router();

router.get('/translated-detail/feedback-list', getFeedbackListController);
router.get('/translated-detail/feedback-detail', getFeedbackDetailController);
router.post('/translated-detail/feedback-detail', createFeedbackController);
router.patch('/translated-detail/feedback-detail', updateFeedbackController);
router.delete('/translated-detail/feedback-detail', deleteFeedbackController);

export default router;
