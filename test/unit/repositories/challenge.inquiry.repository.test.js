import { describe, it, expect, jest, beforeEach } from '@jest/globals';

// Prisma Mock
const mockPrisma = {
  challenge: {
    findMany: jest.fn(),
    count: jest.fn(),
  },
};

jest.unstable_mockModule('../../../src/config/prisma.config.js', () => ({
  default: mockPrisma,
}));

const challengeInquiryRepository = await import(
  '../../../src/api/repositories/challenge.inquiry.repository.js'
);

describe('Challenge Inquiry Repository Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('findUserChallenges', () => {
    it('사용자가 참여한 챌린지를 조회해야 함', async () => {
      const mockChallenges = [
        {
          challenge_id: 'challenge-1',
          title: 'React 챌린지',
          content: 'React 학습',
          type: 'OFFICIAL',
          status: 'APPROVED',
          field: 'WEB',
          source: 'https://example.com',
          deadline: new Date('2025-12-31'),
          capacity: '50',
          created_at: new Date('2025-01-01'),
          _count: { attends: 10 },
        },
      ];

      mockPrisma.challenge.findMany.mockResolvedValue(mockChallenges);

      const result = await challengeInquiryRepository.findUserChallenges({
        userId: 'user-123',
        where: {
          isDelete: false,
          deadline: { gt: new Date() },
        },
        skip: 0,
        take: 10,
        orderBy: { created_at: 'desc' },
      });

      expect(mockPrisma.challenge.findMany).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockChallenges);

      const callArgs = mockPrisma.challenge.findMany.mock.calls[0][0];
      expect(callArgs.where.attends).toEqual({
        some: {
          user_id: 'user-123',
          isSave: false,
        },
      });
    });

    it('userId와 where 조건이 올바르게 병합되어야 함', async () => {
      mockPrisma.challenge.findMany.mockResolvedValue([]);

      await challengeInquiryRepository.findUserChallenges({
        userId: 'user-456',
        where: {
          isDelete: false,
          status: 'APPROVED',
          field: 'WEB',
        },
        skip: 10,
        take: 20,
        orderBy: { deadline: 'asc' },
      });

      const callArgs = mockPrisma.challenge.findMany.mock.calls[0][0];

      // attends 조건 확인
      expect(callArgs.where.attends.some.user_id).toBe('user-456');
      expect(callArgs.where.attends.some.isSave).toBe(false);

      // 기존 where 조건 확인
      expect(callArgs.where.isDelete).toBe(false);
      expect(callArgs.where.status).toBe('APPROVED');
      expect(callArgs.where.field).toBe('WEB');

      // 페이지네이션 확인
      expect(callArgs.skip).toBe(10);
      expect(callArgs.take).toBe(20);

      // 정렬 확인
      expect(callArgs.orderBy).toEqual({ deadline: 'asc' });
    });

    it('임시 저장(isSave: true)은 제외해야 함', async () => {
      mockPrisma.challenge.findMany.mockResolvedValue([]);

      await challengeInquiryRepository.findUserChallenges({
        userId: 'user-123',
        where: { isDelete: false },
        skip: 0,
        take: 10,
        orderBy: { created_at: 'desc' },
      });

      const callArgs = mockPrisma.challenge.findMany.mock.calls[0][0];
      expect(callArgs.where.attends.some.isSave).toBe(false);
    });

    it('올바른 select 필드를 사용해야 함', async () => {
      mockPrisma.challenge.findMany.mockResolvedValue([]);

      await challengeInquiryRepository.findUserChallenges({
        userId: 'user-123',
        where: { isDelete: false },
        skip: 0,
        take: 10,
        orderBy: { created_at: 'desc' },
      });

      const callArgs = mockPrisma.challenge.findMany.mock.calls[0][0];
      expect(callArgs.select.challenge_id).toBe(true);
      expect(callArgs.select.title).toBe(true);
      expect(callArgs.select.content).toBe(true);
      expect(callArgs.select.type).toBe(true);
      expect(callArgs.select.status).toBe(true);
      expect(callArgs.select.field).toBe(true);
      expect(callArgs.select.source).toBe(true);
      expect(callArgs.select.deadline).toBe(true);
      expect(callArgs.select.capacity).toBe(true);
      expect(callArgs.select.created_at).toBe(true);
      expect(callArgs.select._count).toEqual({
        select: { attends: true },
      });
    });

    it('빈 결과도 정상 처리되어야 함', async () => {
      mockPrisma.challenge.findMany.mockResolvedValue([]);

      const result = await challengeInquiryRepository.findUserChallenges({
        userId: 'user-999',
        where: { isDelete: false },
        skip: 0,
        take: 10,
        orderBy: { created_at: 'desc' },
      });

      expect(result).toEqual([]);
    });

    it('여러 where 조건과 userId가 모두 적용되어야 함', async () => {
      mockPrisma.challenge.findMany.mockResolvedValue([]);

      await challengeInquiryRepository.findUserChallenges({
        userId: 'user-123',
        where: {
          isDelete: false,
          deadline: { gt: new Date('2025-12-01') },
          status: 'APPROVED',
          field: 'WEB',
          type: 'OFFICIAL',
          title: {
            contains: 'React',
            mode: 'insensitive',
          },
        },
        skip: 20,
        take: 10,
        orderBy: { created_at: 'desc' },
      });

      const callArgs = mockPrisma.challenge.findMany.mock.calls[0][0];

      // attends 조건
      expect(callArgs.where.attends.some.user_id).toBe('user-123');
      expect(callArgs.where.attends.some.isSave).toBe(false);

      // 나머지 where 조건들
      expect(callArgs.where.isDelete).toBe(false);
      expect(callArgs.where.deadline).toEqual({ gt: expect.any(Date) });
      expect(callArgs.where.status).toBe('APPROVED');
      expect(callArgs.where.field).toBe('WEB');
      expect(callArgs.where.type).toBe('OFFICIAL');
      expect(callArgs.where.title).toEqual({
        contains: 'React',
        mode: 'insensitive',
      });
    });
  });

  describe('countChallenges', () => {
    it('챌린지 개수를 조회해야 함', async () => {
      mockPrisma.challenge.count.mockResolvedValue(42);

      const result = await challengeInquiryRepository.countChallenges({
        isDelete: false,
      });

      expect(mockPrisma.challenge.count).toHaveBeenCalledWith({
        where: { isDelete: false },
      });
      expect(result).toBe(42);
    });

    it('여러 where 조건으로 개수를 조회해야 함', async () => {
      mockPrisma.challenge.count.mockResolvedValue(10);

      await challengeInquiryRepository.countChallenges({
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
  });
});
