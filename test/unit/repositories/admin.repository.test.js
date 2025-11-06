import { describe, it, expect, jest, beforeEach } from '@jest/globals';

// Prisma Mock
const mockPrisma = {
  user: {
    findMany: jest.fn(),
    count: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
  },
};

jest.unstable_mockModule('../../../src/config/prisma.config.js', () => ({
  default: mockPrisma,
}));

const adminRepository = await import(
  '../../../src/api/repositories/admin.repository.js'
);

describe('Admin Repository Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('findAllUsers', () => {
    it('모든 사용자를 페이지네이션과 함께 조회해야 함', async () => {
      const mockUsers = [
        {
          email: 'user1@example.com',
          nick_name: 'User1',
          role: 'USER',
          isDelete: false,
          created_at: new Date('2025-01-01'),
        },
        {
          email: 'user2@example.com',
          nick_name: 'User2',
          role: 'ADMIN',
          isDelete: false,
          created_at: new Date('2025-01-02'),
        },
      ];

      mockPrisma.user.findMany.mockResolvedValue(mockUsers);
      mockPrisma.user.count.mockResolvedValue(42);

      const result = await adminRepository.findAllUsers({
        page: 1,
        limit: 10,
        search: '',
      });

      expect(mockPrisma.user.findMany).toHaveBeenCalledTimes(1);
      expect(mockPrisma.user.count).toHaveBeenCalledTimes(1);
      expect(result.users).toEqual(mockUsers);
      expect(result.totalCount).toBe(42);
      expect(result.currentPage).toBe(1);
      expect(result.totalPage).toBe(5);
    });

    it('검색어로 사용자를 필터링해야 함', async () => {
      mockPrisma.user.findMany.mockResolvedValue([]);
      mockPrisma.user.count.mockResolvedValue(0);

      await adminRepository.findAllUsers({
        page: 1,
        limit: 10,
        search: 'testuser',
      });

      const callArgs = mockPrisma.user.findMany.mock.calls[0][0];
      expect(callArgs.where.OR).toEqual([
        { email: { contains: 'testuser', mode: 'insensitive' } },
        { nick_name: { contains: 'testuser', mode: 'insensitive' } },
      ]);
    });

    it('빈 검색어는 모든 사용자를 조회해야 함', async () => {
      mockPrisma.user.findMany.mockResolvedValue([]);
      mockPrisma.user.count.mockResolvedValue(0);

      await adminRepository.findAllUsers({
        page: 1,
        limit: 10,
        search: '',
      });

      const callArgs = mockPrisma.user.findMany.mock.calls[0][0];
      expect(callArgs.where).toEqual({});
    });

    it('공백만 있는 검색어는 모든 사용자를 조회해야 함', async () => {
      mockPrisma.user.findMany.mockResolvedValue([]);
      mockPrisma.user.count.mockResolvedValue(0);

      await adminRepository.findAllUsers({
        page: 1,
        limit: 10,
        search: '   ',
      });

      const callArgs = mockPrisma.user.findMany.mock.calls[0][0];
      expect(callArgs.where).toEqual({});
    });

    it('페이지네이션을 올바르게 계산해야 함', async () => {
      mockPrisma.user.findMany.mockResolvedValue([]);
      mockPrisma.user.count.mockResolvedValue(0);

      await adminRepository.findAllUsers({
        page: 3,
        limit: 20,
        search: '',
      });

      const callArgs = mockPrisma.user.findMany.mock.calls[0][0];
      expect(callArgs.skip).toBe(40);
      expect(callArgs.take).toBe(20);
    });

    it('올바른 필드만 select해야 함', async () => {
      mockPrisma.user.findMany.mockResolvedValue([]);
      mockPrisma.user.count.mockResolvedValue(0);

      await adminRepository.findAllUsers({
        page: 1,
        limit: 10,
        search: '',
      });

      const callArgs = mockPrisma.user.findMany.mock.calls[0][0];
      expect(callArgs.select.email).toBe(true);
      expect(callArgs.select.nick_name).toBe(true);
      expect(callArgs.select.role).toBe(true);
      expect(callArgs.select.isDelete).toBe(true);
      expect(callArgs.select.created_at).toBe(true);
      expect(callArgs.select.password).toBeUndefined();
    });

    it('created_at 내림차순으로 정렬해야 함', async () => {
      mockPrisma.user.findMany.mockResolvedValue([]);
      mockPrisma.user.count.mockResolvedValue(0);

      await adminRepository.findAllUsers({
        page: 1,
        limit: 10,
        search: '',
      });

      const callArgs = mockPrisma.user.findMany.mock.calls[0][0];
      expect(callArgs.orderBy).toEqual({ created_at: 'desc' });
    });

    it('totalPage를 올바르게 계산해야 함', async () => {
      mockPrisma.user.findMany.mockResolvedValue([]);
      mockPrisma.user.count.mockResolvedValue(25);

      const result = await adminRepository.findAllUsers({
        page: 1,
        limit: 10,
        search: '',
      });

      expect(result.totalPage).toBe(3);
    });
  });

  describe('findUserByEmailAdmin', () => {
    it('이메일로 사용자를 조회해야 함', async () => {
      const mockUser = {
        email: 'test@example.com',
        nick_name: 'TestUser',
        role: 'USER',
        isDelete: false,
        created_at: new Date('2025-01-01'),
      };

      mockPrisma.user.findUnique.mockResolvedValue(mockUser);

      const result = await adminRepository.findUserByEmailAdmin('test@example.com');

      expect(mockPrisma.user.findUnique).toHaveBeenCalledTimes(1);
      expect(mockPrisma.user.findUnique).toHaveBeenCalledWith({
        where: { email: 'test@example.com' },
        select: {
          email: true,
          nick_name: true,
          role: true,
          isDelete: true,
          created_at: true,
        },
      });
      expect(result).toEqual(mockUser);
    });

    it('존재하지 않는 이메일은 null을 반환해야 함', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null);

      const result = await adminRepository.findUserByEmailAdmin('nonexistent@example.com');

      expect(result).toBeNull();
    });

    it('올바른 필드만 select해야 함', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null);

      await adminRepository.findUserByEmailAdmin('test@example.com');

      const callArgs = mockPrisma.user.findUnique.mock.calls[0][0];
      expect(callArgs.select.email).toBe(true);
      expect(callArgs.select.nick_name).toBe(true);
      expect(callArgs.select.role).toBe(true);
      expect(callArgs.select.isDelete).toBe(true);
      expect(callArgs.select.created_at).toBe(true);
      expect(callArgs.select.password).toBeUndefined();
      expect(callArgs.select.user_id).toBeUndefined();
    });
  });

  describe('changeUserRoleByEmail', () => {
    it('이메일로 사용자 역할을 변경해야 함', async () => {
      const mockUpdatedUser = {
        user_id: 'user-123',
        email: 'test@example.com',
        nick_name: 'TestUser',
        role: 'ADMIN',
      };

      mockPrisma.user.update.mockResolvedValue(mockUpdatedUser);

      const result = await adminRepository.changeUserRoleByEmail(
        'test@example.com',
        'ADMIN'
      );

      expect(mockPrisma.user.update).toHaveBeenCalledTimes(1);
      expect(mockPrisma.user.update).toHaveBeenCalledWith({
        where: { email: 'test@example.com' },
        data: { role: 'ADMIN' },
        select: {
          user_id: true,
          email: true,
          nick_name: true,
          role: true,
        },
      });
      expect(result).toEqual(mockUpdatedUser);
    });

    it('USER 역할로 변경해야 함', async () => {
      const mockUpdatedUser = {
        user_id: 'user-123',
        email: 'admin@example.com',
        nick_name: 'AdminUser',
        role: 'USER',
      };

      mockPrisma.user.update.mockResolvedValue(mockUpdatedUser);

      const result = await adminRepository.changeUserRoleByEmail(
        'admin@example.com',
        'USER'
      );

      expect(mockPrisma.user.update).toHaveBeenCalledWith({
        where: { email: 'admin@example.com' },
        data: { role: 'USER' },
        select: {
          user_id: true,
          email: true,
          nick_name: true,
          role: true,
        },
      });
      expect(result.role).toBe('USER');
    });

    it('올바른 필드만 select해야 함', async () => {
      mockPrisma.user.update.mockResolvedValue({
        user_id: 'user-123',
        email: 'test@example.com',
        nick_name: 'TestUser',
        role: 'ADMIN',
      });

      await adminRepository.changeUserRoleByEmail('test@example.com', 'ADMIN');

      const callArgs = mockPrisma.user.update.mock.calls[0][0];
      expect(callArgs.select.user_id).toBe(true);
      expect(callArgs.select.email).toBe(true);
      expect(callArgs.select.nick_name).toBe(true);
      expect(callArgs.select.role).toBe(true);
      expect(callArgs.select.password).toBeUndefined();
      expect(callArgs.select.isDelete).toBeUndefined();
    });
  });
});
