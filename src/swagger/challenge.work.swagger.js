/**
 * @swagger
 * tags:
 *   - name: ChallengeWork
 *     description: 첼린지 작업물(Translated Work) 관련 API
 */

/**
 * @swagger
 * /api/challenge/work/translated-list:
 *   get:
 *     summary: 제출된 작업물 리스트 조회
 *     description: 특정 첼린지에 제출된 모든 작업물 목록을 페이지네이션 형태로 반환합니다.
 *     tags: [ChallengeWork]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: challengeId
 *         schema:
 *           type: string
 *         required: true
 *         description: 첼린지 ID
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: size
 *         schema:
 *           type: integer
 *           default: 10
 *     responses:
 *       200:
 *         description: 작업물 리스트 반환 성공
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
 *                     items:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           attendsId:
 *                             type: string
 *                           nickName:
 *                             type: string
 *                           role:
 *                             type: string
 *                           likeCount:
 *                             type: integer
 *                           createdAt:
 *                             type: string
 *                             format: date-time
 *                     pagination:
 *                       type: object
 *                       properties:
 *                         page:
 *                           type: integer
 *                         size:
 *                           type: integer
 *                         total:
 *                           type: integer
 *                         totalPages:
 *                           type: integer
 *       400:
 *         description: 잘못된 요청 - 유효성 검증 실패 또는 데이터 조회 실패
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               workListFetchFailed:
 *                 summary: 작업물 목록 조회 실패
 *                 value:
 *                   success: false
 *                   error:
 *                     code: "WORK_LIST_FETCH_FAILED"
 *                     message: "챌린지 ID 'challenge-123'의 작업물 목록 조회에 실패했습니다. 데이터베이스에서 올바른 형식의 데이터를 반환받지 못했습니다. 잠시 후 다시 시도하거나 관리자에게 문의해주세요."
 *               validationError:
 *                 summary: 유효성 검증 실패
 *                 value:
 *                   success: false
 *                   error:
 *                     code: "VALIDATION_ERROR"
 *                     message: "입력값이 올바르지 않습니다. challengeId는 필수 항목입니다."
 *       401:
 *         description: 인증 실패 - 토큰이 없거나 유효하지 않음
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               missingToken:
 *                 summary: 토큰 없음
 *                 value:
 *                   success: false
 *                   error:
 *                     code: "MISSING_AUTH_TOKEN"
 *                     message: "인증 토큰이 제공되지 않았습니다. Authorization 헤더에 Bearer 토큰을 포함해주세요."
 *               invalidToken:
 *                 summary: 유효하지 않은 토큰
 *                 value:
 *                   success: false
 *                   error:
 *                     code: "INVALID_TOKEN"
 *                     message: "제공된 액세스 토큰이 유효하지 않습니다. 토큰이 만료되었거나 변조되었을 수 있습니다. 다시 로그인해주세요."
 *       500:
 *         description: 서버 내부 오류
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /api/challenge/work/translated-detail/{attendId}:
 *   get:
 *     summary: 제출된 작업물 상세 조회
 *     description: 특정 참가자의 제출된 작업물 상세 정보를 조회합니다.
 *     tags: [ChallengeWork]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: attendId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: 작업물 상세 조회 성공
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
 *                     item:
 *                       type: object
 *                       properties:
 *                         attendId:
 *                           type: string
 *                         userId:
 *                           type: string
 *                         title:
 *                           type: string
 *                         workItem:
 *                           type: string
 *                         createdAt:
 *                           type: string
 *                           format: date-time
 *                         nickName:
 *                           type: string
 *                         role:
 *                           type: string
 *                         likeCount:
 *                           type: integer
 *                         likeByMe:
 *                           type: boolean
 *                         isClose:
 *                           type: boolean
 *       400:
 *         description: 잘못된 요청 - 유효성 검증 실패
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: 인증 실패 - 토큰이 없거나 유효하지 않음
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               missingToken:
 *                 summary: 토큰 없음
 *                 value:
 *                   success: false
 *                   error:
 *                     code: "MISSING_AUTH_TOKEN"
 *                     message: "인증 토큰이 제공되지 않았습니다. 로그인 후 다시 시도해주세요."
 *               invalidToken:
 *                 summary: 유효하지 않은 토큰
 *                 value:
 *                   success: false
 *                   error:
 *                     code: "INVALID_TOKEN"
 *                     message: "제공된 토큰이 유효하지 않습니다. 다시 로그인해주세요."
 *       404:
 *         description: 작업물을 찾을 수 없음
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               error:
 *                 code: "WORK_NOT_FOUND"
 *                 message: "작업물 ID 'attend-123'를 찾을 수 없습니다. 작업물이 존재하지 않거나 이미 삭제되었을 수 있습니다. 작업물 ID를 확인해주세요."
 *       500:
 *         description: 서버 내부 오류
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /api/challenge/work/translated-list/save:
 *   get:
 *     summary: 임시 저장된 작업물 리스트 조회
 *     description: 사용자가 임시로 저장한 작업물 리스트를 조회합니다.
 *     tags: [ChallengeWork]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: size
 *         schema:
 *           type: integer
 *           default: 5
 *     responses:
 *       200:
 *         description: 임시 저장 리스트 반환 성공
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
 *                     items:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           attendId:
 *                             type: string
 *                           title:
 *                             type: string
 *                           createdAt:
 *                             type: string
 *                             format: date-time
 *                           nickName:
 *                             type: string
 *                     pagination:
 *                       type: object
 *                       properties:
 *                         page:
 *                           type: integer
 *                         size:
 *                           type: integer
 *                         total:
 *                           type: integer
 *                         totalPages:
 *                           type: integer
 *       400:
 *         description: 잘못된 요청 - 데이터 조회 실패
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               error:
 *                 code: "SAVE_LIST_FETCH_FAILED"
 *                 message: "사용자 ID 'user-123'의 임시 저장 목록 조회에 실패했습니다. 데이터베이스에서 올바른 형식의 데이터를 반환받지 못했습니다. 잠시 후 다시 시도하거나 관리자에게 문의해주세요."
 *       401:
 *         description: 인증 실패 - 토큰이 없거나 유효하지 않음
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               missingToken:
 *                 summary: 토큰 없음
 *                 value:
 *                   success: false
 *                   error:
 *                     code: "MISSING_AUTH_TOKEN"
 *                     message: "인증 토큰이 제공되지 않았습니다. 로그인 후 다시 시도해주세요."
 *               invalidToken:
 *                 summary: 유효하지 않은 토큰
 *                 value:
 *                   success: false
 *                   error:
 *                     code: "INVALID_TOKEN"
 *                     message: "제공된 토큰이 유효하지 않습니다. 다시 로그인해주세요."
 *       500:
 *         description: 서버 내부 오류
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /api/challenge/work/translated-detail/save/{attendId}:
 *   get:
 *     summary: 임시 저장 상세 조회
 *     description: 특정 임시 저장 작업물의 상세 내용을 조회합니다.
 *     tags: [ChallengeWork]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: attendId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: 임시 저장 상세 조회 성공
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
 *                     item:
 *                       type: object
 *                       properties:
 *                         attendId:
 *                           type: string
 *                         title:
 *                           type: string
 *                         workItem:
 *                           type: string
 *                         createdAt:
 *                           type: string
 *                           format: date-time
 *                         nickName:
 *                           type: string
 *                         role:
 *                           type: string
 *                         isClose:
 *                           type: boolean
 *       400:
 *         description: 잘못된 요청 - 유효성 검증 실패
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: 인증 실패 또는 권한 없음
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               missingToken:
 *                 summary: 토큰 없음
 *                 value:
 *                   success: false
 *                   error:
 *                     code: "MISSING_AUTH_TOKEN"
 *                     message: "인증 토큰이 제공되지 않았습니다. 로그인 후 다시 시도해주세요."
 *               invalidToken:
 *                 summary: 유효하지 않은 토큰
 *                 value:
 *                   success: false
 *                   error:
 *                     code: "INVALID_TOKEN"
 *                     message: "제공된 토큰이 유효하지 않습니다. 다시 로그인해주세요."
 *               saveAccessDenied:
 *                 summary: 접근 권한 없음
 *                 value:
 *                   success: false
 *                   error:
 *                     code: "SAVE_ACCESS_DENIED"
 *                     message: "임시 저장 ID 'attend-123'에 대한 조회 권한이 없습니다. 본인이 작성한 임시 저장만 조회할 수 있습니다. 현재 사용자 ID: 'user-123', 작성자 ID: 'user-456'"
 *       404:
 *         description: 임시 저장을 찾을 수 없음
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               error:
 *                 code: "SAVE_NOT_FOUND"
 *                 message: "임시 저장 ID 'attend-123'를 찾을 수 없습니다. 임시 저장된 작업물이 존재하지 않거나 이미 삭제되었을 수 있습니다. 임시 저장 ID를 확인해주세요."
 *       500:
 *         description: 서버 내부 오류
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /api/challenge/work/translated-detail:
 *   post:
 *     summary: 작업물 제출
 *     description: 사용자 작업물을 제출(저장)합니다.
 *     tags: [ChallengeWork]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [challengeId, title, workItem]
 *             properties:
 *               challengeId:
 *                 type: string
 *               title:
 *                 type: string
 *               workItem:
 *                 type: string
 *     responses:
 *       201:
 *         description: 작업물 제출 성공
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
 *                     message:
 *                       type: string
 *                       example: "작업물 제출"
 *                     attendId:
 *                       type: string
 *                       example: "uuid-string"
 *       400:
 *         description: 잘못된 요청 - 유효성 검증 실패, 챌린지 종료됨, 또는 정원 초과
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               validationError:
 *                 summary: 유효성 검증 실패
 *                 value:
 *                   success: false
 *                   error:
 *                     code: "VALIDATION_ERROR"
 *                     message: "입력값이 올바르지 않습니다. challengeId, title, workItem은 필수 항목입니다."
 *               challengeClosed:
 *                 summary: 챌린지 종료됨
 *                 value:
 *                   success: false
 *                   error:
 *                     code: "CHALLENGE_ALREADY_CLOSED"
 *                     message: "챌린지 ID 'challenge-123'는 이미 종료되었습니다. 종료된 챌린지에는 작업물을 제출할 수 없습니다. 진행 중인 다른 챌린지를 선택해주세요."
 *               capacityFull:
 *                 summary: 정원 초과
 *                 value:
 *                   success: false
 *                   error:
 *                     code: "CHALLENGE_CAPACITY_FULL"
 *                     message: "챌린지 ID 'challenge-123'의 참여 인원이 이미 정원(30명)에 도달했습니다. 현재 참여자 수: 30명. 다른 챌린지를 선택해주세요."
 *       401:
 *         description: 인증 실패 - 토큰이 없거나 유효하지 않음
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               missingToken:
 *                 summary: 토큰 없음
 *                 value:
 *                   success: false
 *                   error:
 *                     code: "MISSING_AUTH_TOKEN"
 *                     message: "인증 토큰이 제공되지 않았습니다. 로그인 후 다시 시도해주세요."
 *               invalidToken:
 *                 summary: 유효하지 않은 토큰
 *                 value:
 *                   success: false
 *                   error:
 *                     code: "INVALID_TOKEN"
 *                     message: "제공된 토큰이 유효하지 않습니다. 다시 로그인해주세요."
 *       409:
 *         description: 중복 오류 - 이미 제출된 작업물이 존재함
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               error:
 *                 code: "WORK_ALREADY_SUBMITTED"
 *                 message: "챌린지 ID 'challenge-123'에 이미 제출된 작업물이 존재합니다. 하나의 챌린지에는 한 번만 작업물을 제출할 수 있습니다. 기존 작업물 ID: 'attend-123'"
 *       500:
 *         description: 서버 내부 오류
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /api/challenge/work/translated-detail/save:
 *   post:
 *     summary: 작업물 임시 저장
 *     description: 작업물을 임시 저장합니다.
 *     tags: [ChallengeWork]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [challengeId, title, workItem]
 *             properties:
 *               challengeId:
 *                 type: string
 *               title:
 *                 type: string
 *               workItem:
 *                 type: string
 *     responses:
 *       200:
 *         description: 임시 저장 성공
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
 *                     message:
 *                       type: string
 *                       example: "임시 저장 완료"
 *                     attendId:
 *                       type: string
 *                       example: "uuid-string"
 *       400:
 *         description: 잘못된 요청 - 유효성 검증 실패 또는 챌린지 종료됨
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               validationError:
 *                 summary: 유효성 검증 실패
 *                 value:
 *                   success: false
 *                   error:
 *                     code: "VALIDATION_ERROR"
 *                     message: "입력값이 올바르지 않습니다. challengeId, title, workItem은 필수 항목입니다."
 *               challengeClosed:
 *                 summary: 챌린지 종료됨
 *                 value:
 *                   success: false
 *                   error:
 *                     code: "CHALLENGE_ALREADY_CLOSED"
 *                     message: "챌린지 ID 'challenge-123'는 이미 종료되었습니다. 종료된 챌린지에는 작업물을 임시 저장할 수 없습니다. 진행 중인 다른 챌린지를 선택해주세요."
 *       401:
 *         description: 인증 실패 - 토큰이 없거나 유효하지 않음
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               missingToken:
 *                 summary: 토큰 없음
 *                 value:
 *                   success: false
 *                   error:
 *                     code: "MISSING_AUTH_TOKEN"
 *                     message: "인증 토큰이 제공되지 않았습니다. 로그인 후 다시 시도해주세요."
 *               invalidToken:
 *                 summary: 유효하지 않은 토큰
 *                 value:
 *                   success: false
 *                   error:
 *                     code: "INVALID_TOKEN"
 *                     message: "제공된 토큰이 유효하지 않습니다. 다시 로그인해주세요."
 *       500:
 *         description: 서버 내부 오류
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /api/challenge/work/translated-detail/{attendId}:
 *   patch:
 *     summary: 작업물 수정
 *     description: 제출된 작업물의 제목 및 내용을 수정합니다.
 *     tags: [ChallengeWork]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: attendId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title, workItem]
 *             properties:
 *               title:
 *                 type: string
 *               workItem:
 *                 type: string
 *     responses:
 *       200:
 *         description: 수정 성공
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
 *                     message:
 *                       type: string
 *                       example: "작업물 수정 완료"
 *       400:
 *         description: 잘못된 요청 - 유효성 검증 실패 또는 챌린지 종료됨
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               validationError:
 *                 summary: 유효성 검증 실패
 *                 value:
 *                   success: false
 *                   error:
 *                     code: "VALIDATION_ERROR"
 *                     message: "입력값이 올바르지 않습니다. title, workItem은 필수 항목입니다."
 *               challengeClosed:
 *                 summary: 챌린지 종료됨
 *                 value:
 *                   success: false
 *                   error:
 *                     code: "CHALLENGE_ALREADY_CLOSED"
 *                     message: "챌린지 ID 'challenge-123'는 이미 종료되었습니다. 종료된 챌린지의 작업물은 수정할 수 없습니다."
 *       401:
 *         description: 인증 실패 - 토큰이 없거나 유효하지 않음
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               missingToken:
 *                 summary: 토큰 없음
 *                 value:
 *                   success: false
 *                   error:
 *                     code: "MISSING_AUTH_TOKEN"
 *                     message: "인증 토큰이 제공되지 않았습니다. 로그인 후 다시 시도해주세요."
 *               invalidToken:
 *                 summary: 유효하지 않은 토큰
 *                 value:
 *                   success: false
 *                   error:
 *                     code: "INVALID_TOKEN"
 *                     message: "제공된 토큰이 유효하지 않습니다. 다시 로그인해주세요."
 *       403:
 *         description: 권한 없음 - 본인이 작성한 작업물만 수정 가능
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               error:
 *                 code: "WORK_UPDATE_DENIED"
 *                 message: "작업물 ID 'attend-123'에 대한 수정 권한이 없습니다. 본인이 작성한 작업물만 수정할 수 있습니다. 현재 사용자 ID: 'user-123', 작성자 ID: 'user-456'"
 *       404:
 *         description: 작업물을 찾을 수 없음
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               error:
 *                 code: "WORK_NOT_FOUND"
 *                 message: "작업물 ID 'attend-123'를 찾을 수 없습니다. 작업물이 존재하지 않거나 이미 삭제되었을 수 있습니다. 작업물 ID를 확인해주세요."
 *       500:
 *         description: 서버 내부 오류
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /api/challenge/work/translated-detail/{attendId}:
 *   delete:
 *     summary: 작업물 삭제
 *     description: 제출된 작업물을 삭제합니다. (Soft Delete - 실제로는 is_delete 플래그만 변경)
 *     tags: [ChallengeWork]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: attendId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               deleteReason:
 *                 type: string
 *                 description: 삭제 사유 (선택적)
 *                 example: "내용이 부적절하여 삭제합니다."
 *     responses:
 *       200:
 *         description: 삭제 성공
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
 *                     message:
 *                       type: string
 *                       example: "삭제 완료"
 *       400:
 *         description: 잘못된 요청 - 챌린지가 종료됨
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               error:
 *                 code: "CHALLENGE_ALREADY_CLOSED"
 *                 message: "챌린지 ID 'challenge-123'는 이미 종료되었습니다. 종료된 챌린지의 작업물은 삭제할 수 없습니다."
 *       401:
 *         description: 인증 실패 - 토큰이 없거나 유효하지 않음
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               missingToken:
 *                 summary: 토큰 없음
 *                 value:
 *                   success: false
 *                   error:
 *                     code: "MISSING_AUTH_TOKEN"
 *                     message: "인증 토큰이 제공되지 않았습니다. 로그인 후 다시 시도해주세요."
 *               invalidToken:
 *                 summary: 유효하지 않은 토큰
 *                 value:
 *                   success: false
 *                   error:
 *                     code: "INVALID_TOKEN"
 *                     message: "제공된 토큰이 유효하지 않습니다. 다시 로그인해주세요."
 *       403:
 *         description: 권한 없음 - 본인이 작성한 작업물만 삭제 가능
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               error:
 *                 code: "WORK_DELETE_DENIED"
 *                 message: "작업물 ID 'attend-123'에 대한 삭제 권한이 없습니다. 본인이 작성한 작업물만 삭제할 수 있습니다. 현재 사용자 ID: 'user-123', 작성자 ID: 'user-456'"
 *       404:
 *         description: 작업물을 찾을 수 없음
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               error:
 *                 code: "WORK_NOT_FOUND"
 *                 message: "작업물 ID 'attend-123'를 찾을 수 없습니다. 작업물이 존재하지 않거나 이미 삭제되었을 수 있습니다. 작업물 ID를 확인해주세요."
 *       500:
 *         description: 서버 내부 오류
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /api/challenge/work/translated-detail/like/{attendId}:
 *   post:
 *     summary: 좋아요 토글
 *     description: 특정 작업물의 좋아요 상태를 토글합니다.
 *     tags: [ChallengeWork]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: attendId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: 좋아요 상태 변경 성공
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
 *                     message:
 *                       type: string
 *                       example: "좋아요 추가"
 *             examples:
 *               likeAdded:
 *                 summary: 좋아요 추가
 *                 value:
 *                   success: true
 *                   data:
 *                     message: "좋아요 추가"
 *               likeRemoved:
 *                 summary: 좋아요 취소
 *                 value:
 *                   success: true
 *                   data:
 *                     message: "좋아요 취소"
 *       400:
 *         description: 잘못된 요청 - 유효성 검증 실패
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: 인증 실패 - 토큰이 없거나 유효하지 않음
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               missingToken:
 *                 summary: 토큰 없음
 *                 value:
 *                   success: false
 *                   error:
 *                     code: "MISSING_AUTH_TOKEN"
 *                     message: "인증 토큰이 제공되지 않았습니다. 로그인 후 다시 시도해주세요."
 *               invalidToken:
 *                 summary: 유효하지 않은 토큰
 *                 value:
 *                   success: false
 *                   error:
 *                     code: "INVALID_TOKEN"
 *                     message: "제공된 토큰이 유효하지 않습니다. 다시 로그인해주세요."
 *       500:
 *         description: 서버 내부 오류
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
