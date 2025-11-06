import { describe, it, expect } from '@jest/globals';
import {
  noticeIdParamSchema,
  getNoticeListQuerySchema,
} from '../../../src/validators/notice.validator.js';

describe('Notice Validator Tests', () => {
  describe('noticeIdParamSchema', () => {
    it('유효한 알림 ID는 통과해야 함', () => {
      const validData = {
        params: {
          noticeId: '123e4567-e89b-12d3-a456-426614174000',
        },
      };

      const result = noticeIdParamSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('알림 ID가 없으면 실패해야 함', () => {
      const invalidData = {
        params: {},
      };

      const result = noticeIdParamSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      // Zod returns generic message when field is missing
      expect(result.error.issues[0].message).toBeDefined();
    });

    it('알림 ID가 유효하지 않은 UUID면 실패해야 함', () => {
      const invalidUUIDs = [
        'invalid-uuid',
        '123',
        'not-a-uuid-format',
        '123e4567-e89b-12d3-a456',
        '123e4567e89b12d3a456426614174000',
        'g23e4567-e89b-12d3-a456-426614174000',
      ];

      invalidUUIDs.forEach((noticeId) => {
        const invalidData = {
          params: { noticeId },
        };
        const result = noticeIdParamSchema.safeParse(invalidData);
        expect(result.success).toBe(false);
        expect(result.error.issues[0].message).toMatch(/유효하지 않은/);
      });
    });

    it('유효한 UUID 버전은 모두 통과해야 함', () => {
      const validUUIDs = [
        '123e4567-e89b-12d3-a456-426614174000',
        'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
        '550e8400-e29b-41d4-a716-446655440000',
        '6ba7b810-9dad-11d1-80b4-00c04fd430c8',
      ];

      validUUIDs.forEach((noticeId) => {
        const validData = {
          params: { noticeId },
        };
        const result = noticeIdParamSchema.safeParse(validData);
        expect(result.success).toBe(true);
      });
    });

    it('UUID는 대소문자를 구분하지 않아야 함', () => {
      const uuids = [
        '123E4567-E89B-12D3-A456-426614174000',
        '123e4567-e89b-12d3-a456-426614174000',
        '123E4567-e89b-12D3-A456-426614174000',
      ];

      uuids.forEach((noticeId) => {
        const validData = {
          params: { noticeId },
        };
        const result = noticeIdParamSchema.safeParse(validData);
        expect(result.success).toBe(true);
      });
    });

    it('UUID에 공백이 있으면 실패해야 함', () => {
      const invalidData = {
        params: {
          noticeId: '123e4567 -e89b-12d3-a456-426614174000',
        },
      };

      const result = noticeIdParamSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('빈 문자열은 실패해야 함', () => {
      const invalidData = {
        params: {
          noticeId: '',
        },
      };

      const result = noticeIdParamSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });
  });

  describe('getNoticeListQuerySchema', () => {
    it('유효한 쿼리 파라미터는 통과해야 함', () => {
      const validData = {
        query: {
          page: '1',
          pageSize: '10',
        },
      };

      const result = getNoticeListQuerySchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('모든 파라미터가 없어도 통과해야 함 (선택적)', () => {
      const validData = {
        query: {},
      };

      const result = getNoticeListQuerySchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    describe('page 검증', () => {
      it('page가 문자열 숫자면 숫자로 변환되어야 함', () => {
        const validData = {
          query: {
            page: '5',
          },
        };

        const result = getNoticeListQuerySchema.safeParse(validData);
        expect(result.success).toBe(true);
        expect(result.data.query.page).toBe(5);
        expect(typeof result.data.query.page).toBe('number');
      });

      it('page가 숫자가 아니면 실패해야 함', () => {
        const invalidData = {
          query: {
            page: 'abc',
          },
        };

        const result = getNoticeListQuerySchema.safeParse(invalidData);
        expect(result.success).toBe(false);
        // Check that validation failed with a message
        expect(result.error.issues[0].message).toBeDefined();
      });

      it('page가 1 미만이면 실패해야 함', () => {
        const invalidData = {
          query: {
            page: '0',
          },
        };

        const result = getNoticeListQuerySchema.safeParse(invalidData);
        expect(result.success).toBe(false);
        // Check that validation failed with a message
        expect(result.error.issues[0].message).toBeDefined();
      });

      it('page가 음수면 실패해야 함', () => {
        const invalidData = {
          query: {
            page: '-1',
          },
        };

        const result = getNoticeListQuerySchema.safeParse(invalidData);
        expect(result.success).toBe(false);
      });

      it('page가 소수면 실패해야 함', () => {
        const invalidData = {
          query: {
            page: '1.5',
          },
        };

        const result = getNoticeListQuerySchema.safeParse(invalidData);
        expect(result.success).toBe(false);
      });

      it('page가 정수 형식의 문자열이면 통과해야 함', () => {
        const validPages = ['1', '10', '100', '999'];

        validPages.forEach((page) => {
          const validData = {
            query: { page },
          };
          const result = getNoticeListQuerySchema.safeParse(validData);
          expect(result.success).toBe(true);
        });
      });

      it('page에 선행 0이 있어도 통과해야 함', () => {
        const validData = {
          query: {
            page: '01',
          },
        };

        const result = getNoticeListQuerySchema.safeParse(validData);
        expect(result.success).toBe(true);
        expect(result.data.query.page).toBe(1);
      });
    });

    describe('pageSize 검증', () => {
      it('pageSize가 문자열 숫자면 숫자로 변환되어야 함', () => {
        const validData = {
          query: {
            pageSize: '20',
          },
        };

        const result = getNoticeListQuerySchema.safeParse(validData);
        expect(result.success).toBe(true);
        expect(result.data.query.pageSize).toBe(20);
        expect(typeof result.data.query.pageSize).toBe('number');
      });

      it('pageSize가 숫자가 아니면 실패해야 함', () => {
        const invalidData = {
          query: {
            pageSize: 'xyz',
          },
        };

        const result = getNoticeListQuerySchema.safeParse(invalidData);
        expect(result.success).toBe(false);
        // Check that validation failed with a message
        expect(result.error.issues[0].message).toBeDefined();
      });

      it('pageSize가 1 미만이면 실패해야 함', () => {
        const invalidData = {
          query: {
            pageSize: '0',
          },
        };

        const result = getNoticeListQuerySchema.safeParse(invalidData);
        expect(result.success).toBe(false);
        // Check that validation failed with a message
        expect(result.error.issues[0].message).toBeDefined();
      });

      it('pageSize가 100을 초과하면 실패해야 함', () => {
        const invalidData = {
          query: {
            pageSize: '101',
          },
        };

        const result = getNoticeListQuerySchema.safeParse(invalidData);
        expect(result.success).toBe(false);
        // Check that validation failed with a message
        expect(result.error.issues[0].message).toBeDefined();
      });

      it('pageSize가 1-100 사이면 통과해야 함', () => {
        const validSizes = ['1', '10', '50', '100'];

        validSizes.forEach((pageSize) => {
          const validData = {
            query: { pageSize },
          };
          const result = getNoticeListQuerySchema.safeParse(validData);
          expect(result.success).toBe(true);
        });
      });

      it('pageSize가 정확히 1이면 통과해야 함', () => {
        const validData = {
          query: {
            pageSize: '1',
          },
        };

        const result = getNoticeListQuerySchema.safeParse(validData);
        expect(result.success).toBe(true);
        expect(result.data.query.pageSize).toBe(1);
      });

      it('pageSize가 정확히 100이면 통과해야 함', () => {
        const validData = {
          query: {
            pageSize: '100',
          },
        };

        const result = getNoticeListQuerySchema.safeParse(validData);
        expect(result.success).toBe(true);
        expect(result.data.query.pageSize).toBe(100);
      });
    });

    describe('조합 테스트', () => {
      it('page와 pageSize를 동시에 사용할 수 있어야 함', () => {
        const validData = {
          query: {
            page: '3',
            pageSize: '25',
          },
        };

        const result = getNoticeListQuerySchema.safeParse(validData);
        expect(result.success).toBe(true);
        expect(result.data.query.page).toBe(3);
        expect(result.data.query.pageSize).toBe(25);
      });

      it('page만 있어도 통과해야 함', () => {
        const validData = {
          query: {
            page: '2',
          },
        };

        const result = getNoticeListQuerySchema.safeParse(validData);
        expect(result.success).toBe(true);
      });

      it('pageSize만 있어도 통과해야 함', () => {
        const validData = {
          query: {
            pageSize: '50',
          },
        };

        const result = getNoticeListQuerySchema.safeParse(validData);
        expect(result.success).toBe(true);
      });
    });

    describe('Edge cases', () => {
      it('매우 큰 page 숫자는 통과해야 함', () => {
        const validData = {
          query: {
            page: '999999',
          },
        };

        const result = getNoticeListQuerySchema.safeParse(validData);
        expect(result.success).toBe(true);
        expect(result.data.query.page).toBe(999999);
      });

      it('page에 공백이 포함되면 실패해야 함', () => {
        const invalidData = {
          query: {
            page: '1 0',
          },
        };

        const result = getNoticeListQuerySchema.safeParse(invalidData);
        expect(result.success).toBe(false);
      });

      it('pageSize에 공백이 포함되면 실패해야 함', () => {
        const invalidData = {
          query: {
            pageSize: '1 0',
          },
        };

        const result = getNoticeListQuerySchema.safeParse(invalidData);
        expect(result.success).toBe(false);
      });

      it('빈 문자열은 실패해야 함', () => {
        const invalidData = {
          query: {
            page: '',
          },
        };

        const result = getNoticeListQuerySchema.safeParse(invalidData);
        expect(result.success).toBe(false);
      });
    });
  });
});
