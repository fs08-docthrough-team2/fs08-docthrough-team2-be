/**
 * @swagger
 * tags:
 *   - name: 알림 API
 *     description: 사용자 알림 관련 API
 */

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     BearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *       description: JWT 액세스 토큰을 입력하세요
 *   schemas:
 *     Notice:
 *       type: object
 *       properties:
 *         notice_id:
 *           type: string
 *           format: uuid
 *           description: 알림 ID
 *           example: 8f4832e8-d573-4576-9514-2b373e9a20ae
 *         user_id:
 *           type: string
 *           format: uuid
 *           description: 사용자 ID
 *           example: a2547373-5303-48e6-b452-c7bd9ff095fd
 *         type:
 *           type: string
 *           enum: [CHALLENGE, APPROVAL, FEEDBACK, DEADLINE, ATTEND]
 *           description: 알림 타입
 *           example: CHALLENGE
 *         content:
 *           type: string
 *           description: 알림 내용
 *           example: "챌린지가 생성되었습니다: 파이썬 초급"
 *         isRead:
 *           type: boolean
 *           description: 읽음 여부
 *           example: false
 *         created_at:
 *           type: string
 *           format: date-time
 *           description: 생성 일시
 *           example: 2025-10-28T06:08:15.157Z
 *         updated_at:
 *           type: string
 *           format: date-time
 *           description: 수정 일시
 *           example: 2025-10-28T06:08:15.157Z
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
 *           example: 25
 *         totalPages:
 *           type: integer
 *           description: 전체 페이지 수
 *           example: 3
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
 * /api/notice/add-mark-read/{noticeId}:
 *   post:
 *     summary: 알림 읽음 처리
 *     description: 특정 알림을 읽음 상태로 변경합니다.
 *     tags: [알림 API]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: noticeId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: 알림 ID (UUID v4 형식)
 *         example: 8f4832e8-d573-4576-9514-2b373e9a20ae
 *     responses:
 *       200:
 *         description: 알림 읽음 처리 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 알림이 읽음 상태로 업데이트되었습니다.
 *       400:
 *         description: 잘못된 요청
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *             examples:
 *               alreadyRead:
 *                 value:
 *                   message: 이미 읽음 상태인 알림입니다.
 *               invalidId:
 *                 value:
 *                   message: 유효하지 않은 알림 ID입니다.
 *       401:
 *         description: 인증 실패 (토큰 없음 또는 유효하지 않음)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: 인증이 필요합니다.
 *       404:
 *         description: 알림을 찾을 수 없음
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 알림을 찾을 수 없습니다.
 */

/**
 * @swagger
 * /api/notice/get-list:
 *   get:
 *     summary: 사용자 알림 목록 조회
 *     description: 로그인한 사용자의 알림 목록을 페이징하여 조회합니다. 최신 알림이 먼저 표시됩니다.
 *     tags: [알림 API]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: 페이지 번호 (1부터 시작)
 *         example: 1
 *       - in: query
 *         name: pageSize
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 10
 *         description: 페이지당 항목 수
 *         example: 10
 *     responses:
 *       201:
 *         description: 알림 목록 조회 성공
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
 *                     $ref: '#/components/schemas/Notice'
 *                 pagination:
 *                   $ref: '#/components/schemas/Pagination'
 *       400:
 *         description: 잘못된 요청
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *             examples:
 *               invalidPageSize:
 *                 value:
 *                   message: 페이지 또는 페이지 크기 값이 올바르지 않습니다.
 *               invalidRange:
 *                 value:
 *                   message: 페이지 또는 페이지 크기 값은 1 이상이어야 합니다.
 *       401:
 *         description: 인증 실패 (토큰 없음 또는 유효하지 않음)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: 인증이 필요합니다.
 */
