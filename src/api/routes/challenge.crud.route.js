// 설명: API 라우트 정의하는 파일
import express from 'express';
import errorMiddleware from '../../common/error.js';
import authMiddleware from '../../common/auth.js';

import challengeCRUDControllers from '../controllers/challenge.crud.controllers.js';

const router = express.Router();

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     BearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *       description: JWT 액세스 토큰을 입력하세요
 */

/**
 * @swagger
 * /api/challenge/create:
 *   post:
 *     tags:
 *       - 챌린지 관리
 *     summary: 챌린지 생성
 *     description: 새로운 챌린지를 생성합니다. JWT 토큰의 userId가 자동으로 사용됩니다.
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - source
 *               - field
 *               - type
 *               - deadline
 *               - capacity
 *               - content
 *             properties:
 *               title:
 *                 type: string
 *                 description: 챌린지 제목
 *                 example: "타입스크립트 고급"
 *               source:
 *                 type: string
 *                 description: 챌린지 참고 자료 URL
 *                 example: "https://www.typescriptlang.org/docs/"
 *               field:
 *                 type: string
 *                 enum: [NEXT, MODERN, API, WEB, CAREER]
 *                 description: 챌린지 분야
 *                 example: "WEB"
 *               type:
 *                 type: string
 *                 enum: [OFFICIAL, BLOG]
 *                 description: 챌린지 유형
 *                 example: "BLOG"
 *               deadline:
 *                 type: string
 *                 format: date-time
 *                 description: 챌린지 마감일 (ISO 8601 형식)
 *                 example: "2025-12-31T23:59:59+09:00"
 *               capacity:
 *                 type: string
 *                 description: 챌린지 인원 (2명 이상)
 *                 example: "15"
 *               content:
 *                 type: string
 *                 description: 챌린지 내용 설명
 *                 example: "타입스크립트의 고급 기능을 학습합니다."
 *     responses:
 *       201:
 *         description: 챌린지 생성 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "챌린지가 성공적으로 생성되었습니다."
 *                 data:
 *                   type: object
 *                   properties:
 *                     createChallenge:
 *                       type: object
 *                       properties:
 *                         challenge_id:
 *                           type: string
 *                           format: uuid
 *                           example: "59715b34-70a1-4f64-9a88-7d46f8258f5b"
 *                         challenge_no:
 *                           type: integer
 *                           example: 15
 *                         user_id:
 *                           type: string
 *                           format: uuid
 *                           example: "a0c235d2-c97f-41b2-b36f-4faf8c13243f"
 *                         title:
 *                           type: string
 *                           example: "파이썬 중급"
 *                         content:
 *                           type: string
 *                           example: "파이썬은 고급 범용 프로그래밍 언어입니다."
 *                         type:
 *                           type: string
 *                           example: "OFFICIAL"
 *                         status:
 *                           type: string
 *                           example: "INPROGRESS"
 *                         field:
 *                           type: string
 *                           example: "API"
 *                         source:
 *                           type: string
 *                           example: "https://docs.python.org/3/tutorial/index.html"
 *                         deadline:
 *                           type: string
 *                           format: date-time
 *                           example: "2025-06-05T14:59:59.000Z"
 *                         capacity:
 *                           type: string
 *                           example: "2"
 *                         isDelete:
 *                           type: boolean
 *                           example: false
 *                         isClose:
 *                           type: boolean
 *                           example: false
 *                         isReject:
 *                           type: boolean
 *                           example: false
 *                         isApprove:
 *                           type: boolean
 *                           example: false
 *                         reject_content:
 *                           type: string
 *                           nullable: true
 *                           example: null
 *                         created_at:
 *                           type: string
 *                           format: date-time
 *                           example: "2025-10-29T08:02:47.377Z"
 *                         updated_at:
 *                           type: string
 *                           format: date-time
 *                           example: "2025-10-29T08:02:47.377Z"
 *       400:
 *         description: 잘못된 요청 (필수 값 누락 또는 유효성 검증 실패)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   examples:
 *                     missingValues:
 *                       value: "챌린지 추가에 필요한 값이 입력되지 않았습니다."
 *                     invalidCapacity:
 *                       value: "챌린지 인원은 2명 이상의 문자여야 합니다."
 *       401:
 *         description: 인증 실패 (토큰 없음 또는 유효하지 않음)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "인증이 필요합니다."
 *       500:
 *         description: 서버 오류
 */
