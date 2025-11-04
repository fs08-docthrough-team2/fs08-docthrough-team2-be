import { asyncHandler } from "../../middleware/error.middleware.js";
import { signup, login, logout } from "../services/auth.service.js";
import { cookiesOption } from "../../middleware/auth.middleware.js";

export const signupController = asyncHandler(async (req, res) => {
  const { email, password, nickName } = req.body;
  const { user, accessToken, refreshToken } = await signup(email, password, nickName);

  res.cookie("refreshToken", refreshToken, cookiesOption);

  res.status(201).json({
    message: "회원가입 성공",
    user,
    accessToken,
  });
});

export const loginController = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  
  const { user, accessToken, refreshToken } = await login(email, password);

  res.cookie("refreshToken", refreshToken, cookiesOption);

  res.status(200).json({
    message: "로그인 성공",
    user,
    accessToken,
  });
});

export const logoutController = asyncHandler(async (req, res) => {
  const refreshToken = req.cookies?.refreshToken;

  if (!refreshToken) {
    return res.status(401).json({ message: "Refresh Token이 없습니다." });
  }

  // 쿠키 기반 로그아웃 (refreshToken 전달)
  await logout(refreshToken);

  // 쿠키 제거
  res.clearCookie("refreshToken");

  res.status(200).json({
    message: "로그아웃 성공",
  });
});