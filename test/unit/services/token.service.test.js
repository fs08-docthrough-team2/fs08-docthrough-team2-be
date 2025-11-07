import { describe, it, expect, jest, beforeEach } from '@jest/globals';

// Mock jwt
const mockJwt = {
  verify: jest.fn(),
  sign: jest.fn(),
};

jest.unstable_mockModule('jsonwebtoken', () => ({ default: mockJwt }));

// Mock repositories
jest.unstable_mockModule('../../../src/api/repositories/token.repository.js', () => ({
  findUserByRefreshToken: jest.fn(),
  updateRefreshToken: jest.fn(),
}));

const tokenService = await import('../../../src/api/services/token.service.js');
const tokenRepository = await import('../../../src/api/repositories/token.repository.js');

describe('Token Service Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.JWT_SECRET = 'test-secret';
    process.env.JWT_EXPIRES_IN = '1d';
    process.env.REFRESH_TOKEN_EXPIRES_IN = '7d';
  });

  describe('verifyAccessToken', () => {
    it('유효한 Refresh Token으로 사용자 정보를 반환해야 함', async () => {
      const mockUser = {
        user_id: 'user-123',
        email: 'test@example.com',
        nick_name: '테스트유저',
        role: 'USER',
      };

      tokenRepository.findUserByRefreshToken.mockResolvedValue(mockUser);
      mockJwt.verify.mockReturnValue({ userId: 'user-123' });

      const result = await tokenService.verifyAccessToken('valid-refresh-token');

      expect(tokenRepository.findUserByRefreshToken).toHaveBeenCalledWith('valid-refresh-token');
      expect(mockJwt.verify).toHaveBeenCalledWith('valid-refresh-token', 'test-secret');
      expect(result).toEqual({
        user: {
          email: 'test@example.com',
          nickName: '테스트유저',
          role: 'USER',
        },
      });
    });

    it('Refresh Token이 없으면 에러를 던져야 함', async () => {
      await expect(tokenService.verifyAccessToken(null)).rejects.toThrow(
        /Refresh Token.*제공되지 않았습니다/
      );

      await expect(tokenService.verifyAccessToken(undefined)).rejects.toThrow(
        /Refresh Token.*제공되지 않았습니다/
      );

      await expect(tokenService.verifyAccessToken('')).rejects.toThrow(
        /Refresh Token.*제공되지 않았습니다/
      );
    });

    it('유효하지 않은 Refresh Token이면 에러를 던져야 함', async () => {
      tokenRepository.findUserByRefreshToken.mockResolvedValue(null);

      await expect(tokenService.verifyAccessToken('invalid-token')).rejects.toThrow(
        /Refresh Token.*찾을 수 없습니다/
      );
    });

    it('만료된 Refresh Token이면 에러를 던져야 함', async () => {
      const mockUser = {
        user_id: 'user-123',
        email: 'test@example.com',
        nick_name: '테스트유저',
        role: 'USER',
      };

      tokenRepository.findUserByRefreshToken.mockResolvedValue(mockUser);
      mockJwt.verify.mockImplementation(() => {
        throw new Error('jwt expired');
      });

      await expect(tokenService.verifyAccessToken('expired-token')).rejects.toThrow(
        /Refresh Token.*검증에 실패/
      );
    });
  });

  describe('refreshAccessToken', () => {
    it('새로운 Access Token과 Refresh Token을 발급해야 함', async () => {
      const mockUser = {
        user_id: 'user-123',
        email: 'test@example.com',
        nick_name: '테스트유저',
        role: 'USER',
      };

      tokenRepository.findUserByRefreshToken.mockResolvedValue(mockUser);
      mockJwt.verify.mockReturnValue({ userId: 'user-123' });
      mockJwt.sign
        .mockReturnValueOnce('new-access-token')
        .mockReturnValueOnce('new-refresh-token');
      tokenRepository.updateRefreshToken.mockResolvedValue();

      const result = await tokenService.refreshAccessToken('valid-refresh-token');

      expect(tokenRepository.findUserByRefreshToken).toHaveBeenCalledWith('valid-refresh-token');
      expect(mockJwt.verify).toHaveBeenCalledWith('valid-refresh-token', 'test-secret');
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
      expect(tokenRepository.updateRefreshToken).toHaveBeenCalledWith(
        'user-123',
        'new-refresh-token'
      );
      expect(result).toEqual({
        accessToken: 'new-access-token',
        refreshToken: 'new-refresh-token',
        user: {
          email: 'test@example.com',
          nickName: '테스트유저',
          role: 'USER',
        },
      });
    });

    it('Refresh Token이 없으면 에러를 던져야 함', async () => {
      await expect(tokenService.refreshAccessToken(null)).rejects.toThrow(
        /Refresh Token.*제공되지 않았습니다/
      );
    });

    it('유효하지 않은 토큰이면 에러를 던져야 함', async () => {
      tokenRepository.findUserByRefreshToken.mockResolvedValue(null);

      await expect(tokenService.refreshAccessToken('invalid-token')).rejects.toThrow(
        /Refresh Token.*찾을 수 없습니다/
      );
    });

    it('만료된 Refresh Token이면 에러를 던져야 함', async () => {
      const mockUser = {
        user_id: 'user-123',
        email: 'test@example.com',
        nick_name: '테스트유저',
        role: 'USER',
      };

      tokenRepository.findUserByRefreshToken.mockResolvedValue(mockUser);
      mockJwt.verify.mockImplementation(() => {
        throw new Error('jwt expired');
      });

      await expect(tokenService.refreshAccessToken('expired-token')).rejects.toThrow(
        /Refresh Token.*검증에 실패/
      );
    });

    it('환경변수가 없으면 기본값을 사용해야 함', async () => {
      delete process.env.JWT_EXPIRES_IN;
      delete process.env.REFRESH_TOKEN_EXPIRES_IN;

      const mockUser = {
        user_id: 'user-123',
        email: 'test@example.com',
        nick_name: '테스트유저',
        role: 'USER',
      };

      tokenRepository.findUserByRefreshToken.mockResolvedValue(mockUser);
      mockJwt.verify.mockReturnValue({ userId: 'user-123' });
      mockJwt.sign
        .mockReturnValueOnce('new-access-token')
        .mockReturnValueOnce('new-refresh-token');
      tokenRepository.updateRefreshToken.mockResolvedValue();

      await tokenService.refreshAccessToken('valid-refresh-token');

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
    });

    it('EXPERT 역할을 가진 사용자도 정상적으로 토큰을 갱신해야 함', async () => {
      const mockUser = {
        user_id: 'expert-123',
        email: 'expert@example.com',
        nick_name: '전문가',
        role: 'EXPERT',
      };

      tokenRepository.findUserByRefreshToken.mockResolvedValue(mockUser);
      mockJwt.verify.mockReturnValue({ userId: 'expert-123' });
      mockJwt.sign
        .mockReturnValueOnce('new-access-token')
        .mockReturnValueOnce('new-refresh-token');
      tokenRepository.updateRefreshToken.mockResolvedValue();

      const result = await tokenService.refreshAccessToken('valid-refresh-token');

      expect(mockJwt.sign).toHaveBeenCalledWith(
        { userId: 'expert-123', role: 'EXPERT' },
        'test-secret',
        { expiresIn: '1d' }
      );
      expect(result.user.role).toBe('EXPERT');
    });
  });
});
