import express from 'express';
import {
  getFeedbackListController,
  getFeedbackDetailController,
  createFeedbackController,
  updateFeedbackController,
  deleteFeedbackController,
} from '../controllers/challenge.feedback.controller.js';
import { validate } from '../../middleware/validation.middleware.js';
import {
  createFeedbackSchema,
  updateFeedbackSchema,
  getFeedbackListQuerySchema,
} from '../../validators/feedback.validator.js';

const router = express.Router();

// 피드백 조회 - Zod 검증 적용
router.get('/translated-detail/feedback-list', validate(getFeedbackListQuerySchema), getFeedbackListController);
router.get('/translated-detail/feedback-detail', getFeedbackDetailController);

// 피드백 생성 - Zod 검증 적용 (SQL 인젝션, XSS 방지)
router.post('/translated-detail/feedback-detail', validate(createFeedbackSchema), createFeedbackController);

// 피드백 수정 - Zod 검증 적용
router.patch('/translated-detail/feedback-detail', validate(updateFeedbackSchema), updateFeedbackController);

// 피드백 삭제
router.delete('/translated-detail/feedback-detail', deleteFeedbackController);

export default router;
