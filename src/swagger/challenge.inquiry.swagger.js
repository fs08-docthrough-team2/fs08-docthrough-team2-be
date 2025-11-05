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
 * /api/challenge/inquiry/challenge-list:
 *   get:
 *     tags:
 *       - 챌린지 조회
 *     summary: 번역 챌린지 목록 조회
 *     description: 모든 번역 챌린지를 조회하고 제목 검색, 필터링, 페이지네이션을 제공합니다.
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: title
 *         schema:
 *           type: string
 *         required: false
 *         description: 챌린지 제목 검색 (부분 일치, 대소문자 무시)
 *         example: ""
 *       - in: query
 *         name: field
 *         schema:
 *           type: string
 *           enum: [NEXT, MODERN, API, WEB, CAREER]
 *         required: false
 *         description: 챌린지 분야 필터
 *         example: ""
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [OFFICIAL, BLOG]
 *         required: false
 *         description: 문서 타입 필터
 *         example: ""
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [INPROGRESS, DEADLINE]
 *         required: false
 *         description: 챌린지 상태 필터
 *         example: ""
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         required: false
 *         description: 페이지 번호
 *         example: 3
 *       - in: query
 *         name: pageSize
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *         required: false
 *         description: 페이지당 항목 수
 *         example: 1
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *           enum: [신청시간빠름순, 신청시간느림순, 마감기한빠름순, 마감기한느림순]
 *           default: 신청시간느림순
 *         required: false
 *         description: 정렬 기준 (신청시간빠름순=생성일 오름차순, 신청시간느림순=생성일 내림차순, 마감기한빠름순=마감일 오름차순, 마감기한느림순=마감일 내림차순)
 *         example: "신청시간느림순"
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
 *                     type: object
 *                     properties:
 *                       challengeId:
 *                         type: string
 *                         format: uuid
 *                         description: 챌린지 ID
 *                         example: "de68229a-3f0b-4869-b220-d04c186a7024"
 *                       title:
 *                         type: string
 *                         description: 챌린지 제목
 *                         example: "Next.js 공식 문서 번역"
 *                       field:
 *                         type: string
 *                         enum: [NEXT, MODERN, API, WEB, CAREER]
 *                         description: 챌린지 분야
 *                         example: "NEXT"
 *                       type:
 *                         type: string
 *                         enum: [OFFICIAL, BLOG]
 *                         description: 문서 타입
 *                         example: "OFFICIAL"
 *                       status:
 *                         type: string
 *                         enum: [INPROGRESS, DEADLINE]
 *                         description: 챌린지 상태
 *                         example: "INPROGRESS"
 *                       deadline:
 *                         type: string
 *                         format: date-time
 *                         description: 마감일
 *                         example: "2025-11-30T23:59:59.000Z"
 *                       currentParticipants:
 *                         type: integer
 *                         description: 현재 참여 인원
 *                         example: 15
 *                       maxParticipants:
 *                         type: integer
 *                         description: 최대 참여 가능 인원
 *                         example: 30
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     page:
 *                       type: integer
 *                       description: 현재 페이지
 *                       example: 3
 *                     pageSize:
 *                       type: integer
 *                       description: 페이지당 항목 수
 *                       example: 1
 *                     totalCount:
 *                       type: integer
 *                       description: 전체 항목 수
 *                       example: 50
 *                     totalPages:
 *                       type: integer
 *                       description: 전체 페이지 수
 *                       example: 50
 *       400:
 *         description: 잘못된 요청 (유효하지 않은 파라미터)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "필드 값이 올바르지 않습니다."
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
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: object
 *                   properties:
 *                     code:
 *                       type: string
 *                       example: "INTERNAL_SERVER_ERROR"
 *                     message:
 *                       type: string
 *                       example: "서버 오류가 발생했습니다."
 */

