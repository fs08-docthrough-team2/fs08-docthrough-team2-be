import { describe, it, expect, jest, beforeEach } from '@jest/globals';

// Repository Mock
jest.unstable_mockModule('../../../src/api/repositories/challenge.admin.repository.js', () => ({
  countChallenges: jest.fn(),
  findChallengesForAdmin: jest.fn(),
  findChallengeById: jest.fn(),
  approveChallengeById: jest.fn(),
  rejectChallengeById: jest.fn(),
}));

// Notice Service Mock
jest.unstable_mockModule('../../../src/api/services/notice.service.js', () => ({
  default: {
    addChallengeStateNotice: jest.fn(),
    addAdminChallengeUpdateNotice: jest.fn(),
  },
}));

const challengeAdminRepository = await import(
  '../../../src/api/repositories/challenge.admin.repository.js'
);
const noticeService = await import('../../../src/api/services/notice.service.js');
const challengeAdminService = (await import('../../../src/api/services/challenge.admin.service.js')).default;

describe('Challenge Admin Service Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getChallengeList', () => {
    it('관리자 챌린지 목록을 조회해야 함', async () => {
      const mockChallenges = [
        {
          challenge_no: 1,
          challenge_id: 'challenge-1',
          type: 'OFFICIAL',
          field: 'WEB',
          title: 'React 챌린지',
          capacity: 50,
          created_at: new Date('2025-01-01'),
          deadline: new Date('2025-12-31'),
          status: 'APPROVED',
          _count: { attends: 10 },
        },
      ];

      challengeAdminRepository.countChallenges.mockResolvedValue(25);
      challengeAdminRepository.findChallengesForAdmin.mockResolvedValue(mockChallenges);

      const result = await challengeAdminService.getChallengeList(
        null, // searchKeyword
        null, // status
        1, // page
        10, // pageSize
        '신청시간느림순' // sort
      );

      expect(result.success).toBe(true);
      expect(result.data).toHaveLength(1);
      expect(result.pagination.totalCount).toBe(25);
      expect(result.pagination.totalPages).toBe(3);
    });

    it('한글 status를 영문 enum으로 변환해야 함 - 신청승인', async () => {
      challengeAdminRepository.countChallenges.mockResolvedValue(0);
      challengeAdminRepository.findChallengesForAdmin.mockResolvedValue([]);

      await challengeAdminService.getChallengeList(
        null,
        '신청승인',
        1,
        10,
        '신청시간느림순'
      );

      const whereCondition = challengeAdminRepository.countChallenges.mock.calls[0][0];
      expect(whereCondition.status).toBe('APPROVED');
    });

    it('한글 status를 영문 enum으로 변환해야 함 - 신청거절', async () => {
      challengeAdminRepository.countChallenges.mockResolvedValue(0);
      challengeAdminRepository.findChallengesForAdmin.mockResolvedValue([]);

      await challengeAdminService.getChallengeList(
        null,
        '신청거절',
        1,
        10,
        '신청시간느림순'
      );

      const whereCondition = challengeAdminRepository.countChallenges.mock.calls[0][0];
      expect(whereCondition.status).toBe('REJECTED');
    });

    it('한글 status를 영문 enum으로 변환해야 함 - 신청취소', async () => {
      challengeAdminRepository.countChallenges.mockResolvedValue(0);
      challengeAdminRepository.findChallengesForAdmin.mockResolvedValue([]);

      await challengeAdminService.getChallengeList(
        null,
        '신청취소',
        1,
        10,
        '신청시간느림순'
      );

      const whereCondition = challengeAdminRepository.countChallenges.mock.calls[0][0];
      expect(whereCondition.status).toBe('CANCELLED');
    });

    it('한글 status를 영문 enum으로 변환해야 함 - 신청대기', async () => {
      challengeAdminRepository.countChallenges.mockResolvedValue(0);
      challengeAdminRepository.findChallengesForAdmin.mockResolvedValue([]);

      await challengeAdminService.getChallengeList(
        null,
        '신청대기',
        1,
        10,
        '신청시간느림순'
      );

      const whereCondition = challengeAdminRepository.countChallenges.mock.calls[0][0];
      expect(whereCondition.status).toBe('PENDING');
    });

    it('검색 키워드가 제목 필터에 적용되어야 함', async () => {
      challengeAdminRepository.countChallenges.mockResolvedValue(0);
      challengeAdminRepository.findChallengesForAdmin.mockResolvedValue([]);

      await challengeAdminService.getChallengeList(
        'React',
        null,
        1,
        10,
        '신청시간느림순'
      );

      const whereCondition = challengeAdminRepository.countChallenges.mock.calls[0][0];
      expect(whereCondition.title).toEqual({
        contains: 'React',
        mode: 'insensitive',
      });
    });

    it('정렬 기준이 올바르게 적용되어야 함 - 신청시간빠름순', async () => {
      challengeAdminRepository.countChallenges.mockResolvedValue(0);
      challengeAdminRepository.findChallengesForAdmin.mockResolvedValue([]);

      await challengeAdminService.getChallengeList(
        null,
        null,
        1,
        10,
        '신청시간빠름순'
      );

      const orderBy = challengeAdminRepository.findChallengesForAdmin.mock.calls[0][0].orderBy;
      expect(orderBy).toEqual({ created_at: 'asc' });
    });

    it('정렬 기준이 올바르게 적용되어야 함 - 마감기한빠름순', async () => {
      challengeAdminRepository.countChallenges.mockResolvedValue(0);
      challengeAdminRepository.findChallengesForAdmin.mockResolvedValue([]);

      await challengeAdminService.getChallengeList(
        null,
        null,
        1,
        10,
        '마감기한빠름순'
      );

      const orderBy = challengeAdminRepository.findChallengesForAdmin.mock.calls[0][0].orderBy;
      expect(orderBy).toEqual({ deadline: 'asc' });
    });

    it('응답 데이터 포맷이 올바르게 변환되어야 함', async () => {
      const mockChallenge = {
        challenge_no: 1,
        challenge_id: 'challenge-1',
        type: 'OFFICIAL',
        field: 'WEB',
        title: 'Next.js 챌린지',
        capacity: 100,
        created_at: new Date('2025-01-01'),
        deadline: new Date('2025-12-31'),
        status: 'APPROVED',
        _count: { attends: 25 },
      };

      challengeAdminRepository.countChallenges.mockResolvedValue(1);
      challengeAdminRepository.findChallengesForAdmin.mockResolvedValue([mockChallenge]);

      const result = await challengeAdminService.getChallengeList(
        null,
        null,
        1,
        10,
        '신청시간느림순'
      );

      const challenge = result.data[0];
      expect(challenge.challenge_no).toBe(1);
      expect(challenge.challenge_id).toBe('challenge-1');
      expect(challenge.participants).toBe(25);
      expect(challenge.maxParticipants).toBe(100);
    });
  });

  describe('getChallengeDetail', () => {
    it('챌린지 상세 정보를 조회해야 함', async () => {
      const mockChallenge = {
        challenge_no: 1,
        challenge_id: 'challenge-1',
        title: 'React 챌린지',
        type: 'OFFICIAL',
        field: 'WEB',
        content: '상세 내용',
        deadline: new Date('2025-12-31'),
        capacity: 50,
        source: 'https://example.com',
      };

      challengeAdminRepository.findChallengeById.mockResolvedValue(mockChallenge);

      const result = await challengeAdminService.getChallengeDetail('challenge-1');

      expect(result.success).toBe(true);
      expect(result.data.no).toBe(1);
      expect(result.data.title).toBe('React 챌린지');
    });

    it('존재하지 않는 챌린지는 에러를 던져야 함', async () => {
      challengeAdminRepository.findChallengeById.mockResolvedValue(null);

      await expect(challengeAdminService.getChallengeDetail('invalid-id')).rejects.toThrow(
        /챌린지.*찾을 수 없습니다/
      );
    });
  });

  describe('approveChallenge', () => {
    it('챌린지를 승인하고 알림을 전송해야 함', async () => {
      const mockChallenge = {
        challenge_id: 'challenge-1',
        user_id: 'user-123',
        title: 'React 챌린지',
        status: 'APPROVED',
      };

      challengeAdminRepository.approveChallengeById.mockResolvedValue(mockChallenge);

      const result = await challengeAdminService.approveChallenge('challenge-1');

      expect(result.success).toBe(true);
      expect(result.message).toBe('챌린지가 승인되었습니다.');
      expect(noticeService.default.addChallengeStateNotice).toHaveBeenCalledWith(
        '승인',
        'user-123',
        'React 챌린지'
      );
    });
  });

  describe('rejectChallenge', () => {
    it('챌린지를 거절하고 사유와 함께 알림을 전송해야 함', async () => {
      const mockChallenge = {
        challenge_id: 'challenge-1',
        user_id: 'user-123',
        title: 'React 챌린지',
        status: 'REJECTED',
      };

      challengeAdminRepository.rejectChallengeById.mockResolvedValue(mockChallenge);

      const result = await challengeAdminService.rejectChallenge(
        'challenge-1',
        '중복된 내용입니다'
      );

      expect(result.success).toBe(true);
      expect(result.message).toBe('챌린지가 거절되었습니다.');
      expect(noticeService.default.addAdminChallengeUpdateNotice).toHaveBeenCalledWith(
        '거절',
        'user-123',
        'React 챌린지',
        '중복된 내용입니다'
      );
    });
  });
});