router.post(
  '/create',
  authMiddleware.verifyAccessToken,
  challengeCRUDControllers.createChallengeInput,
);

/**
 * @swagger
 * /api/challenge/update/{challengeId}:
 *   patch:
 *     tags:
 *       - 챌린지 관리
 *     summary: 챌린지 수정
 *     description: 기존 챌린지의 정보를 수정합니다.
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: challengeId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: 수정할 챌린지의 ID
 *         example: "0685b51d-953f-4943-bef7-8eebba911e8e"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: 챌린지 제목
 *                 example: "파이썬 고급"
 *               content:
 *                 type: string
 *                 description: 챌린지 내용
 *                 example: "파이썬은 매우 강력한 프로그래밍 언어입니다."
 *               type:
 *                 type: string
 *                 enum: [OFFICIAL, BLOG]
 *                 description: 챌린지 유형
 *                 example: "OFFICIAL"
 *               source:
 *                 type: string
 *                 description: 참고 자료 URL
 *               field:
 *                 type: string
 *                 enum: [NEXT, MODERN, API, WEB, CAREER]
 *                 description: 챌린지 분야
 *               deadline:
 *                 type: string
 *                 format: date-time
 *                 description: 마감일
 *               capacity:
 *                 type: string
 *                 description: 인원
 *     responses:
 *       200:
 *         description: 챌린지 수정 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "챌린지가 성공적으로 수정되었습니다."
 *                 data:
 *                   type: object
 *                   properties:
 *                     updateChallenge:
 *                       type: object
 *                       properties:
 *                         challenge_id:
 *                           type: string
 *                           format: uuid
 *                           example: "59715b34-70a1-4f64-9a88-7d46f8258f5b"
 *                         challenge_no:
 *                           type: integer
 *                           example: 15
 *                         user_id:
 *                           type: string
 *                           format: uuid
 *                           example: "a0c235d2-c97f-41b2-b36f-4faf8c13243f"
 *                         title:
 *                           type: string
 *                           example: "파이썬 고급"
 *                         content:
 *                           type: string
 *                           example: "파이썬은 매우 강력한 프로그래밍 언어입니다."
 *                         type:
 *                           type: string
 *                           example: "OFFICIAL"
 *                         status:
 *                           type: string
 *                           example: "INPROGRESS"
 *                         field:
 *                           type: string
 *                           example: "API"
 *                         source:
 *                           type: string
 *                           example: "https://docs.python.org/3/tutorial/index.html"
 *                         deadline:
 *                           type: string
 *                           format: date-time
 *                           example: "2025-06-05T14:59:59.000Z"
 *                         capacity:
 *                           type: string
 *                           example: "2"
 *                         isDelete:
 *                           type: boolean
 *                           example: false
 *                         isClose:
 *                           type: boolean
 *                           example: false
 *                         isReject:
 *                           type: boolean
 *                           example: false
 *                         isApprove:
 *                           type: boolean
 *                           example: false
 *                         reject_content:
 *                           type: string
 *                           nullable: true
 *                           example: null
 *                         created_at:
 *                           type: string
 *                           format: date-time
 *                           example: "2025-10-29T08:02:47.377Z"
 *                         updated_at:
 *                           type: string
 *                           format: date-time
 *                           example: "2025-10-29T08:03:12.292Z"
 *       401:
 *         description: 인증 실패 (토큰 없음 또는 유효하지 않음)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "인증이 필요합니다."
 *       404:
 *         description: 챌린지를 찾을 수 없음
 *       500:
 *         description: 서버 오류
 */
router.patch(
  '/update/:challengeId',
  authMiddleware.verifyAccessToken,
  challengeCRUDControllers.updateChallengeInput,
);

