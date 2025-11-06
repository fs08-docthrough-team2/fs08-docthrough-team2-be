import { describe, it, expect, jest, beforeEach } from '@jest/globals';

// Prisma Mock
const mockPrisma = {
  user: {
    findUnique: jest.fn(),
    update: jest.fn(),
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
        nick_name: 'TestUser',
        role: 'ADMIN',
      });

      await userRepository.findUserProfileByToken('user-123');

      const callArgs = mockPrisma.user.findUnique.mock.calls[0][0];
      expect(callArgs.select.user_id).toBe(true);
      expect(callArgs.select.nick_name).toBe(true);
      expect(callArgs.select.role).toBe(true);
      expect(callArgs.select.email).toBeUndefined();
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
});
