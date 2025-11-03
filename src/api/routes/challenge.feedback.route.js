import express from 'express';
import {
  getFeedbackListController,
  getFeedbackDetailController,
  createFeedbackController,
  updateFeedbackController,
  deleteFeedbackController,
} from '../controllers/challenge.feedback.controller.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: ChallengeFeedback
 *     description: 첼린지 작업물 피드백 관련 API
 */

/**
 * @swagger
 * /api/challenge/feedback/translated-detail/feedback-list:
 *   get:
 *     summary: 피드백 목록 조회
 *     description: 특정 작업물(attend_id)에 달린 모든 피드백을 최신순으로 반환합니다.
 *     tags: [ChallengeFeedback]
 *     parameters:
 *       - in: query
 *         name: attend_id
 *         required: true
 *         schema: { type: string }
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: size
 *         schema: { type: integer, default: 10 }
 *     responses:
 *       200:
 *         description: 피드백 목록 반환 성공
 */
router.get('/translated-detail/feedback-list', getFeedbackListController);

/**
 * @swagger
 * /api/challenge/feedback/translated-detail/feedback-detail:
 *   get:
 *     summary: 피드백 상세 조회
 *     description: feedback_id로 특정 피드백을 조회합니다.
 *     tags: [ChallengeFeedback]
 *     parameters:
 *       - in: query
 *         name: feedback_id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: 피드백 상세 조회 성공
 */
router.get('/translated-detail/feedback-detail', getFeedbackDetailController);

/**
 * @swagger
 * /api/challenge/feedback/translated-detail/feedback-detail:
 *   post:
 *     summary: 피드백 생성
 *     description: 특정 작업물(attend_id)에 대해 피드백을 작성합니다.
 *     tags: [ChallengeFeedback]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [attend_id, content]
 *             properties:
 *               attend_id: { type: string, example: "a1b2c3" }
 *               content: { type: string, example: "좋은 번역이에요!" }
 *     responses:
 *       201:
 *         description: 피드백 작성 성공
 */
router.post('/translated-detail/feedback-detail', createFeedbackController);

/**
 * @swagger
 * /api/challenge/feedback/translated-detail/feedback-detail:
 *   patch:
 *     summary: 피드백 수정
 *     description: 본인 또는 ADMIN만 수정 가능.
 *     tags: [ChallengeFeedback]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [feedback_id, content]
 *             properties:
 *               feedback_id: { type: string, example: "feed123" }
 *               content: { type: string, example: "수정된 피드백 내용" }
 *     responses:
 *       200:
 *         description: 수정 성공
 */
router.patch('/translated-detail/feedback-detail', updateFeedbackController);

/**
 * @swagger
 * /api/challenge/feedback/translated-detail/feedback-detail:
 *   delete:
 *     summary: 피드백 삭제
 *     description: 본인 또는 ADMIN만 삭제 가능.
 *     tags: [ChallengeFeedback]
 *     parameters:
 *       - in: query
 *         name: feedback_id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: 삭제 성공
 */
router.delete('/translated-detail/feedback-detail', deleteFeedbackController);

export default router;
