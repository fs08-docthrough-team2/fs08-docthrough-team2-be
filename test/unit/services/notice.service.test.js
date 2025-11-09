import { describe, it, expect, jest, beforeEach } from '@jest/globals';

// Repository Mock
jest.unstable_mockModule('../../../src/api/repositories/notice.repository.js', () => ({
  createNotice: jest.fn(),
  findNoticeById: jest.fn(),
  updateNoticeAsRead: jest.fn(),
  countUserNotices: jest.fn(),
  findUserNotices: jest.fn(),
}));

// Import service AFTER mocks are defined
const noticeService = (await import('../../../src/api/services/notice.service.js')).default;
const noticeRepository = await import('../../../src/api/repositories/notice.repository.js');

describe('Notice Service Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('addModifyNotice', () => {
    it('챌린지 수정 알림을 생성해야 함', async () => {
      noticeRepository.createNotice.mockResolvedValue({
        notice_id: 'test-notice-id',
        user_id: 'test-user-id',
        type: 'CHALLENGE',
        content: '챌린지(이)가 수정되었습니다. 챌린지 제목: 테스트 챌린지, 변경일: 2025-11-05',
        isRead: false,
      });

      const result = await noticeService.addModifyNotice(
        '챌린지',
        '수정',
        'test-user-id',
        '테스트 챌린지'
      );

      expect(result).toBeNull();
      expect(noticeRepository.createNotice).toHaveBeenCalledTimes(1);
      expect(noticeRepository.createNotice).toHaveBeenCalledWith(
        expect.objectContaining({
          user_id: 'test-user-id',
          type: 'CHALLENGE',
          isRead: false,
        })
      );
    });

    it('작업물 삭제 알림을 생성해야 함', async () => {
      noticeRepository.createNotice.mockResolvedValue({});

      await noticeService.addModifyNotice('작업물', '삭제', 'user-123', '챌린지 제목');

      expect(noticeRepository.createNotice).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'ATTEND',
        })
      );
    });

    it('피드백 업데이트 알림을 생성해야 함', async () => {
      noticeRepository.createNotice.mockResolvedValue({});

      await noticeService.addModifyNotice('피드백', '업데이트', 'user-123', '챌린지 제목');

      expect(noticeRepository.createNotice).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'FEEDBACK',
        })
      );
    });

    it('알 수 없는 타입은 UNKNOWN으로 설정해야 함', async () => {
      noticeRepository.createNotice.mockResolvedValue({});

      await noticeService.addModifyNotice('알수없음', '생성', 'user-123', '챌린지 제목');

      expect(noticeRepository.createNotice).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'UNKNOWN',
        })
      );
    });
  });

  describe('addMarkNoticeAsRead', () => {
    it('알림을 읽음 상태로 변경해야 함', async () => {
      const mockNotice = {
        notice_id: 'notice-123',
        isRead: false,
      };

      noticeRepository.findNoticeById.mockResolvedValue(mockNotice);
      noticeRepository.updateNoticeAsRead.mockResolvedValue({
        ...mockNotice,
        isRead: true,
      });

      const result = await noticeService.addMarkNoticeAsRead('notice-123');

      expect(noticeRepository.findNoticeById).toHaveBeenCalledWith('notice-123');
      expect(noticeRepository.updateNoticeAsRead).toHaveBeenCalledWith('notice-123');
      expect(result).toEqual(mockNotice);
    });

    it('존재하지 않는 알림은 에러를 던져야 함', async () => {
      noticeRepository.findNoticeById.mockResolvedValue(null);

      await expect(noticeService.addMarkNoticeAsRead('invalid-id')).rejects.toThrow(
        '알림을 찾을 수 없습니다.'
      );

      expect(noticeRepository.updateNoticeAsRead).not.toHaveBeenCalled();
    });

    it('이미 읽은 알림은 에러를 던져야 함', async () => {
      const mockNotice = {
        notice_id: 'notice-123',
        isRead: true,
      };

      noticeRepository.findNoticeById.mockResolvedValue(mockNotice);

      await expect(noticeService.addMarkNoticeAsRead('notice-123')).rejects.toThrow(
        '이미 읽음 상태인 알림입니다.'
      );

      expect(noticeRepository.updateNoticeAsRead).not.toHaveBeenCalled();
    });

    it('에러에 적절한 상태 코드가 설정되어야 함', async () => {
      noticeRepository.findNoticeById.mockResolvedValue(null);

      try {
        await noticeService.addMarkNoticeAsRead('invalid-id');
      } catch (error) {
        expect(error.status).toBe(404);
      }
    });
  });

  describe('getUserNotice', () => {
    it('사용자 알림 목록을 조회해야 함', async () => {
      const mockNotices = [
        { notice_id: '1', content: '알림1', isRead: false },
        { notice_id: '2', content: '알림2', isRead: true },
      ];

      noticeRepository.countUserNotices.mockResolvedValue(25);
      noticeRepository.findUserNotices.mockResolvedValue(mockNotices);

      const result = await noticeService.getUserNotice('user-123', 2, 10);

      expect(noticeRepository.countUserNotices).toHaveBeenCalledWith('user-123');
      expect(noticeRepository.findUserNotices).toHaveBeenCalledWith('user-123', 10, 10);
      expect(result).toEqual({
        success: true,
        data: mockNotices,
        pagination: {
          page: 2,
          pageSize: 10,
          totalCount: 25,
          totalPages: 3,
        },
      });
    });

    it('페이지네이션 계산이 정확해야 함', async () => {
      noticeRepository.countUserNotices.mockResolvedValue(100);
      noticeRepository.findUserNotices.mockResolvedValue([]);

      const result = await noticeService.getUserNotice('user-123', 5, 20);

      expect(noticeRepository.findUserNotices).toHaveBeenCalledWith('user-123', 80, 20);
      expect(result.pagination).toEqual({
        page: 5,
        pageSize: 20,
        totalCount: 100,
        totalPages: 5,
      });
    });

    it('totalPages는 올림 처리되어야 함', async () => {
      noticeRepository.countUserNotices.mockResolvedValue(25);
      noticeRepository.findUserNotices.mockResolvedValue([]);

      const result = await noticeService.getUserNotice('user-123', 1, 10);

      expect(result.pagination.totalPages).toBe(3); // 25 / 10 = 2.5 -> 3
    });

    it('빈 결과도 정상 처리되어야 함', async () => {
      noticeRepository.countUserNotices.mockResolvedValue(0);
      noticeRepository.findUserNotices.mockResolvedValue([]);

      const result = await noticeService.getUserNotice('user-123', 1, 10);

      expect(result.success).toBe(true);
      expect(result.data).toEqual([]);
      expect(result.pagination.totalCount).toBe(0);
      expect(result.pagination.totalPages).toBe(0);
    });
  });

  describe('addWorkSubmitNotice', () => {
    it('작업물 제출 알림을 생성해야 함', async () => {
      noticeRepository.createNotice.mockResolvedValue({});

      const result = await noticeService.addWorkSubmitNotice('user-123', '테스트 챌린지');

      expect(noticeRepository.createNotice).toHaveBeenCalledWith(
        expect.objectContaining({
          user_id: 'user-123',
          type: 'ATTEND',
          isRead: false,
        })
      );
      expect(result).toBeNull();
    });

    it('알림 내용에 챌린지 제목이 포함되어야 함', async () => {
      let capturedContent = '';
      noticeRepository.createNotice.mockImplementation((data) => {
        capturedContent = data.content;
        return Promise.resolve({});
      });

      await noticeService.addWorkSubmitNotice('user-123', 'React 챌린지');

      expect(capturedContent).toContain('React 챌린지');
      expect(capturedContent).toContain('새로운 작업물이 제출되었습니다');
    });
  });

  describe('addFeedbackReceiveNotice', () => {
    it('피드백 수신 알림을 생성해야 함', async () => {
      noticeRepository.createNotice.mockResolvedValue({});

      await noticeService.addFeedbackReceiveNotice('user-123', '테스트 챌린지');

      expect(noticeRepository.createNotice).toHaveBeenCalledWith(
        expect.objectContaining({
          user_id: 'user-123',
          type: 'FEEDBACK',
          content: expect.stringContaining('새로운 피드백이 도착했습니다'),
        })
      );
    });
  });

  describe('addChallengeDeadlineNotice', () => {
    it('마감일 알림을 생성해야 함', async () => {
      noticeRepository.createNotice.mockResolvedValue({});

      await noticeService.addChallengeDeadlineNotice('user-123', '테스트 챌린지');

      expect(noticeRepository.createNotice).toHaveBeenCalledWith(
        expect.objectContaining({
          user_id: 'user-123',
          type: 'CHALLENGE',
          content: expect.stringContaining('마감일이 다가왔습니다'),
        })
      );
    });
  });

  describe('addAdminChallengeUpdateNotice', () => {
    it('관리자 챌린지 업데이트 알림을 생성해야 함', async () => {
      noticeRepository.createNotice.mockResolvedValue({});

      await noticeService.addAdminChallengeUpdateNotice(
        '수정',
        'user-123',
        '테스트 챌린지',
        '내용이 부적절합니다'
      );

      expect(noticeRepository.createNotice).toHaveBeenCalledWith(
        expect.objectContaining({
          user_id: 'user-123',
          type: 'APPROVAL',
          content: expect.stringContaining('어드민이 챌린지를'),
        })
      );
    });

    it('알림 내용에 사유가 포함되어야 함', async () => {
      let capturedContent = '';
      noticeRepository.createNotice.mockImplementation((data) => {
        capturedContent = data.content;
        return Promise.resolve({});
      });

      await noticeService.addAdminChallengeUpdateNotice(
        '거절',
        'user-123',
        '테스트 챌린지',
        '중복된 내용입니다'
      );

      expect(capturedContent).toContain('중복된 내용입니다');
      expect(capturedContent).toContain('거절');
    });
  });

  describe('addAdminWorkUpdateNotice', () => {
    it('관리자 작업물 업데이트 알림을 생성해야 함', async () => {
      noticeRepository.createNotice.mockResolvedValue({});

      await noticeService.addAdminWorkUpdateNotice(
        '삭제',
        'user-123',
        '테스트 챌린지',
        '부적절한 내용입니다',
        'attend-456'
      );

      expect(noticeRepository.createNotice).toHaveBeenCalledWith(
        expect.objectContaining({
          user_id: 'user-123',
          attend_id: 'attend-456',
          type: 'APPROVAL',
          content: expect.stringContaining('어드민이 작업물을'),
        })
      );
    });

    it('attend_id가 null일 때도 정상 동작해야 함', async () => {
      noticeRepository.createNotice.mockResolvedValue({});

      await noticeService.addAdminWorkUpdateNotice(
        '수정',
        'user-123',
        '테스트 챌린지',
        '내용을 수정했습니다'
      );

      expect(noticeRepository.createNotice).toHaveBeenCalledWith(
        expect.objectContaining({
          user_id: 'user-123',
          attend_id: null,
          type: 'APPROVAL',
        })
      );
    });

    it('알림 내용에 사유가 포함되어야 함', async () => {
      let capturedContent = '';
      noticeRepository.createNotice.mockImplementation((data) => {
        capturedContent = data.content;
        return Promise.resolve({});
      });

      await noticeService.addAdminWorkUpdateNotice(
        '삭제',
        'user-123',
        '테스트 챌린지',
        '저작권 위반',
        'attend-789'
      );

      expect(capturedContent).toContain('저작권 위반');
      expect(capturedContent).toContain('삭제');
    });
  });
});