/**
 * @swagger
 * /api/challenge/inquiry/challenge-detail/{challengeId}:
 *   get:
 *     tags:
 *       - 챌린지 조회
 *     summary: 번역 챌린지 상세 조회
 *     description: 특정 챌린지의 상세 정보를 조회합니다.
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: challengeId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: 챌린지 ID
 *         example: "de68229a-3f0b-4869-b220-d04c186a7024"
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
 *                   type: object
 *                   properties:
 *                     challengeId:
 *                       type: string
 *                       format: uuid
 *                       description: 챌린지 ID
 *                       example: "de68229a-3f0b-4869-b220-d04c186a7024"
 *                     title:
 *                       type: string
 *                       description: 챌린지 제목
 *                       example: "Next.js 공식 문서 번역"
 *                     content:
 *                       type: string
 *                       description: 챌린지 내용
 *                       example: "Next.js 13 버전의 공식 문서를 한글로 번역하는 챌린지입니다."
 *                     field:
 *                       type: string
 *                       enum: [NEXT, MODERN, API, WEB, CAREER]
 *                       description: 챌린지 분야
 *                       example: "NEXT"
 *                     type:
 *                       type: string
 *                       enum: [OFFICIAL, BLOG]
 *                       description: 문서 타입
 *                       example: "OFFICIAL"
 *                     status:
 *                       type: string
 *                       enum: [INPROGRESS, DEADLINE]
 *                       description: 챌린지 상태
 *                       example: "INPROGRESS"
 *                     deadline:
 *                       type: string
 *                       format: date-time
 *                       description: 마감일
 *                       example: "2025-11-30T23:59:59.000Z"
 *                     currentParticipants:
 *                       type: integer
 *                       description: 현재 참여 인원
 *                       example: 15
 *                     maxParticipants:
 *                       type: integer
 *                       description: 최대 참여 가능 인원
 *                       example: 30
 *                     source:
 *                       type: string
 *                       description: 원본 문서 링크
 *                       example: "https://nextjs.org/docs"
 *       400:
 *         description: 잘못된 요청 (유효하지 않은 UUID)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "유효하지 않은 챌린지 ID 형식입니다."
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
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "챌린지를 찾을 수 없습니다."
 *       500:
 *         description: 서버 오류
 */

