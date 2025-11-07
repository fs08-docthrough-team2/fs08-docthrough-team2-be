/**
 * @swagger
 * tags:
 *   name: Token
 *   description: JWT 토큰 관련 API
 */

/**
 * @swagger
 * /api/token/verify:
 *   post:
 *     summary: Refresh Token 유효성 검증
 *     description: 쿠키에 저장된 Refresh Token을 검증하여 사용자가 유효한지 확인합니다.
 *     tags: [Token]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Refresh Token이 유효한 경우 사용자 정보 반환
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
 *                         email:
 *                           type: string
 *                           example: "user@test.com"
 *                         nickName:
 *                           type: string
 *                           example: "tester"
 *                         role:
 *                           type: string
 *                           example: "USER"
 *       400:
 *         description: 잘못된 요청 - Refresh Token이 제공되지 않음
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               error:
 *                 code: "MISSING_REFRESH_TOKEN"
 *                 message: "Refresh Token이 제공되지 않았습니다. 요청에 유효한 Refresh Token을 포함해주세요. 쿠키가 삭제되었거나 만료된 경우 다시 로그인해주세요."
 *       401:
 *         description: 인증 실패 - Refresh Token이 유효하지 않음
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               invalidToken:
 *                 summary: 잘못된 Refresh Token
 *                 value:
 *                   success: false
 *                   error:
 *                     code: "INVALID_REFRESH_TOKEN"
 *                     message: "제공된 Refresh Token을 데이터베이스에서 찾을 수 없습니다. Token이 유효하지 않거나, 이미 로그아웃되었거나, 삭제된 사용자의 Token입니다. 다시 로그인해주세요."
 *               verificationFailed:
 *                 summary: Token 검증 실패
 *                 value:
 *                   success: false
 *                   error:
 *                     code: "TOKEN_VERIFICATION_FAILED"
 *                     message: "Refresh Token의 서명 검증에 실패했습니다. Token이 만료되었거나, 변조되었거나, 잘못된 서명입니다. 보안을 위해 다시 로그인해주세요."
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
 * /api/token/refresh:
 *   post:
 *     summary: Refresh Token으로 Access Token 재발급
 *     description: 쿠키에 저장된 Refresh Token을 사용하여 새로운 Access Token을 발급받습니다.
 *     tags: [Token]
 *     responses:
 *       200:
 *         description: 새 Access/Refresh 토큰 반환
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
 *                     accessToken:
 *                       type: string
 *                       example: "eyJhbGciOiJIUzI1NiIs..."
 *                     refreshToken:
 *                       type: string
 *                       example: "eyJhbGciOiJIUzI1NiIs..."
 *                     user:
 *                       type: object
 *                       properties:
 *                         email:
 *                           type: string
 *                           example: "user@test.com"
 *                         nickName:
 *                           type: string
 *                           example: "tester"
 *                         role:
 *                           type: string
 *                           example: "USER"
 *       400:
 *         description: 잘못된 요청 - Refresh Token이 제공되지 않음
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               error:
 *                 code: "MISSING_REFRESH_TOKEN"
 *                 message: "Refresh Token이 제공되지 않았습니다. Access Token을 갱신하려면 유효한 Refresh Token이 필요합니다. 쿠키가 삭제되었거나 만료된 경우 다시 로그인해주세요."
 *       401:
 *         description: 인증 실패 - Refresh Token이 유효하지 않음
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               invalidToken:
 *                 summary: 잘못된 Refresh Token
 *                 value:
 *                   success: false
 *                   error:
 *                     code: "INVALID_REFRESH_TOKEN"
 *                     message: "제공된 Refresh Token을 데이터베이스에서 찾을 수 없습니다. Token이 유효하지 않거나, 이미 로그아웃되었거나, 삭제된 사용자의 Token입니다. 다시 로그인해주세요."
 *               verificationFailed:
 *                 summary: Token 검증 실패
 *                 value:
 *                   success: false
 *                   error:
 *                     code: "TOKEN_VERIFICATION_FAILED"
 *                     message: "Refresh Token의 서명 검증에 실패했습니다. Token이 만료되었거나, 변조되었거나, 잘못된 서명입니다. 보안을 위해 다시 로그인해주세요."
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
