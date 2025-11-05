import { asyncHandler } from "../../middleware/error.middleware.js";
import {
  verifyAccessToken,
  refreshAccessToken
} from "../services/token.service.js";
import { cookiesOption } from "../../middleware/auth.middleware.js";
import HTTP_STATUS from "../../constants/http.constant.js";
import { AUTH_MESSAGE } from "../../constants/message.constant.js";

export const verifyAccessTokenController = asyncHandler(async (req, res) => {
  const refreshToken = req.cookies?.refreshToken;
  if (!refreshToken) {
    return res.status(HTTP_STATUS.UNAUTHORIZED).json({
      success: false,
      error: {
        code: "UNAUTHORIZED",
        message: AUTH_MESSAGE.NO_REFRESH_TOKEN,
      },
    });
  }

  try {
    const result = await verifyAccessToken(refreshToken);

    if (!result?.user) {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({
        success: false,
        error: {
          code: "INVALID_USER",
          message: AUTH_MESSAGE.INVALID_USER,
        },
      });
    }

    return res.status(HTTP_STATUS.OK).json({
      success: true,
      message: AUTH_MESSAGE.REFRESH_TOKEN_VALID,
      user: result.user,
    });
  }
  catch (error) {
    console.error("verifyAccessTokenController Error:", error);
    return res.status(HTTP_STATUS.UNAUTHORIZED).json({
      success: false,
      error: {
        code: "TOKEN_VERIFICATION_FAILED",
        message: error.message || AUTH_MESSAGE.TOKEN_VERIFICATION_FAILED,
      },
    });
  }
});

export const refreshTokenController = asyncHandler(async (req, res) => {
  const oldRefreshToken = req.cookies?.refreshToken;

  const { accessToken, refreshToken, user} = await refreshAccessToken(oldRefreshToken);

  res.cookie("refreshToken", refreshToken, cookiesOption)

  res.status(HTTP_STATUS.OK).json({
    message: AUTH_MESSAGE.ACCESS_TOKEN_REFRESH_SUCCESS,
    accessToken,
    user,
  });
});
