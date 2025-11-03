// routes/challenge.admin.routes.js
import express from 'express';
import errorMiddleware from '../../common/error.js';
import authMiddleware from '../../common/auth.js';

import challengeAdminControllers from '../controllers/challenge.admin.controllers.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: 관리자용 챌린지 API
 *     description: 관리자를 위한 챌린지 관련 API
 */

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     BearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *       description: JWT 액세스 토큰을 입력하세요 (관리자 권한 필요)
 *   schemas:
 *     ChallengeListItem:
 *       type: object
 *       properties:
 *         no:
 *           type: integer
 *           description: 챌린지 번호
 *           example: 7
 *         type:
 *           type: string
 *           enum: [OFFICIAL, BLOG]
 *           description: 챌린지 타입
 *           example: OFFICIAL
 *         field:
 *           type: string
 *           enum: [NEXT, MODERN, API, WEB, CAREER]
 *           description: 챌린지 분야
 *           example: MODERN
 *         title:
 *           type: string
 *           description: 챌린지 제목
 *           example: Jest test framework
 *         participants:
 *           type: integer
 *           description: 참가자 수
 *           example: 3
 *         appliedDate:
 *           type: string
 *           format: date-time
 *           description: 신청 일시
 *           example: 2025-10-28T06:08:15.171Z
 *         deadline:
 *           type: string
 *           format: date-time
 *           description: 마감 일시
 *           example: 2025-06-17T23:59:59.000Z
 *         status:
 *           type: string
 *           enum: [PENDING, APPROVED, REJECTED, CANCELLED, INPROGRESS, DEADLINE]
 *           description: 챌린지 상태
 *           example: DEADLINE
 *
 *     ChallengeDetailInfo:
 *       type: object
 *       properties:
 *         no:
 *           type: integer
 *           description: 챌린지 번호
 *           example: 1
 *         title:
 *           type: string
 *           description: 챌린지 제목
 *           example: 파이썬 초급
 *         type:
 *           type: string
 *           enum: [OFFICIAL, BLOG]
 *           description: 챌린지 타입
 *           example: OFFICIAL
 *         field:
 *           type: string
 *           enum: [NEXT, MODERN, API, WEB, CAREER]
 *           description: 챌린지 분야
 *           example: API
 *         content:
 *           type: string
 *           description: 챌린지 내용
 *           example: 파이썬은 고급 범용 프로그래밍 언어입니다.
 *         deadline:
 *           type: string
 *           format: date-time
 *           description: 마감 일시
 *           example: 2025-06-05T23:59:59.000Z
 *         capacity:
 *           type: string
 *           description: 정원
 *           example: "10"
 *         source:
 *           type: string
 *           format: uri
 *           description: 출처 URL
 *           example: https://docs.python.org/3/tutorial/index.html
 *
 *     ChallengeDetail:
 *       type: object
 *       properties:
 *         challenge_id:
 *           type: string
 *           format: uuid
 *           description: 챌린지 ID
 *           example: 0685b51d-953f-4943-bef7-8eebba911e8e
 *         challenge_no:
 *           type: integer
 *           description: 챌린지 번호
 *           example: 1
 *         user_id:
 *           type: string
 *           format: uuid
 *           description: 작성자 ID
 *           example: a2547373-5303-48e6-b452-c7bd9ff095fd
 *         title:
 *           type: string
 *           description: 챌린지 제목
 *           example: 파이썬 초급
 *         content:
 *           type: string
 *           description: 챌린지 내용
 *           example: 파이썬은 고급 범용 프로그래밍 언어입니다.
 *         type:
 *           type: string
 *           enum: [OFFICIAL, BLOG]
 *           description: 챌린지 타입
 *           example: OFFICIAL
 *         status:
 *           type: string
 *           enum: [PENDING, APPROVED, REJECTED, CANCELLED, INPROGRESS, DEADLINE]
 *           description: 챌린지 상태
 *           example: DEADLINE
 *         field:
 *           type: string
 *           enum: [NEXT, MODERN, API, WEB, CAREER]
 *           description: 챌린지 분야
 *           example: API
 *         source:
 *           type: string
 *           format: uri
 *           description: 출처 URL
 *           example: https://docs.python.org/3/tutorial/index.html
 *         deadline:
 *           type: string
 *           format: date-time
 *           description: 마감 일시
 *           example: 2025-06-05T23:59:59.000Z
 *         capacity:
 *           type: string
 *           description: 정원
 *           example: "10"
 *         isDelete:
 *           type: boolean
 *           description: 삭제 여부
 *           example: false
 *         isClose:
 *           type: boolean
 *           description: 마감 여부
 *           example: false
 *         isReject:
 *           type: boolean
 *           description: 거절 여부
 *           example: false
 *         isApprove:
 *           type: boolean
 *           description: 승인 여부
 *           example: true
 *         reject_content:
 *           type: string
 *           nullable: true
 *           description: 거절 사유
 *           example: null
 *         created_at:
 *           type: string
 *           format: date-time
 *           description: 생성 일시
 *           example: 2025-10-28T06:08:15.157Z
 *         updated_at:
 *           type: string
 *           format: date-time
 *           description: 수정 일시
 *           example: 2025-10-28T06:50:42.178Z
 *
 *     Pagination:
 *       type: object
 *       properties:
 *         page:
 *           type: integer
 *           description: 현재 페이지
 *           example: 1
 *         pageSize:
 *           type: integer
 *           description: 페이지당 항목 수
 *           example: 10
 *         totalCount:
 *           type: integer
 *           description: 전체 항목 수
 *           example: 7
 *         totalPages:
 *           type: integer
 *           description: 전체 페이지 수
 *           example: 1
 *
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: false
 *         message:
 *           type: string
 *           description: 에러 메시지
 *           example: 에러가 발생했습니다.
 */

