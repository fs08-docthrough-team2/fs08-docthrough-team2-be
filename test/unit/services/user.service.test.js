import { describe, it, expect, jest, beforeEach } from '@jest/globals';

// Mock argon2
const mockArgon2 = {
  hash: jest.fn(),
};

jest.unstable_mockModule('argon2', () => ({ default: mockArgon2 }));

// Mock jwt
const mockJwt = {
  verify: jest.fn(),
};

jest.unstable_mockModule('jsonwebtoken', () => ({ default: mockJwt }));

// Mock repositories
jest.unstable_mockModule('../../../src/api/repositories/user.repository.js', () => ({
  findUserProfileByToken: jest.fn(),
  updateUser: jest.fn(),
  deleteUser: jest.fn(),
  findUserProfileRepository: jest.fn(),
  getUserWorkIdRepository: jest.fn(),
}));

jest.unstable_mockModule('../../../src/api/repositories/token.repository.js', () => ({
  updateRefreshToken: jest.fn(),
}));

// Mock prisma
jest.unstable_mockModule('../../../src/config/prisma.config.js', () => ({
  default: {
    challenge: {
      findUnique: jest.fn(),
    },
  },
}));

const userService = await import('../../../src/api/services/user.service.js');
const userRepository = await import('../../../src/api/repositories/user.repository.js');
const tokenRepository = await import('../../../src/api/repositories/token.repository.js');
const prisma = await import('../../../src/config/prisma.config.js');

