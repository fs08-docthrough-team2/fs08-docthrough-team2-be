import { describe, it, expect, jest, beforeEach } from '@jest/globals';

// Prisma Mock
const mockPrisma = {
  feedback: {
    count: jest.fn(),
    findMany: jest.fn(),
    findFirst: jest.fn(),
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
  attend: {
    findUnique: jest.fn(),
  },
};

jest.unstable_mockModule('../../../src/config/prisma.config.js', () => ({
  default: mockPrisma,
}));

const challengeFeedbackRepository = await import(
  '../../../src/api/repositories/challenge.feedback.repository.js'
);

describe('Challenge Feedback Repository Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('countFeedbacks', () => {
    it('피드백 개수를 조회해야 함', async () => {
      mockPrisma.feedback.count.mockResolvedValue(15);

      const result = await challengeFeedbackRepository.countFeedbacks('attend-123');

      expect(mockPrisma.feedback.count).toHaveBeenCalledTimes(1);
      expect(mockPrisma.feedback.count).toHaveBeenCalledWith({
        where: { attend_id: 'attend-123' },
      });
      expect(result).toBe(15);
    });

    it('피드백이 없으면 0을 반환해야 함', async () => {
      mockPrisma.feedback.count.mockResolvedValue(0);

      const result = await challengeFeedbackRepository.countFeedbacks('attend-999');

      expect(result).toBe(0);
    });
  });

  describe('findFeedbacksByAttendId', () => {
    it('attend ID로 피드백 목록을 조회해야 함', async () => {
      const mockFeedbacks = [
        {
          feedback_id: 'feedback-1',
          content: 'Great work!',
          created_at: new Date('2025-01-02'),
          updated_at: new Date('2025-01-02'),
          user: {
            nick_name: 'Reviewer1',
            role: 'USER',
          },
        },
        {
          feedback_id: 'feedback-2',
          content: 'Nice implementation',
          created_at: new Date('2025-01-01'),
          updated_at: new Date('2025-01-01'),
          user: {
            nick_name: 'Reviewer2',
            role: 'ADMIN',
          },
        },
      ];

      mockPrisma.feedback.findMany.mockResolvedValue(mockFeedbacks);

      const result = await challengeFeedbackRepository.findFeedbacksByAttendId({
        attendId: 'attend-123',
        skip: 0,
        take: 10,
      });

      expect(mockPrisma.feedback.findMany).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockFeedbacks);
    });

    it('올바른 select 필드를 사용해야 함', async () => {
      mockPrisma.feedback.findMany.mockResolvedValue([]);

      await challengeFeedbackRepository.findFeedbacksByAttendId({
        attendId: 'attend-123',
        skip: 0,
        take: 10,
      });

      const callArgs = mockPrisma.feedback.findMany.mock.calls[0][0];
      expect(callArgs.select.feedback_id).toBe(true);
      expect(callArgs.select.content).toBe(true);
      expect(callArgs.select.created_at).toBe(true);
      expect(callArgs.select.updated_at).toBe(true);
      expect(callArgs.select.user).toEqual({
        select: {
          nick_name: true,
          role: true,
        },
      });
    });

    it('페이지네이션을 적용해야 함', async () => {
      mockPrisma.feedback.findMany.mockResolvedValue([]);

      await challengeFeedbackRepository.findFeedbacksByAttendId({
        attendId: 'attend-123',
        skip: 20,
        take: 10,
      });

      const callArgs = mockPrisma.feedback.findMany.mock.calls[0][0];
      expect(callArgs.skip).toBe(20);
      expect(callArgs.take).toBe(10);
    });

    it('created_at 내림차순으로 정렬해야 함', async () => {
      mockPrisma.feedback.findMany.mockResolvedValue([]);

      await challengeFeedbackRepository.findFeedbacksByAttendId({
        attendId: 'attend-123',
        skip: 0,
        take: 10,
      });

      const callArgs = mockPrisma.feedback.findMany.mock.calls[0][0];
      expect(callArgs.orderBy).toEqual({ created_at: 'desc' });
    });
  });

  describe('findFeedbackById', () => {
    it('ID로 피드백 상세를 조회해야 함', async () => {
      const mockFeedback = {
        feedback_id: 'feedback-1',
        content: 'Test feedback',
        created_at: new Date('2025-01-01'),
        updated_at: new Date('2025-01-01'),
        user: {
          nick_name: 'TestUser',
          role: 'USER',
        },
        attend: {
          attend_id: 'attend-123',
        },
      };

      mockPrisma.feedback.findFirst.mockResolvedValue(mockFeedback);

      const result = await challengeFeedbackRepository.findFeedbackById('feedback-1');

      expect(mockPrisma.feedback.findFirst).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockFeedback);
    });

    it('올바른 select 필드를 사용해야 함', async () => {
      mockPrisma.feedback.findFirst.mockResolvedValue(null);

      await challengeFeedbackRepository.findFeedbackById('feedback-1');

      const callArgs = mockPrisma.feedback.findFirst.mock.calls[0][0];
      expect(callArgs.select.feedback_id).toBe(true);
      expect(callArgs.select.content).toBe(true);
      expect(callArgs.select.created_at).toBe(true);
      expect(callArgs.select.updated_at).toBe(true);
      expect(callArgs.select.user).toEqual({
        select: {
          nick_name: true,
          role: true,
        },
      });
      expect(callArgs.select.attend).toEqual({
        select: {
          attend_id: true,
        },
      });
    });

    it('존재하지 않는 피드백은 null을 반환해야 함', async () => {
      mockPrisma.feedback.findFirst.mockResolvedValue(null);

      const result = await challengeFeedbackRepository.findFeedbackById('non-existent');

      expect(result).toBeNull();
    });
  });

  describe('findFeedbackWithChallengeById', () => {
    it('챌린지 정보를 포함한 피드백을 조회해야 함', async () => {
      const mockFeedback = {
        user_id: 'user-123',
        attend: {
          challenge: {
            title: 'Test Challenge',
          },
        },
      };

      mockPrisma.feedback.findUnique.mockResolvedValue(mockFeedback);

      const result = await challengeFeedbackRepository.findFeedbackWithChallengeById(
        'feedback-1'
      );

      expect(mockPrisma.feedback.findUnique).toHaveBeenCalledTimes(1);
      expect(mockPrisma.feedback.findUnique).toHaveBeenCalledWith({
        where: { feedback_id: 'feedback-1' },
        select: {
          user_id: true,
          attend: {
            select: {
              challenge: {
                select: {
                  title: true,
                },
              },
            },
          },
        },
      });
      expect(result).toEqual(mockFeedback);
    });

    it('존재하지 않는 피드백은 null을 반환해야 함', async () => {
      mockPrisma.feedback.findUnique.mockResolvedValue(null);

      const result = await challengeFeedbackRepository.findFeedbackWithChallengeById(
        'non-existent'
      );

      expect(result).toBeNull();
    });
  });

  describe('findAttendWithChallengeById', () => {
    it('챌린지 정보를 포함한 attend를 조회해야 함', async () => {
      const mockAttend = {
        attend_id: 'attend-123',
        user_id: 'user-123',
        challenge: {
          title: 'Test Challenge',
        },
      };

      mockPrisma.attend.findUnique.mockResolvedValue(mockAttend);

      const result = await challengeFeedbackRepository.findAttendWithChallengeById(
        'attend-123'
      );

      expect(mockPrisma.attend.findUnique).toHaveBeenCalledTimes(1);
      expect(mockPrisma.attend.findUnique).toHaveBeenCalledWith({
        where: { attend_id: 'attend-123' },
        select: {
          attend_id: true,
          user_id: true,
          challenge: {
            select: {
              title: true,
            },
          },
        },
      });
      expect(result).toEqual(mockAttend);
    });

    it('존재하지 않는 attend는 null을 반환해야 함', async () => {
      mockPrisma.attend.findUnique.mockResolvedValue(null);

      const result = await challengeFeedbackRepository.findAttendWithChallengeById(
        'non-existent'
      );

      expect(result).toBeNull();
    });
  });

  describe('createFeedback', () => {
    it('피드백을 생성해야 함', async () => {
      const feedbackData = {
        attend_id: 'attend-123',
        user_id: 'user-456',
        content: 'Great work!',
      };

      const mockCreatedFeedback = {
        feedback_id: 'feedback-new',
        ...feedbackData,
        created_at: new Date('2025-01-01'),
      };

      mockPrisma.feedback.create.mockResolvedValue(mockCreatedFeedback);

      const result = await challengeFeedbackRepository.createFeedback(feedbackData);

      expect(mockPrisma.feedback.create).toHaveBeenCalledTimes(1);
      expect(mockPrisma.feedback.create).toHaveBeenCalledWith({ data: feedbackData });
      expect(result).toEqual(mockCreatedFeedback);
    });
  });

  describe('updateFeedbackById', () => {
    it('피드백을 수정해야 함', async () => {
      const updatedContent = 'Updated feedback content';
      const mockUpdatedFeedback = {
        feedback_id: 'feedback-1',
        content: updatedContent,
        updated_at: expect.any(Date),
      };

      mockPrisma.feedback.update.mockResolvedValue(mockUpdatedFeedback);

      const result = await challengeFeedbackRepository.updateFeedbackById(
        'feedback-1',
        updatedContent
      );

      expect(mockPrisma.feedback.update).toHaveBeenCalledTimes(1);
      expect(result.content).toBe(updatedContent);
    });

    it('수정 시 updated_at을 업데이트해야 함', async () => {
      mockPrisma.feedback.update.mockResolvedValue({});

      await challengeFeedbackRepository.updateFeedbackById('feedback-1', 'New content');

      const callArgs = mockPrisma.feedback.update.mock.calls[0][0];
      expect(callArgs.data.content).toBe('New content');
      expect(callArgs.data.updated_at).toBeInstanceOf(Date);
    });
  });

  describe('deleteFeedbackById', () => {
    it('피드백을 삭제해야 함', async () => {
      const mockDeletedFeedback = {
        feedback_id: 'feedback-1',
        content: 'Deleted feedback',
      };

      mockPrisma.feedback.delete.mockResolvedValue(mockDeletedFeedback);

      const result = await challengeFeedbackRepository.deleteFeedbackById('feedback-1');

      expect(mockPrisma.feedback.delete).toHaveBeenCalledTimes(1);
      expect(mockPrisma.feedback.delete).toHaveBeenCalledWith({
        where: { feedback_id: 'feedback-1' },
      });
      expect(result).toEqual(mockDeletedFeedback);
    });
  });
});
