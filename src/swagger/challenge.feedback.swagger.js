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
 *     description: 특정 작업물(attendId)에 달린 모든 피드백을 최신순으로 반환합니다.
 *     tags: [ChallengeFeedback]
 *     parameters:
 *       - in: query
 *         name: attendId
 *         required: true
 *         schema: { type: string }
 *         description: 작업물 ID
 *         example: "a1b2c3"
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *         description: 페이지 번호
 *         example: 1
 *       - in: query
 *         name: size
 *         schema: { type: integer, default: 10 }
 *         description: 페이지당 항목 수
 *         example: 10
 *     responses:
 *       200:
 *         description: 피드백 목록 반환 성공
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
 *                           feedbackId:
 *                             type: string
 *                             example: "feed123"
 *                           content:
 *                             type: string
 *                             example: "좋은 번역이에요!"
 *                           createdAt:
 *                             type: string
 *                             format: date-time
 *                           updatedAt:
 *                             type: string
 *                             format: date-time
 *                           user:
 *                             type: object
 *                             properties:
 *                               nickName:
 *                                 type: string
 *                                 example: "사용자1"
 *                               role:
 *                                 type: string
 *                                 example: "USER"
 *                     pagination:
 *                       type: object
 *                       properties:
 *                         page:
 *                           type: integer
 *                           example: 1
 *                         size:
 *                           type: integer
 *                           example: 10
 *                         total:
 *                           type: integer
 *                           example: 25
 *                         totalPage:
 *                           type: integer
 *                           example: 3
 *       400:
 *         description: 잘못된 요청 - 유효성 검증 실패
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               error:
 *                 code: "VALIDATION_ERROR"
 *                 message: "attendId는 필수 항목입니다."
 *       500:
 *         description: 서버 오류
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               error:
 *                 code: "INTERNAL_SERVER_ERROR"
 *                 message: "서버 내부 오류가 발생했습니다."
 */

/**
 * @swagger
 * /api/challenge/feedback/translated-detail/feedback-detail:
 *   get:
 *     summary: 피드백 상세 조회
 *     description: feedbackId로 특정 피드백을 조회합니다.
 *     tags: [ChallengeFeedback]
 *     parameters:
 *       - in: query
 *         name: feedbackId
 *         required: true
 *         schema: { type: string }
 *         description: 피드백 ID
 *         example: "feed123"
 *     responses:
 *       200:
 *         description: 피드백 상세 조회 성공
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
 *                         feedbackId:
 *                           type: string
 *                           example: "feed123"
 *                         content:
 *                           type: string
 *                           example: "좋은 번역이에요!"
 *                         createdAt:
 *                           type: string
 *                           format: date-time
 *                         updatedAt:
 *                           type: string
 *                           format: date-time
 *                         user:
 *                           type: object
 *                           properties:
 *                             nickName:
 *                               type: string
 *                               example: "사용자1"
 *                             role:
 *                               type: string
 *                               example: "USER"
 *                         attend:
 *                           type: object
 *                           properties:
 *                             attendId:
 *                               type: string
 *                               example: "a1b2c3"
 *       400:
 *         description: 잘못된 요청 - 유효성 검증 실패
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               error:
 *                 code: "VALIDATION_ERROR"
 *                 message: "feedbackId는 필수 항목입니다."
 *       404:
 *         description: 리소스를 찾을 수 없음
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               error:
 *                 code: "FEEDBACK_NOT_FOUND"
 *                 message: "피드백 ID 'feed123'를 찾을 수 없습니다. 피드백이 존재하지 않거나 이미 삭제되었을 수 있습니다. 피드백 ID를 확인해주세요."
 *       500:
 *         description: 서버 오류
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               error:
 *                 code: "INTERNAL_SERVER_ERROR"
 *                 message: "서버 내부 오류가 발생했습니다."
 */