describe('User Service Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.JWT_SECRET = 'test-secret';
  });

  describe('getUserProfileFromToken', () => {
    it('토큰 페이로드로부터 사용자 프로필을 조회해야 함', async () => {
      const mockUser = {
        user_id: 'user-123',
        nick_name: '테스트유저',
        role: 'USER',
      };

      userRepository.findUserProfileByToken.mockResolvedValue(mockUser);

      const result = await userService.getUserProfileFromToken({ userId: 'user-123' });

      expect(userRepository.findUserProfileByToken).toHaveBeenCalledWith('user-123');
      expect(result).toEqual({
        user: {
          userId: 'user-123',
          email: undefined,
          nickName: '테스트유저',
          role: 'USER',
        },
      });
    });

    it('사용자를 찾을 수 없으면 에러를 던져야 함', async () => {
      userRepository.findUserProfileByToken.mockResolvedValue(null);

      await expect(
        userService.getUserProfileFromToken({ userId: 'invalid-id' })
      ).rejects.toThrow(/사용자.*찾을 수 없습니다/);
    });
  });

  describe('getUserFromToken', () => {
    it('쿠키의 accessToken으로 사용자 정보를 조회해야 함', async () => {
      const mockReq = {
        cookies: {
          accessToken: 'valid-token',
        },
        headers: {},
      };

      const mockUser = {
        user_id: 'user-123',
        nick_name: '테스트유저',
        role: 'USER',
      };

      mockJwt.verify.mockReturnValue({ userId: 'user-123', role: 'USER' });
      userRepository.findUserProfileByToken.mockResolvedValue(mockUser);

      const result = await userService.getUserFromToken(mockReq);

      expect(mockJwt.verify).toHaveBeenCalledWith('valid-token', 'test-secret');
      expect(result).toEqual({
        userId: 'user-123',
        email: undefined,
        nickName: '테스트유저',
        role: 'USER',
      });
    });

    it('Authorization 헤더의 Bearer 토큰으로 사용자 정보를 조회해야 함', async () => {
      const mockReq = {
        cookies: {},
        headers: {
          authorization: 'Bearer valid-token',
        },
      };

      const mockUser = {
        user_id: 'user-123',
        nick_name: '테스트유저',
        role: 'EXPERT',
      };

      mockJwt.verify.mockReturnValue({ userId: 'user-123', role: 'EXPERT' });
      userRepository.findUserProfileByToken.mockResolvedValue(mockUser);

      const result = await userService.getUserFromToken(mockReq);

      expect(mockJwt.verify).toHaveBeenCalledWith('valid-token', 'test-secret');
      expect(result).toEqual({
        userId: 'user-123',
        email: undefined,
        nickName: '테스트유저',
        role: 'EXPERT',
      });
    });

    it('토큰이 없으면 에러를 던져야 함', async () => {
      const mockReq = {
        cookies: {},
        headers: {},
      };

      await expect(userService.getUserFromToken(mockReq)).rejects.toThrow(
        /인증 토큰.*제공되지 않았습니다/
      );
    });

    it('유효하지 않은 토큰이면 에러를 던져야 함', async () => {
      const mockReq = {
        cookies: {
          accessToken: 'invalid-token',
        },
        headers: {},
      };

      mockJwt.verify.mockImplementation(() => {
        throw new Error('jwt malformed');
      });

      await expect(userService.getUserFromToken(mockReq)).rejects.toThrow();
    });
  });

  describe('updateUserProfile', () => {
    it('닉네임만 수정해야 함', async () => {
      const mockReq = {
        cookies: {
          accessToken: 'valid-token',
        },
        headers: {},
        body: {
          nickName: '새닉네임',
        },
      };

      const mockUser = {
        user_id: 'user-123',
        nick_name: '테스트유저',
        role: 'USER',
      };

      const updatedUser = {
        user_id: 'user-123',
        nick_name: '새닉네임',
        role: 'USER',
      };

      mockJwt.verify.mockReturnValue({ userId: 'user-123', role: 'USER' });
      userRepository.findUserProfileByToken.mockResolvedValue(mockUser);
      userRepository.updateUser.mockResolvedValue(updatedUser);

      const result = await userService.updateUserProfile(mockReq);

      expect(userRepository.updateUser).toHaveBeenCalledWith('user-123', {
        nick_name: '새닉네임',
      });
      expect(result.message).toBe('내 정보 수정 완료');
      expect(result.user).toEqual(updatedUser);
    });

    it('비밀번호만 수정해야 함', async () => {
      const mockReq = {
        cookies: {
          accessToken: 'valid-token',
        },
        headers: {},
        body: {
          password: 'newPassword123',
        },
      };

      const mockUser = {
        user_id: 'user-123',
        nick_name: '테스트유저',
        role: 'USER',
      };

      mockJwt.verify.mockReturnValue({ userId: 'user-123', role: 'USER' });
      userRepository.findUserProfileByToken.mockResolvedValue(mockUser);
      mockArgon2.hash.mockResolvedValue('hashed-new-password');
      userRepository.updateUser.mockResolvedValue(mockUser);

      await userService.updateUserProfile(mockReq);

      expect(mockArgon2.hash).toHaveBeenCalledWith('newPassword123');
      expect(userRepository.updateUser).toHaveBeenCalledWith('user-123', {
        password: 'hashed-new-password',
      });
    });

    it('닉네임과 비밀번호를 모두 수정해야 함', async () => {
      const mockReq = {
        cookies: {
          accessToken: 'valid-token',
        },
        headers: {},
        body: {
          nickName: '새닉네임',
          password: 'newPassword123',
        },
      };

      const mockUser = {
        user_id: 'user-123',
        nick_name: '테스트유저',
        role: 'USER',
      };

      mockJwt.verify.mockReturnValue({ userId: 'user-123', role: 'USER' });
      userRepository.findUserProfileByToken.mockResolvedValue(mockUser);
      mockArgon2.hash.mockResolvedValue('hashed-new-password');
      userRepository.updateUser.mockResolvedValue(mockUser);

      await userService.updateUserProfile(mockReq);

      expect(userRepository.updateUser).toHaveBeenCalledWith('user-123', {
        nick_name: '새닉네임',
        password: 'hashed-new-password',
      });
    });

    it('수정할 항목이 없으면 에러를 던져야 함', async () => {
      const mockReq = {
        cookies: {
          accessToken: 'valid-token',
        },
        headers: {},
        body: {},
      };

      const mockUser = {
        user_id: 'user-123',
        nick_name: '테스트유저',
        role: 'USER',
      };

      mockJwt.verify.mockReturnValue({ userId: 'user-123', role: 'USER' });
      userRepository.findUserProfileByToken.mockResolvedValue(mockUser);

      await expect(userService.updateUserProfile(mockReq)).rejects.toThrow(
        /수정할 항목.*제공되지 않았습니다/
      );
    });
  });

  describe('deleteUserProfile', () => {
    it('사용자를 탈퇴시켜야 함', async () => {
      const mockReq = {
        cookies: {
          accessToken: 'valid-token',
        },
        headers: {},
      };

      const mockUser = {
        user_id: 'user-123',
        nick_name: '테스트유저',
        role: 'USER',
        isDelete: false,
      };

      mockJwt.verify.mockReturnValue({ userId: 'user-123', role: 'USER' });
      userRepository.findUserProfileByToken.mockResolvedValue(mockUser);
      userRepository.deleteUser.mockResolvedValue();
      tokenRepository.updateRefreshToken.mockResolvedValue();

      const result = await userService.deleteUserProfile(mockReq);

      expect(userRepository.deleteUser).toHaveBeenCalledWith('user-123');
      expect(tokenRepository.updateRefreshToken).toHaveBeenCalledWith('user-123', '');
      expect(result.message).toBe('회원 탈퇴');
    });

    it('존재하지 않는 사용자는 에러를 던져야 함', async () => {
      const mockReq = {
        cookies: {
          accessToken: 'valid-token',
        },
        headers: {},
      };

      mockJwt.verify.mockReturnValue({ userId: 'user-123', role: 'USER' });
      userRepository.findUserProfileByToken.mockResolvedValue(null);

      await expect(userService.deleteUserProfile(mockReq)).rejects.toThrow(
        /사용자.*찾을 수 없습니다/
      );
    });

    it('이미 탈퇴한 사용자는 에러를 던져야 함', async () => {
      const mockReq = {
        cookies: {
          accessToken: 'valid-token',
        },
        headers: {},
      };

      const mockUser = {
        user_id: 'user-123',
        nick_name: '테스트유저',
        role: 'USER',
        isDelete: true,
      };

      mockJwt.verify.mockReturnValue({ userId: 'user-123', role: 'USER' });
      userRepository.findUserProfileByToken.mockResolvedValue(mockUser);

      await expect(userService.deleteUserProfile(mockReq)).rejects.toThrow(
        /이미 탈퇴.*계정입니다/
      );
    });
  });

  describe('getUserprofile', () => {
    it('사용자 프로필을 challengeCount와 workCount와 함께 조회해야 함', async () => {
      const mockUserData = {
        email: 'test@example.com',
        nick_name: '테스트유저',
        role: 'USER',
        challengeCount: 5,
        workCount: 10,
      };

      userRepository.findUserProfileRepository.mockResolvedValue(mockUserData);

      const result = await userService.getUserprofile({ userId: 'user-123' });

      expect(userRepository.findUserProfileRepository).toHaveBeenCalledWith('user-123');
      expect(result).toEqual({
        userId: 'user-123',
        email: 'test@example.com',
        nickName: '테스트유저',
        role: 'USER',
        challengeCount: 5,
        workCount: 10,
      });
    });

    it('사용자를 찾을 수 없으면 에러를 던져야 함', async () => {
      userRepository.findUserProfileRepository.mockResolvedValue(null);

      await expect(
        userService.getUserprofile({ userId: 'invalid-id' })
      ).rejects.toThrow(/사용자.*찾을 수 없습니다/);
    });
  });

  describe('getUserWorkId', () => {
    it('본인의 챌린지에 대한 출석 ID 목록을 is_delete와 함께 조회해야 함', async () => {
      const userId = 'user-123';
      const challengeId = 'challenge-456';

      prisma.default.challenge.findUnique.mockResolvedValue({
        user_id: userId,
      });

      userRepository.getUserWorkIdRepository.mockResolvedValue([
        { attend_id: 'attend-1', is_delete: false },
        { attend_id: 'attend-2', is_delete: false },
        { attend_id: 'attend-3', is_delete: true },
      ]);

      const result = await userService.getUserWorkId(userId, challengeId);

      expect(prisma.default.challenge.findUnique).toHaveBeenCalledWith({
        where: { challenge_id: challengeId },
        select: { user_id: true },
      });
      expect(userRepository.getUserWorkIdRepository).toHaveBeenCalledWith(userId, challengeId);
      expect(result).toEqual([
        { attend_id: 'attend-1', is_delete: false },
        { attend_id: 'attend-2', is_delete: false },
        { attend_id: 'attend-3', is_delete: true },
      ]);
    });

    it('다른 사용자의 챌린지에 대한 출석 ID 조회 시 에러를 던져야 함', async () => {
      const userId = 'user-123';
      const challengeId = 'challenge-456';

      prisma.default.challenge.findUnique.mockResolvedValue({
        user_id: 'different-user-id',
      });

      await expect(
        userService.getUserWorkId(userId, challengeId)
      ).rejects.toThrow(/본인의 챌린지.*조회할 수 있습니다/);
    });
  });
});
