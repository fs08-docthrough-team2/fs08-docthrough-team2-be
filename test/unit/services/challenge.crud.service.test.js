import { describe, it, expect, jest, beforeEach } from '@jest/globals';

// Mock repositories
jest.unstable_mockModule('../../../src/api/repositories/challenge.crud.repository.js', () => ({
  createChallenge: jest.fn(),
  updateChallengeById: jest.fn(),
  cancelChallengeById: jest.fn(),
  deleteChallengeById: jest.fn(),
  hardDeleteChallengeById: jest.fn(),
}));

// Mock notice service
jest.unstable_mockModule('../../../src/api/services/notice.service.js', () => ({
  default: {
    addModifyNotice: jest.fn(),
  },
}));

const challengeCrudService = await import('../../../src/api/services/challenge.crud.service.js');
const challengeCrudRepository = await import(
  '../../../src/api/repositories/challenge.crud.repository.js'
);
const noticeService = await import('../../../src/api/services/notice.service.js');

describe('Challenge CRUD Service Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createChallenge', () => {
    it('챌린지를 생성해야 함', async () => {
      const mockChallenge = {
        challenge_id: 'challenge-123',
        user_id: 'user-123',
        title: 'React 챌린지',
        source: 'https://example.com',
        field: 'WEB',
        type: 'OFFICIAL',
        deadline: new Date('2025-12-31'),
        capacity: 50,
        content: '챌린지 내용',
        status: 'PENDING',
        isDelete: false,
        isClose: false,
        isReject: false,
      };

      challengeCrudRepository.createChallenge.mockResolvedValue(mockChallenge);

      const result = await challengeCrudService.default.createChallenge(
        'React 챌린지',
        'https://example.com',
        'WEB',
        'OFFICIAL',
        new Date('2025-12-31'),
        50,
        '챌린지 내용',
        'user-123'
      );

      expect(challengeCrudRepository.createChallenge).toHaveBeenCalledWith({
        user_id: 'user-123',
        title: 'React 챌린지',
        source: 'https://example.com',
        field: 'WEB',
        type: 'OFFICIAL',
        deadline: new Date('2025-12-31'),
        capacity: 50,
        content: '챌린지 내용',
        status: 'PENDING',
        isDelete: false,
        isClose: false,
        isReject: false,
      });

      expect(result.success).toBe(true);
      expect(result.message).toBe('챌린지가 성공적으로 생성되었습니다.');
      expect(result.data.createChallenge).toEqual(mockChallenge);
    });

    it('BLOG 타입 챌린지를 생성해야 함', async () => {
      const mockChallenge = {
        challenge_id: 'challenge-124',
        user_id: 'user-123',
        title: 'Vue 챌린지',
        source: 'https://blog.example.com',
        field: 'WEB',
        type: 'BLOG',
        deadline: new Date('2025-12-31'),
        capacity: 30,
        content: '블로그 챌린지',
        status: 'PENDING',
        isDelete: false,
        isClose: false,
        isReject: false,
      };

      challengeCrudRepository.createChallenge.mockResolvedValue(mockChallenge);

      const result = await challengeCrudService.default.createChallenge(
        'Vue 챌린지',
        'https://blog.example.com',
        'WEB',
        'BLOG',
        new Date('2025-12-31'),
        30,
        '블로그 챌린지',
        'user-123'
      );

      expect(result.success).toBe(true);
      expect(result.data.createChallenge.type).toBe('BLOG');
    });

    it('에러 발생 시 에러를 던져야 함', async () => {
      challengeCrudRepository.createChallenge.mockRejectedValue(new Error('DB 에러'));

      await expect(
        challengeCrudService.default.createChallenge(
          'React 챌린지',
          'https://example.com',
          'WEB',
          'OFFICIAL',
          new Date('2025-12-31'),
          50,
          '챌린지 내용',
          'user-123'
        )
      ).rejects.toThrow('DB 에러');
    });
  });

  describe('updateChallenge', () => {
    it('챌린지를 수정하고 알림을 전송해야 함', async () => {
      const mockReq = {
        params: {
          challengeId: 'challenge-123',
        },
        body: {
          title: '수정된 챌린지',
          content: '수정된 내용',
        },
      };

      const mockUpdatedChallenge = {
        challenge_id: 'challenge-123',
        title: '수정된 챌린지',
        content: '수정된 내용',
      };

      challengeCrudRepository.updateChallengeById.mockResolvedValue(mockUpdatedChallenge);
      noticeService.default.addModifyNotice.mockResolvedValue();

      const result = await challengeCrudService.default.updateChallenge(mockReq, 'user-123');

      expect(challengeCrudRepository.updateChallengeById).toHaveBeenCalledWith(
        'challenge-123',
        mockReq.body
      );
      expect(noticeService.default.addModifyNotice).toHaveBeenCalledWith(
        '챌린지',
        '수정',
        'user-123',
        '수정된 챌린지'
      );
      expect(result.success).toBe(true);
      expect(result.message).toBe('챌린지가 성공적으로 수정되었습니다.');
      expect(result.data.updateChallenge).toEqual(mockUpdatedChallenge);
    });

    it('에러 발생 시 에러를 던져야 함', async () => {
      const mockReq = {
        params: {
          challengeId: 'challenge-123',
        },
        body: {
          title: '수정된 챌린지',
        },
      };

      challengeCrudRepository.updateChallengeById.mockRejectedValue(
        new Error('수정 권한이 없습니다')
      );

      await expect(
        challengeCrudService.default.updateChallenge(mockReq, 'user-123')
      ).rejects.toThrow('수정 권한이 없습니다');
    });
  });

  describe('cancelChallenge', () => {
    it('챌린지를 취소하고 알림을 전송해야 함', async () => {
      const mockCancelledChallenge = {
        challenge_id: 'challenge-123',
        title: '취소된 챌린지',
        status: 'CANCELLED',
      };

      challengeCrudRepository.cancelChallengeById.mockResolvedValue(mockCancelledChallenge);
      noticeService.default.addModifyNotice.mockResolvedValue();

      const result = await challengeCrudService.default.cancelChallenge(
        'challenge-123',
        'user-123'
      );

      expect(challengeCrudRepository.cancelChallengeById).toHaveBeenCalledWith('challenge-123');
      expect(noticeService.default.addModifyNotice).toHaveBeenCalledWith(
        '챌린지',
        '취소',
        'user-123',
        '취소된 챌린지'
      );
      expect(result.success).toBe(true);
      expect(result.message).toBe('챌린지가 성공적으로 취소되었습니다.');
      expect(result.data.cancelChallenge).toEqual(mockCancelledChallenge);
    });

    it('에러 발생 시 에러를 던져야 함', async () => {
      challengeCrudRepository.cancelChallengeById.mockRejectedValue(
        new Error('챌린지를 찾을 수 없습니다')
      );

      await expect(
        challengeCrudService.default.cancelChallenge('invalid-id', 'user-123')
      ).rejects.toThrow('챌린지를 찾을 수 없습니다');
    });
  });

  describe('deleteChallenge', () => {
    it('챌린지를 소프트 삭제하고 알림을 전송해야 함', async () => {
      const delete_reason = '참여자가 없어서 챌린지를 삭제합니다.';
      const mockDeletedChallenge = {
        challenge_id: 'challenge-123',
        title: '삭제된 챌린지',
        isDelete: true,
        delete_reason: delete_reason,
      };

      challengeCrudRepository.deleteChallengeById.mockResolvedValue(mockDeletedChallenge);
      noticeService.default.addModifyNotice.mockResolvedValue();

      const result = await challengeCrudService.default.deleteChallenge(
        'challenge-123',
        'user-123',
        delete_reason
      );

      expect(challengeCrudRepository.deleteChallengeById).toHaveBeenCalledWith('challenge-123', delete_reason);
      expect(noticeService.default.addModifyNotice).toHaveBeenCalledWith(
        '챌린지',
        '삭제',
        'user-123',
        '삭제된 챌린지'
      );
      expect(result.success).toBe(true);
      expect(result.message).toBe('챌린지가 성공적으로 삭제되었습니다.');
      expect(result.data.deletedChallenge).toEqual(mockDeletedChallenge);
    });

    it('에러 발생 시 에러를 던져야 함', async () => {
      const delete_reason = '저작권 문제로 인해 삭제되었습니다.';
      challengeCrudRepository.deleteChallengeById.mockRejectedValue(
        new Error('삭제 권한이 없습니다')
      );

      await expect(
        challengeCrudService.default.deleteChallenge('challenge-123', 'user-123', delete_reason)
      ).rejects.toThrow('삭제 권한이 없습니다');
    });
  });

  describe('hardDeleteChallenge', () => {
    it('챌린지를 완전 삭제하고 알림을 전송해야 함', async () => {
      const mockDeletedChallenge = {
        challenge_id: 'challenge-123',
        title: '완전 삭제된 챌린지',
      };

      challengeCrudRepository.hardDeleteChallengeById.mockResolvedValue(mockDeletedChallenge);
      noticeService.default.addModifyNotice.mockResolvedValue();

      const result = await challengeCrudService.default.hardDeleteChallenge(
        'challenge-123',
        'user-123'
      );

      expect(challengeCrudRepository.hardDeleteChallengeById).toHaveBeenCalledWith(
        'challenge-123'
      );
      expect(noticeService.default.addModifyNotice).toHaveBeenCalledWith(
        '챌린지',
        '완전 삭제',
        'user-123',
        '완전 삭제된 챌린지'
      );
      expect(result.success).toBe(true);
      expect(result.message).toBe('챌린지가 성공적으로 영구 삭제되었습니다.');
      expect(result.data.deletedChallenge).toEqual(mockDeletedChallenge);
    });

    it('에러 발생 시 에러를 던져야 함', async () => {
      challengeCrudRepository.hardDeleteChallengeById.mockRejectedValue(
        new Error('챌린지를 찾을 수 없습니다')
      );

      await expect(
        challengeCrudService.default.hardDeleteChallenge('invalid-id', 'user-123')
      ).rejects.toThrow('챌린지를 찾을 수 없습니다');
    });
  });
});