/**
 * @swagger
 * /api/challenge/feedback/translated-detail/feedback-detail:
 *   post:
 *     summary: 피드백 생성
 *     description: 특정 작업물(attendId)에 대해 피드백을 작성합니다. (인증 필요)
 *     tags: [ChallengeFeedback]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [attendId, content]
 *             properties:
 *               attendId:
 *                 type: string
 *                 description: 작업물 ID
 *                 example: "a1b2c3"
 *               content:
 *                 type: string
 *                 description: 피드백 내용
 *                 example: "좋은 번역이에요!"
 *     responses:
 *       201:
 *         description: 피드백 작성 성공
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
 *                       example: "피드백이 등록되었습니다."
 *                     feedback:
 *                       type: object
 *                       properties:
 *                         feedbackId:
 *                           type: string
 *                           example: "feed123"
 *                         content:
 *                           type: string
 *                           example: "좋은 번역이에요!"
 *                         createdAt:
 *                           type: string
 *                           format: date-time
 *                         updatedAt:
 *                           type: string
 *                           format: date-time
 *       400:
 *         description: 잘못된 요청 - 유효성 검증 실패
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               error:
 *                 code: "VALIDATION_ERROR"
 *                 message: "content는 필수 항목입니다."
 *       401:
 *         description: 인증 실패
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               noToken:
 *                 summary: 토큰 없음
 *                 value:
 *                   success: false
 *                   error:
 *                     code: "MISSING_AUTH_TOKEN"
 *                     message: "인증 토큰이 제공되지 않았습니다. 이 작업을 수행하려면 로그인이 필요합니다. Authorization 헤더에 'Bearer {token}' 형식으로 Access Token을 포함하거나 쿠키에 accessToken을 포함해주세요."
 *               invalidToken:
 *                 summary: 유효하지 않은 토큰
 *                 value:
 *                   success: false
 *                   error:
 *                     code: "INVALID_TOKEN"
 *                     message: "유효하지 않은 토큰입니다."
 *       404:
 *         description: 리소스를 찾을 수 없음
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               error:
 *                 code: "WORK_NOT_FOUND"
 *                 message: "작업물 ID 'a1b2c3'를 찾을 수 없습니다. 작업물이 존재하지 않거나 이미 삭제되었을 수 있습니다. 피드백을 작성하기 전에 작업물 ID를 확인해주세요."
 *       500:
 *         description: 서버 오류
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               error:
 *                 code: "INTERNAL_SERVER_ERROR"
 *                 message: "서버 내부 오류가 발생했습니다."
 */

/**
 * @swagger
 * /api/challenge/feedback/translated-detail/feedback-detail:
 *   patch:
 *     summary: 피드백 수정
 *     description: 본인 또는 ADMIN만 수정 가능. (인증 필요)
 *     tags: [ChallengeFeedback]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [feedbackId, content]
 *             properties:
 *               feedbackId:
 *                 type: string
 *                 description: 피드백 ID
 *                 example: "feed123"
 *               content:
 *                 type: string
 *                 description: 수정할 피드백 내용
 *                 example: "수정된 피드백 내용"
 *     responses:
 *       200:
 *         description: 피드백 수정 성공
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
 *                       example: "피드백이 수정되었습니다."
 *                     feedback:
 *                       type: object
 *                       properties:
 *                         feedbackId:
 *                           type: string
 *                           example: "feed123"
 *                         content:
 *                           type: string
 *                           example: "수정된 피드백 내용"
 *                         updatedAt:
 *                           type: string
 *                           format: date-time
 *       400:
 *         description: 잘못된 요청 - 유효성 검증 실패
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               error:
 *                 code: "VALIDATION_ERROR"
 *                 message: "content는 필수 항목입니다."
 *       401:
 *         description: 인증 실패
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               noToken:
 *                 summary: 토큰 없음
 *                 value:
 *                   success: false
 *                   error:
 *                     code: "MISSING_AUTH_TOKEN"
 *                     message: "인증 토큰이 제공되지 않았습니다. 이 작업을 수행하려면 로그인이 필요합니다. Authorization 헤더에 'Bearer {token}' 형식으로 Access Token을 포함하거나 쿠키에 accessToken을 포함해주세요."
 *               invalidToken:
 *                 summary: 유효하지 않은 토큰
 *                 value:
 *                   success: false
 *                   error:
 *                     code: "INVALID_TOKEN"
 *                     message: "유효하지 않은 토큰입니다."
 *       403:
 *         description: 권한 없음 - 본인 또는 ADMIN만 수정 가능
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               error:
 *                 code: "FEEDBACK_UPDATE_DENIED"
 *                 message: "피드백 ID 'feed123'에 대한 수정 권한이 없습니다. 본인이 작성한 피드백만 수정할 수 있습니다. 현재 사용자 ID: 'user123', 작성자 ID: 'user456'"
 *       404:
 *         description: 리소스를 찾을 수 없음
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               error:
 *                 code: "FEEDBACK_NOT_FOUND"
 *                 message: "피드백 ID 'feed123'를 찾을 수 없습니다. 피드백이 존재하지 않거나 이미 삭제되었을 수 있습니다. 피드백 ID를 확인해주세요."
 *       500:
 *         description: 서버 오류
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               error:
 *                 code: "INTERNAL_SERVER_ERROR"
 *                 message: "서버 내부 오류가 발생했습니다."
 */

