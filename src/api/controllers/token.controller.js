import { asyncHandler } from "../../common/error.js";
import {
  verifyAccessToken,
  refreshAccessToken
} from "../services/token.service.js";
import { cookiesOption } from "../../common/auth.js";

export const verifyAccessTokenController = asyncHandler(async (req, res) => {
  const refreshToken = req.cookies?.refreshToken; 
  if (!refreshToken) {
    return res.status(401).json({
      success: false,
      error: {
        code: "UNAUTHORIZED",
        message: "Refresh Token이 없습니다.",
      },
    });
  }

  try {
    const result = await verifyAccessToken(refreshToken);

    if (!result?.user) {
      return res.status(401).json({
        success: false,
        error: {
          code: "INVALID_USER",
          message: "유효하지 않은 사용자입니다.",
        },
      });
    }

    return res.status(200).json({
      success: true,
      message: "Refresh Token 유효함",
      user: result.user,
    });
  } 
  catch (error) {
    console.error("verifyAccessTokenController Error:", error);
    return res.status(401).json({
      success: false,
      error: {
        code: "TOKEN_VERIFICATION_FAILED",
        message: error.message || "토큰 검증 중 오류가 발생했습니다.",
      },
    });
  }
});

export const refreshTokenController = asyncHandler(async (req, res) => {
  const oldRefreshToken = req.cookies?.refreshToken;

  const { accessToken, refreshToken, user} = await refreshAccessToken(oldRefreshToken);

  res.cookie("refreshToken", refreshToken, cookiesOption)

  res.status(200).json({
    message: "Access Token 재발급 성공",
    accessToken,
    user,
  });
});