/**
 * @swagger
 * /api/challenge/admin/inquiry/challenge-list:
 *   get:
 *     summary: 챌린지 목록 조회 (관리자 전용)
 *     description: 관리자가 챌린지 목록을 조회합니다. 검색, 필터링, 정렬, 페이징 기능을 제공합니다.
 *     tags: [관리자용 챌린지 API]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: searchKeyword
 *         schema:
 *           type: string
 *         description: 챌린지 제목 검색 키워드
 *         example: 파이썬
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [신청승인, 신청거절, 신청취소, 신청대기]
 *         description: 챌린지 상태 필터
 *         example: 신청대기
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *           enum: [신청시간빠름순, 신청시간느림순, 마감기한빠름순, 마감기한느림순, asc, desc]
 *           default: desc
 *         description: 정렬 기준
 *         example: 마감기한빠름순
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: 페이지 번호 (1부터 시작)
 *         example: 1
 *       - in: query
 *         name: pageSize
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 10
 *         description: 페이지당 항목 수
 *         example: 10
 *     responses:
 *       200:
 *         description: 챌린지 목록 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/ChallengeListItem'
 *                 pagination:
 *                   $ref: '#/components/schemas/Pagination'
 *       400:
 *         description: 잘못된 요청
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               invalidPage:
 *                 value:
 *                   success: false
 *                   message: 페이지 번호와 페이지 크기는 1 이상의 값이어야 합니다.
 *               invalidSort:
 *                 value:
 *                   success: false
 *                   message: 유효하지 않은 정렬 기준입니다.
 *               invalidStatus:
 *                 value:
 *                   success: false
 *                   message: 유효하지 않은 상태 필터입니다.
 *       401:
 *         description: 인증 실패 (토큰 없음 또는 유효하지 않음)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: 인증이 필요합니다.
 *       403:
 *         description: 권한 부족 (관리자 권한 필요)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: 관리자 권한이 필요합니다!
 */
router.get(
  '/inquiry/challenge-list',
  authMiddleware.verifyAccessToken,
  authMiddleware.verifyAdmin,
  challengeAdminControllers.getChallengeListInput,
);