/**
 * @swagger
 * /api/challenge/cancel/{challengeId}:
 *   patch:
 *     tags:
 *       - 챌린지 관리
 *     summary: 챌린지 취소
 *     description: 챌린지를 취소 상태로 변경합니다. (isClose를 true로, status를 CANCELLED로 설정)
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: challengeId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: 취소할 챌린지의 ID
 *         example: "59715b34-70a1-4f64-9a88-7d46f8258f5b"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             example: {}
 *     responses:
 *       200:
 *         description: 챌린지 취소 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "챌린지가 성공적으로 취소되었습니다."
 *                 data:
 *                   type: object
 *                   properties:
 *                     cancelChallenge:
 *                       type: object
 *                       properties:
 *                         challenge_id:
 *                           type: string
 *                           format: uuid
 *                           example: "59715b34-70a1-4f64-9a88-7d46f8258f5b"
 *                         challenge_no:
 *                           type: integer
 *                           example: 15
 *                         user_id:
 *                           type: string
 *                           format: uuid
 *                           example: "a0c235d2-c97f-41b2-b36f-4faf8c13243f"
 *                         title:
 *                           type: string
 *                           example: "파이썬 고급"
 *                         content:
 *                           type: string
 *                           example: "파이썬은 매우 강력한 프로그래밍 언어입니다."
 *                         type:
 *                           type: string
 *                           example: "OFFICIAL"
 *                         status:
 *                           type: string
 *                           example: "CANCELLED"
 *                         field:
 *                           type: string
 *                           example: "API"
 *                         source:
 *                           type: string
 *                           example: "https://docs.python.org/3/tutorial/index.html"
 *                         deadline:
 *                           type: string
 *                           format: date-time
 *                           example: "2025-06-05T14:59:59.000Z"
 *                         capacity:
 *                           type: string
 *                           example: "2"
 *                         isDelete:
 *                           type: boolean
 *                           example: false
 *                         isClose:
 *                           type: boolean
 *                           example: true
 *                         isReject:
 *                           type: boolean
 *                           example: false
 *                         isApprove:
 *                           type: boolean
 *                           example: false
 *                         reject_content:
 *                           type: string
 *                           nullable: true
 *                           example: null
 *                         created_at:
 *                           type: string
 *                           format: date-time
 *                           example: "2025-10-29T08:02:47.377Z"
 *                         updated_at:
 *                           type: string
 *                           format: date-time
 *                           example: "2025-10-29T08:03:25.973Z"
 *       401:
 *         description: 인증 실패 (토큰 없음 또는 유효하지 않음)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "인증이 필요합니다."
 *       404:
 *         description: 챌린지를 찾을 수 없음
 *       500:
 *         description: 서버 오류
 */
router.patch(
  '/cancel/:challengeId',
  authMiddleware.verifyAccessToken,
  challengeCRUDControllers.cancelChallengeInput,
);

/**
 * @swagger
 * /api/challenge/delete/{challengeId}:
 *   patch:
 *     tags:
 *       - 챌린지 관리
 *     summary: 챌린지 삭제 (소프트 삭제)
 *     description: 챌린지를 논리적으로 삭제합니다. (isDelete를 true로, status를 DEADLINE으로 설정)
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: challengeId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: 삭제할 챌린지의 ID
 *         example: "59715b34-70a1-4f64-9a88-7d46f8258f5b"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             example: {}
 *     responses:
 *       200:
 *         description: 챌린지 삭제 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "챌린지가 성공적으로 삭제되었습니다."
 *                 data:
 *                   type: object
 *                   properties:
 *                     deleteChallenge:
 *                       type: object
 *                       properties:
 *                         challenge_id:
 *                           type: string
 *                           format: uuid
 *                           example: "59715b34-70a1-4f64-9a88-7d46f8258f5b"
 *                         challenge_no:
 *                           type: integer
 *                           example: 15
 *                         user_id:
 *                           type: string
 *                           format: uuid
 *                           example: "a0c235d2-c97f-41b2-b36f-4faf8c13243f"
 *                         title:
 *                           type: string
 *                           example: "파이썬 고급"
 *                         content:
 *                           type: string
 *                           example: "파이썬은 매우 강력한 프로그래밍 언어입니다."
 *                         type:
 *                           type: string
 *                           example: "OFFICIAL"
 *                         status:
 *                           type: string
 *                           example: "DEADLINE"
 *                         field:
 *                           type: string
 *                           example: "API"
 *                         source:
 *                           type: string
 *                           example: "https://docs.python.org/3/tutorial/index.html"
 *                         deadline:
 *                           type: string
 *                           format: date-time
 *                           example: "2025-06-05T14:59:59.000Z"
 *                         capacity:
 *                           type: string
 *                           example: "2"
 *                         isDelete:
 *                           type: boolean
 *                           example: true
 *                         isClose:
 *                           type: boolean
 *                           example: true
 *                         isReject:
 *                           type: boolean
 *                           example: false
 *                         isApprove:
 *                           type: boolean
 *                           example: false
 *                         reject_content:
 *                           type: string
 *                           nullable: true
 *                           example: null
 *                         created_at:
 *                           type: string
 *                           format: date-time
 *                           example: "2025-10-29T08:02:47.377Z"
 *                         updated_at:
 *                           type: string
 *                           format: date-time
 *                           example: "2025-10-29T08:03:37.304Z"
 *       401:
 *         description: 인증 실패 (토큰 없음 또는 유효하지 않음)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "인증이 필요합니다."
 *       404:
 *         description: 챌린지를 찾을 수 없음
 *       500:
 *         description: 서버 오류
 */
