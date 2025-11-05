import { asyncHandler } from "../../middleware/error.middleware.js";
import { signup, login, logout } from "../services/auth.service.js";
import { cookiesOption } from "../../middleware/auth.middleware.js";
import HTTP_STATUS from "../../constants/http.constant.js";
import { AUTH_MESSAGE } from "../../constants/message.constant.js";
import { successResponse, errorResponse } from "../../utils/response.util.js";
import { AUTH_ERROR_CODE } from "../../constants/error-code.constant.js";

export const signupController = asyncHandler(async (req, res) => {
  const { email, password, nickName } = req.body;
  const { userId, email: userEmail, nickName: userNickName, role, accessToken, refreshToken } = await signup(email, password, nickName);

  res.cookie("refreshToken", refreshToken, cookiesOption);

  res.status(HTTP_STATUS.CREATED).json(
    successResponse({
      data: {
        userId,
        email: userEmail,
        nickName: userNickName,
        role,
        accessToken,
        refreshToken
      },
      message: AUTH_MESSAGE.SIGNUP_SUCCESS,
    })
  );
});

export const loginController = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const { userId, email: userEmail, nickName, role, accessToken, refreshToken } = await login(email, password);

  res.cookie("refreshToken", refreshToken, cookiesOption);

  res.status(HTTP_STATUS.OK).json(
    successResponse({
      data: {
        userId,
        email: userEmail,
        nickName,
        role,
        accessToken,
        refreshToken
      },
      message: AUTH_MESSAGE.LOGIN_SUCCESS,
    })
  );
});

export const logoutController = asyncHandler(async (req, res) => {
  const refreshToken = req.cookies?.refreshToken;

  if (!refreshToken) {
    return res.status(HTTP_STATUS.UNAUTHORIZED).json(
      errorResponse({
        code: AUTH_ERROR_CODE.NO_REFRESH_TOKEN,
        message: AUTH_MESSAGE.NO_REFRESH_TOKEN,
      })
    );
  }

  // 쿠키 기반 로그아웃 (refreshToken 전달)
  await logout(refreshToken);

  // 쿠키 제거
  res.clearCookie("refreshToken");

  res.status(HTTP_STATUS.OK).json(
    successResponse({
      data: null,
      message: AUTH_MESSAGE.LOGOUT_SUCCESS,
    })
  );
});