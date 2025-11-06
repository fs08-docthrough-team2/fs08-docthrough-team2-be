import { describe, it, expect, jest, beforeEach } from '@jest/globals';

// Mock repositories
jest.unstable_mockModule('../../../src/api/repositories/admin.repository.js', () => ({
  findAllUsers: jest.fn(),
  findUserByEmailAdmin: jest.fn(),
  changeUserRoleByEmail: jest.fn(),
}));

jest.unstable_mockModule('../../../src/api/repositories/auth.repository.js', () => ({
  findUserByEmail: jest.fn(),
}));

const adminService = await import('../../../src/api/services/admin.service.js');
const adminRepository = await import('../../../src/api/repositories/admin.repository.js');
const authRepository = await import('../../../src/api/repositories/auth.repository.js');

describe('Admin Service Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllUsers', () => {
    it('사용자 목록을 조회해야 함', async () => {
      const mockUsers = {
        users: [
          { user_id: 'user-1', email: 'user1@example.com', nick_name: '유저1', role: 'USER' },
          { user_id: 'user-2', email: 'user2@example.com', nick_name: '유저2', role: 'EXPERT' },
        ],
        total: 2,
      };

      adminRepository.findAllUsers.mockResolvedValue(mockUsers);

      const result = await adminService.getAllUsers({ page: 1, limit: 10, search: '' });

      expect(adminRepository.findAllUsers).toHaveBeenCalledWith({
        page: 1,
        limit: 10,
        search: '',
      });
      expect(result).toEqual(mockUsers);
    });

    it('페이지 기본값이 1이어야 함', async () => {
      adminRepository.findAllUsers.mockResolvedValue({ users: [], total: 0 });

      await adminService.getAllUsers({ page: undefined, limit: 10, search: '' });

      expect(adminRepository.findAllUsers).toHaveBeenCalledWith({
        page: 1,
        limit: 10,
        search: '',
      });
    });

    it('limit 기본값이 10이어야 함', async () => {
      adminRepository.findAllUsers.mockResolvedValue({ users: [], total: 0 });

      await adminService.getAllUsers({ page: 1, limit: undefined, search: '' });

      expect(adminRepository.findAllUsers).toHaveBeenCalledWith({
        page: 1,
        limit: 10,
        search: '',
      });
    });

    it('search 기본값이 빈 문자열이어야 함', async () => {
      adminRepository.findAllUsers.mockResolvedValue({ users: [], total: 0 });

      await adminService.getAllUsers({ page: 1, limit: 10 });

      expect(adminRepository.findAllUsers).toHaveBeenCalledWith({
        page: 1,
        limit: 10,
        search: '',
      });
    });

    it('search 키워드의 앞뒤 공백을 제거해야 함', async () => {
      adminRepository.findAllUsers.mockResolvedValue({ users: [], total: 0 });

      await adminService.getAllUsers({ page: 1, limit: 10, search: '  test  ' });

      expect(adminRepository.findAllUsers).toHaveBeenCalledWith({
        page: 1,
        limit: 10,
        search: 'test',
      });
    });

    it('문자열 페이지와 limit을 숫자로 변환해야 함', async () => {
      adminRepository.findAllUsers.mockResolvedValue({ users: [], total: 0 });

      await adminService.getAllUsers({ page: '2', limit: '20', search: '' });

      expect(adminRepository.findAllUsers).toHaveBeenCalledWith({
        page: 2,
        limit: 20,
        search: '',
      });
    });
  });

  describe('getUserByEmail', () => {
    it('이메일로 사용자를 조회해야 함', async () => {
      const mockUser = {
        user_id: 'user-123',
        email: 'test@example.com',
        nick_name: '테스트유저',
        role: 'USER',
      };

      adminRepository.findUserByEmailAdmin.mockResolvedValue(mockUser);

      const result = await adminService.getUserByEmail('test@example.com');

      expect(adminRepository.findUserByEmailAdmin).toHaveBeenCalledWith('test@example.com');
      expect(result).toEqual(mockUser);
    });

    it('사용자를 찾을 수 없으면 에러를 던져야 함', async () => {
      adminRepository.findUserByEmailAdmin.mockResolvedValue(null);

      try {
        await adminService.getUserByEmail('notfound@example.com');
      } catch (error) {
        expect(error.message).toBe('해당 이메일의 사용자를 찾을 수가 없습니다.');
        expect(error.status).toBe(400);
      }
    });
  });

  describe('updateUserRoleByEmail', () => {
    it('USER 역할로 업데이트해야 함', async () => {
      const existingUser = {
        user_id: 'user-123',
        email: 'test@example.com',
        nick_name: '테스트유저',
        role: 'EXPERT',
      };

      const updatedUser = {
        ...existingUser,
        role: 'USER',
      };

      adminRepository.findUserByEmailAdmin.mockResolvedValue(existingUser);
      adminRepository.changeUserRoleByEmail.mockResolvedValue(updatedUser);

      const result = await adminService.updateUserRoleByEmail('test@example.com', 'USER');

      expect(adminRepository.findUserByEmailAdmin).toHaveBeenCalledWith('test@example.com');
      expect(adminRepository.changeUserRoleByEmail).toHaveBeenCalledWith(
        'test@example.com',
        'USER'
      );
      expect(result.user).toEqual(updatedUser);
    });

    it('EXPERT 역할로 업데이트해야 함', async () => {
      const existingUser = {
        user_id: 'user-123',
        email: 'test@example.com',
        nick_name: '테스트유저',
        role: 'USER',
      };

      const updatedUser = {
        ...existingUser,
        role: 'EXPERT',
      };

      adminRepository.findUserByEmailAdmin.mockResolvedValue(existingUser);
      adminRepository.changeUserRoleByEmail.mockResolvedValue(updatedUser);

      const result = await adminService.updateUserRoleByEmail('test@example.com', 'EXPERT');

      expect(adminRepository.changeUserRoleByEmail).toHaveBeenCalledWith(
        'test@example.com',
        'EXPERT'
      );
      expect(result.user).toEqual(updatedUser);
    });

    it('ADMIN 역할로 업데이트해야 함', async () => {
      const existingUser = {
        user_id: 'user-123',
        email: 'test@example.com',
        nick_name: '테스트유저',
        role: 'USER',
      };

      const updatedUser = {
        ...existingUser,
        role: 'ADMIN',
      };

      adminRepository.findUserByEmailAdmin.mockResolvedValue(existingUser);
      adminRepository.changeUserRoleByEmail.mockResolvedValue(updatedUser);

      const result = await adminService.updateUserRoleByEmail('test@example.com', 'ADMIN');

      expect(adminRepository.changeUserRoleByEmail).toHaveBeenCalledWith(
        'test@example.com',
        'ADMIN'
      );
      expect(result.user).toEqual(updatedUser);
    });

    it('소문자 역할을 대문자로 변환해야 함', async () => {
      const existingUser = {
        user_id: 'user-123',
        email: 'test@example.com',
        nick_name: '테스트유저',
        role: 'USER',
      };

      adminRepository.findUserByEmailAdmin.mockResolvedValue(existingUser);
      adminRepository.changeUserRoleByEmail.mockResolvedValue(existingUser);

      await adminService.updateUserRoleByEmail('test@example.com', 'expert');

      expect(adminRepository.changeUserRoleByEmail).toHaveBeenCalledWith(
        'test@example.com',
        'EXPERT'
      );
    });

    it('역할이 없으면 에러를 던져야 함', async () => {
      try {
        await adminService.updateUserRoleByEmail('test@example.com', null);
      } catch (error) {
        expect(error.message).toBe('유효하지 않은 값입니다.');
        expect(error.status).toBe(400);
      }
    });

    it('유효하지 않은 역할이면 에러를 던져야 함', async () => {
      try {
        await adminService.updateUserRoleByEmail('test@example.com', 'INVALID_ROLE');
      } catch (error) {
        expect(error.message).toBe('유효하지 않은 값입니다.');
        expect(error.status).toBe(400);
      }
    });

    it('사용자를 찾을 수 없으면 에러를 던져야 함', async () => {
      adminRepository.findUserByEmailAdmin.mockResolvedValue(null);

      try {
        await adminService.updateUserRoleByEmail('notfound@example.com', 'USER');
      } catch (error) {
        expect(error.message).toBe('해당 이메일의 사용자를 찾을 수 없습니다.');
        expect(error.status).toBe(404);
      }
    });

    it('이미 해당 직급이면 변경하지 않고 메시지를 반환해야 함', async () => {
      const existingUser = {
        user_id: 'user-123',
        email: 'test@example.com',
        nick_name: '테스트유저',
        role: 'EXPERT',
      };

      adminRepository.findUserByEmailAdmin.mockResolvedValue(existingUser);

      const result = await adminService.updateUserRoleByEmail('test@example.com', 'EXPERT');

      expect(adminRepository.changeUserRoleByEmail).not.toHaveBeenCalled();
      expect(result.message).toBe('이미 해당 직급입니다.');
      expect(result.user).toEqual(existingUser);
    });
  });
});
