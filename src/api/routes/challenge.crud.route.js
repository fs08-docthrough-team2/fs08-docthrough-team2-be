// 설명: API 라우트 정의하는 파일
import express from 'express';
import corsMiddleware from '../../common/cors.js';
import errorMiddleware from '../../common/error.js';

import challengeCRUDControllers from '../controllers/challenge.crud.controllers.js';

const router = express.Router();
router.use(corsMiddleware);

/**
 * @swagger
 * /api/challenge/create:
 *   post:
 *     tags:
 *       - 챌린지 관리
 *     summary: 챌린지 생성
 *     description: 새로운 챌린지를 생성합니다.
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
 *               - email
 *             properties:
 *               title:
 *                 type: string
 *                 description: 챌린지 제목
 *                 example: "파이썬 중급"
 *               source:
 *                 type: string
 *                 description: 챌린지 참고 자료 URL
 *                 example: "https://docs.python.org/3/tutorial/index.html"
 *               field:
 *                 type: string
 *                 enum: [NEXT, MODERN, API, WEB, CAREER]
 *                 description: 챌린지 분야
 *                 example: "API"
 *               type:
 *                 type: string
 *                 enum: [OFFICIAL, BLOG]
 *                 description: 챌린지 유형
 *                 example: "OFFICIAL"
 *               deadline:
 *                 type: string
 *                 format: date-time
 *                 description: 챌린지 마감일 (ISO 8601 형식)
 *                 example: "2025-06-05T23:59:59+09:00"
 *               capacity:
 *                 type: string
 *                 description: 챌린지 인원 (2명 이상의 문자)
 *                 example: "2"
 *               content:
 *                 type: string
 *                 description: 챌린지 내용 설명
 *                 example: "파이썬은 고급 범용 프로그래밍 언어입니다."
 *               email:
 *                 type: string
 *                 format: email
 *                 description: 챌린지 생성자 이메일
 *                 example: "user2@example.com"
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
 *                 data:
 *                   type: object
 *                   properties:
 *                     newChallenge:
 *                       type: object
 *                       properties:
 *                         challenge_id:
 *                           type: string
 *                           format: uuid
 *                           example: "3e3d85d3-4c98-41db-8459-7fde0fab1e44"
 *                         user_id:
 *                           type: string
 *                           format: uuid
 *                           example: "4ee7409f-0a01-4b3e-8a30-3d2e7bf06ddd"
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
 *                         reject_content:
 *                           type: string
 *                           nullable: true
 *                           example: null
 *                         created_at:
 *                           type: string
 *                           format: date-time
 *                           example: "2025-10-28T02:18:06.633Z"
 *                         updated_at:
 *                           type: string
 *                           format: date-time
 *                           example: "2025-10-28T02:18:06.633Z"
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
 *       500:
 *         description: 서버 오류
 */
router.post('/create', challengeCRUDControllers.createChallengeInput);

/**
 * @swagger
 * /api/challenge/update/{challengeId}:
 *   patch:
 *     tags:
 *       - 챌린지 관리
 *     summary: 챌린지 수정
 *     description: 기존 챌린지의 정보를 수정합니다.
 *     parameters:
 *       - in: path
 *         name: challengeId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: 수정할 챌린지의 ID
 *         example: "b82d8c0d-82f6-43fd-8bf5-8e0071366e63"
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
 *                 data:
 *                   type: object
 *                   properties:
 *                     updateChallenge:
 *                       type: object
 *                       properties:
 *                         challenge_id:
 *                           type: string
 *                           format: uuid
 *                           example: "3e3d85d3-4c98-41db-8459-7fde0fab1e44"
 *                         user_id:
 *                           type: string
 *                           format: uuid
 *                           example: "4ee7409f-0a01-4b3e-8a30-3d2e7bf06ddd"
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
 *                         reject_content:
 *                           type: string
 *                           nullable: true
 *                           example: null
 *                         created_at:
 *                           type: string
 *                           format: date-time
 *                           example: "2025-10-28T02:18:06.633Z"
 *                         updated_at:
 *                           type: string
 *                           format: date-time
 *                           example: "2025-10-28T02:19:46.233Z"
 *       404:
 *         description: 챌린지를 찾을 수 없음
 *       500:
 *         description: 서버 오류
 */
router.patch('/update/:challengeId', challengeCRUDControllers.updateChallengeInput);

