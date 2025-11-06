import { describe, it, expect, jest, beforeEach } from '@jest/globals';

// Mock repositories
jest.unstable_mockModule('../../../src/api/repositories/challenge.feedback.repository.js', () => ({
  countFeedbacks: jest.fn(),
  findFeedbacksByAttendId: jest.fn(),
  findFeedbackById: jest.fn(),
  findAttendWithChallengeById: jest.fn(),
  createFeedback: jest.fn(),
  findFeedbackWithChallengeById: jest.fn(),
  updateFeedbackById: jest.fn(),
  deleteFeedbackById: jest.fn(),
}));

// Mock user service
jest.unstable_mockModule('../../../src/api/services/user.service.js', () => ({
  getUserFromToken: jest.fn(),
}));

// Mock notice service
jest.unstable_mockModule('../../../src/api/services/notice.service.js', () => ({
  default: {
    addFeedbackReceiveNotice: jest.fn(),
    addModifyNotice: jest.fn(),
  },
}));

const feedbackService = await import('../../../src/api/services/challenge.feedback.service.js');
const feedbackRepository = await import(
  '../../../src/api/repositories/challenge.feedback.repository.js'
);
const userService = await import('../../../src/api/services/user.service.js');
const noticeService = await import('../../../src/api/services/notice.service.js');

