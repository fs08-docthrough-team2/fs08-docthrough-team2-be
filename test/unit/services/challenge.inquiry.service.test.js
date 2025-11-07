import { describe, it, expect, jest, beforeEach } from '@jest/globals';

// Repository Mock
jest.unstable_mockModule('../../../src/api/repositories/challenge.inquiry.repository.js', () => ({
  findUserChallenges: jest.fn(),
  countChallenges: jest.fn(),
  findChallengesWithAttendCount: jest.fn(),
  findChallengeDetailById: jest.fn(),
  findParticipatesByChallenge: jest.fn(),
}));

const challengeInquiryService = (await import('../../../src/api/services/challenge.inquiry.service.js')).default;
const challengeInquiryRepository = await import(
  '../../../src/api/repositories/challenge.inquiry.repository.js'
);

describe('Challenge Inquiry Service Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getUserParticipateList', () => {
    it('사용자가 참여한 챌린지 목록을 조회해야 함', async () => {
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

      challengeInquiryRepository.findUserChallenges.mockResolvedValue(mockChallenges);

      const result = await challengeInquiryService.getUserParticipateList(
        'user-123',
        null, // title
        null, // field
        null, // type
        null, // status
        1, // page
        10, // pageSize
        '신청시간느림순' // sort
      );

      expect(challengeInquiryRepository.findUserChallenges).toHaveBeenCalledWith({
        userId: 'user-123',
        where: expect.objectContaining({
          isDelete: false,
          deadline: { gt: expect.any(Date) },
        }),
        skip: 0,
        take: 10,
        orderBy: { created_at: 'desc' },
      });

      expect(result.success).toBe(true);
      expect(result.data.participates).toHaveLength(1);
      expect(result.data.participates[0].challengeId).toBe('challenge-1');
    });

    it('만료되지 않은 챌린지만 조회해야 함', async () => {
      challengeInquiryRepository.findUserChallenges.mockResolvedValue([]);

      await challengeInquiryService.getUserParticipateList(
        'user-123',
        null,
        null,
        null,
        null,
        1,
        10,
        '신청시간느림순'
      );

      const whereCondition = challengeInquiryRepository.findUserChallenges.mock.calls[0][0].where;
      expect(whereCondition.deadline).toEqual({ gt: expect.any(Date) });
    });

    it('한글 status를 영문 enum으로 변환해야 함', async () => {
      challengeInquiryRepository.findUserChallenges.mockResolvedValue([]);

      await challengeInquiryService.getUserParticipateList(
        'user-123',
        null,
        null,
        null,
        '신청승인',
        1,
        10,
        '신청시간느림순'
      );

      const whereCondition = challengeInquiryRepository.findUserChallenges.mock.calls[0][0].where;
      expect(whereCondition.status).toBe('APPROVED');
    });

    it('status 신청거절은 REJECTED로 변환해야 함', async () => {
      challengeInquiryRepository.findUserChallenges.mockResolvedValue([]);

      await challengeInquiryService.getUserParticipateList(
        'user-123',
        null,
        null,
        null,
        '신청거절',
        1,
        10,
        '신청시간느림순'
      );

      const whereCondition = challengeInquiryRepository.findUserChallenges.mock.calls[0][0].where;
      expect(whereCondition.status).toBe('REJECTED');
    });

    it('status 신청취소는 CANCELLED로 변환해야 함', async () => {
      challengeInquiryRepository.findUserChallenges.mockResolvedValue([]);

      await challengeInquiryService.getUserParticipateList(
        'user-123',
        null,
        null,
        null,
        '신청취소',
        1,
        10,
        '신청시간느림순'
      );

      const whereCondition = challengeInquiryRepository.findUserChallenges.mock.calls[0][0].where;
      expect(whereCondition.status).toBe('CANCELLED');
    });

    it('status 신청대기는 PENDING으로 변환해야 함', async () => {
      challengeInquiryRepository.findUserChallenges.mockResolvedValue([]);

      await challengeInquiryService.getUserParticipateList(
        'user-123',
        null,
        null,
        null,
        '신청대기',
        1,
        10,
        '신청시간느림순'
      );

      const whereCondition = challengeInquiryRepository.findUserChallenges.mock.calls[0][0].where;
      expect(whereCondition.status).toBe('PENDING');
    });

    it('정렬 기준이 올바르게 적용되어야 함 - 신청시간빠름순', async () => {
      challengeInquiryRepository.findUserChallenges.mockResolvedValue([]);

      await challengeInquiryService.getUserParticipateList(
        'user-123',
        null,
        null,
        null,
        null,
        1,
        10,
        '신청시간빠름순'
      );

      const orderBy = challengeInquiryRepository.findUserChallenges.mock.calls[0][0].orderBy;
      expect(orderBy).toEqual({ created_at: 'asc' });
    });

    it('정렬 기준이 올바르게 적용되어야 함 - 마감기한빠름순', async () => {
      challengeInquiryRepository.findUserChallenges.mockResolvedValue([]);

      await challengeInquiryService.getUserParticipateList(
        'user-123',
        null,
        null,
        null,
        null,
        1,
        10,
        '마감기한빠름순'
      );

      const orderBy = challengeInquiryRepository.findUserChallenges.mock.calls[0][0].orderBy;
      expect(orderBy).toEqual({ deadline: 'asc' });
    });

    it('페이지네이션이 올바르게 계산되어야 함', async () => {
      challengeInquiryRepository.findUserChallenges.mockResolvedValue([]);

      await challengeInquiryService.getUserParticipateList(
        'user-123',
        null,
        null,
        null,
        null,
        3, // page
        20, // pageSize
        '신청시간느림순'
      );

      expect(challengeInquiryRepository.findUserChallenges).toHaveBeenCalledWith(
        expect.objectContaining({
          skip: 40, // (3 - 1) * 20
          take: 20,
        })
      );
    });

    it('title 필터가 있으면 where 조건에 추가해야 함', async () => {
      challengeInquiryRepository.findUserChallenges.mockResolvedValue([]);

      await challengeInquiryService.getUserParticipateList(
        'user-123',
        'React',
        null,
        null,
        null,
        1,
        10,
        '신청시간느림순'
      );

      const whereCondition = challengeInquiryRepository.findUserChallenges.mock.calls[0][0].where;
      expect(whereCondition.title).toEqual({
        contains: 'React',
        mode: 'insensitive',
      });
    });
  });

  describe('getUserCompleteList', () => {
    it('사용자가 완료한 챌린지 목록을 조회해야 함', async () => {
      const mockChallenges = [
        {
          challenge_id: 'challenge-2',
          title: 'Vue 챌린지',
          content: 'Vue 학습',
          type: 'BLOG',
          status: 'APPROVED',
          field: 'WEB',
          source: 'https://example.com',
          deadline: new Date('2025-01-01'),
          capacity: '30',
          _count: { attends: 15 },
        },
      ];

      challengeInquiryRepository.findUserChallenges.mockResolvedValue(mockChallenges);

      const result = await challengeInquiryService.getUserCompleteList(
        'user-123',
        null,
        null,
        null,
        null,
        1,
        10,
        '신청시간느림순'
      );

      expect(challengeInquiryRepository.findUserChallenges).toHaveBeenCalledWith({
        userId: 'user-123',
        where: expect.objectContaining({
          isDelete: false,
          deadline: { lte: expect.any(Date) },
        }),
        skip: 0,
        take: 10,
        orderBy: { created_at: 'desc' },
      });

      expect(result.success).toBe(true);
      expect(result.data.participates).toHaveLength(1);
    });

    it('마감일이 지난 챌린지만 조회해야 함', async () => {
      challengeInquiryRepository.findUserChallenges.mockResolvedValue([]);

      await challengeInquiryService.getUserCompleteList(
        'user-123',
        null,
        null,
        null,
        null,
        1,
        10,
        '신청시간느림순'
      );

      const whereCondition = challengeInquiryRepository.findUserChallenges.mock.calls[0][0].where;
      expect(whereCondition.deadline).toEqual({ lte: expect.any(Date) });
    });

    it('한글 status를 영문 enum으로 변환해야 함', async () => {
      challengeInquiryRepository.findUserChallenges.mockResolvedValue([]);

      await challengeInquiryService.getUserCompleteList(
        'user-123',
        null,
        null,
        null,
        '신청승인',
        1,
        10,
        '신청시간느림순'
      );

      const whereCondition = challengeInquiryRepository.findUserChallenges.mock.calls[0][0].where;
      expect(whereCondition.status).toBe('APPROVED');
    });
  });

  describe('getChallengeList', () => {
    it('챌린지 목록을 조회해야 함', async () => {
      const mockChallenges = [
        {
          challenge_id: 'challenge-1',
          title: 'Next.js 챌린지',
          field: 'NEXT',
          type: 'OFFICIAL',
          status: 'APPROVED',
          created_at: new Date(),
          deadline: new Date('2025-12-31'),
          capacity: '100',
          _count: { attends: 25 },
        },
      ];

      challengeInquiryRepository.countChallenges.mockResolvedValue(50);
      challengeInquiryRepository.findChallengesWithAttendCount.mockResolvedValue(mockChallenges);

      const result = await challengeInquiryService.getChallengeList({
        title: null,
        field: null,
        type: null,
        status: null,
        page: 1,
        pageSize: 10,
        sort: '신청시간느림순',
      });

      expect(result.success).toBe(true);
      expect(result.data).toHaveLength(1);
      expect(result.pagination.totalCount).toBe(50);
      expect(result.pagination.totalPages).toBe(5);
    });

    it('응답 데이터 포맷이 올바르게 변환되어야 함', async () => {
      const mockChallenge = {
        challenge_id: 'challenge-1',
        title: 'React 챌린지',
        field: 'WEB',
        type: 'OFFICIAL',
        status: 'APPROVED',
        created_at: new Date('2025-01-01'),
        deadline: new Date('2025-12-31'),
        capacity: '50',
        _count: { attends: 10 },
      };

      challengeInquiryRepository.countChallenges.mockResolvedValue(1);
      challengeInquiryRepository.findChallengesWithAttendCount.mockResolvedValue([mockChallenge]);

      const result = await challengeInquiryService.getChallengeList({
        title: null,
        field: null,
        type: null,
        status: null,
        page: 1,
        pageSize: 10,
        sort: '신청시간느림순',
      });

      const challenge = result.data[0];
      expect(challenge.challengeId).toBe('challenge-1');
      expect(challenge.title).toBe('React 챌린지');
      expect(challenge.currentParticipants).toBe(10);
      expect(challenge.maxParticipants).toBe(50);
    });
  });

  describe('getChallengeDetail', () => {
    it('챌린지가 존재하면 상세 정보를 반환해야 함', async () => {
      const mockChallenge = {
        challenge_id: 'challenge-123',
        title: 'React 챌린지',
        content: 'React 학습하기',
        field: 'WEB',
        type: 'OFFICIAL',
        status: 'APPROVED',
        deadline: new Date('2025-12-31'),
        capacity: '50',
        source: 'https://example.com',
        _count: { attends: 10 },
      };

      challengeInquiryRepository.findChallengeDetailById.mockResolvedValue(mockChallenge);

      const result = await challengeInquiryService.getChallengeDetail('challenge-123');

      expect(challengeInquiryRepository.findChallengeDetailById).toHaveBeenCalledWith('challenge-123');
      expect(result.success).toBe(true);
      expect(result.data.challengeId).toBe('challenge-123');
      expect(result.data.title).toBe('React 챌린지');
      expect(result.data.currentParticipants).toBe(10);
      expect(result.data.maxParticipants).toBe(50);
    });

    it('챌린지가 존재하지 않으면 에러를 던져야 함', async () => {
      challengeInquiryRepository.findChallengeDetailById.mockResolvedValue(null);

      await expect(
        challengeInquiryService.getChallengeDetail('invalid-id')
      ).rejects.toThrow(/챌린지.*찾을 수 없습니다/);

      expect(challengeInquiryRepository.findChallengeDetailById).toHaveBeenCalledWith('invalid-id');
    });
  });

  describe('getParticipateList', () => {
    it('챌린지가 존재하고 참여자가 있을 때 목록을 조회해야 함', async () => {
      const mockChallenge = {
        challenge_id: 'challenge-123',
        title: 'React 챌린지',
        _count: { attends: 3 },
      };

      const mockParticipates = [
        {
          attend_id: 'attend-1',
          user_id: 'user-1',
          updated_at: new Date('2025-01-10'),
          user: { nick_name: '유저1' },
          _count: { likes: 5 },
        },
        {
          attend_id: 'attend-2',
          user_id: 'user-2',
          updated_at: new Date('2025-01-09'),
          user: { nick_name: '유저2' },
          _count: { likes: 3 },
        },
      ];

      challengeInquiryRepository.findChallengeDetailById.mockResolvedValue(mockChallenge);
      challengeInquiryRepository.findParticipatesByChallenge.mockResolvedValue(mockParticipates);

      const result = await challengeInquiryService.getParticipateList('challenge-123', 1, 10);

      expect(challengeInquiryRepository.findChallengeDetailById).toHaveBeenCalledWith('challenge-123');
      expect(challengeInquiryRepository.findParticipatesByChallenge).toHaveBeenCalledWith({
        challengeId: 'challenge-123',
        skip: 0,
        take: 10,
      });
      expect(result.success).toBe(true);
      expect(result.data.participates).toHaveLength(2);
      expect(result.data.participates[0].rank).toBe(1);
      expect(result.data.participates[0].nickName).toBe('유저1');
      expect(result.data.participates[0].hearts).toBe(5);
    });

    it('챌린지가 존재하지 않으면 에러를 던져야 함', async () => {
      challengeInquiryRepository.findChallengeDetailById.mockResolvedValue(null);

      await expect(
        challengeInquiryService.getParticipateList('invalid-challenge-id', 1, 10)
      ).rejects.toThrow(/챌린지.*찾을 수 없습니다/);

      expect(challengeInquiryRepository.findChallengeDetailById).toHaveBeenCalledWith('invalid-challenge-id');
      expect(challengeInquiryRepository.findParticipatesByChallenge).not.toHaveBeenCalled();
    });

    it('챌린지는 존재하지만 참여자가 없을 때 빈 배열을 반환해야 함', async () => {
      const mockChallenge = {
        challenge_id: 'challenge-123',
        title: 'React 챌린지',
        _count: { attends: 0 },
      };

      challengeInquiryRepository.findChallengeDetailById.mockResolvedValue(mockChallenge);
      challengeInquiryRepository.findParticipatesByChallenge.mockResolvedValue([]);

      const result = await challengeInquiryService.getParticipateList('challenge-123', 1, 10);

      expect(challengeInquiryRepository.findChallengeDetailById).toHaveBeenCalledWith('challenge-123');
      expect(challengeInquiryRepository.findParticipatesByChallenge).toHaveBeenCalled();
      expect(result.success).toBe(true);
      expect(result.data.participates).toHaveLength(0);
    });

    it('페이지네이션이 올바르게 계산되어야 함', async () => {
      const mockChallenge = {
        challenge_id: 'challenge-123',
        title: 'React 챌린지',
        _count: { attends: 50 },
      };

      challengeInquiryRepository.findChallengeDetailById.mockResolvedValue(mockChallenge);
      challengeInquiryRepository.findParticipatesByChallenge.mockResolvedValue([]);

      await challengeInquiryService.getParticipateList('challenge-123', 3, 20);

      expect(challengeInquiryRepository.findParticipatesByChallenge).toHaveBeenCalledWith({
        challengeId: 'challenge-123',
        skip: 40, // (3 - 1) * 20
        take: 20,
      });
    });
  });
});
