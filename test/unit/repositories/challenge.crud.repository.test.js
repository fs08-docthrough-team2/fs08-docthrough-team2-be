import { describe, it, expect, jest, beforeEach } from '@jest/globals';

// Prisma Mock
const mockPrisma = {
  challenge: {
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
};

jest.unstable_mockModule('../../../src/config/prisma.config.js', () => ({
  default: mockPrisma,
}));

const challengeCrudRepository = await import(
  '../../../src/api/repositories/challenge.crud.repository.js'
);

describe('Challenge CRUD Repository Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createChallenge', () => {
    it('챌린지를 생성해야 함', async () => {
      const challengeData = {
        title: 'New Challenge',
        content: 'Challenge content',
        type: 'OFFICIAL',
        field: 'WEB',
        source: 'https://example.com',
        deadline: new Date('2025-12-31'),
        capacity: '50',
      };

      const mockCreatedChallenge = {
        challenge_id: 'challenge-new',
        ...challengeData,
        status: 'PENDING',
        created_at: new Date('2025-01-01'),
      };

      mockPrisma.challenge.create.mockResolvedValue(mockCreatedChallenge);

      const result = await challengeCrudRepository.createChallenge(challengeData);

      expect(mockPrisma.challenge.create).toHaveBeenCalledTimes(1);
      expect(mockPrisma.challenge.create).toHaveBeenCalledWith({ data: challengeData });
      expect(result).toEqual(mockCreatedChallenge);
    });

    it('모든 필드가 포함된 챌린지를 생성해야 함', async () => {
      const challengeData = {
        title: 'Complete Challenge',
        content: 'Complete content',
        type: 'USER',
        field: 'AI',
        source: 'https://example.com',
        deadline: new Date('2025-12-31'),
        capacity: '100',
        user_id: 'user-123',
      };

      const mockCreatedChallenge = {
        challenge_id: 'challenge-complete',
        ...challengeData,
        created_at: new Date('2025-01-01'),
      };

      mockPrisma.challenge.create.mockResolvedValue(mockCreatedChallenge);

      const result = await challengeCrudRepository.createChallenge(challengeData);

      expect(mockPrisma.challenge.create).toHaveBeenCalledWith({ data: challengeData });
      expect(result).toEqual(mockCreatedChallenge);
    });
  });

  describe('updateChallengeById', () => {
    it('챌린지를 업데이트해야 함', async () => {
      const updateData = {
        title: 'Updated Title',
        content: 'Updated content',
      };

      const mockUpdatedChallenge = {
        challenge_id: 'challenge-1',
        ...updateData,
        updated_at: new Date('2025-01-02'),
      };

      mockPrisma.challenge.update.mockResolvedValue(mockUpdatedChallenge);

      const result = await challengeCrudRepository.updateChallengeById(
        'challenge-1',
        updateData
      );

      expect(mockPrisma.challenge.update).toHaveBeenCalledTimes(1);
      expect(mockPrisma.challenge.update).toHaveBeenCalledWith({
        where: { challenge_id: 'challenge-1' },
        data: updateData,
      });
      expect(result).toEqual(mockUpdatedChallenge);
    });

    it('여러 필드를 동시에 업데이트해야 함', async () => {
      const updateData = {
        title: 'New Title',
        content: 'New content',
        deadline: new Date('2025-12-31'),
        capacity: '100',
      };

      mockPrisma.challenge.update.mockResolvedValue({
        challenge_id: 'challenge-1',
        ...updateData,
      });

      const result = await challengeCrudRepository.updateChallengeById(
        'challenge-1',
        updateData
      );

      expect(mockPrisma.challenge.update).toHaveBeenCalledWith({
        where: { challenge_id: 'challenge-1' },
        data: updateData,
      });
      expect(result.title).toBe('New Title');
    });

    it('단일 필드만 업데이트할 수 있어야 함', async () => {
      const updateData = { title: 'Only Title Updated' };

      mockPrisma.challenge.update.mockResolvedValue({
        challenge_id: 'challenge-1',
        title: 'Only Title Updated',
      });

      await challengeCrudRepository.updateChallengeById('challenge-1', updateData);

      expect(mockPrisma.challenge.update).toHaveBeenCalledWith({
        where: { challenge_id: 'challenge-1' },
        data: updateData,
      });
    });
  });

  describe('cancelChallengeById', () => {
    it('챌린지를 취소해야 함', async () => {
      const mockCancelledChallenge = {
        challenge_id: 'challenge-1',
        isClose: true,
        status: 'CANCELLED',
      };

      mockPrisma.challenge.update.mockResolvedValue(mockCancelledChallenge);

      const result = await challengeCrudRepository.cancelChallengeById('challenge-1');

      expect(mockPrisma.challenge.update).toHaveBeenCalledTimes(1);
      expect(mockPrisma.challenge.update).toHaveBeenCalledWith({
        where: { challenge_id: 'challenge-1' },
        data: { isClose: true, status: 'CANCELLED' },
      });
      expect(result).toEqual(mockCancelledChallenge);
    });

    it('취소 시 올바른 필드를 업데이트해야 함', async () => {
      mockPrisma.challenge.update.mockResolvedValue({});

      await challengeCrudRepository.cancelChallengeById('challenge-1');

      const callArgs = mockPrisma.challenge.update.mock.calls[0][0];
      expect(callArgs.data.isClose).toBe(true);
      expect(callArgs.data.status).toBe('CANCELLED');
    });
  });

  describe('deleteChallengeById', () => {
    it('챌린지를 soft delete해야 함', async () => {
      const delete_reason = '참여자가 없어서 챌린지를 삭제합니다.';
      const mockDeletedChallenge = {
        challenge_id: 'challenge-1',
        isDelete: true,
        status: 'DELETED',
        delete_reason: delete_reason,
      };

      mockPrisma.challenge.update.mockResolvedValue(mockDeletedChallenge);

      const result = await challengeCrudRepository.deleteChallengeById('challenge-1', delete_reason);

      expect(mockPrisma.challenge.update).toHaveBeenCalledTimes(1);
      expect(mockPrisma.challenge.update).toHaveBeenCalledWith({
        where: { challenge_id: 'challenge-1' },
        data: {
          isDelete: true,
          status: 'DELETED',
          delete_reason: delete_reason
        },
      });
      expect(result).toEqual(mockDeletedChallenge);
    });

    it('삭제 시 올바른 필드를 업데이트해야 함', async () => {
      const delete_reason = '저작권 문제로 인해 삭제되었습니다.';
      mockPrisma.challenge.update.mockResolvedValue({});

      await challengeCrudRepository.deleteChallengeById('challenge-1', delete_reason);

      const callArgs = mockPrisma.challenge.update.mock.calls[0][0];
      expect(callArgs.data.isDelete).toBe(true);
      expect(callArgs.data.status).toBe('DELETED');
      expect(callArgs.data.delete_reason).toBe(delete_reason);
    });
  });

  describe('hardDeleteChallengeById', () => {
    it('챌린지를 완전 삭제해야 함', async () => {
      const mockDeletedChallenge = {
        challenge_id: 'challenge-1',
        title: 'Deleted Challenge',
      };

      mockPrisma.challenge.delete.mockResolvedValue(mockDeletedChallenge);

      const result = await challengeCrudRepository.hardDeleteChallengeById('challenge-1');

      expect(mockPrisma.challenge.delete).toHaveBeenCalledTimes(1);
      expect(mockPrisma.challenge.delete).toHaveBeenCalledWith({
        where: { challenge_id: 'challenge-1' },
      });
      expect(result).toEqual(mockDeletedChallenge);
    });

    it('올바른 ID로 삭제를 요청해야 함', async () => {
      mockPrisma.challenge.delete.mockResolvedValue({
        challenge_id: 'challenge-to-delete',
      });

      await challengeCrudRepository.hardDeleteChallengeById('challenge-to-delete');

      const callArgs = mockPrisma.challenge.delete.mock.calls[0][0];
      expect(callArgs.where.challenge_id).toBe('challenge-to-delete');
    });
  });
});