describe('Challenge Feedback Service Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getFeedbackList', () => {
    it('피드백 목록을 조회해야 함', async () => {
      const mockFeedbacks = [
        {
          feedback_id: 'feedback-1',
          content: '좋은 작업입니다',
          created_at: new Date(),
        },
        {
          feedback_id: 'feedback-2',
          content: '개선이 필요합니다',
          created_at: new Date(),
        },
      ];

      feedbackRepository.countFeedbacks.mockResolvedValue(25);
      feedbackRepository.findFeedbacksByAttendId.mockResolvedValue(mockFeedbacks);

      const result = await feedbackService.getFeedbackList({
        attend_id: 'attend-123',
        page: 2,
        size: 10,
      });

      expect(feedbackRepository.countFeedbacks).toHaveBeenCalledWith('attend-123');
      expect(feedbackRepository.findFeedbacksByAttendId).toHaveBeenCalledWith({
        attendId: 'attend-123',
        skip: 10,
        take: 10,
      });
      expect(result.items).toEqual(mockFeedbacks);
      expect(result.pagination).toEqual({
        page: 2,
        size: 10,
        total: 25,
        totalPage: 3,
      });
    });

    it('페이지 기본값이 1이어야 함', async () => {
      feedbackRepository.countFeedbacks.mockResolvedValue(0);
      feedbackRepository.findFeedbacksByAttendId.mockResolvedValue([]);

      const result = await feedbackService.getFeedbackList({ attend_id: 'attend-123' });

      expect(feedbackRepository.findFeedbacksByAttendId).toHaveBeenCalledWith({
        attendId: 'attend-123',
        skip: 0,
        take: 10,
      });
      expect(result.pagination.page).toBe(1);
    });

    it('size 기본값이 10이어야 함', async () => {
      feedbackRepository.countFeedbacks.mockResolvedValue(0);
      feedbackRepository.findFeedbacksByAttendId.mockResolvedValue([]);

      const result = await feedbackService.getFeedbackList({ attend_id: 'attend-123' });

      expect(result.pagination.size).toBe(10);
    });
  });

  describe('getFeedbackDetail', () => {
    it('피드백 상세 정보를 조회해야 함', async () => {
      const mockFeedback = {
        feedback_id: 'feedback-123',
        content: '좋은 작업입니다',
        user_id: 'user-123',
        created_at: new Date(),
      };

      feedbackRepository.findFeedbackById.mockResolvedValue(mockFeedback);

      const result = await feedbackService.getFeedbackDetail({ feedback_id: 'feedback-123' });

      expect(feedbackRepository.findFeedbackById).toHaveBeenCalledWith('feedback-123');
      expect(result.item).toEqual(mockFeedback);
    });

    it('피드백을 찾을 수 없으면 에러를 던져야 함', async () => {
      feedbackRepository.findFeedbackById.mockResolvedValue(null);

      await expect(
        feedbackService.getFeedbackDetail({ feedback_id: 'invalid-id' })
      ).rejects.toThrow(/피드백.*찾을 수 없습니다/);
    });
  });

  describe('createFeedback', () => {
    it('피드백을 생성하고 알림을 전송해야 함', async () => {
      const mockReq = {
        cookies: { accessToken: 'valid-token' },
        headers: {},
      };

      const mockAttend = {
        attend_id: 'attend-123',
        user_id: 'work-author-123',
        challenge: {
          challenge_id: 'challenge-123',
          title: 'React 챌린지',
        },
      };

      const mockFeedback = {
        feedback_id: 'feedback-123',
        attend_id: 'attend-123',
        user_id: 'user-123',
        content: '좋은 작업입니다',
      };

      userService.getUserFromToken.mockResolvedValue({ userId: 'user-123', role: 'EXPERT' });
      feedbackRepository.findAttendWithChallengeById.mockResolvedValue(mockAttend);
      feedbackRepository.createFeedback.mockResolvedValue(mockFeedback);
      noticeService.default.addFeedbackReceiveNotice.mockResolvedValue();

      const result = await feedbackService.createFeedback(mockReq, {
        attend_id: 'attend-123',
        content: '좋은 작업입니다',
      });

      expect(userService.getUserFromToken).toHaveBeenCalledWith(mockReq);
      expect(feedbackRepository.findAttendWithChallengeById).toHaveBeenCalledWith('attend-123');
      expect(feedbackRepository.createFeedback).toHaveBeenCalledWith({
        attend_id: 'attend-123',
        user_id: 'user-123',
        content: '좋은 작업입니다',
      });
      expect(noticeService.default.addFeedbackReceiveNotice).toHaveBeenCalledWith(
        'work-author-123',
        'React 챌린지'
      );
      expect(result.message).toBe('피드백이 등록되었습니다.');
      expect(result.feedback_id).toBe('feedback-123');
    });

    it('작업물을 찾을 수 없으면 에러를 던져야 함', async () => {
      const mockReq = {
        cookies: { accessToken: 'valid-token' },
        headers: {},
      };

      userService.getUserFromToken.mockResolvedValue({ userId: 'user-123', role: 'EXPERT' });
      feedbackRepository.findAttendWithChallengeById.mockResolvedValue(null);

      await expect(
        feedbackService.createFeedback(mockReq, {
          attend_id: 'invalid-id',
          content: '좋은 작업입니다',
        })
      ).rejects.toThrow(/작업물.*찾을 수 없습니다/);
    });
  });

  describe('updateFeedback', () => {
    it('본인의 피드백을 수정하고 알림을 전송해야 함', async () => {
      const mockReq = {
        cookies: { accessToken: 'valid-token' },
        headers: {},
      };

      const mockFeedback = {
        feedback_id: 'feedback-123',
        user_id: 'user-123',
        content: '기존 피드백',
        attend: {
          challenge: {
            title: 'React 챌린지',
          },
        },
      };

      userService.getUserFromToken.mockResolvedValue({ userId: 'user-123', role: 'EXPERT' });
      feedbackRepository.findFeedbackWithChallengeById.mockResolvedValue(mockFeedback);
      feedbackRepository.updateFeedbackById.mockResolvedValue();
      noticeService.default.addModifyNotice.mockResolvedValue();

      const result = await feedbackService.updateFeedback(mockReq, {
        feedback_id: 'feedback-123',
        content: '수정된 피드백',
      });

      expect(feedbackRepository.updateFeedbackById).toHaveBeenCalledWith(
        'feedback-123',
        '수정된 피드백'
      );
      expect(noticeService.default.addModifyNotice).toHaveBeenCalledWith(
        '피드백',
        '수정',
        'user-123',
        'React 챌린지'
      );
      expect(result.message).toBe('피드백이 수정되었습니다.');
    });

    it('관리자는 다른 사람의 피드백을 수정할 수 있어야 함', async () => {
      const mockReq = {
        cookies: { accessToken: 'valid-token' },
        headers: {},
      };

      const mockFeedback = {
        feedback_id: 'feedback-123',
        user_id: 'other-user-123',
        content: '기존 피드백',
        attend: {
          challenge: {
            title: 'React 챌린지',
          },
        },
      };

      userService.getUserFromToken.mockResolvedValue({ userId: 'admin-123', role: 'ADMIN' });
      feedbackRepository.findFeedbackWithChallengeById.mockResolvedValue(mockFeedback);
      feedbackRepository.updateFeedbackById.mockResolvedValue();
      noticeService.default.addModifyNotice.mockResolvedValue();

      const result = await feedbackService.updateFeedback(mockReq, {
        feedback_id: 'feedback-123',
        content: '관리자가 수정한 피드백',
      });

      expect(result.message).toBe('피드백이 수정되었습니다.');
    });

    it('피드백을 찾을 수 없으면 에러를 던져야 함', async () => {
      const mockReq = {
        cookies: { accessToken: 'valid-token' },
        headers: {},
      };

      userService.getUserFromToken.mockResolvedValue({ userId: 'user-123', role: 'EXPERT' });
      feedbackRepository.findFeedbackWithChallengeById.mockResolvedValue(null);

      await expect(
        feedbackService.updateFeedback(mockReq, {
          feedback_id: 'invalid-id',
          content: '수정된 피드백',
        })
      ).rejects.toThrow(/피드백.*찾을 수 없습니다/);
    });

    it('수정 권한이 없으면 에러를 던져야 함', async () => {
      const mockReq = {
        cookies: { accessToken: 'valid-token' },
        headers: {},
      };

      const mockFeedback = {
        feedback_id: 'feedback-123',
        user_id: 'other-user-123',
        content: '기존 피드백',
        attend: {
          challenge: {
            title: 'React 챌린지',
          },
        },
      };

      userService.getUserFromToken.mockResolvedValue({ userId: 'user-123', role: 'USER' });
      feedbackRepository.findFeedbackWithChallengeById.mockResolvedValue(mockFeedback);

      await expect(
        feedbackService.updateFeedback(mockReq, {
          feedback_id: 'feedback-123',
          content: '수정된 피드백',
        })
      ).rejects.toThrow(/수정.*권한.*없습니다/);
    });
  });

  describe('deleteFeedback', () => {
    it('본인의 피드백을 삭제하고 알림을 전송해야 함', async () => {
      const mockReq = {
        cookies: { accessToken: 'valid-token' },
        headers: {},
      };

      const mockFeedback = {
        feedback_id: 'feedback-123',
        user_id: 'user-123',
        content: '삭제할 피드백',
        attend: {
          challenge: {
            title: 'React 챌린지',
          },
        },
      };

      userService.getUserFromToken.mockResolvedValue({ userId: 'user-123', role: 'EXPERT' });
      feedbackRepository.findFeedbackWithChallengeById.mockResolvedValue(mockFeedback);
      feedbackRepository.deleteFeedbackById.mockResolvedValue();
      noticeService.default.addModifyNotice.mockResolvedValue();

      const result = await feedbackService.deleteFeedback(mockReq, {
        feedback_id: 'feedback-123',
      });

      expect(feedbackRepository.deleteFeedbackById).toHaveBeenCalledWith('feedback-123');
      expect(noticeService.default.addModifyNotice).toHaveBeenCalledWith(
        '피드백',
        '삭제',
        'user-123',
        'React 챌린지'
      );
      expect(result.message).toBe('피드백이 삭제되었습니다.');
    });

    it('관리자는 다른 사람의 피드백을 삭제할 수 있어야 함', async () => {
      const mockReq = {
        cookies: { accessToken: 'valid-token' },
        headers: {},
      };

      const mockFeedback = {
        feedback_id: 'feedback-123',
        user_id: 'other-user-123',
        content: '삭제할 피드백',
        attend: {
          challenge: {
            title: 'React 챌린지',
          },
        },
      };

      userService.getUserFromToken.mockResolvedValue({ userId: 'admin-123', role: 'ADMIN' });
      feedbackRepository.findFeedbackWithChallengeById.mockResolvedValue(mockFeedback);
      feedbackRepository.deleteFeedbackById.mockResolvedValue();
      noticeService.default.addModifyNotice.mockResolvedValue();

      const result = await feedbackService.deleteFeedback(mockReq, {
        feedback_id: 'feedback-123',
      });

      expect(result.message).toBe('피드백이 삭제되었습니다.');
    });

    it('피드백을 찾을 수 없으면 에러를 던져야 함', async () => {
      const mockReq = {
        cookies: { accessToken: 'valid-token' },
        headers: {},
      };

      userService.getUserFromToken.mockResolvedValue({ userId: 'user-123', role: 'EXPERT' });
      feedbackRepository.findFeedbackWithChallengeById.mockResolvedValue(null);

      await expect(
        feedbackService.deleteFeedback(mockReq, {
          feedback_id: 'invalid-id',
        })
      ).rejects.toThrow(/피드백.*찾을 수 없습니다/);
    });

    it('삭제 권한이 없으면 에러를 던져야 함', async () => {
      const mockReq = {
        cookies: { accessToken: 'valid-token' },
        headers: {},
      };

      const mockFeedback = {
        feedback_id: 'feedback-123',
        user_id: 'other-user-123',
        content: '삭제할 피드백',
        attend: {
          challenge: {
            title: 'React 챌린지',
          },
        },
      };

      userService.getUserFromToken.mockResolvedValue({ userId: 'user-123', role: 'USER' });
      feedbackRepository.findFeedbackWithChallengeById.mockResolvedValue(mockFeedback);

      await expect(
        feedbackService.deleteFeedback(mockReq, {
          feedback_id: 'feedback-123',
        })
      ).rejects.toThrow(/삭제.*권한.*없습니다/);
    });
  });
});
