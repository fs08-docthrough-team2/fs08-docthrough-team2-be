import { describe, it, expect, jest, beforeEach } from '@jest/globals';

// Mock repositories
jest.unstable_mockModule('../../../src/api/repositories/challenge.work.repository.js', () => ({
  findWorksByChallengeId: jest.fn(),
  countWorksByChallengeId: jest.fn(),
  findWorkById: jest.fn(),
  countSavesByUserId: jest.fn(),
  findSavesByUserId: jest.fn(),
  findSaveById: jest.fn(),
  findChallengeIsClose: jest.fn(),
  findExistingWork: jest.fn(),
  createWork: jest.fn(),
  findWorkWithChallengeById: jest.fn(),
  updateWorkById: jest.fn(),
  deleteLikesByAttendId: jest.fn(),
  deleteFeedbacksByAttendId: jest.fn(),
  deleteWorkById: jest.fn(),
  findExistingLike: jest.fn(),
  deleteLikeById: jest.fn(),
  createLike: jest.fn(),
}));

// Mock user service
jest.unstable_mockModule('../../../src/api/services/user.service.js', () => ({
  getUserFromToken: jest.fn(),
}));

// Mock notice service
jest.unstable_mockModule('../../../src/api/services/notice.service.js', () => ({
  default: {
    addWorkSubmitNotice: jest.fn(),
    addModifyNotice: jest.fn(),
  },
}));

const workService = await import('../../../src/api/services/challenge.work.service.js');
const workRepository = await import('../../../src/api/repositories/challenge.work.repository.js');
const userService = await import('../../../src/api/services/user.service.js');
const noticeService = await import('../../../src/api/services/notice.service.js');

