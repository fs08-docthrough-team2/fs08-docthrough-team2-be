import { describe, it, expect, jest, beforeEach } from '@jest/globals';

// Prisma Mock
const mockPrisma = {
  challenge: {
    count: jest.fn(),
    findMany: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
  },
};

jest.unstable_mockModule('../../../src/config/prisma.config.js', () => ({
  default: mockPrisma,
}));

const challengeAdminRepository = await import(
  '../../../src/api/repositories/challenge.admin.repository.js'
);

describe('Challenge Admin Repository Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('countChallenges', () => {
    it('챌린지 개수를 조회해야 함', async () => {
      mockPrisma.challenge.count.mockResolvedValue(42);

      const result = await challengeAdminRepository.countChallenges({
        isDelete: false,
      });

      expect(mockPrisma.challenge.count).toHaveBeenCalledTimes(1);
      expect(mockPrisma.challenge.count).toHaveBeenCalledWith({
        where: { isDelete: false },
      });
      expect(result).toBe(42);
    });

    it('여러 where 조건으로 개수를 조회해야 함', async () => {
      mockPrisma.challenge.count.mockResolvedValue(10);

      await challengeAdminRepository.countChallenges({
        isDelete: false,
        status: 'APPROVED',
        field: 'WEB',
      });

      expect(mockPrisma.challenge.count).toHaveBeenCalledWith({
        where: {
          isDelete: false,
          status: 'APPROVED',
          field: 'WEB',
        },
      });
    });

    it('빈 where 조건으로 모든 챌린지 개수를 조회해야 함', async () => {
      mockPrisma.challenge.count.mockResolvedValue(100);

      const result = await challengeAdminRepository.countChallenges({});

      expect(mockPrisma.challenge.count).toHaveBeenCalledWith({
        where: {},
      });
      expect(result).toBe(100);
    });
  });

  describe('findChallengesForAdmin', () => {
    it('관리자용 챌린지 목록을 조회해야 함', async () => {
      const mockChallenges = [
        {
          challenge_no: 1,
          challenge_id: 'challenge-1',
          title: 'React 챌린지',
          type: 'OFFICIAL',
          field: 'WEB',
          status: 'APPROVED',
          deadline: new Date('2025-12-31'),
          created_at: new Date('2025-01-01'),
          capacity: '50',
          _count: { attends: 25 },
        },
      ];

      mockPrisma.challenge.findMany.mockResolvedValue(mockChallenges);

      const result = await challengeAdminRepository.findChallengesForAdmin({
        where: { isDelete: false },
        skip: 0,
        take: 10,
        orderBy: { created_at: 'desc' },
      });

      expect(mockPrisma.challenge.findMany).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockChallenges);
    });

    it('올바른 select 필드를 사용해야 함', async () => {
      mockPrisma.challenge.findMany.mockResolvedValue([]);

      await challengeAdminRepository.findChallengesForAdmin({
        where: { isDelete: false },
        skip: 0,
        take: 10,
        orderBy: { created_at: 'desc' },
      });

      const callArgs = mockPrisma.challenge.findMany.mock.calls[0][0];
      expect(callArgs.select.challenge_no).toBe(true);
      expect(callArgs.select.challenge_id).toBe(true);
      expect(callArgs.select.title).toBe(true);
      expect(callArgs.select.type).toBe(true);
      expect(callArgs.select.field).toBe(true);
      expect(callArgs.select.status).toBe(true);
      expect(callArgs.select.deadline).toBe(true);
      expect(callArgs.select.created_at).toBe(true);
      expect(callArgs.select.capacity).toBe(true);
      expect(callArgs.select._count).toEqual({
        select: { attends: true },
      });
    });

    it('페이지네이션을 적용해야 함', async () => {
      mockPrisma.challenge.findMany.mockResolvedValue([]);

      await challengeAdminRepository.findChallengesForAdmin({
        where: { isDelete: false },
        skip: 20,
        take: 10,
        orderBy: { created_at: 'desc' },
      });

      const callArgs = mockPrisma.challenge.findMany.mock.calls[0][0];
      expect(callArgs.skip).toBe(20);
      expect(callArgs.take).toBe(10);
    });

    it('정렬 조건을 적용해야 함', async () => {
      mockPrisma.challenge.findMany.mockResolvedValue([]);

      await challengeAdminRepository.findChallengesForAdmin({
        where: { isDelete: false },
        skip: 0,
        take: 10,
        orderBy: { deadline: 'asc' },
      });

      const callArgs = mockPrisma.challenge.findMany.mock.calls[0][0];
      expect(callArgs.orderBy).toEqual({ deadline: 'asc' });
    });

    it('where 조건을 적용해야 함', async () => {
      mockPrisma.challenge.findMany.mockResolvedValue([]);

      const whereCondition = {
        isDelete: false,
        status: 'APPROVED',
        field: 'WEB',
      };

      await challengeAdminRepository.findChallengesForAdmin({
        where: whereCondition,
        skip: 0,
        take: 10,
        orderBy: { created_at: 'desc' },
      });

      const callArgs = mockPrisma.challenge.findMany.mock.calls[0][0];
      expect(callArgs.where).toEqual(whereCondition);
    });
  });

  describe('findChallengeById', () => {
    it('ID로 챌린지를 조회해야 함', async () => {
      const mockChallenge = {
        challenge_id: 'challenge-1',
        title: 'Test Challenge',
        content: 'Test Content',
        type: 'OFFICIAL',
        status: 'APPROVED',
        field: 'WEB',
        deadline: new Date('2025-12-31'),
        capacity: '50',
        created_at: new Date('2025-01-01'),
      };

      mockPrisma.challenge.findUnique.mockResolvedValue(mockChallenge);

      const result = await challengeAdminRepository.findChallengeById('challenge-1');

      expect(mockPrisma.challenge.findUnique).toHaveBeenCalledTimes(1);
      expect(mockPrisma.challenge.findUnique).toHaveBeenCalledWith({
        where: { challenge_id: 'challenge-1' },
      });
      expect(result).toEqual(mockChallenge);
    });

    it('존재하지 않는 챌린지는 null을 반환해야 함', async () => {
      mockPrisma.challenge.findUnique.mockResolvedValue(null);

      const result = await challengeAdminRepository.findChallengeById('non-existent');

      expect(result).toBeNull();
    });
  });

  describe('approveChallengeById', () => {
    it('챌린지를 승인해야 함', async () => {
      const mockApprovedChallenge = {
        challenge_id: 'challenge-1',
        isApprove: true,
        isReject: false,
        reject_content: null,
        status: 'APPROVED',
      };

      mockPrisma.challenge.update.mockResolvedValue(mockApprovedChallenge);

      const result = await challengeAdminRepository.approveChallengeById('challenge-1');

      expect(mockPrisma.challenge.update).toHaveBeenCalledTimes(1);
      expect(mockPrisma.challenge.update).toHaveBeenCalledWith({
        where: { challenge_id: 'challenge-1' },
        data: {
          isApprove: true,
          isReject: false,
          reject_content: null,
          status: 'APPROVED',
        },
      });
      expect(result).toEqual(mockApprovedChallenge);
    });

    it('승인 시 올바른 필드를 업데이트해야 함', async () => {
      mockPrisma.challenge.update.mockResolvedValue({});

      await challengeAdminRepository.approveChallengeById('challenge-1');

      const callArgs = mockPrisma.challenge.update.mock.calls[0][0];
      expect(callArgs.data.isApprove).toBe(true);
      expect(callArgs.data.isReject).toBe(false);
      expect(callArgs.data.reject_content).toBeNull();
      expect(callArgs.data.status).toBe('APPROVED');
    });
  });

  describe('rejectChallengeById', () => {
    it('챌린지를 거절해야 함', async () => {
      const rejectComment = '부적절한 내용이 포함되어 있습니다.';
      const mockRejectedChallenge = {
        challenge_id: 'challenge-1',
        isReject: true,
        isApprove: false,
        reject_content: rejectComment,
        status: 'REJECTED',
      };

      mockPrisma.challenge.update.mockResolvedValue(mockRejectedChallenge);

      const result = await challengeAdminRepository.rejectChallengeById(
        'challenge-1',
        rejectComment
      );

      expect(mockPrisma.challenge.update).toHaveBeenCalledTimes(1);
      expect(mockPrisma.challenge.update).toHaveBeenCalledWith({
        where: { challenge_id: 'challenge-1' },
        data: {
          isReject: true,
          isApprove: false,
          reject_content: rejectComment,
          status: 'REJECTED',
        },
      });
      expect(result).toEqual(mockRejectedChallenge);
    });

    it('거절 시 올바른 필드를 업데이트해야 함', async () => {
      mockPrisma.challenge.update.mockResolvedValue({});

      const rejectComment = 'Test reject reason';
      await challengeAdminRepository.rejectChallengeById('challenge-1', rejectComment);

      const callArgs = mockPrisma.challenge.update.mock.calls[0][0];
      expect(callArgs.data.isReject).toBe(true);
      expect(callArgs.data.isApprove).toBe(false);
      expect(callArgs.data.reject_content).toBe(rejectComment);
      expect(callArgs.data.status).toBe('REJECTED');
    });

    it('거절 사유를 저장해야 함', async () => {
      mockPrisma.challenge.update.mockResolvedValue({
        reject_content: '기준 미달',
      });

      const result = await challengeAdminRepository.rejectChallengeById(
        'challenge-1',
        '기준 미달'
      );

      expect(result.reject_content).toBe('기준 미달');
    });
  });
});
