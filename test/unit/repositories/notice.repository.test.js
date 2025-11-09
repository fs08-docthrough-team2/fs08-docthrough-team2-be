import { describe, it, expect, jest, beforeEach } from '@jest/globals';

// Prisma Mock
const mockPrisma = {
  notice: {
    create: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
    count: jest.fn(),
    findMany: jest.fn(),
  },
};

jest.unstable_mockModule('../../../src/config/prisma.config.js', () => ({
  default: mockPrisma,
}));

const noticeRepository = await import(
  '../../../src/api/repositories/notice.repository.js'
);

describe('Notice Repository Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createNotice', () => {
    it('알림을 생성해야 함', async () => {
      const noticeData = {
        user_id: 'user-123',
        content: 'New notification',
        type: 'INFO',
      };

      const mockCreatedNotice = {
        notice_id: 'notice-1',
        ...noticeData,
        isRead: false,
        created_at: new Date('2025-01-01'),
      };

      mockPrisma.notice.create.mockResolvedValue(mockCreatedNotice);

      const result = await noticeRepository.createNotice(noticeData);

      expect(mockPrisma.notice.create).toHaveBeenCalledTimes(1);
      expect(mockPrisma.notice.create).toHaveBeenCalledWith({ data: noticeData });
      expect(result).toEqual(mockCreatedNotice);
    });

    it('모든 필드가 포함된 알림을 생성해야 함', async () => {
      const noticeData = {
        user_id: 'user-123',
        content: 'Complete notification',
        type: 'WARNING',
        isRead: false,
      };

      const mockCreatedNotice = {
        notice_id: 'notice-2',
        ...noticeData,
        created_at: new Date('2025-01-01'),
      };

      mockPrisma.notice.create.mockResolvedValue(mockCreatedNotice);

      const result = await noticeRepository.createNotice(noticeData);

      expect(mockPrisma.notice.create).toHaveBeenCalledWith({ data: noticeData });
      expect(result).toEqual(mockCreatedNotice);
    });
  });

  describe('findNoticeById', () => {
    it('ID로 알림을 조회해야 함', async () => {
      const mockNotice = {
        isRead: false,
      };

      mockPrisma.notice.findUnique.mockResolvedValue(mockNotice);

      const result = await noticeRepository.findNoticeById('notice-1');

      expect(mockPrisma.notice.findUnique).toHaveBeenCalledTimes(1);
      expect(mockPrisma.notice.findUnique).toHaveBeenCalledWith({
        where: { notice_id: 'notice-1' },
        select: { isRead: true },
      });
      expect(result).toEqual(mockNotice);
    });

    it('존재하지 않는 알림은 null을 반환해야 함', async () => {
      mockPrisma.notice.findUnique.mockResolvedValue(null);

      const result = await noticeRepository.findNoticeById('non-existent');

      expect(result).toBeNull();
    });

    it('isRead 필드만 select해야 함', async () => {
      mockPrisma.notice.findUnique.mockResolvedValue({ isRead: true });

      await noticeRepository.findNoticeById('notice-1');

      const callArgs = mockPrisma.notice.findUnique.mock.calls[0][0];
      expect(callArgs.select.isRead).toBe(true);
      expect(Object.keys(callArgs.select).length).toBe(1);
    });
  });

  describe('updateNoticeAsRead', () => {
    it('알림을 읽음 상태로 업데이트해야 함', async () => {
      const mockUpdatedNotice = {
        notice_id: 'notice-1',
        user_id: 'user-123',
        content: 'Test notification',
        isRead: true,
        created_at: new Date('2025-01-01'),
      };

      mockPrisma.notice.update.mockResolvedValue(mockUpdatedNotice);

      const result = await noticeRepository.updateNoticeAsRead('notice-1');

      expect(mockPrisma.notice.update).toHaveBeenCalledTimes(1);
      expect(mockPrisma.notice.update).toHaveBeenCalledWith({
        where: { notice_id: 'notice-1' },
        data: { isRead: true },
      });
      expect(result).toEqual(mockUpdatedNotice);
    });

    it('isRead를 true로 설정해야 함', async () => {
      mockPrisma.notice.update.mockResolvedValue({
        notice_id: 'notice-1',
        isRead: true,
      });

      await noticeRepository.updateNoticeAsRead('notice-1');

      const callArgs = mockPrisma.notice.update.mock.calls[0][0];
      expect(callArgs.data.isRead).toBe(true);
    });
  });

  describe('countUserNotices', () => {
    it('사용자 알림 개수를 조회해야 함', async () => {
      mockPrisma.notice.count.mockResolvedValue(15);

      const result = await noticeRepository.countUserNotices('user-123');

      expect(mockPrisma.notice.count).toHaveBeenCalledTimes(1);
      expect(mockPrisma.notice.count).toHaveBeenCalledWith({
        where: { user_id: 'user-123' },
      });
      expect(result).toBe(15);
    });

    it('알림이 없으면 0을 반환해야 함', async () => {
      mockPrisma.notice.count.mockResolvedValue(0);

      const result = await noticeRepository.countUserNotices('user-999');

      expect(result).toBe(0);
    });
  });

  describe('findUserNotices', () => {
    it('사용자 알림 목록을 조회해야 함', async () => {
      const mockNotices = [
        {
          notice_id: 'notice-1',
          user_id: 'user-123',
          content: 'Notification 1',
          isRead: false,
          created_at: new Date('2025-01-02'),
          attend: null,
        },
        {
          notice_id: 'notice-2',
          user_id: 'user-123',
          content: 'Notification 2',
          isRead: true,
          created_at: new Date('2025-01-01'),
          attend: {
            attend_id: 'attend-123',
            title: 'Test Work',
            is_delete: false,
            delete_reason: null,
          },
        },
      ];

      mockPrisma.notice.findMany.mockResolvedValue(mockNotices);

      const result = await noticeRepository.findUserNotices('user-123', 0, 10);

      expect(mockPrisma.notice.findMany).toHaveBeenCalledTimes(1);
      expect(mockPrisma.notice.findMany).toHaveBeenCalledWith({
        where: { user_id: 'user-123' },
        include: {
          attend: {
            select: {
              attend_id: true,
              delete_reason: true,
              is_delete: true,
              title: true,
            }
          }
        },
        orderBy: { created_at: 'desc' },
        skip: 0,
        take: 10,
      });
      expect(result).toEqual(mockNotices);
    });

    it('페이지네이션을 적용해야 함', async () => {
      mockPrisma.notice.findMany.mockResolvedValue([]);

      await noticeRepository.findUserNotices('user-123', 20, 10);

      const callArgs = mockPrisma.notice.findMany.mock.calls[0][0];
      expect(callArgs.skip).toBe(20);
      expect(callArgs.take).toBe(10);
    });

    it('created_at 내림차순으로 정렬해야 함', async () => {
      mockPrisma.notice.findMany.mockResolvedValue([]);

      await noticeRepository.findUserNotices('user-123', 0, 10);

      const callArgs = mockPrisma.notice.findMany.mock.calls[0][0];
      expect(callArgs.orderBy).toEqual({ created_at: 'desc' });
    });

    it('빈 결과도 정상 처리되어야 함', async () => {
      mockPrisma.notice.findMany.mockResolvedValue([]);

      const result = await noticeRepository.findUserNotices('user-999', 0, 10);

      expect(result).toEqual([]);
    });

    it('다른 limit 값을 적용할 수 있어야 함', async () => {
      mockPrisma.notice.findMany.mockResolvedValue([]);

      await noticeRepository.findUserNotices('user-123', 0, 20);

      const callArgs = mockPrisma.notice.findMany.mock.calls[0][0];
      expect(callArgs.take).toBe(20);
    });
  });
});
