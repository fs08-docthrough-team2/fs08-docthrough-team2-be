import userRepository from '../repositories/auth.repository';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export async function signup(email, password, nick_name) {
  const existing = await userRepository.findUserByEmail(email);
  if (existing) throw new Error('이미 등록된 이메일입니다.');

  const hashed = await bcrypt.hash(password, 10);
  const user = await userRepository.createUser({
    email,
    password: hashed,
    nick_name,
    role: 'USER',
  });

  return user;
}

export async function login(email, password) {
  const user = await userRepository.findUserByEmail(email);

  if (!user || user.isDelete) throw new Error('존재하지 않는 사용자입니다.');

  const match = await bcrypt.compare(password, user.password);
  if (!match) throw new Error('비밀번호가 올바르지 않습니다.');

  const accessToken = JsonWebTokenError.sign(
    { user_id: user.user_id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN },
  );

  const refreshToken = jwt.sign({ user_id: user.user_id }, process.env.JWT_SECRET, {
    expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN,
  });

  await userRepository.updateRefreshToken(user.user_id, refreshToken);

  return { user, accessToken, refreshToken: refreshToken };
}
