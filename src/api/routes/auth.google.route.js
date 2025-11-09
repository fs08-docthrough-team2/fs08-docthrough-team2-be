import express from 'express';
import passport from 'passport';
import { cookiesOption } from '../../middleware/auth.middleware.js';

const router = express.Router();

router.get('/google/login', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get(
  '/google/callback',
  passport.authenticate('google', {
    session: false,
    failureRedirect: '/api/auth/google/login-failed',
  }),
  (req, res) => {
    const { user, jwtAccessToken, jwtRefreshToken } = req.user;

    if (!jwtAccessToken || !jwtRefreshToken) {
      return res.status(500).json({
        success: false,
        message: '토큰 생성 실패',
      });
    }

    // res.cookie("refreshToken", jwtRefreshToken, cookiesOption);

    // res.status(200).json({
    //   success: true,
    //   data: {
    //     user: {
    //       userId: user.user_id,
    //       email: user.email,
    //       nickName: user.nick_name,
    //       role: user.role,
    //       provider: user.provider,
    //     },
    //     accessToken: jwtAccessToken,
    //     refreshToken: jwtRefreshToken,
    //   },
    //   message: "Google 로그인 성공",
    // });

    res.cookie('refreshToken', jwtRefreshToken, cookiesOption);

    return res.status(302).redirect(`${process.env.FRONTEND_URL}/auth/callback`);
  },
);

router.get('/google/login-failed', (req, res) => {
  res.status(401).json({ success: false, message: 'Google 로그인 실패' });
});

export default router;