router.patch(
  '/delete/:challengeId',
  authMiddleware.verifyAccessToken,
  challengeCRUDControllers.deleteChallengeInput,
);

/**
 * @swagger
 * /api/challenge/hard-delete/{challengeId}:
 *   delete:
 *     tags:
 *       - 챌린지 관리
 *     summary: 챌린지 완전 삭제 (하드 삭제) - 관리자 전용
 *     description: 데이터베이스에서 챌린지를 영구적으로 삭제합니다. 관리자 권한이 필요합니다.
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: challengeId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: 완전 삭제할 챌린지의 ID
 *         example: "59715b34-70a1-4f64-9a88-7d46f8258f5b"
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             example: {}
 *     responses:
 *       200:
 *         description: 챌린지 완전 삭제 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "챌린지가 성공적으로 영구 삭제되었습니다."
 *                 data:
 *                   type: object
 *                   properties:
 *                     deletedChallenge:
 *                       type: object
 *                       properties:
 *                         challenge_id:
 *                           type: string
 *                           format: uuid
 *                           example: "59715b34-70a1-4f64-9a88-7d46f8258f5b"
 *                         challenge_no:
 *                           type: integer
 *                           example: 15
 *                         user_id:
 *                           type: string
 *                           format: uuid
 *                           example: "a0c235d2-c97f-41b2-b36f-4faf8c13243f"
 *                         title:
 *                           type: string
 *                           example: "파이썬 고급"
 *                         content:
 *                           type: string
 *                           example: "파이썬은 매우 강력한 프로그래밍 언어입니다."
 *                         type:
 *                           type: string
 *                           example: "OFFICIAL"
 *                         status:
 *                           type: string
 *                           example: "DEADLINE"
 *                         field:
 *                           type: string
 *                           example: "API"
 *                         source:
 *                           type: string
 *                           example: "https://docs.python.org/3/tutorial/index.html"
 *                         deadline:
 *                           type: string
 *                           format: date-time
 *                           example: "2025-06-05T14:59:59.000Z"
 *                         capacity:
 *                           type: string
 *                           example: "2"
 *                         isDelete:
 *                           type: boolean
 *                           example: true
 *                         isClose:
 *                           type: boolean
 *                           example: true
 *                         isReject:
 *                           type: boolean
 *                           example: false
 *                         isApprove:
 *                           type: boolean
 *                           example: false
 *                         reject_content:
 *                           type: string
 *                           nullable: true
 *                           example: null
 *                         created_at:
 *                           type: string
 *                           format: date-time
 *                           example: "2025-10-29T08:02:47.377Z"
 *                         updated_at:
 *                           type: string
 *                           format: date-time
 *                           example: "2025-10-29T08:03:37.304Z"
 *       401:
 *         description: 인증 실패 (토큰 없음 또는 유효하지 않음)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "인증이 필요합니다."
 *       403:
 *         description: 권한 부족 (관리자 권한 필요)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "관리자 권한이 필요합니다!"
 *       404:
 *         description: 챌린지를 찾을 수 없음
 *       500:
 *         description: 서버 오류
 */
router.delete(
  '/hard-delete/:challengeId',
  authMiddleware.verifyAccessToken,
  authMiddleware.verifyAdmin,
  challengeCRUDControllers.hardDeleteChallengeInput,
);

// 에러 핸들링 미들웨어 적용
router.use(errorMiddleware.errorHandler);

export default router;
