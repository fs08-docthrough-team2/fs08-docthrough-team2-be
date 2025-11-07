import { describe, it, expect, jest, beforeEach } from '@jest/globals';

// Prisma Mock
const mockPrisma = {
  user: {
    findFirst: jest.fn(),
    update: jest.fn(),
  },
};

jest.unstable_mockModule('../../../src/config/prisma.config.js', () => ({
  default: mockPrisma,
}));

const tokenRepository = await import(
  '../../../src/api/repositories/token.repository.js'
);

describe('Token Repository Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('findUserByRefreshToken', () => {
    it('refresh token으로 사용자를 조회해야 함', async () => {
      const mockUser = {
        user_id: 'user-123',
        email: 'test@example.com',
        nick_name: 'TestUser',
        role: 'USER',
        refresh_token: 'valid-refresh-token',
      };

      mockPrisma.user.findFirst.mockResolvedValue(mockUser);

      const result = await tokenRepository.findUserByRefreshToken('valid-refresh-token');

      expect(mockPrisma.user.findFirst).toHaveBeenCalledTimes(1);
      expect(mockPrisma.user.findFirst).toHaveBeenCalledWith({
        where: { refresh_token: 'valid-refresh-token' },
        select: {
          user_id: true,
          email: true,
          nick_name: true,
          role: true,
          refresh_token: true,
        },
      });
      expect(result).toEqual(mockUser);
    });

    it('존재하지 않는 토큰은 null을 반환해야 함', async () => {
      mockPrisma.user.findFirst.mockResolvedValue(null);

      const result = await tokenRepository.findUserByRefreshToken('invalid-token');

      expect(result).toBeNull();
    });

    it('null 토큰은 null을 반환해야 함', async () => {
      const result = await tokenRepository.findUserByRefreshToken(null);

      expect(mockPrisma.user.findFirst).not.toHaveBeenCalled();
      expect(result).toBeNull();
    });

    it('undefined 토큰은 null을 반환해야 함', async () => {
      const result = await tokenRepository.findUserByRefreshToken(undefined);

      expect(mockPrisma.user.findFirst).not.toHaveBeenCalled();
      expect(result).toBeNull();
    });

    it('빈 문자열 토큰은 null을 반환해야 함', async () => {
      const result = await tokenRepository.findUserByRefreshToken('');

      expect(mockPrisma.user.findFirst).not.toHaveBeenCalled();
      expect(result).toBeNull();
    });

    it('공백만 있는 토큰은 null을 반환해야 함', async () => {
      const result = await tokenRepository.findUserByRefreshToken('   ');

      expect(mockPrisma.user.findFirst).not.toHaveBeenCalled();
      expect(result).toBeNull();
    });

    it('숫자 타입 토큰은 null을 반환해야 함', async () => {
      const result = await tokenRepository.findUserByRefreshToken(123);

      expect(mockPrisma.user.findFirst).not.toHaveBeenCalled();
      expect(result).toBeNull();
    });

    it('객체 타입 토큰은 null을 반환해야 함', async () => {
      const result = await tokenRepository.findUserByRefreshToken({});

      expect(mockPrisma.user.findFirst).not.toHaveBeenCalled();
      expect(result).toBeNull();
    });

    it('올바른 필드만 select해야 함', async () => {
      mockPrisma.user.findFirst.mockResolvedValue(null);

      await tokenRepository.findUserByRefreshToken('some-token');

      const callArgs = mockPrisma.user.findFirst.mock.calls[0][0];
      expect(callArgs.select.user_id).toBe(true);
      expect(callArgs.select.email).toBe(true);
      expect(callArgs.select.nick_name).toBe(true);
      expect(callArgs.select.role).toBe(true);
      expect(callArgs.select.refresh_token).toBe(true);
      expect(callArgs.select.password).toBeUndefined();
    });
  });

  describe('updateRefreshToken', () => {
    it('refresh token을 업데이트해야 함', async () => {
      const mockUpdatedUser = {
        user_id: 'user-123',
        refresh_token: 'new-refresh-token',
      };

      mockPrisma.user.update.mockResolvedValue(mockUpdatedUser);

      const result = await tokenRepository.updateRefreshToken(
        'user-123',
        'new-refresh-token'
      );

      expect(mockPrisma.user.update).toHaveBeenCalledTimes(1);
      expect(mockPrisma.user.update).toHaveBeenCalledWith({
        where: { user_id: 'user-123' },
        data: { refresh_token: 'new-refresh-token' },
        select: {
          user_id: true,
          refresh_token: true,
        },
      });
      expect(result).toEqual(mockUpdatedUser);
    });

    it('null 토큰으로 업데이트할 수 있어야 함', async () => {
      const mockUpdatedUser = {
        user_id: 'user-123',
        refresh_token: null,
      };

      mockPrisma.user.update.mockResolvedValue(mockUpdatedUser);

      const result = await tokenRepository.updateRefreshToken('user-123', null);

      expect(mockPrisma.user.update).toHaveBeenCalledWith({
        where: { user_id: 'user-123' },
        data: { refresh_token: null },
        select: {
          user_id: true,
          refresh_token: true,
        },
      });
      expect(result.refresh_token).toBeNull();
    });

    it('빈 문자열 토큰으로 업데이트할 수 있어야 함', async () => {
      const mockUpdatedUser = {
        user_id: 'user-123',
        refresh_token: '',
      };

      mockPrisma.user.update.mockResolvedValue(mockUpdatedUser);

      const result = await tokenRepository.updateRefreshToken('user-123', '');

      expect(mockPrisma.user.update).toHaveBeenCalledWith({
        where: { user_id: 'user-123' },
        data: { refresh_token: '' },
        select: {
          user_id: true,
          refresh_token: true,
        },
      });
      expect(result.refresh_token).toBe('');
    });

    it('올바른 필드만 select해야 함', async () => {
      mockPrisma.user.update.mockResolvedValue({
        user_id: 'user-123',
        refresh_token: 'token',
      });

      await tokenRepository.updateRefreshToken('user-123', 'token');

      const callArgs = mockPrisma.user.update.mock.calls[0][0];
      expect(callArgs.select.user_id).toBe(true);
      expect(callArgs.select.refresh_token).toBe(true);
      expect(Object.keys(callArgs.select).length).toBe(2);
    });
  });
});
