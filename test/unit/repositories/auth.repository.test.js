import { describe, it, expect, jest, beforeEach } from '@jest/globals';

// Prisma Mock
const mockPrisma = {
  user: {
    findUnique: jest.fn(),
    findFirst: jest.fn(),
    create: jest.fn(),
  },
};

jest.unstable_mockModule('../../../src/config/prisma.config.js', () => ({
  default: mockPrisma,
}));

const authRepository = await import(
  '../../../src/api/repositories/auth.repository.js'
);

describe('Auth Repository Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('findUserById', () => {
    it('ID로 사용자를 조회해야 함', async () => {
      const mockUser = {
        user_id: 'user-123',
        email: 'test@example.com',
        nick_name: 'TestUser',
        role: 'USER',
        created_at: new Date('2025-01-01'),
      };

      mockPrisma.user.findUnique.mockResolvedValue(mockUser);

      const result = await authRepository.findUserById('user-123');

      expect(mockPrisma.user.findUnique).toHaveBeenCalledTimes(1);
      expect(mockPrisma.user.findUnique).toHaveBeenCalledWith({
        where: { user_id: 'user-123' },
      });
      expect(result).toEqual(mockUser);
    });

    it('존재하지 않는 사용자는 null을 반환해야 함', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null);

      const result = await authRepository.findUserById('non-existent');

      expect(mockPrisma.user.findUnique).toHaveBeenCalledWith({
        where: { user_id: 'non-existent' },
      });
      expect(result).toBeNull();
    });
  });

  describe('findUserByEmail', () => {
    it('이메일로 사용자를 조회해야 함', async () => {
      const mockUser = {
        user_id: 'user-123',
        email: 'test@example.com',
        nick_name: 'TestUser',
        role: 'USER',
      };

      mockPrisma.user.findUnique.mockResolvedValue(mockUser);

      const result = await authRepository.findUserByEmail('test@example.com');

      expect(mockPrisma.user.findUnique).toHaveBeenCalledTimes(1);
      expect(mockPrisma.user.findUnique).toHaveBeenCalledWith({
        where: { email: 'test@example.com' },
      });
      expect(result).toEqual(mockUser);
    });

    it('존재하지 않는 이메일은 null을 반환해야 함', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null);

      const result = await authRepository.findUserByEmail('nonexistent@example.com');

      expect(mockPrisma.user.findUnique).toHaveBeenCalledWith({
        where: { email: 'nonexistent@example.com' },
      });
      expect(result).toBeNull();
    });
  });

  describe('createUser', () => {
    it('사용자를 생성해야 함', async () => {
      const userData = {
        email: 'newuser@example.com',
        password: 'hashedPassword123',
        nick_name: 'NewUser',
        role: 'USER',
      };

      const mockCreatedUser = {
        user_id: 'user-new-123',
        ...userData,
        created_at: new Date('2025-01-01'),
      };

      mockPrisma.user.create.mockResolvedValue(mockCreatedUser);

      const result = await authRepository.createUser(userData);

      expect(mockPrisma.user.create).toHaveBeenCalledTimes(1);
      expect(mockPrisma.user.create).toHaveBeenCalledWith({ data: userData });
      expect(result).toEqual(mockCreatedUser);
    });

    it('모든 필드가 포함된 사용자를 생성해야 함', async () => {
      const userData = {
        email: 'fulluser@example.com',
        password: 'hashedPassword123',
        nick_name: 'FullUser',
        role: 'ADMIN',
        refresh_token: 'some-refresh-token',
      };

      const mockCreatedUser = {
        user_id: 'user-full-123',
        ...userData,
        created_at: new Date('2025-01-01'),
      };

      mockPrisma.user.create.mockResolvedValue(mockCreatedUser);

      const result = await authRepository.createUser(userData);

      expect(mockPrisma.user.create).toHaveBeenCalledWith({ data: userData });
      expect(result).toEqual(mockCreatedUser);
    });
  });

  describe('findUserByNickName', () => {
    it('닉네임으로 사용자를 조회해야 함', async () => {
      const mockUser = {
        user_id: 'user-123',
        email: 'test@example.com',
        nick_name: 'UniqueNick',
        role: 'USER',
      };

      mockPrisma.user.findFirst.mockResolvedValue(mockUser);

      const result = await authRepository.findUserByNickName('UniqueNick');

      expect(mockPrisma.user.findFirst).toHaveBeenCalledTimes(1);
      expect(mockPrisma.user.findFirst).toHaveBeenCalledWith({
        where: { nick_name: 'UniqueNick' },
      });
      expect(result).toEqual(mockUser);
    });

    it('존재하지 않는 닉네임은 null을 반환해야 함', async () => {
      mockPrisma.user.findFirst.mockResolvedValue(null);

      const result = await authRepository.findUserByNickName('NonExistentNick');

      expect(mockPrisma.user.findFirst).toHaveBeenCalledWith({
        where: { nick_name: 'NonExistentNick' },
      });
      expect(result).toBeNull();
    });

    it('중복된 닉네임이 있으면 첫 번째 사용자를 반환해야 함', async () => {
      const mockUser = {
        user_id: 'user-first',
        email: 'first@example.com',
        nick_name: 'DuplicateNick',
        role: 'USER',
      };

      mockPrisma.user.findFirst.mockResolvedValue(mockUser);

      const result = await authRepository.findUserByNickName('DuplicateNick');

      expect(result).toEqual(mockUser);
      expect(result.user_id).toBe('user-first');
    });
  });
});
