import { describe, it, expect, jest, beforeEach } from '@jest/globals';

// Prisma Mock
const mockPrisma = {
  attend: {
    findMany: jest.fn(),
    count: jest.fn(),
    findUnique: jest.fn(),
    findFirst: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
  challenge: {
    findUnique: jest.fn(),
  },
  like: {
    findFirst: jest.fn(),
    delete: jest.fn(),
    deleteMany: jest.fn(),
    create: jest.fn(),
  },
  feedback: {
    deleteMany: jest.fn(),
  },
};

jest.unstable_mockModule('../../../src/config/prisma.config.js', () => ({
  default: mockPrisma,
}));

const challengeWorkRepository = await import(
  '../../../src/api/repositories/challenge.work.repository.js'
);

describe('Challenge Work Repository Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('findWorksByChallengeId', () => {
    it('챌린지별 작업물 목록을 조회해야 함', async () => {
      const mockWorks = [
        {
          attend_id: 'attend-1',
          created_at: new Date('2025-01-02'),
          user: {
            nick_name: 'User1',
            role: 'USER',
          },
          likes: [{ liker: 'user-2' }, { liker: 'user-3' }],
        },
      ];

      mockPrisma.attend.findMany.mockResolvedValue(mockWorks);

      const result = await challengeWorkRepository.findWorksByChallengeId({
        challengeId: 'challenge-123',
        skip: 0,
        take: 10,
      });

      expect(mockPrisma.attend.findMany).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockWorks);
    });

    it('임시 저장은 제외해야 함', async () => {
      mockPrisma.attend.findMany.mockResolvedValue([]);

      await challengeWorkRepository.findWorksByChallengeId({
        challengeId: 'challenge-123',
        skip: 0,
        take: 10,
      });

      const callArgs = mockPrisma.attend.findMany.mock.calls[0][0];
      expect(callArgs.where.isSave).toBe(false);
    });

    it('올바른 select 필드를 사용해야 함', async () => {
      mockPrisma.attend.findMany.mockResolvedValue([]);

      await challengeWorkRepository.findWorksByChallengeId({
        challengeId: 'challenge-123',
        skip: 0,
        take: 10,
      });

      const callArgs = mockPrisma.attend.findMany.mock.calls[0][0];
      expect(callArgs.select.attend_id).toBe(true);
      expect(callArgs.select.created_at).toBe(true);
      expect(callArgs.select.user).toEqual({
        select: {
          nick_name: true,
          role: true,
        },
      });
      expect(callArgs.select.likes).toEqual({
        select: {
          liker: true,
        },
      });
    });

    it('created_at 내림차순으로 정렬해야 함', async () => {
      mockPrisma.attend.findMany.mockResolvedValue([]);

      await challengeWorkRepository.findWorksByChallengeId({
        challengeId: 'challenge-123',
        skip: 0,
        take: 10,
      });

      const callArgs = mockPrisma.attend.findMany.mock.calls[0][0];
      expect(callArgs.orderBy).toEqual([{ created_at: 'desc' }]);
    });

    it('페이지네이션을 적용해야 함', async () => {
      mockPrisma.attend.findMany.mockResolvedValue([]);

      await challengeWorkRepository.findWorksByChallengeId({
        challengeId: 'challenge-123',
        skip: 20,
        take: 10,
      });

      const callArgs = mockPrisma.attend.findMany.mock.calls[0][0];
      expect(callArgs.skip).toBe(20);
      expect(callArgs.take).toBe(10);
    });
  });

  describe('countWorksByChallengeId', () => {
    it('챌린지별 작업물 개수를 조회해야 함', async () => {
      mockPrisma.attend.count.mockResolvedValue(25);

      const result = await challengeWorkRepository.countWorksByChallengeId('challenge-123');

      expect(mockPrisma.attend.count).toHaveBeenCalledTimes(1);
      expect(mockPrisma.attend.count).toHaveBeenCalledWith({
        where: { challenge_id: 'challenge-123', isSave: false },
      });
      expect(result).toBe(25);
    });

    it('임시 저장은 제외해야 함', async () => {
      mockPrisma.attend.count.mockResolvedValue(0);

      await challengeWorkRepository.countWorksByChallengeId('challenge-123');

      const callArgs = mockPrisma.attend.count.mock.calls[0][0];
      expect(callArgs.where.isSave).toBe(false);
    });
  });

  describe('findWorkById', () => {
    it('ID로 작업물 상세를 조회해야 함', async () => {
      const mockWork = {
        attend_id: 'attend-123',
        title: 'My Work',
        work_item: 'Work content',
        created_at: new Date('2025-01-01'),
        user: {
          nick_name: 'TestUser',
          role: 'USER',
        },
        likes: [{ liker: 'user-2' }],
        challenge: {
          isClose: false,
        },
      };

      mockPrisma.attend.findUnique.mockResolvedValue(mockWork);

      const result = await challengeWorkRepository.findWorkById('attend-123');

      expect(mockPrisma.attend.findUnique).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockWork);
    });

    it('임시 저장은 조회하지 않아야 함', async () => {
      mockPrisma.attend.findUnique.mockResolvedValue(null);

      await challengeWorkRepository.findWorkById('attend-123');

      const callArgs = mockPrisma.attend.findUnique.mock.calls[0][0];
      expect(callArgs.where.isSave).toBe(false);
    });

    it('올바른 select 필드를 사용해야 함', async () => {
      mockPrisma.attend.findUnique.mockResolvedValue(null);

      await challengeWorkRepository.findWorkById('attend-123');

      const callArgs = mockPrisma.attend.findUnique.mock.calls[0][0];
      expect(callArgs.select.attend_id).toBe(true);
      expect(callArgs.select.title).toBe(true);
      expect(callArgs.select.work_item).toBe(true);
      expect(callArgs.select.created_at).toBe(true);
      expect(callArgs.select.user).toBeDefined();
      expect(callArgs.select.likes).toBeDefined();
      expect(callArgs.select.challenge).toEqual({
        select: {
          isClose: true,
        },
      });
    });
  });

  describe('findSavesByUserId', () => {
    it('사용자별 임시 저장 목록을 조회해야 함', async () => {
      const mockSaves = [
        {
          attend_id: 'attend-1',
          title: 'Saved Work 1',
          created_at: new Date('2025-01-02'),
          user: {
            nick_name: 'TestUser',
          },
        },
      ];

      mockPrisma.attend.findMany.mockResolvedValue(mockSaves);

      const result = await challengeWorkRepository.findSavesByUserId({
        userId: 'user-123',
        skip: 0,
        take: 10,
      });

      expect(mockPrisma.attend.findMany).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockSaves);
    });

    it('임시 저장만 조회해야 함', async () => {
      mockPrisma.attend.findMany.mockResolvedValue([]);

      await challengeWorkRepository.findSavesByUserId({
        userId: 'user-123',
        skip: 0,
        take: 10,
      });

      const callArgs = mockPrisma.attend.findMany.mock.calls[0][0];
      expect(callArgs.where.isSave).toBe(true);
    });

    it('페이지네이션을 적용해야 함', async () => {
      mockPrisma.attend.findMany.mockResolvedValue([]);

      await challengeWorkRepository.findSavesByUserId({
        userId: 'user-123',
        skip: 10,
        take: 5,
      });

      const callArgs = mockPrisma.attend.findMany.mock.calls[0][0];
      expect(callArgs.skip).toBe(10);
      expect(callArgs.take).toBe(5);
    });

    it('created_at 내림차순으로 정렬해야 함', async () => {
      mockPrisma.attend.findMany.mockResolvedValue([]);

      await challengeWorkRepository.findSavesByUserId({
        userId: 'user-123',
        skip: 0,
        take: 10,
      });

      const callArgs = mockPrisma.attend.findMany.mock.calls[0][0];
      expect(callArgs.orderBy).toEqual([{ created_at: 'desc' }]);
    });
  });

  describe('countSavesByUserId', () => {
    it('사용자별 임시 저장 개수를 조회해야 함', async () => {
      mockPrisma.attend.count.mockResolvedValue(5);

      const result = await challengeWorkRepository.countSavesByUserId('user-123');

      expect(mockPrisma.attend.count).toHaveBeenCalledTimes(1);
      expect(mockPrisma.attend.count).toHaveBeenCalledWith({
        where: {
          user_id: 'user-123',
          isSave: true,
        },
      });
      expect(result).toBe(5);
    });
  });

  describe('findSaveById', () => {
    it('ID로 임시 저장 상세를 조회해야 함', async () => {
      const mockSave = {
        attend_id: 'attend-123',
        title: 'Saved Work',
        work_item: 'Work content',
        created_at: new Date('2025-01-01'),
        user_id: 'user-123',
        user: {
          nick_name: 'TestUser',
          role: 'USER',
        },
        challenge: {
          isClose: false,
        },
      };

      mockPrisma.attend.findUnique.mockResolvedValue(mockSave);

      const result = await challengeWorkRepository.findSaveById('attend-123');

      expect(mockPrisma.attend.findUnique).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockSave);
    });

    it('임시 저장만 조회해야 함', async () => {
      mockPrisma.attend.findUnique.mockResolvedValue(null);

      await challengeWorkRepository.findSaveById('attend-123');

      const callArgs = mockPrisma.attend.findUnique.mock.calls[0][0];
      expect(callArgs.where.isSave).toBe(true);
    });
  });

  describe('findChallengeIsClose', () => {
    it('챌린지의 종료 상태를 조회해야 함', async () => {
      const mockChallenge = {
        isClose: false,
        title: 'Test Challenge',
      };

      mockPrisma.challenge.findUnique.mockResolvedValue(mockChallenge);

      const result = await challengeWorkRepository.findChallengeIsClose('challenge-123');

      expect(mockPrisma.challenge.findUnique).toHaveBeenCalledTimes(1);
      expect(mockPrisma.challenge.findUnique).toHaveBeenCalledWith({
        where: { challenge_id: 'challenge-123' },
        select: {
          isClose: true,
          title: true,
        },
      });
      expect(result).toEqual(mockChallenge);
    });
  });

  describe('findExistingWork', () => {
    it('기존 작업물 존재 여부를 확인해야 함', async () => {
      const mockExistingWork = {
        attend_id: 'attend-123',
        challenge_id: 'challenge-123',
        user_id: 'user-123',
      };

      mockPrisma.attend.findFirst.mockResolvedValue(mockExistingWork);

      const result = await challengeWorkRepository.findExistingWork(
        'challenge-123',
        'user-123'
      );

      expect(mockPrisma.attend.findFirst).toHaveBeenCalledTimes(1);
      expect(mockPrisma.attend.findFirst).toHaveBeenCalledWith({
        where: {
          challenge_id: 'challenge-123',
          user_id: 'user-123',
          isSave: false,
        },
      });
      expect(result).toEqual(mockExistingWork);
    });

    it('기존 작업물이 없으면 null을 반환해야 함', async () => {
      mockPrisma.attend.findFirst.mockResolvedValue(null);

      const result = await challengeWorkRepository.findExistingWork(
        'challenge-123',
        'user-123'
      );

      expect(result).toBeNull();
    });
  });

  describe('createWork', () => {
    it('작업물을 생성해야 함', async () => {
      const workData = {
        challenge_id: 'challenge-123',
        user_id: 'user-123',
        title: 'My Work',
        work_item: 'Work content',
        isSave: false,
      };

      const mockCreatedWork = {
        attend_id: 'attend-new',
        ...workData,
        created_at: new Date('2025-01-01'),
      };

      mockPrisma.attend.create.mockResolvedValue(mockCreatedWork);

      const result = await challengeWorkRepository.createWork(workData);

      expect(mockPrisma.attend.create).toHaveBeenCalledTimes(1);
      expect(mockPrisma.attend.create).toHaveBeenCalledWith({ data: workData });
      expect(result).toEqual(mockCreatedWork);
    });
  });

  describe('findWorkWithChallengeById', () => {
    it('챌린지 정보를 포함한 작업물을 조회해야 함', async () => {
      const mockWork = {
        attend_id: 'attend-123',
        challenge: {
          isClose: false,
          challenge_id: 'challenge-123',
          title: 'Test Challenge',
        },
        user: {
          user_id: 'user-123',
        },
      };

      mockPrisma.attend.findUnique.mockResolvedValue(mockWork);

      const result = await challengeWorkRepository.findWorkWithChallengeById('attend-123');

      expect(mockPrisma.attend.findUnique).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockWork);
    });
  });

  describe('updateWorkById', () => {
    it('작업물을 수정해야 함', async () => {
      const updateData = {
        title: 'Updated Title',
        work_item: 'Updated content',
      };

      const mockUpdatedWork = {
        attend_id: 'attend-123',
        ...updateData,
        updated_at: expect.any(Date),
      };

      mockPrisma.attend.update.mockResolvedValue(mockUpdatedWork);

      const result = await challengeWorkRepository.updateWorkById('attend-123', updateData);

      expect(mockPrisma.attend.update).toHaveBeenCalledTimes(1);
      expect(result.title).toBe('Updated Title');
    });

    it('수정 시 updated_at을 업데이트해야 함', async () => {
      mockPrisma.attend.update.mockResolvedValue({});

      await challengeWorkRepository.updateWorkById('attend-123', { title: 'New' });

      const callArgs = mockPrisma.attend.update.mock.calls[0][0];
      expect(callArgs.data.updated_at).toBeInstanceOf(Date);
    });
  });

  describe('deleteLikesByAttendId', () => {
    it('작업물의 모든 좋아요를 삭제해야 함', async () => {
      mockPrisma.like.deleteMany.mockResolvedValue({ count: 5 });

      const result = await challengeWorkRepository.deleteLikesByAttendId('attend-123');

      expect(mockPrisma.like.deleteMany).toHaveBeenCalledTimes(1);
      expect(mockPrisma.like.deleteMany).toHaveBeenCalledWith({
        where: { attend_id: 'attend-123' },
      });
      expect(result.count).toBe(5);
    });
  });

  describe('deleteFeedbacksByAttendId', () => {
    it('작업물의 모든 피드백을 삭제해야 함', async () => {
      mockPrisma.feedback.deleteMany.mockResolvedValue({ count: 3 });

      const result = await challengeWorkRepository.deleteFeedbacksByAttendId('attend-123');

      expect(mockPrisma.feedback.deleteMany).toHaveBeenCalledTimes(1);
      expect(mockPrisma.feedback.deleteMany).toHaveBeenCalledWith({
        where: { attend_id: 'attend-123' },
      });
      expect(result.count).toBe(3);
    });
  });

  describe('deleteWorkById', () => {
    it('작업물을 삭제해야 함', async () => {
      const mockDeletedWork = {
        attend_id: 'attend-123',
        title: 'Deleted Work',
      };

      mockPrisma.attend.delete.mockResolvedValue(mockDeletedWork);

      const result = await challengeWorkRepository.deleteWorkById('attend-123');

      expect(mockPrisma.attend.delete).toHaveBeenCalledTimes(1);
      expect(mockPrisma.attend.delete).toHaveBeenCalledWith({
        where: { attend_id: 'attend-123' },
      });
      expect(result).toEqual(mockDeletedWork);
    });
  });

  describe('findExistingLike', () => {
    it('기존 좋아요 존재 여부를 확인해야 함', async () => {
      const mockLike = {
        like_id: 'like-123',
        user_id: 'user-123',
        attend_id: 'attend-123',
      };

      mockPrisma.like.findFirst.mockResolvedValue(mockLike);

      const result = await challengeWorkRepository.findExistingLike(
        'user-123',
        'attend-123'
      );

      expect(mockPrisma.like.findFirst).toHaveBeenCalledTimes(1);
      expect(mockPrisma.like.findFirst).toHaveBeenCalledWith({
        where: {
          user_id: 'user-123',
          attend_id: 'attend-123',
        },
      });
      expect(result).toEqual(mockLike);
    });

    it('좋아요가 없으면 null을 반환해야 함', async () => {
      mockPrisma.like.findFirst.mockResolvedValue(null);

      const result = await challengeWorkRepository.findExistingLike(
        'user-123',
        'attend-123'
      );

      expect(result).toBeNull();
    });
  });

  describe('deleteLikeById', () => {
    it('좋아요를 삭제해야 함', async () => {
      const mockDeletedLike = {
        like_id: 'like-123',
      };

      mockPrisma.like.delete.mockResolvedValue(mockDeletedLike);

      const result = await challengeWorkRepository.deleteLikeById('like-123');

      expect(mockPrisma.like.delete).toHaveBeenCalledTimes(1);
      expect(mockPrisma.like.delete).toHaveBeenCalledWith({
        where: { like_id: 'like-123' },
      });
      expect(result).toEqual(mockDeletedLike);
    });
  });

  describe('createLike', () => {
    it('좋아요를 추가해야 함', async () => {
      const likeData = {
        user_id: 'user-123',
        attend_id: 'attend-123',
        liker: 'user-123',
      };

      const mockCreatedLike = {
        like_id: 'like-new',
        ...likeData,
        created_at: new Date('2025-01-01'),
      };

      mockPrisma.like.create.mockResolvedValue(mockCreatedLike);

      const result = await challengeWorkRepository.createLike(likeData);

      expect(mockPrisma.like.create).toHaveBeenCalledTimes(1);
      expect(mockPrisma.like.create).toHaveBeenCalledWith({ data: likeData });
      expect(result).toEqual(mockCreatedLike);
    });
  });
});
