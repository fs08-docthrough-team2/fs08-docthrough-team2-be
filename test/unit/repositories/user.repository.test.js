import { describe, it, expect, jest, beforeEach } from '@jest/globals';

// Prisma Mock
const mockPrisma = {
  user: {
    findUnique: jest.fn(),
    update: jest.fn(),
  },
  challenge: {
    findMany: jest.fn(),
  },
  attend: {
    findMany: jest.fn(),
  },
};

jest.unstable_mockModule('../../../src/config/prisma.config.js', () => ({
  default: mockPrisma,
}));

const userRepository = await import(
  '../../../src/api/repositories/user.repository.js'
);

describe('User Repository Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('findUserProfileByToken', () => {
    it('토큰으로 사용자 프로필을 조회해야 함', async () => {
      const mockProfile = {
        user_id: 'user-123',
        email: 'test@example.com',
        nick_name: 'TestUser',
        role: 'USER',
      };

      mockPrisma.user.findUnique.mockResolvedValue(mockProfile);

      const result = await userRepository.findUserProfileByToken('user-123');

      expect(mockPrisma.user.findUnique).toHaveBeenCalledTimes(1);
      expect(mockPrisma.user.findUnique).toHaveBeenCalledWith({
        where: { user_id: 'user-123' },
        select: {
          user_id: true,
          email: true,
          nick_name: true,
          role: true,
        },
      });
      expect(result).toEqual(mockProfile);
    });

    it('존재하지 않는 사용자는 null을 반환해야 함', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null);

      const result = await userRepository.findUserProfileByToken('non-existent');

      expect(result).toBeNull();
    });

    it('올바른 필드만 select해야 함', async () => {
      mockPrisma.user.findUnique.mockResolvedValue({
        user_id: 'user-123',
        email: 'test@example.com',
        nick_name: 'TestUser',
        role: 'ADMIN',
      });

      await userRepository.findUserProfileByToken('user-123');

      const callArgs = mockPrisma.user.findUnique.mock.calls[0][0];
      expect(callArgs.select.user_id).toBe(true);
      expect(callArgs.select.email).toBe(true);
      expect(callArgs.select.nick_name).toBe(true);
      expect(callArgs.select.role).toBe(true);
      expect(callArgs.select.password).toBeUndefined();
    });
  });

  describe('updateUser', () => {
    it('사용자 정보를 업데이트해야 함', async () => {
      const updateData = {
        nick_name: 'UpdatedNick',
      };

      const mockUpdatedUser = {
        user_id: 'user-123',
        nick_name: 'UpdatedNick',
        role: 'USER',
      };

      mockPrisma.user.update.mockResolvedValue(mockUpdatedUser);

      const result = await userRepository.updateUser('user-123', updateData);

      expect(mockPrisma.user.update).toHaveBeenCalledTimes(1);
      expect(mockPrisma.user.update).toHaveBeenCalledWith({
        where: { user_id: 'user-123' },
        data: updateData,
        select: {
          user_id: true,
          nick_name: true,
          role: true,
        },
      });
      expect(result).toEqual(mockUpdatedUser);
    });

    it('여러 필드를 동시에 업데이트해야 함', async () => {
      const updateData = {
        nick_name: 'NewNick',
        role: 'ADMIN',
      };

      const mockUpdatedUser = {
        user_id: 'user-123',
        nick_name: 'NewNick',
        role: 'ADMIN',
      };

      mockPrisma.user.update.mockResolvedValue(mockUpdatedUser);

      const result = await userRepository.updateUser('user-123', updateData);

      expect(mockPrisma.user.update).toHaveBeenCalledWith({
        where: { user_id: 'user-123' },
        data: updateData,
        select: {
          user_id: true,
          nick_name: true,
          role: true,
        },
      });
      expect(result).toEqual(mockUpdatedUser);
    });

    it('올바른 필드만 select해야 함', async () => {
      mockPrisma.user.update.mockResolvedValue({
        user_id: 'user-123',
        nick_name: 'TestUser',
        role: 'USER',
      });

      await userRepository.updateUser('user-123', { nick_name: 'TestUser' });

      const callArgs = mockPrisma.user.update.mock.calls[0][0];
      expect(callArgs.select.user_id).toBe(true);
      expect(callArgs.select.nick_name).toBe(true);
      expect(callArgs.select.role).toBe(true);
      expect(callArgs.select.email).toBeUndefined();
      expect(callArgs.select.password).toBeUndefined();
    });
  });

  describe('deleteUser', () => {
    it('사용자를 soft delete해야 함', async () => {
      const mockDeletedUser = {
        user_id: 'user-123',
      };

      mockPrisma.user.update.mockResolvedValue(mockDeletedUser);

      const result = await userRepository.deleteUser('user-123');

      expect(mockPrisma.user.update).toHaveBeenCalledTimes(1);
      expect(mockPrisma.user.update).toHaveBeenCalledWith({
        where: { user_id: 'user-123' },
        data: { isDelete: true },
        select: {
          user_id: true,
        },
      });
      expect(result).toEqual(mockDeletedUser);
    });

    it('isDelete를 true로 설정해야 함', async () => {
      mockPrisma.user.update.mockResolvedValue({ user_id: 'user-123' });

      await userRepository.deleteUser('user-123');

      const callArgs = mockPrisma.user.update.mock.calls[0][0];
      expect(callArgs.data.isDelete).toBe(true);
    });

    it('user_id만 반환해야 함', async () => {
      mockPrisma.user.update.mockResolvedValue({ user_id: 'user-123' });

      await userRepository.deleteUser('user-123');

      const callArgs = mockPrisma.user.update.mock.calls[0][0];
      expect(callArgs.select.user_id).toBe(true);
      expect(Object.keys(callArgs.select).length).toBe(1);
    });
  });

  describe('findUserProfileRepository', () => {
    it('사용자 프로필과 챌린지/작업 개수를 함께 조회해야 함', async () => {
      const mockUserData = {
        email: 'test@example.com',
        nick_name: 'TestUser',
        role: 'USER',
      };

      const mockChallenges = [
        { challenge_id: 'ch-1' },
        { challenge_id: 'ch-2' },
        { challenge_id: 'ch-3' },
      ];

      const mockAttends = [
        { attend_id: 'att-1', is_delete: false },
        { attend_id: 'att-2', is_delete: false },
      ];

      mockPrisma.user.findUnique.mockResolvedValue(mockUserData);
      mockPrisma.challenge.findMany.mockResolvedValue(mockChallenges);
      mockPrisma.attend.findMany.mockResolvedValue(mockAttends);

      const result = await userRepository.findUserProfileRepository('user-123');

      expect(mockPrisma.user.findUnique).toHaveBeenCalledWith({
        where: { user_id: 'user-123' },
        select: {
          email: true,
          nick_name: true,
          role: true,
        },
      });

      expect(mockPrisma.challenge.findMany).toHaveBeenCalledWith({
        where: { user_id: 'user-123' },
      });

      expect(mockPrisma.attend.findMany).toHaveBeenCalledWith({
        where: {
          user_id: 'user-123',
          is_delete: false,
        },
      });

      expect(result).toEqual({
        email: 'test@example.com',
        nick_name: 'TestUser',
        role: 'USER',
        challengeCount: 3,
        workCount: 2,
      });
    });

    it('삭제된 출석은 workCount에 포함되지 않아야 함', async () => {
      mockPrisma.user.findUnique.mockResolvedValue({
        email: 'test@example.com',
        nick_name: 'TestUser',
        role: 'USER',
      });

      mockPrisma.challenge.findMany.mockResolvedValue([]);

      mockPrisma.attend.findMany.mockResolvedValue([
        { attend_id: 'att-1', is_delete: false },
      ]);

      const result = await userRepository.findUserProfileRepository('user-123');

      expect(mockPrisma.attend.findMany).toHaveBeenCalledWith({
        where: {
          user_id: 'user-123',
          is_delete: false,
        },
      });

      expect(result.workCount).toBe(1);
    });
  });

  describe('getUserWorkIdRepository', () => {
    it('특정 챌린지의 출석 ID 목록을 is_delete와 함께 조회해야 함', async () => {
      const mockAttendData = [
        { attend_id: 'attend-1', is_delete: false },
        { attend_id: 'attend-2', is_delete: false },
        { attend_id: 'attend-3', is_delete: true },
      ];

      mockPrisma.attend.findMany.mockResolvedValue(mockAttendData);

      const result = await userRepository.getUserWorkIdRepository(
        'user-123',
        'challenge-456'
      );

      expect(mockPrisma.attend.findMany).toHaveBeenCalledWith({
        where: {
          user_id: 'user-123',
          challenge_id: 'challenge-456',
        },
        select: {
          attend_id: true,
          is_delete: true,
        },
      });

      expect(result).toEqual(mockAttendData);
    });

    it('빈 배열을 반환할 수 있어야 함', async () => {
      mockPrisma.attend.findMany.mockResolvedValue([]);

      const result = await userRepository.getUserWorkIdRepository(
        'user-123',
        'challenge-456'
      );

      expect(result).toEqual([]);
    });

    it('is_delete 필드를 포함해야 함', async () => {
      const mockData = [{ attend_id: 'att-1', is_delete: true }];
      mockPrisma.attend.findMany.mockResolvedValue(mockData);

      await userRepository.getUserWorkIdRepository('user-123', 'challenge-456');

      const callArgs = mockPrisma.attend.findMany.mock.calls[0][0];
      expect(callArgs.select.attend_id).toBe(true);
      expect(callArgs.select.is_delete).toBe(true);
    });
  });
});
