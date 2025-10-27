import { expressjwt } from 'express-jwt';
import {
  findUserById
} from '../api/repositories/auth.repository.js';

function throwUnauthorizedError() {
  // 인증되지 않은 경우 401 에러를 발생시키는 함수
  const error = new Error('Unauthorized');
  error.code = 401;
  throw error;
}

async function verifySessionLogin(req, res, next) {
  try {
    const { userId } = req.session;
    if (!userId) throwUnauthorizedError();

    const user = await findUserById(userId);
    if (!user || user.isDelete) throwUnauthorizedError();

    req.user = {
      id: user.user_id,
      email: user.email,
      nickName: user.nick_name,
      role: user.role,
    };
    next();
  } catch (error) {
    next(error);
  }
}

const verifyAccessToken = expressjwt({
  secret: process.env.JWT_SECRET,
  algorithms: ['HS256'],
  requestProperty: 'auth',
  getToken: (req) => {
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer ")
    ) {
      return req.headers.authorization.split(" ")[1];
    }
    return null;
  },
});

const verifyRefreshToken = [
  expressjwt({
    secret: process.env.JWT_SECRET,
    algorithms: ['HS256'],
    getToken(req) {
      return req.cookies.refreshToken;
    },
    requestProperty: 'auth',
  }),
  async function checkRefreshToken(req, res, next) {
    try {
      const token = req.cookies.refreshToken;
      if (!token) throwUnauthorizedError();

      const user = await findUserById(req.auth.user_id);
      if (!user || user.refresh_token !== token) {
        const err = new Error('Refresh Token 불일치');
        err.status = 401;
        throw err;
      }

      req.refresh = {
        userId: user.user_id,
        role: user.role,
      };
      next();
    } catch (error) {
      next(error);
    }
  },
];

async function verifyAdmin(req, res, next) {
  try {
    const role = req.auth?.role || req.user?.role;
    if (role !== 'ADMIN') {
      const err = new Error('관리자 권한이 필요합니다!');
      err.status = 403;
      throw err;
    }
    next();
  } catch (error) {
    next(error);
  }
}

export default {
  verifySessionLogin,
  verifyAccessToken,
  verifyRefreshToken,
  verifyAdmin,
};
