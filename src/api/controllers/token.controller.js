import { asyncHandler } from "../../common/error.js";
import {
  verifyAccessToken,
  refreshAccessToken
} from "../services/token.service.js";


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
  const refreshToken = req.cookies?.refreshToken;
  const result = await refreshAccessToken(refreshToken);

  res.cookie("refreshToken", result.refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.status(200).json({
    message: "Access Token 재발급 성공",
    accessToken: result.accessToken,
    user: result.user,
  });
});