/**
 * @swagger
 * /api/challenge/admin/inquiry/challenge/{challengeId}:
 *   get:
 *     summary: 챌린지 상세 조회 (관리자 전용)
 *     description: 특정 챌린지의 상세 정보를 조회합니다.
 *     tags: [관리자용 챌린지 API]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: challengeId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: 챌린지 ID (UUID v4 형식)
 *         example: 0685b51d-953f-4943-bef7-8eebba911e8e
 *     responses:
 *       200:
 *         description: 챌린지 상세 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/ChallengeDetailInfo'
 *       400:
 *         description: 잘못된 요청 (유효하지 않은 UUID)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: 챌린지 ID가 필요합니다.
 *       401:
 *         description: 인증 실패 (토큰 없음 또는 유효하지 않음)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: 인증이 필요합니다.
 *       403:
 *         description: 권한 부족 (관리자 권한 필요)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: 관리자 권한이 필요합니다!
 */
router.get(
  '/inquiry/challenge/:challengeId',
  authMiddleware.verifyAccessToken,
  authMiddleware.verifyAdmin,
  challengeAdminControllers.getChallengeDetailInput,
);

/**
 * @swagger
 * /api/challenge/admin/new-challenge/approve/{challengeId}:
 *   patch:
 *     summary: 챌린지 승인 (관리자 전용)
 *     description: 대기 중인 챌린지를 승인합니다.
 *     tags: [관리자용 챌린지 API]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: challengeId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: 챌린지 ID (UUID v4 형식)
 *         example: 0685b51d-953f-4943-bef7-8eebba911e8e
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             example: {}
 *     responses:
 *       200:
 *         description: 챌린지 승인 성공
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
 *                   example: 챌린지가 승인되었습니다.
 *                 data:
 *                   type: object
 *                   properties:
 *                     approvedChallenge:
 *                       $ref: '#/components/schemas/ChallengeDetail'
 *       400:
 *         description: 잘못된 요청
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: 챌린지 ID가 필요합니다.
 *       401:
 *         description: 인증 실패 (토큰 없음 또는 유효하지 않음)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: 인증이 필요합니다.
 *       403:
 *         description: 권한 부족 (관리자 권한 필요)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: 관리자 권한이 필요합니다!
 */
router.patch(
  '/new-challenge/approve/:challengeId',
  authMiddleware.verifyAccessToken,
  authMiddleware.verifyAdmin,
  challengeAdminControllers.approveChallengeInput,
);

/**
 * @swagger
 * /api/challenge/admin/new-challenge/reject/{challengeId}:
 *   patch:
 *     summary: 챌린지 거절 (관리자 전용)
 *     description: 대기 중인 챌린지를 거절하고 거절 사유를 기록합니다.
 *     tags: [관리자용 챌린지 API]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: challengeId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: 챌린지 ID (UUID v4 형식)
 *         example: 0685b51d-953f-4943-bef7-8eebba911e8e
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - reject_comment
 *             properties:
 *               reject_comment:
 *                 type: string
 *                 description: 거절 사유
 *                 minLength: 1
 *                 example: 챌린지 내용이 부적절합니다.
 *     responses:
 *       200:
 *         description: 챌린지 거절 성공
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
 *                   example: 챌린지가 거절되었습니다.
 *                 data:
 *                   type: object
 *                   properties:
 *                     rejectedChallenge:
 *                       $ref: '#/components/schemas/ChallengeDetail'
 *       400:
 *         description: 잘못된 요청
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               missingComment:
 *                 value:
 *                   success: false
 *                   message: 거절 사유를 입력해주세요.
 *               invalidId:
 *                 value:
 *                   success: false
 *                   message: 챌린지 ID가 필요합니다.
 *       401:
 *         description: 인증 실패 (토큰 없음 또는 유효하지 않음)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: 인증이 필요합니다.
 *       403:
 *         description: 권한 부족 (관리자 권한 필요)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: 관리자 권한이 필요합니다!
 */
router.patch(
  '/new-challenge/reject/:challengeId',
  authMiddleware.verifyAccessToken,
  authMiddleware.verifyAdmin,
  challengeAdminControllers.rejectChallengeInput,
);

// 에러 핸들링 미들웨어 적용
router.use(errorMiddleware.errorHandler);

export default router;
