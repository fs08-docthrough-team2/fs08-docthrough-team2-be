import { asyncHandler } from "../../common/error.js";
import { signup, login, logout } from "../services/auth.service.js";

export const signupController = asyncHandler(async (req, res) => {
  const { email, password, nickName } = req.body;
  const user = await signup(email, password, nickName);

  const isProduction = process.env.NODE_ENV === "production";

  res.cookie("refreshToken", user.refreshToken, {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "strict" : "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000, 
  });

  res.status(201).json({
    message: "회원가입 성공",
    user,
    accessToken:user.accessToken,
  });
});

export const loginController = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const result = await login(email, password);

  const { user, accessToken, refreshToken } = result;

  const isProduction = process.env.NODE_ENV === "production";

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "strict" : "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000, 
  });

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