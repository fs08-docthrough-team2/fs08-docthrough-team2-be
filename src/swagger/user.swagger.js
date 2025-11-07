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
 * tags:
 *   name: User
 *   description: 사용자 관련 API
 */

/**
 * @swagger
 * /api/user/my:
 *   get:
 *     summary: 내 정보 조회
 *     description: Authorization 헤더의 Access Token을 이용해 현재 로그인한 유저의 정보를 조회합니다.
 *     tags: [User]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: 성공적으로 유저 정보 반환
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
 *                     user:
 *                       type: object
 *                       properties:
 *                         userId:
 *                           type: string
 *                           format: uuid
 *                           example: "abc-123-def-456"
 *                         email:
 *                           type: string
 *                           format: email
 *                           example: "user@example.com"
 *                         nickName:
 *                           type: string
 *                           example: "유저2"
 *                         role:
 *                           type: string
 *                           enum: [USER, EXPERT, ADMIN]
 *                           example: "USER"
 *       401:
 *         description: 인증 실패
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               missingToken:
 *                 summary: 토큰 누락
 *                 value:
 *                   success: false
 *                   error:
 *                     code: "MISSING_AUTH_TOKEN"
 *                     message: "인증 토큰이 제공되지 않았습니다. 이 작업을 수행하려면 로그인이 필요합니다. Authorization 헤더에 'Bearer {token}' 형식으로 Access Token을 포함하거나 쿠키에 accessToken을 포함해주세요."
 *       404:
 *         description: 사용자를 찾을 수 없음
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               error:
 *                 code: "USER_NOT_FOUND"
 *                 message: "사용자 ID에 해당하는 프로필을 찾을 수 없습니다. 사용자가 존재하지 않거나 삭제되었을 수 있습니다. 다시 로그인해주세요."
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
 * /api/user/my:
 *   patch:
 *     summary: 내 정보 수정
 *     description: 로그인한 유저가 닉네임 또는 비밀번호를 수정합니다.
 *     tags: [User]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nickName:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 20
 *                 example: "새닉네임"
 *               password:
 *                 type: string
 *                 minLength: 8
 *                 example: "newpassword1234"
 *     responses:
 *       200:
 *         description: 수정 완료
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
 *                       example: "내 정보 수정 완료"
 *                     user:
 *                       type: object
 *                       properties:
 *                         userId:
 *                           type: string
 *                           format: uuid
 *                         email:
 *                           type: string
 *                         nickName:
 *                           type: string
 *                         role:
 *                           type: string
 *       400:
 *         description: 잘못된 요청
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               noUpdateFields:
 *                 summary: 수정할 필드 누락
 *                 value:
 *                   success: false
 *                   error:
 *                     code: "NO_UPDATE_FIELDS"
 *                     message: "수정할 항목이 제공되지 않았습니다. 프로필을 수정하려면 최소한 하나의 필드(nickName 또는 password)를 요청 본문에 포함해주세요. 예: {\"nickName\": \"새닉네임\"} 또는 {\"password\": \"새비밀번호\"}"
 *               validationError:
 *                 summary: 유효성 검증 실패
 *                 value:
 *                   success: false
 *                   error:
 *                     code: "VALIDATION_ERROR"
 *                     message: "입력 데이터 검증에 실패했습니다..."
 *       401:
 *         description: 인증 실패
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               error:
 *                 code: "MISSING_AUTH_TOKEN"
 *                 message: "인증 토큰이 제공되지 않았습니다. 이 작업을 수행하려면 로그인이 필요합니다..."
 *       404:
 *         description: 사용자를 찾을 수 없음
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               error:
 *                 code: "USER_NOT_FOUND"
 *                 message: "사용자를 찾을 수 없습니다..."
 *       500:
 *         description: 서버 오류
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *   delete:
 *     summary: 회원 탈퇴 (논리적 삭제)
 *     description: 로그인한 유저의 계정을 논리적으로 삭제합니다.
 *     tags: [User]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: 탈퇴 완료
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
 *                       example: "회원 탈퇴"
 *       401:
 *         description: 인증 실패
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               error:
 *                 code: "MISSING_AUTH_TOKEN"
 *                 message: "인증 토큰이 제공되지 않았습니다..."
 *       404:
 *         description: 사용자를 찾을 수 없음
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               error:
 *                 code: "USER_NOT_FOUND"
 *                 message: "사용자 ID에 해당하는 계정을 찾을 수 없습니다. 이미 삭제되었거나 존재하지 않는 계정입니다."
 *       409:
 *         description: 이미 탈퇴된 계정
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               error:
 *                 code: "ALREADY_DELETED"
 *                 message: "이미 탈퇴 처리된 계정입니다. 탈퇴한 계정은 다시 탈퇴할 수 없습니다. 새로운 계정이 필요한 경우 회원가입을 진행해주세요."
 *       500:
 *         description: 서버 오류
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
