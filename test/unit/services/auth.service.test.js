import { describe, it, expect, jest, beforeEach } from '@jest/globals';

// Mock argon2
const mockArgon2 = {
  hash: jest.fn(),
  verify: jest.fn(),
};

jest.unstable_mockModule('argon2', () => mockArgon2);

// Mock jwt
const mockJwt = {
  sign: jest.fn(),
};

jest.unstable_mockModule('jsonwebtoken', () => ({ default: mockJwt }));

// Mock repositories
jest.unstable_mockModule('../../../src/api/repositories/auth.repository.js', () => ({
  findUserByEmail: jest.fn(),
  findUserByNickName: jest.fn(),
  createUser: jest.fn(),
}));

jest.unstable_mockModule('../../../src/api/repositories/token.repository.js', () => ({
  findUserByRefreshToken: jest.fn(),
  updateRefreshToken: jest.fn(),
}));

const authService = await import('../../../src/api/services/auth.service.js');
const authRepository = await import('../../../src/api/repositories/auth.repository.js');
const tokenRepository = await import('../../../src/api/repositories/token.repository.js');

describe('Auth Service Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.JWT_SECRET = 'test-secret';
    process.env.JWT_EXPIRES_IN = '1d';
    process.env.REFRESH_TOKEN_EXPIRES_IN = '7d';
  });

  describe('signup', () => {
    it('새로운 사용자를 등록하고 토큰을 발급해야 함', async () => {
      const mockUser = {
        user_id: 'user-123',
        email: 'test@example.com',
        nick_name: '테스트유저',
        role: 'USER',
      };

      authRepository.findUserByEmail.mockResolvedValue(null);
      authRepository.findUserByNickName.mockResolvedValue(null);
      mockArgon2.hash.mockResolvedValue('hashed-password');
      authRepository.createUser.mockResolvedValue(mockUser);
      mockJwt.sign.mockReturnValueOnce('access-token').mockReturnValueOnce('refresh-token');
      tokenRepository.updateRefreshToken.mockResolvedValue();

      const result = await authService.signup('test@example.com', 'password123', '테스트유저');

      expect(authRepository.findUserByEmail).toHaveBeenCalledWith('test@example.com');
      expect(authRepository.findUserByNickName).toHaveBeenCalledWith('테스트유저');
      expect(mockArgon2.hash).toHaveBeenCalledWith('password123');
      expect(authRepository.createUser).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'hashed-password',
        nick_name: '테스트유저',
        role: 'USER',
        refresh_token: '',
      });

      expect(result.userId).toBe('user-123');
      expect(result.email).toBe('test@example.com');
      expect(result.nickName).toBe('테스트유저');
      expect(result.role).toBe('USER');
      expect(result.accessToken).toBe('access-token');
      expect(result.refreshToken).toBe('refresh-token');
    });

    it('이미 등록된 이메일이면 에러를 던져야 함', async () => {
      authRepository.findUserByEmail.mockResolvedValue({ email: 'test@example.com' });

      await expect(
        authService.signup('test@example.com', 'password123', '테스트유저')
      ).rejects.toThrow('이미 등록된 이메일입니다.');

      expect(authRepository.createUser).not.toHaveBeenCalled();
    });

    it('이미 사용 중인 닉네임이면 에러를 던져야 함', async () => {
      authRepository.findUserByEmail.mockResolvedValue(null);
      authRepository.findUserByNickName.mockResolvedValue({ nick_name: '테스트유저' });

      await expect(
        authService.signup('test@example.com', 'password123', '테스트유저')
      ).rejects.toThrow('이미 사용 중인 닉네임입니다.');

      expect(authRepository.createUser).not.toHaveBeenCalled();
    });
  });

  describe('login', () => {
    it('올바른 이메일과 비밀번호로 로그인해야 함', async () => {
      const mockUser = {
        user_id: 'user-123',
        email: 'test@example.com',
        nick_name: '테스트유저',
        role: 'USER',
        password: 'hashed-password',
        isDelete: false,
      };

      authRepository.findUserByEmail.mockResolvedValue(mockUser);
      mockArgon2.verify.mockResolvedValue(true);
      mockJwt.sign.mockReturnValueOnce('access-token').mockReturnValueOnce('refresh-token');
      tokenRepository.updateRefreshToken.mockResolvedValue();

      const result = await authService.login('test@example.com', 'password123');

      expect(authRepository.findUserByEmail).toHaveBeenCalledWith('test@example.com');
      expect(mockArgon2.verify).toHaveBeenCalledWith('hashed-password', 'password123');
      expect(tokenRepository.updateRefreshToken).toHaveBeenCalledWith('user-123', 'refresh-token');

      expect(result.userId).toBe('user-123');
      expect(result.email).toBe('test@example.com');
      expect(result.nickName).toBe('테스트유저');
      expect(result.accessToken).toBe('access-token');
      expect(result.refreshToken).toBe('refresh-token');
    });

    it('존재하지 않는 사용자는 에러를 던져야 함', async () => {
      authRepository.findUserByEmail.mockResolvedValue(null);

      await expect(
        authService.login('notfound@example.com', 'password123')
      ).rejects.toThrow('존재하지 않는 사용자입니다.');
    });

    it('삭제된 사용자는 에러를 던져야 함', async () => {
      authRepository.findUserByEmail.mockResolvedValue({
        user_id: 'user-123',
        isDelete: true,
      });

      await expect(
        authService.login('deleted@example.com', 'password123')
      ).rejects.toThrow('존재하지 않는 사용자입니다.');
    });

    it('비밀번호가 틀리면 에러를 던져야 함', async () => {
      const mockUser = {
        user_id: 'user-123',
        password: 'hashed-password',
        isDelete: false,
      };

      authRepository.findUserByEmail.mockResolvedValue(mockUser);
      mockArgon2.verify.mockResolvedValue(false);

      await expect(
        authService.login('test@example.com', 'wrong-password')
      ).rejects.toThrow('비밀번호가 올바르지 않습니다.');
    });
  });

  describe('generateTokens', () => {
    it('액세스 토큰과 리프레시 토큰을 생성해야 함', async () => {
      const mockUser = {
        user_id: 'user-123',
        role: 'USER',
      };

      mockJwt.sign.mockReturnValueOnce('access-token').mockReturnValueOnce('refresh-token');
      tokenRepository.updateRefreshToken.mockResolvedValue();

      const result = await authService.generateTokens(mockUser);

      expect(mockJwt.sign).toHaveBeenCalledTimes(2);
      expect(mockJwt.sign).toHaveBeenCalledWith(
        { userId: 'user-123', role: 'USER' },
        'test-secret',
        { expiresIn: '1d' }
      );
      expect(mockJwt.sign).toHaveBeenCalledWith(
        { userId: 'user-123' },
        'test-secret',
        { expiresIn: '7d' }
      );

      expect(result.accessToken).toBe('access-token');
      expect(result.refreshToken).toBe('refresh-token');
    });
  });
});