describe('Challenge Work Service Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getWorkList', () => {
    it('작업물 목록을 좋아요 순으로 조회해야 함', async () => {
      const mockWorks = [
        {
          attend_id: 'attend-1',
          user: { nick_name: '유저1', role: 'USER' },
          likes: [{ liker: true }, { liker: true }],
          created_at: new Date('2025-01-01'),
        },
        {
          attend_id: 'attend-2',
          user: { nick_name: '유저2', role: 'EXPERT' },
          likes: [{ liker: true }],
          created_at: new Date('2025-01-02'),
        },
      ];

      workRepository.findWorksByChallengeId.mockResolvedValue(mockWorks);
      workRepository.countWorksByChallengeId.mockResolvedValue(2);

      const result = await workService.getWorkList({
        challenge_id: 'challenge-123',
        page: 1,
        size: 10,
      });

      expect(workRepository.findWorksByChallengeId).toHaveBeenCalledWith({
        challengeId: 'challenge-123',
        skip: 0,
        take: 10,
      });
      expect(result.items).toHaveLength(2);
      expect(result.items[0].likeCount).toBe(2);
      expect(result.items[1].likeCount).toBe(1);
      expect(result.pagination).toEqual({
        page: 1,
        size: 10,
        total: 2,
        totalPages: 1,
      });
    });

    it('페이지 기본값이 1이어야 함', async () => {
      workRepository.findWorksByChallengeId.mockResolvedValue([]);
      workRepository.countWorksByChallengeId.mockResolvedValue(0);

      await workService.getWorkList({ challenge_id: 'challenge-123' });

      expect(workRepository.findWorksByChallengeId).toHaveBeenCalledWith({
        challengeId: 'challenge-123',
        skip: 0,
        take: 10,
      });
    });

    it('size 기본값이 10이어야 함', async () => {
      workRepository.findWorksByChallengeId.mockResolvedValue([]);
      workRepository.countWorksByChallengeId.mockResolvedValue(0);

      const result = await workService.getWorkList({ challenge_id: 'challenge-123' });

      expect(result.pagination.size).toBe(10);
    });

    it('작업물 목록이 배열이 아니면 에러를 던져야 함', async () => {
      workRepository.findWorksByChallengeId.mockResolvedValue(null);

      await expect(
        workService.getWorkList({ challenge_id: 'challenge-123' })
      ).rejects.toThrow(/작업물.*목록.*조회.*실패/);
    });
  });

  describe('getWorkDetail', () => {
    it('작업물 상세 정보를 조회해야 함', async () => {
      const mockReq = {
        cookies: { accessToken: 'valid-token' },
        headers: {},
      };

      const mockWork = {
        attend_id: 'attend-123',
        user_id: 'user-123',
        title: '작업물 제목',
        work_item: '작업물 내용',
        created_at: new Date(),
        user: { nick_name: '테스트유저', role: 'USER' },
        likes: [{ liker: true }, { liker: true }],
        challenge: { isClose: false },
      };

      userService.getUserFromToken.mockResolvedValue({ userId: 'user-123', role: 'USER' });
      workRepository.findWorkById.mockResolvedValue(mockWork);
      workRepository.findExistingLike.mockResolvedValue(null);

      const result = await workService.getWorkDetail(mockReq, 'attend-123');

      expect(workRepository.findWorkById).toHaveBeenCalledWith('attend-123');
      expect(result.item).toEqual({
        attendId: 'attend-123',
        userId: 'user-123',
        title: '작업물 제목',
        workItem: '작업물 내용',
        createdAt: mockWork.created_at,
        nickName: '테스트유저',
        role: 'USER',
        likeCount: 2,
        likeByMe: false,
        isClose: false,
      });
    });

    it('작업물을 찾을 수 없으면 에러를 던져야 함', async () => {
      const mockReq = {
        cookies: { accessToken: 'valid-token' },
        headers: {},
      };

      userService.getUserFromToken.mockResolvedValue({ userId: 'user-123', role: 'USER' });
      workRepository.findWorkById.mockResolvedValue(null);

      await expect(workService.getWorkDetail(mockReq, 'invalid-id')).rejects.toThrow(
        /작업물.*찾을 수 없습니다/
      );
    });
  });

  describe('getSaveList', () => {
    it('임시 저장 목록을 조회해야 함', async () => {
      const mockReq = {
        cookies: { accessToken: 'valid-token' },
        headers: {},
      };

      const mockSaves = [
        {
          attend_id: 'save-1',
          title: '임시저장1',
          created_at: new Date(),
          user: { nick_name: '테스트유저' },
        },
      ];

      userService.getUserFromToken.mockResolvedValue({ userId: 'user-123', role: 'USER' });
      workRepository.countSavesByUserId.mockResolvedValue(1);
      workRepository.findSavesByUserId.mockResolvedValue(mockSaves);

      const result = await workService.getSaveList(mockReq, { page: 1, size: 5 });

      expect(workRepository.countSavesByUserId).toHaveBeenCalledWith('user-123');
      expect(workRepository.findSavesByUserId).toHaveBeenCalledWith({
        userId: 'user-123',
        skip: 0,
        take: 5,
      });
      expect(result.items).toHaveLength(1);
      expect(result.pagination.size).toBe(5);
    });

    it('페이지 기본값이 1이고 size 기본값이 5여야 함', async () => {
      const mockReq = {
        cookies: { accessToken: 'valid-token' },
        headers: {},
      };

      userService.getUserFromToken.mockResolvedValue({ userId: 'user-123', role: 'USER' });
      workRepository.countSavesByUserId.mockResolvedValue(0);
      workRepository.findSavesByUserId.mockResolvedValue([]);

      const result = await workService.getSaveList(mockReq, {});

      expect(result.pagination.page).toBe(1);
      expect(result.pagination.size).toBe(5);
    });

    it('임시 저장 목록이 배열이 아니면 에러를 던져야 함', async () => {
      const mockReq = {
        cookies: { accessToken: 'valid-token' },
        headers: {},
      };

      userService.getUserFromToken.mockResolvedValue({ userId: 'user-123', role: 'USER' });
      workRepository.countSavesByUserId.mockResolvedValue(1);
      workRepository.findSavesByUserId.mockResolvedValue(null);

      await expect(workService.getSaveList(mockReq, {})).rejects.toThrow(
        /임시.*저장.*목록.*조회.*실패/
      );
    });
  });

  describe('getSaveDetail', () => {
    it('본인의 임시 저장 상세를 조회해야 함', async () => {
      const mockReq = {
        cookies: { accessToken: 'valid-token' },
        headers: {},
      };

      const mockSave = {
        attend_id: 'save-123',
        title: '임시저장 제목',
        work_item: '임시저장 내용',
        created_at: new Date(),
        user_id: 'user-123',
        user: { nick_name: '테스트유저', role: 'USER' },
        challenge: { isClose: false },
      };

      userService.getUserFromToken.mockResolvedValue({ userId: 'user-123', role: 'USER' });
      workRepository.findSaveById.mockResolvedValue(mockSave);

      const result = await workService.getSaveDetail(mockReq, 'save-123');

      expect(workRepository.findSaveById).toHaveBeenCalledWith('save-123');
      expect(result.item.attendId).toBe('save-123');
      expect(result.item.title).toBe('임시저장 제목');
    });

    it('임시 저장을 찾을 수 없으면 에러를 던져야 함', async () => {
      const mockReq = {
        cookies: { accessToken: 'valid-token' },
        headers: {},
      };

      userService.getUserFromToken.mockResolvedValue({ userId: 'user-123', role: 'USER' });
      workRepository.findSaveById.mockResolvedValue(null);

      await expect(workService.getSaveDetail(mockReq, 'invalid-id')).rejects.toThrow(
        /임시 저장.*찾을 수 없습니다/
      );
    });

    it('본인의 임시 저장이 아니면 에러를 던져야 함', async () => {
      const mockReq = {
        cookies: { accessToken: 'valid-token' },
        headers: {},
      };

      const mockSave = {
        attend_id: 'save-123',
        user_id: 'other-user-123',
        user: { nick_name: '다른유저', role: 'USER' },
        challenge: { isClose: false },
      };

      userService.getUserFromToken.mockResolvedValue({ userId: 'user-123', role: 'USER' });
      workRepository.findSaveById.mockResolvedValue(mockSave);

      await expect(workService.getSaveDetail(mockReq, 'save-123')).rejects.toThrow(
        /조회 권한이 없습니다.*본인이 작성한 임시 저장만 조회할 수 있습니다/
      );
    });
  });

  describe('createWork', () => {
    it('작업물을 제출하고 알림을 전송해야 함', async () => {
      const mockReq = {
        cookies: { accessToken: 'valid-token' },
        headers: {},
      };

      const mockChallenge = {
        challenge_id: 'challenge-123',
        title: 'React 챌린지',
        isClose: false,
        capacity: '30',
      };

      const mockWork = {
        attend_id: 'attend-123',
        challenge_id: 'challenge-123',
        user_id: 'user-123',
        work_item: '작업물 내용',
        isSave: false,
      };

      userService.getUserFromToken.mockResolvedValue({ userId: 'user-123', role: 'USER' });
      workRepository.findChallengeIsClose.mockResolvedValue(mockChallenge);
      workRepository.countWorksByChallengeId.mockResolvedValue(10); // 현재 10명 참여 중
      workRepository.findExistingWork.mockResolvedValue(null);
      workRepository.createWork.mockResolvedValue(mockWork);
      noticeService.default.addWorkSubmitNotice.mockResolvedValue();

      const result = await workService.createWork(
        mockReq,
        'challenge-123',
        '작업물 제목',
        '작업물 내용'
      );

      expect(workRepository.createWork).toHaveBeenCalledWith({
        challenge_id: 'challenge-123',
        title: '작업물 제목',
        user_id: 'user-123',
        work_item: '작업물 내용',
        isSave: false,
      });
      expect(noticeService.default.addWorkSubmitNotice).toHaveBeenCalledWith(
        'user-123',
        'React 챌린지'
      );
      expect(result.message).toBe('작업물 제출');
      expect(result.attendId).toBe('attend-123');
    });

    it('이미 종료된 챌린지면 에러를 던져야 함', async () => {
      const mockReq = {
        cookies: { accessToken: 'valid-token' },
        headers: {},
      };

      const mockChallenge = {
        challenge_id: 'challenge-123',
        title: 'React 챌린지',
        isClose: true,
      };

      userService.getUserFromToken.mockResolvedValue({ userId: 'user-123', role: 'USER' });
      workRepository.findChallengeIsClose.mockResolvedValue(mockChallenge);

      try {
        await workService.createWork(mockReq, 'challenge-123', '작업물 제목', '작업물 내용');
      } catch (error) {
        expect(error.message).toMatch(/이미.*종료.*챌린지/);
        expect(error.status).toBe(400);
      }
    });

    it('이미 제출된 작업물이 있으면 에러를 던져야 함', async () => {
      const mockReq = {
        cookies: { accessToken: 'valid-token' },
        headers: {},
      };

      const mockChallenge = {
        challenge_id: 'challenge-123',
        title: 'React 챌린지',
        isClose: false,
        capacity: '30',
      };

      userService.getUserFromToken.mockResolvedValue({ userId: 'user-123', role: 'USER' });
      workRepository.findChallengeIsClose.mockResolvedValue(mockChallenge);
      workRepository.countWorksByChallengeId.mockResolvedValue(5);
      workRepository.findExistingWork.mockResolvedValue({ attend_id: 'existing-attend' });

      try {
        await workService.createWork(mockReq, 'challenge-123', '작업물 제목', '작업물 내용');
      } catch (error) {
        expect(error.message).toMatch(/이미.*제출.*작업물.*존재/);
        expect(error.status).toBe(409);
      }
    });

    it('참여 인원이 정원에 도달하면 에러를 던져야 함', async () => {
      const mockReq = {
        cookies: { accessToken: 'valid-token' },
        headers: {},
      };

      const mockChallenge = {
        challenge_id: 'challenge-123',
        title: 'React 챌린지',
        isClose: false,
        capacity: '30',
      };

      userService.getUserFromToken.mockResolvedValue({ userId: 'user-123', role: 'USER' });
      workRepository.findChallengeIsClose.mockResolvedValue(mockChallenge);
      workRepository.countWorksByChallengeId.mockResolvedValue(30); // 정원 30명 꽉 참

      try {
        await workService.createWork(mockReq, 'challenge-123', '작업물 제목', '작업물 내용');
      } catch (error) {
        expect(error.message).toMatch(/참여.*인원.*정원.*도달/);
        expect(error.message).toContain('30명');
        expect(error.status).toBe(400);
      }
    });

    it('참여 인원이 정원을 초과하면 에러를 던져야 함', async () => {
      const mockReq = {
        cookies: { accessToken: 'valid-token' },
        headers: {},
      };

      const mockChallenge = {
        challenge_id: 'challenge-123',
        title: 'React 챌린지',
        isClose: false,
        capacity: '10',
      };

      userService.getUserFromToken.mockResolvedValue({ userId: 'user-123', role: 'USER' });
      workRepository.findChallengeIsClose.mockResolvedValue(mockChallenge);
      workRepository.countWorksByChallengeId.mockResolvedValue(12); // 정원 10명인데 12명

      try {
        await workService.createWork(mockReq, 'challenge-123', '작업물 제목', '작업물 내용');
      } catch (error) {
        expect(error.message).toMatch(/참여.*인원.*정원.*도달/);
        expect(error.message).toContain('10명');
        expect(error.message).toContain('12명');
        expect(error.status).toBe(400);
      }
    });
  });

  describe('createSaveWork', () => {
    it('작업물을 임시 저장하고 알림을 전송해야 함', async () => {
      const mockReq = {
        cookies: { accessToken: 'valid-token' },
        headers: {},
      };

      const mockChallenge = {
        challenge_id: 'challenge-123',
        title: 'React 챌린지',
        isClose: false,
      };

      const mockSave = {
        attend_id: 'save-123',
        challenge_id: 'challenge-123',
        user_id: 'user-123',
        work_item: '임시 저장 내용',
        isSave: true,
      };

      userService.getUserFromToken.mockResolvedValue({ userId: 'user-123', role: 'USER' });
      workRepository.findChallengeIsClose.mockResolvedValue(mockChallenge);
      workRepository.createWork.mockResolvedValue(mockSave);
      noticeService.default.addModifyNotice.mockResolvedValue();

      const result = await workService.createSaveWork(
        mockReq,
        'challenge-123',
        '임시 저장 제목',
        '임시 저장 내용'
      );

      expect(workRepository.createWork).toHaveBeenCalledWith({
        challenge_id: 'challenge-123',
        user_id: 'user-123',
        title: '임시 저장 제목',
        work_item: '임시 저장 내용',
        isSave: true,
      });
      expect(noticeService.default.addModifyNotice).toHaveBeenCalledWith(
        '작업물',
        '임시 저장',
        'user-123',
        'React 챌린지'
      );
      expect(result.message).toBe('임시 저장 완료');
      expect(result.attendId).toBe('save-123');
    });

    it('이미 종료된 챌린지면 에러를 던져야 함', async () => {
      const mockReq = {
        cookies: { accessToken: 'valid-token' },
        headers: {},
      };

      const mockChallenge = {
        challenge_id: 'challenge-123',
        title: 'React 챌린지',
        isClose: true,
      };

      userService.getUserFromToken.mockResolvedValue({ userId: 'user-123', role: 'USER' });
      workRepository.findChallengeIsClose.mockResolvedValue(mockChallenge);

      await expect(
        workService.createSaveWork(mockReq, 'challenge-123', '임시 저장 제목', '임시 저장 내용')
      ).rejects.toThrow(/이미.*종료.*챌린지/);
    });
  });

  describe('updateWork', () => {
    it('본인의 작업물을 수정하고 알림을 전송해야 함', async () => {
      const mockReq = {
        cookies: { accessToken: 'valid-token' },
        headers: {},
      };

      const mockWork = {
        attend_id: 'attend-123',
        user_id: 'user-123',
        challenge: { isClose: false, title: 'React 챌린지' },
        user: { user_id: 'user-123' },
      };

      userService.getUserFromToken.mockResolvedValue({ userId: 'user-123', role: 'USER' });
      workRepository.findWorkWithChallengeById.mockResolvedValue(mockWork);
      workRepository.updateWorkById.mockResolvedValue();
      noticeService.default.addModifyNotice.mockResolvedValue();

      await workService.updateWork(mockReq, 'attend-123', {
        title: '수정된 제목',
        workItem: '수정된 내용',
      });

      expect(workRepository.updateWorkById).toHaveBeenCalledWith('attend-123', {
        title: '수정된 제목',
        work_item: '수정된 내용',
      });
      expect(noticeService.default.addModifyNotice).toHaveBeenCalledWith(
        '작업물',
        '업데이트',
        'user-123',
        'React 챌린지'
      );
    });

    it('관리자는 다른 사람의 작업물을 수정할 수 있어야 함', async () => {
      const mockReq = {
        cookies: { accessToken: 'valid-token' },
        headers: {},
      };

      const mockWork = {
        attend_id: 'attend-123',
        user_id: 'other-user-123',
        challenge: { isClose: false, title: 'React 챌린지' },
        user: { user_id: 'other-user-123' },
      };

      userService.getUserFromToken.mockResolvedValue({ userId: 'admin-123', role: 'ADMIN' });
      workRepository.findWorkWithChallengeById.mockResolvedValue(mockWork);
      workRepository.updateWorkById.mockResolvedValue();
      noticeService.default.addModifyNotice.mockResolvedValue();

      await workService.updateWork(mockReq, 'attend-123', {
        title: '수정된 제목',
        workItem: '수정된 내용',
      });

      expect(workRepository.updateWorkById).toHaveBeenCalled();
    });

    it('작업물을 찾을 수 없으면 에러를 던져야 함', async () => {
      const mockReq = {
        cookies: { accessToken: 'valid-token' },
        headers: {},
      };

      userService.getUserFromToken.mockResolvedValue({ userId: 'user-123', role: 'USER' });
      workRepository.findWorkWithChallengeById.mockResolvedValue(null);

      await expect(
        workService.updateWork(mockReq, 'invalid-id', {
          title: '수정된 제목',
          workItem: '수정된 내용',
        })
      ).rejects.toThrow(/작업물.*찾을 수 없습니다/);
    });

    it('본인만 수정할 수 있어야 함', async () => {
      const mockReq = {
        cookies: { accessToken: 'valid-token' },
        headers: {},
      };

      const mockWork = {
        attend_id: 'attend-123',
        user_id: 'other-user-123',
        challenge: { isClose: false },
      };

      userService.getUserFromToken.mockResolvedValue({ userId: 'user-123', role: 'USER' });
      workRepository.findWorkWithChallengeById.mockResolvedValue(mockWork);

      await expect(
        workService.updateWork(mockReq, 'attend-123', {
          title: '수정된 제목',
          workItem: '수정된 내용',
        })
      ).rejects.toThrow(/본인.*수정.*할 수 있습니다/);
    });

    it('이미 종료된 챌린지면 에러를 던져야 함', async () => {
      const mockReq = {
        cookies: { accessToken: 'valid-token' },
        headers: {},
      };

      const mockWork = {
        attend_id: 'attend-123',
        user_id: 'user-123',
        challenge: { isClose: true },
      };

      userService.getUserFromToken.mockResolvedValue({ userId: 'user-123', role: 'USER' });
      workRepository.findWorkWithChallengeById.mockResolvedValue(mockWork);

      await expect(
        workService.updateWork(mockReq, 'attend-123', {
          title: '수정된 제목',
          workItem: '수정된 내용',
        })
      ).rejects.toThrow(/이미.*종료.*챌린지/);
    });
  });

  describe('deleteWork', () => {
    it('본인의 작업물을 삭제하고 알림을 전송해야 함', async () => {
      const mockReq = {
        cookies: { accessToken: 'valid-token' },
        headers: {},
      };

      const mockWork = {
        attend_id: 'attend-123',
        user_id: 'user-123',
        challenge: { isClose: false, title: 'React 챌린지' },
        user: { user_id: 'user-123' },
      };

      userService.getUserFromToken.mockResolvedValue({ userId: 'user-123', role: 'USER' });
      workRepository.findWorkWithChallengeById.mockResolvedValue(mockWork);
      workRepository.deleteLikesByAttendId.mockResolvedValue();
      workRepository.deleteFeedbacksByAttendId.mockResolvedValue();
      workRepository.deleteWorkById.mockResolvedValue();
      noticeService.default.addModifyNotice.mockResolvedValue();

      const result = await workService.deleteWork(mockReq, 'attend-123');

      expect(workRepository.deleteLikesByAttendId).toHaveBeenCalledWith('attend-123');
      expect(workRepository.deleteFeedbacksByAttendId).toHaveBeenCalledWith('attend-123');
      expect(workRepository.deleteWorkById).toHaveBeenCalledWith('attend-123');
      expect(noticeService.default.addModifyNotice).toHaveBeenCalledWith(
        '작업물',
        '삭제',
        'user-123',
        'React 챌린지'
      );
      expect(result.message).toBe('삭제 완료 ');
    });

    it('관리자는 다른 사람의 작업물을 삭제할 수 있어야 함', async () => {
      const mockReq = {
        cookies: { accessToken: 'valid-token' },
        headers: {},
      };

      const mockWork = {
        attend_id: 'attend-123',
        user_id: 'other-user-123',
        challenge: { isClose: false, title: 'React 챌린지' },
        user: { user_id: 'other-user-123' },
      };

      userService.getUserFromToken.mockResolvedValue({ userId: 'admin-123', role: 'ADMIN' });
      workRepository.findWorkWithChallengeById.mockResolvedValue(mockWork);
      workRepository.deleteLikesByAttendId.mockResolvedValue();
      workRepository.deleteFeedbacksByAttendId.mockResolvedValue();
      workRepository.deleteWorkById.mockResolvedValue();
      noticeService.default.addModifyNotice.mockResolvedValue();

      const result = await workService.deleteWork(mockReq, 'attend-123');

      expect(result.message).toBe('삭제 완료 ');
    });

    it('작업물을 찾을 수 없으면 에러를 던져야 함', async () => {
      const mockReq = {
        cookies: { accessToken: 'valid-token' },
        headers: {},
      };

      userService.getUserFromToken.mockResolvedValue({ userId: 'user-123', role: 'USER' });
      workRepository.findWorkWithChallengeById.mockResolvedValue(null);

      await expect(workService.deleteWork(mockReq, 'invalid-id')).rejects.toThrow(
        /작업물.*찾을 수 없습니다/
      );
    });

    it('본인만 삭제할 수 있어야 함', async () => {
      const mockReq = {
        cookies: { accessToken: 'valid-token' },
        headers: {},
      };

      const mockWork = {
        attend_id: 'attend-123',
        user_id: 'other-user-123',
        challenge: { isClose: false },
      };

      userService.getUserFromToken.mockResolvedValue({ userId: 'user-123', role: 'USER' });
      workRepository.findWorkWithChallengeById.mockResolvedValue(mockWork);

      await expect(workService.deleteWork(mockReq, 'attend-123')).rejects.toThrow(
        /본인.*삭제.*할 수 있습니다/
      );
    });

    it('이미 종료된 챌린지면 에러를 던져야 함', async () => {
      const mockReq = {
        cookies: { accessToken: 'valid-token' },
        headers: {},
      };

      const mockWork = {
        attend_id: 'attend-123',
        user_id: 'user-123',
        challenge: { isClose: true },
      };

      userService.getUserFromToken.mockResolvedValue({ userId: 'user-123', role: 'USER' });
      workRepository.findWorkWithChallengeById.mockResolvedValue(mockWork);

      await expect(workService.deleteWork(mockReq, 'attend-123')).rejects.toThrow(
        /이미.*종료.*챌린지/
      );
    });
  });

  describe('toggleLike', () => {
    it('좋아요를 추가해야 함', async () => {
      const mockReq = {
        cookies: { accessToken: 'valid-token' },
        headers: {},
      };

      userService.getUserFromToken.mockResolvedValue({ userId: 'user-123', role: 'USER' });
      workRepository.findExistingLike.mockResolvedValue(null);
      workRepository.createLike.mockResolvedValue({
        like_id: 'like-123',
        user_id: 'user-123',
        attend_id: 'attend-123',
        liker: true,
      });

      const result = await workService.toggleLike(mockReq, 'attend-123');

      expect(workRepository.createLike).toHaveBeenCalledWith({
        user_id: 'user-123',
        attend_id: 'attend-123',
        liker: true,
      });
      expect(result.message).toBe('좋아요 추가');
    });

    it('좋아요를 취소해야 함', async () => {
      const mockReq = {
        cookies: { accessToken: 'valid-token' },
        headers: {},
      };

      const existingLike = {
        like_id: 'like-123',
        user_id: 'user-123',
        attend_id: 'attend-123',
        liker: true,
      };

      userService.getUserFromToken.mockResolvedValue({ userId: 'user-123', role: 'USER' });
      workRepository.findExistingLike.mockResolvedValue(existingLike);
      workRepository.deleteLikeById.mockResolvedValue();

      const result = await workService.toggleLike(mockReq, 'attend-123');

      expect(workRepository.deleteLikeById).toHaveBeenCalledWith('like-123');
      expect(result.message).toBe('좋아요 취소');
    });
  });
});