/**
 * @swagger
 * /api/challenge/inquiry/participate-list/{challengeId}:
 *   get:
 *     tags:
 *       - 챌린지 조회
 *     summary: 챌린지 참여 현황 조회
 *     description: 특정 챌린지의 참여자 목록을 순위, 닉네임, 하트 수, 최종 제출 시간과 함께 조회합니다.
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: challengeId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: 챌린지 ID
 *         example: "de68229a-3f0b-4869-b220-d04c186a7024"
 *       - in: query
 *         name: page
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: 페이지 번호
 *         example: 1
 *       - in: query
 *         name: pageSize
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: 페이지당 항목 수
 *         example: 1
 *     responses:
 *       200:
 *         description: 참여 현황 조회 성공
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
 *                     participates:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           rank:
 *                             type: integer
 *                             description: 순위 (하트 수 기준)
 *                             example: 1
 *                           attendId:
 *                             type: string
 *                             format: uuid
 *                             description: 참여 ID (작업물 상세 조회에 사용)
 *                             example: "987e6543-e21b-12d3-a456-426614174111"
 *                           userId:
 *                             type: string
 *                             format: uuid
 *                             description: 사용자 ID
 *                             example: "456e7890-e89b-12d3-a456-426614174222"
 *                           nickName:
 *                             type: string
 *                             description: 사용자 닉네임
 *                             example: "번역왕"
 *                           hearts:
 *                             type: integer
 *                             description: 하트 수 (좋아요 개수)
 *                             example: 25
 *                           lastSubmittedAt:
 *                             type: string
 *                             format: date-time
 *                             description: 최종 제출 시간
 *                             example: "2025-10-24T14:30:00.000Z"
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     page:
 *                       type: integer
 *                       description: 현재 페이지
 *                       example: 1
 *                     pageSize:
 *                       type: integer
 *                       description: 페이지당 항목 수
 *                       example: 1
 *       400:
 *         description: 잘못된 요청
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   examples:
 *                     invalidUUID:
 *                       value: "유효하지 않은 챌린지 ID 형식입니다."
 *                     invalidPagination:
 *                       value: "페이지 또는 페이지 크기 값이 올바르지 않습니다."
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

/**
 * @swagger
 * /api/challenge/inquiry/individual-participate-list:
 *   get:
 *     tags:
 *       - 챌린지 조회
 *     summary: 로그인한 회원의 참여 중인 챌린지 목록 조회
 *     description: 로그인한 회원이 참여하고 있는 챌린지 목록을 필터링 옵션과 함께 조회합니다. JWT 토큰의 userId를 사용합니다.
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: 페이지 번호
 *         example: 1
 *       - in: query
 *         name: pageSize
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *         description: 페이지당 항목 수 (최대 100)
 *         example: 10
 *       - in: query
 *         name: title
 *         required: false
 *         schema:
 *           type: string
 *         description: 챌린지 제목 필터
 *         example: "React 챌린지"
 *       - in: query
 *         name: field
 *         required: false
 *         schema:
 *           type: string
 *           enum: [NEXT, MODERN, API, WEB, CAREER]
 *         description: 챌린지 분야 필터
 *         example: "WEB"
 *       - in: query
 *         name: type
 *         required: false
 *         schema:
 *           type: string
 *           enum: [OFFICIAL, BLOG]
 *         description: 챌린지 타입 필터
 *         example: "OFFICIAL"
 *       - in: query
 *         name: status
 *         required: false
 *         schema:
 *           type: string
 *           enum: [INPROGRESS, DEADLINE]
 *         description: 챌린지 상태 필터
 *         example: "INPROGRESS"
 *     responses:
 *       200:
 *         description: 참여 챌린지 목록 조회 성공
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
 *                     participates:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           title:
 *                             type: string
 *                             description: 챌린지 제목
 *                             example: "React 마스터 챌린지"
 *                           content:
 *                             type: string
 *                             description: 챌린지 내용
 *                             example: "React의 기초부터 고급까지 학습하는 챌린지입니다."
 *                           type:
 *                             type: string
 *                             enum: [OFFICIAL, BLOG]
 *                             description: 챌린지 타입
 *                             example: "OFFICIAL"
 *                           status:
 *                             type: string
 *                             enum: [INPROGRESS, DEADLINE]
 *                             description: 챌린지 상태
 *                             example: "INPROGRESS"
 *                           field:
 *                             type: string
 *                             enum: [NEXT, MODERN, API, WEB, CAREER]
 *                             description: 챌린지 분야
 *                             example: "WEB"
 *                           source:
 *                             type: string
 *                             description: 챌린지 출처
 *                             example: "https://example.com/challenge"
 *                           deadline:
 *                             type: string
 *                             format: date-time
 *                             description: 마감 기한
 *                             example: "2025-11-30T23:59:59.000Z"
 *                           capacity:
 *                             type: string
 *                             description: 정원
 *                             example: "50"
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     page:
 *                       type: integer
 *                       description: 현재 페이지
 *                       example: 1
 *                     pageSize:
 *                       type: integer
 *                       description: 페이지당 항목 수
 *                       example: 10
 *       400:
 *         description: 잘못된 요청
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   examples:
 *                     invalidUserId:
 *                       value: "유저 ID가 없거나 올바르지 않습니다."
 *                     invalidField:
 *                       value: "필드 값이 올바르지 않습니다."
 *                     invalidType:
 *                       value: "타입 값이 올바르지 않습니다."
 *                     invalidStatus:
 *                       value: "상태 값이 올바르지 않습니다."
 *                     invalidPagination:
 *                       value: "페이지 또는 페이지 크기 값이 올바르지 않습니다."
 *                     invalidPageValue:
 *                       value: "페이지 또는 페이지 크기 값은 1 이상이어야 합니다."
 *                     pageSizeLimit:
 *                       value: "페이지 크기는 100 이하여야 합니다."
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

/**
 * @swagger
 * /api/challenge/inquiry/individual-complete-list:
 *   get:
 *     tags:
 *       - 챌린지 조회
 *     summary: 로그인한 회원의 참여 완료한 챌린지 목록 조회 (만료된 챌린지)
 *     description: 로그인한 회원이 참여했던 챌린지 중 마감일이 지난(완료된) 챌린지 목록을 필터링 옵션과 함께 조회합니다. JWT 토큰의 userId를 사용합니다.
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: 페이지 번호
 *         example: 1
 *       - in: query
 *         name: pageSize
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *         description: 페이지당 항목 수 (최대 100)
 *         example: 10
 *       - in: query
 *         name: title
 *         required: false
 *         schema:
 *           type: string
 *         description: 챌린지 제목 필터
 *         example: "React 챌린지"
 *       - in: query
 *         name: field
 *         required: false
 *         schema:
 *           type: string
 *           enum: [NEXT, MODERN, API, WEB, CAREER]
 *         description: 챌린지 분야 필터
 *         example: "WEB"
 *       - in: query
 *         name: type
 *         required: false
 *         schema:
 *           type: string
 *           enum: [OFFICIAL, BLOG]
 *         description: 챌린지 타입 필터
 *         example: "OFFICIAL"
 *       - in: query
 *         name: status
 *         required: false
 *         schema:
 *           type: string
 *           enum: [INPROGRESS, DEADLINE]
 *         description: 챌린지 상태 필터
 *         example: "DEADLINE"
 *     responses:
 *       200:
 *         description: 완료한 챌린지 목록 조회 성공 (마감일이 지난 챌린지)
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
 *                     participates:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           title:
 *                             type: string
 *                             description: 챌린지 제목
 *                             example: "React 마스터 챌린지"
 *                           content:
 *                             type: string
 *                             description: 챌린지 내용
 *                             example: "React의 기초부터 고급까지 학습하는 챌린지입니다."
 *                           type:
 *                             type: string
 *                             enum: [OFFICIAL, BLOG]
 *                             description: 챌린지 타입
 *                             example: "OFFICIAL"
 *                           status:
 *                             type: string
 *                             enum: [INPROGRESS, DEADLINE]
 *                             description: 챌린지 상태
 *                             example: "DEADLINE"
 *                           field:
 *                             type: string
 *                             enum: [NEXT, MODERN, API, WEB, CAREER]
 *                             description: 챌린지 분야
 *                             example: "WEB"
 *                           source:
 *                             type: string
 *                             description: 챌린지 출처
 *                             example: "https://example.com/challenge"
 *                           deadline:
 *                             type: string
 *                             format: date-time
 *                             description: 마감 기한 (현재 시간보다 이전)
 *                             example: "2025-10-20T23:59:59.000Z"
 *                           capacity:
 *                             type: string
 *                             description: 정원
 *                             example: "50"
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     page:
 *                       type: integer
 *                       description: 현재 페이지
 *                       example: 1
 *                     pageSize:
 *                       type: integer
 *                       description: 페이지당 항목 수
 *                       example: 10
 *       400:
 *         description: 잘못된 요청
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   examples:
 *                     invalidUserId:
 *                       value: "유저 ID가 없거나 올바르지 않습니다."
 *                     invalidField:
 *                       value: "필드 값이 올바르지 않습니다."
 *                     invalidType:
 *                       value: "타입 값이 올바르지 않습니다."
 *                     invalidStatus:
 *                       value: "상태 값이 올바르지 않습니다."
 *                     invalidPagination:
 *                       value: "페이지 또는 페이지 크기 값이 올바르지 않습니다."
 *                     invalidPageValue:
 *                       value: "페이지 또는 페이지 크기 값은 1 이상이어야 합니다."
 *                     pageSizeLimit:
 *                       value: "페이지 크기는 100 이하여야 합니다."
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

/**
 * @swagger
 * /api/challenge/inquiry/individual-challenge-detail:
 *   get:
 *     tags:
 *       - 챌린지 조회
 *     summary: 로그인한 회원의 신청한 챌린지 목록 조회 및 거절 목록 조회
 *     description: 로그인한 회원이 신청했지만 아직 참여하지 않은 챌린지 목록과 거절된 챌린지 목록을 조회합니다. 마감일이 지나지 않고 종료되지 않은 챌린지만 조회됩니다. JWT 토큰의 userId를 사용합니다.
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: 페이지 번호
 *         example: 1
 *       - in: query
 *         name: pageSize
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *         description: 페이지당 항목 수 (최대 100)
 *         example: 10
 *       - in: query
 *         name: title
 *         required: false
 *         schema:
 *           type: string
 *         description: 챌린지 제목 필터
 *         example: "React 챌린지"
 *       - in: query
 *         name: field
 *         required: false
 *         schema:
 *           type: string
 *           enum: [NEXT, MODERN, API, WEB, CAREER]
 *         description: 챌린지 분야 필터
 *         example: "WEB"
 *       - in: query
 *         name: type
 *         required: false
 *         schema:
 *           type: string
 *           enum: [OFFICIAL, BLOG]
 *         description: 챌린지 타입 필터
 *         example: "OFFICIAL"
 *       - in: query
 *         name: status
 *         required: false
 *         schema:
 *           type: string
 *           enum: [INPROGRESS, DEADLINE]
 *         description: 챌린지 상태 필터
 *         example: "INPROGRESS"
 *     responses:
 *       200:
 *         description: 신청한 챌린지 목록 조회 성공
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
 *                     participates:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           title:
 *                             type: string
 *                             description: 챌린지 제목
 *                             example: "React 마스터 챌린지"
 *                           content:
 *                             type: string
 *                             description: 챌린지 내용
 *                             example: "React의 기초부터 고급까지 학습하는 챌린지입니다."
 *                           type:
 *                             type: string
 *                             enum: [OFFICIAL, BLOG]
 *                             description: 챌린지 타입
 *                             example: "OFFICIAL"
 *                           status:
 *                             type: string
 *                             enum: [INPROGRESS, DEADLINE]
 *                             description: 챌린지 상태
 *                             example: "INPROGRESS"
 *                           field:
 *                             type: string
 *                             enum: [NEXT, MODERN, API, WEB, CAREER]
 *                             description: 챌린지 분야
 *                             example: "WEB"
 *                           source:
 *                             type: string
 *                             description: 챌린지 출처
 *                             example: "https://example.com/challenge"
 *                           deadline:
 *                             type: string
 *                             format: date-time
 *                             description: 마감 기한 (현재 시간보다 이후)
 *                             example: "2025-11-30T23:59:59.000Z"
 *                           capacity:
 *                             type: string
 *                             description: 정원
 *                             example: "50"
 *                           isReject:
 *                             type: boolean
 *                             description: 거절 여부
 *                             example: false
 *                           reject_content:
 *                             type: string
 *                             nullable: true
 *                             description: 거절 사유 (거절된 경우에만 값 존재)
 *                             example: null
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     page:
 *                       type: integer
 *                       description: 현재 페이지
 *                       example: 1
 *                     pageSize:
 *                       type: integer
 *                       description: 페이지당 항목 수
 *                       example: 10
 *             examples:
 *               approved:
 *                 summary: 승인 대기 중인 챌린지
 *                 value:
 *                   success: true
 *                   data:
 *                     participates:
 *                       - title: "React 마스터 챌린지"
 *                         content: "React의 기초부터 고급까지 학습하는 챌린지입니다."
 *                         type: "OFFICIAL"
 *                         status: "INPROGRESS"
 *                         field: "WEB"
 *                         source: "https://example.com/challenge"
 *                         deadline: "2025-11-30T23:59:59.000Z"
 *                         capacity: "50"
 *                         isReject: false
 *                         reject_content: null
 *                   pagination:
 *                     page: 1
 *                     pageSize: 10
 *               rejected:
 *                 summary: 거절된 챌린지
 *                 value:
 *                   success: true
 *                   data:
 *                     participates:
 *                       - title: "Vue.js 심화 챌린지"
 *                         content: "Vue.js 고급 기능을 학습합니다."
 *                         type: "BLOG"
 *                         status: "INPROGRESS"
 *                         field: "WEB"
 *                         source: "https://example.com/vue-challenge"
 *                         deadline: "2025-12-15T23:59:59.000Z"
 *                         capacity: "30"
 *                         isReject: true
 *                         reject_content: "신청 인원이 초과되어 거절되었습니다."
 *                   pagination:
 *                     page: 1
 *                     pageSize: 10
 *       400:
 *         description: 잘못된 요청
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   examples:
 *                     invalidUserId:
 *                       value: "유저 ID가 없거나 올바르지 않습니다."
 *                     invalidPagination:
 *                       value: "페이지 또는 페이지 크기 값이 올바르지 않습니다."
 *                     invalidPageValue:
 *                       value: "페이지 또는 페이지 크기 값은 1 이상이어야 합니다."
 *                     pageSizeLimit:
 *                       value: "페이지 크기는 100 이하여야 합니다."
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