/**
 * @swagger
 * /api/challenge/feedback/translated-detail/feedback-detail:
 *   delete:
 *     summary: 피드백 삭제
 *     description: 본인 또는 ADMIN만 삭제 가능. (인증 필요)
 *     tags: [ChallengeFeedback]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: feedbackId
 *         required: true
 *         schema: { type: string }
 *         description: 피드백 ID
 *         example: "feed123"
 *     responses:
 *       200:
 *         description: 피드백 삭제 성공
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
 *                       example: "피드백이 삭제되었습니다."
 *                     feedback:
 *                       type: object
 *                       properties:
 *                         feedbackId:
 *                           type: string
 *                           example: "feed123"
 *                         content:
 *                           type: string
 *                           example: "좋은 번역이에요!"
 *                         createdAt:
 *                           type: string
 *                           format: date-time
 *       400:
 *         description: 잘못된 요청 - 유효성 검증 실패
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               error:
 *                 code: "VALIDATION_ERROR"
 *                 message: "feedbackId는 필수 항목입니다."
 *       401:
 *         description: 인증 실패
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               noToken:
 *                 summary: 토큰 없음
 *                 value:
 *                   success: false
 *                   error:
 *                     code: "MISSING_AUTH_TOKEN"
 *                     message: "인증 토큰이 제공되지 않았습니다. 이 작업을 수행하려면 로그인이 필요합니다. Authorization 헤더에 'Bearer {token}' 형식으로 Access Token을 포함하거나 쿠키에 accessToken을 포함해주세요."
 *               invalidToken:
 *                 summary: 유효하지 않은 토큰
 *                 value:
 *                   success: false
 *                   error:
 *                     code: "INVALID_TOKEN"
 *                     message: "유효하지 않은 토큰입니다."
 *       403:
 *         description: 권한 없음 - 본인 또는 ADMIN만 삭제 가능
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               error:
 *                 code: "FEEDBACK_DELETE_DENIED"
 *                 message: "피드백 ID 'feed123'에 대한 삭제 권한이 없습니다. 본인이 작성한 피드백만 삭제할 수 있습니다. 현재 사용자 ID: 'user123', 작성자 ID: 'user456'"
 *       404:
 *         description: 리소스를 찾을 수 없음
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               error:
 *                 code: "FEEDBACK_NOT_FOUND"
 *                 message: "피드백 ID 'feed123'를 찾을 수 없습니다. 피드백이 존재하지 않거나 이미 삭제되었을 수 있습니다. 피드백 ID를 확인해주세요."
 *       500:
 *         description: 서버 오류
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               error:
 *                 code: "INTERNAL_SERVER_ERROR"
 *                 message: "서버 내부 오류가 발생했습니다."
 */
