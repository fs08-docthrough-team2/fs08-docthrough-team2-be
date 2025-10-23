import { asyncHandler } from '../../common/error';
import { signup, login, refreshToken } from '../services/user.services';

export const signupController = asyncHandler(async function (req, res) {
  const { email, password, nickName } = req.body;
  const user = await signup(email, password, nickName);

  res.status(201).json({
    message: '회원 가입 성공',
    user: {
      userId: user.user_id,
      email: user.email,
      nickName: user.nick_name,
      role: user.role,
    },
  });
});

export const loginController = asyncHandler(async function (req, res) {
  const { email, password } = req.body;

  res
    .cookies('refreshToken', refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
    })
    .ststus(200)
    .json({
      message: '로그인 성공',
      user: {
        userId: user.user_id,
        email: user.email,
        nuikName: user.nick_name,
        role: user.role,
      },
      accesToken,
    });
});

export const refreshTokenController = asyncHandler(async function (req, res) {
  const refreshToken = req.cookies.refreshToken;
  const { userId } = req.refresh;
  const { accesToken } = await refreshToken(userId, refreshToken);

  res.status(200).json({
    message: '토큰 재발급 성공',
    accesToken,
  });
});