/**
 * @swagger
 * /api/challenge/cancel/{challengeId}:
 *   patch:
 *     tags:
 *       - 챌린지 관리
 *     summary: 챌린지 취소
 *     description: 챌린지를 취소 상태로 변경합니다. (isClose를 true로, status를 DEADLINE으로 설정)
 *     parameters:
 *       - in: path
 *         name: challengeId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: 취소할 챌린지의 ID
 *         example: "b82d8c0d-82f6-43fd-8bf5-8e0071366e63"
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
 *                 data:
 *                   type: object
 *                   properties:
 *                     updateChallenge:
 *                       type: object
 *                       properties:
 *                         challenge_id:
 *                           type: string
 *                           format: uuid
 *                           example: "3e3d85d3-4c98-41db-8459-7fde0fab1e44"
 *                         user_id:
 *                           type: string
 *                           format: uuid
 *                           example: "4ee7409f-0a01-4b3e-8a30-3d2e7bf06ddd"
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
 *                           example: false
 *                         isClose:
 *                           type: boolean
 *                           example: true
 *                         isReject:
 *                           type: boolean
 *                           example: false
 *                         reject_content:
 *                           type: string
 *                           nullable: true
 *                           example: null
 *                         created_at:
 *                           type: string
 *                           format: date-time
 *                           example: "2025-10-28T02:18:06.633Z"
 *                         updated_at:
 *                           type: string
 *                           format: date-time
 *                           example: "2025-10-28T02:20:01.954Z"
 *       404:
 *         description: 챌린지를 찾을 수 없음
 *       500:
 *         description: 서버 오류
 */
router.patch('/cancel/:challengeId', challengeCRUDControllers.cancelChallengeInput);

/**
 * @swagger
 * /api/challenge/delete/{challengeId}:
 *   patch:
 *     tags:
 *       - 챌린지 관리
 *     summary: 챌린지 삭제 (소프트 삭제)
 *     description: 챌린지를 논리적으로 삭제합니다. (isDelete를 true로, status를 DEADLINE으로 설정)
 *     parameters:
 *       - in: path
 *         name: challengeId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: 삭제할 챌린지의 ID
 *         example: "b82d8c0d-82f6-43fd-8bf5-8e0071366e63"
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
 *                 data:
 *                   type: object
 *                   properties:
 *                     updateChallenge:
 *                       type: object
 *                       properties:
 *                         challenge_id:
 *                           type: string
 *                           format: uuid
 *                           example: "3e3d85d3-4c98-41db-8459-7fde0fab1e44"
 *                         user_id:
 *                           type: string
 *                           format: uuid
 *                           example: "4ee7409f-0a01-4b3e-8a30-3d2e7bf06ddd"
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
 *                         reject_content:
 *                           type: string
 *                           nullable: true
 *                           example: null
 *                         created_at:
 *                           type: string
 *                           format: date-time
 *                           example: "2025-10-28T02:18:06.633Z"
 *                         updated_at:
 *                           type: string
 *                           format: date-time
 *                           example: "2025-10-28T02:20:19.951Z"
 *       404:
 *         description: 챌린지를 찾을 수 없음
 *       500:
 *         description: 서버 오류
 */
router.patch('/delete/:challengeId', challengeCRUDControllers.deleteChallengeInput);

/**
 * @swagger
 * /api/challenge/hard-delete/{challengeId}:
 *   delete:
 *     tags:
 *       - 챌린지 관리
 *     summary: 챌린지 완전 삭제 (하드 삭제)
 *     description: 데이터베이스에서 챌린지를 영구적으로 삭제합니다.
 *     parameters:
 *       - in: path
 *         name: challengeId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: 완전 삭제할 챌린지의 ID
 *         example: "b47e3739-e2b3-4ea6-8967-e596e819c4c3"
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
 *                 data:
 *                   type: object
 *                   properties:
 *                     deletedChallenge:
 *                       type: object
 *                       properties:
 *                         challenge_id:
 *                           type: string
 *                           format: uuid
 *                           example: "3e3d85d3-4c98-41db-8459-7fde0fab1e44"
 *                         user_id:
 *                           type: string
 *                           format: uuid
 *                           example: "4ee7409f-0a01-4b3e-8a30-3d2e7bf06ddd"
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
 *                         reject_content:
 *                           type: string
 *                           nullable: true
 *                           example: null
 *                         created_at:
 *                           type: string
 *                           format: date-time
 *                           example: "2025-10-28T02:18:06.633Z"
 *                         updated_at:
 *                           type: string
 *                           format: date-time
 *                           example: "2025-10-28T02:20:19.951Z"
 *       404:
 *         description: 챌린지를 찾을 수 없음
 *       500:
 *         description: 서버 오류
 */
router.delete("/hard-delete/:challengeId", challengeCRUDControllers.hardDeleteChallengeInput);

// 에러 핸들링 미들웨어 적용
router.use(errorMiddleware.errorHandler);

export default router;