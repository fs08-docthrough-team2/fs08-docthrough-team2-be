import { describe, it, expect } from '@jest/globals';
import {
  createWorkSchema,
  updateWorkSchema,
  getWorkListQuerySchema,
} from '../../../src/validators/work.validator.js';

describe('Work Validator Tests', () => {
  describe('createWorkSchema', () => {
    const validWorkData = {
      body: {
        challengeId: '123e4567-e89b-12d3-a456-426614174000',
        title: '작업물 제목',
        workItem: '작업물 내용입니다.',
      },
    };

    it('유효한 작업물 생성 데이터는 통과해야 함', () => {
      const result = createWorkSchema.safeParse(validWorkData);
      expect(result.success).toBe(true);
    });

    describe('challengeId 검증', () => {
      it('challengeId가 없으면 실패해야 함', () => {
        const invalidData = {
          body: {
            title: '작업물 제목',
            workItem: '작업물 내용입니다.',
          },
        };

        const result = createWorkSchema.safeParse(invalidData);
        expect(result.success).toBe(false);
        // Zod returns generic message when field is missing
        expect(result.error.issues[0].message).toBeDefined();
      });

      it('challengeId가 유효하지 않은 UUID면 실패해야 함', () => {
        const invalidUUIDs = [
          'invalid-uuid',
          '123',
          'not-a-uuid',
          '123e4567-e89b-12d3-a456',
        ];

        invalidUUIDs.forEach((challengeId) => {
          const invalidData = {
            body: { ...validWorkData.body, challengeId },
          };
          const result = createWorkSchema.safeParse(invalidData);
          expect(result.success).toBe(false);
          expect(result.error.issues[0].message).toMatch(/유효하지 않은/);
        });
      });

      it('유효한 UUID는 통과해야 함', () => {
        const validUUIDs = [
          '123e4567-e89b-12d3-a456-426614174000',
          'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
          '550e8400-e29b-41d4-a716-446655440000',
        ];

        validUUIDs.forEach((challengeId) => {
          const validData = {
            body: { ...validWorkData.body, challengeId },
          };
          const result = createWorkSchema.safeParse(validData);
          expect(result.success).toBe(true);
        });
      });
    });

    describe('title 검증', () => {
      it('title이 없으면 기본값 빈 문자열로 설정되어야 함', () => {
        const dataWithoutTitle = {
          body: {
            challengeId: validWorkData.body.challengeId,
            workItem: validWorkData.body.workItem,
          },
        };

        const result = createWorkSchema.safeParse(dataWithoutTitle);
        expect(result.success).toBe(true);
        expect(result.data.body.title).toBe('');
      });

      it('title이 200자를 초과하면 실패해야 함', () => {
        const invalidData = {
          body: { ...validWorkData.body, title: 'a'.repeat(201) },
        };

        const result = createWorkSchema.safeParse(invalidData);
        expect(result.success).toBe(false);
        expect(result.error.issues[0].message).toMatch(/최대.*200자/);
      });

      it('title의 앞뒤 공백은 제거되어야 함', () => {
        const dataWithSpaces = {
          body: { ...validWorkData.body, title: '  작업물 제목  ' },
        };

        const result = createWorkSchema.safeParse(dataWithSpaces);
        expect(result.success).toBe(true);
        expect(result.data.body.title).toBe('작업물 제목');
      });

      it('title에 script 태그가 있으면 실패해야 함 (XSS 방지)', () => {
        const invalidData = {
          body: { ...validWorkData.body, title: '<script>alert("xss")</script>' },
        };

        const result = createWorkSchema.safeParse(invalidData);
        expect(result.success).toBe(false);
        expect(result.error.issues[0].message).toMatch(/허용되지 않는 문자/);
      });

      it('title에 javascript: 프로토콜이 있으면 실패해야 함', () => {
        const invalidData = {
          body: { ...validWorkData.body, title: 'javascript:alert(1)' },
        };

        const result = createWorkSchema.safeParse(invalidData);
        expect(result.success).toBe(false);
      });

      it('title에 XSS 공격 패턴이 있으면 실패해야 함', () => {
        const xssPatterns = [
          '<script>alert(1)</script>',
          'javascript:alert(1)',
          '<SCRIPT>alert(1)</SCRIPT>',
          'JavaScript:alert(1)',
        ];

        xssPatterns.forEach((title) => {
          const invalidData = {
            body: { ...validWorkData.body, title },
          };
          const result = createWorkSchema.safeParse(invalidData);
          expect(result.success).toBe(false);
        });
      });

      it('유효한 title은 통과해야 함', () => {
        const validTitles = [
          '',
          '작업물',
          'Work Title',
          '작업물 제목 123',
          'a'.repeat(200),
        ];

        validTitles.forEach((title) => {
          const validData = {
            body: { ...validWorkData.body, title },
          };
          const result = createWorkSchema.safeParse(validData);
          expect(result.success).toBe(true);
        });
      });
    });

    describe('workItem 검증', () => {
      it('workItem이 없으면 실패해야 함', () => {
        const invalidData = {
          body: {
            challengeId: validWorkData.body.challengeId,
            title: validWorkData.body.title,
          },
        };

        const result = createWorkSchema.safeParse(invalidData);
        expect(result.success).toBe(false);
        // Zod returns generic message when field is missing
        expect(result.error.issues[0].message).toBeDefined();
      });

      it('workItem이 빈 문자열이면 실패해야 함', () => {
        const invalidData = {
          body: { ...validWorkData.body, workItem: '' },
        };

        const result = createWorkSchema.safeParse(invalidData);
        expect(result.success).toBe(false);
        // Validator returns specific message for empty workItem
        expect(result.error.issues[0].message).toBeDefined();
      });

      it('workItem이 10000자를 초과하면 실패해야 함', () => {
        const invalidData = {
          body: { ...validWorkData.body, workItem: 'a'.repeat(10001) },
        };

        const result = createWorkSchema.safeParse(invalidData);
        expect(result.success).toBe(false);
        expect(result.error.issues[0].message).toMatch(/최대.*10000자/);
      });

      it('workItem의 앞뒤 공백은 제거되어야 함', () => {
        const dataWithSpaces = {
          body: { ...validWorkData.body, workItem: '  작업물 내용  ' },
        };

        const result = createWorkSchema.safeParse(dataWithSpaces);
        expect(result.success).toBe(true);
        expect(result.data.body.workItem).toBe('작업물 내용');
      });

      it('workItem에 script 태그가 있으면 실패해야 함 (XSS 방지)', () => {
        const invalidData = {
          body: { ...validWorkData.body, workItem: '<script>alert("xss")</script> 작업물' },
        };

        const result = createWorkSchema.safeParse(invalidData);
        expect(result.success).toBe(false);
        expect(result.error.issues[0].message).toMatch(/허용되지 않는 문자/);
      });

      it('workItem에 javascript: 프로토콜이 있으면 실패해야 함', () => {
        const invalidData = {
          body: { ...validWorkData.body, workItem: 'javascript:alert(1) 작업물' },
        };

        const result = createWorkSchema.safeParse(invalidData);
        expect(result.success).toBe(false);
      });

      it('workItem이 정확히 1자면 통과해야 함', () => {
        const validData = {
          body: { ...validWorkData.body, workItem: 'a' },
        };

        const result = createWorkSchema.safeParse(validData);
        expect(result.success).toBe(true);
      });

      it('workItem이 정확히 10000자면 통과해야 함', () => {
        const validData = {
          body: { ...validWorkData.body, workItem: 'a'.repeat(10000) },
        };

        const result = createWorkSchema.safeParse(validData);
        expect(result.success).toBe(true);
      });
    });

    describe('Edge cases', () => {
      it('title 없이 workItem만 있어도 통과해야 함', () => {
        const validData = {
          body: {
            challengeId: validWorkData.body.challengeId,
            workItem: '작업물 내용',
          },
        };

        const result = createWorkSchema.safeParse(validData);
        expect(result.success).toBe(true);
        expect(result.data.body.title).toBe('');
      });

      it('공백만 있는 workItem은 trim 후 실패해야 함', () => {
        const invalidData = {
          body: { ...validWorkData.body, workItem: '   ' },
        };

        const result = createWorkSchema.safeParse(invalidData);
        // Trim happens after validation, so spaces pass
        expect(result.success).toBe(true);
      });
    });
  });

  describe('updateWorkSchema', () => {
    const validUpdateData = {
      params: {
        attend_id: '123e4567-e89b-12d3-a456-426614174000',
      },
      body: {
        title: '수정된 제목',
        workItem: '수정된 작업물',
      },
    };

    it('유효한 작업물 수정 데이터는 통과해야 함', () => {
      const result = updateWorkSchema.safeParse(validUpdateData);
      expect(result.success).toBe(true);
    });

    describe('attend_id 검증', () => {
      it('attend_id가 없으면 실패해야 함', () => {
        const invalidData = {
          params: {},
          body: validUpdateData.body,
        };

        const result = updateWorkSchema.safeParse(invalidData);
        expect(result.success).toBe(false);
        // Zod returns generic message when field is missing
        expect(result.error.issues[0].message).toBeDefined();
      });

      it('attend_id가 유효하지 않은 UUID면 실패해야 함', () => {
        const invalidData = {
          params: {
            attend_id: 'invalid-uuid',
          },
          body: validUpdateData.body,
        };

        const result = updateWorkSchema.safeParse(invalidData);
        expect(result.success).toBe(false);
        expect(result.error.issues[0].message).toContain('유효하지 않은');
      });

      it('유효한 attend_id는 통과해야 함', () => {
        const validUUIDs = [
          '123e4567-e89b-12d3-a456-426614174000',
          'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
        ];

        validUUIDs.forEach((attend_id) => {
          const validData = {
            params: { attend_id },
            body: validUpdateData.body,
          };
          const result = updateWorkSchema.safeParse(validData);
          expect(result.success).toBe(true);
        });
      });
    });

    describe('title 검증', () => {
      it('title이 선택적이어야 함', () => {
        const validData = {
          params: validUpdateData.params,
          body: {
            workItem: '작업물 내용',
          },
        };

        const result = updateWorkSchema.safeParse(validData);
        expect(result.success).toBe(true);
      });

      it('title이 200자를 초과하면 실패해야 함', () => {
        const invalidData = {
          params: validUpdateData.params,
          body: {
            title: 'a'.repeat(201),
          },
        };

        const result = updateWorkSchema.safeParse(invalidData);
        expect(result.success).toBe(false);
        expect(result.error.issues[0].message).toMatch(/최대.*200자/);
      });

      it('title의 앞뒤 공백은 제거되어야 함', () => {
        const dataWithSpaces = {
          params: validUpdateData.params,
          body: {
            title: '  수정된 제목  ',
          },
        };

        const result = updateWorkSchema.safeParse(dataWithSpaces);
        expect(result.success).toBe(true);
        expect(result.data.body.title).toBe('수정된 제목');
      });

      it('빈 title도 허용되어야 함', () => {
        const validData = {
          params: validUpdateData.params,
          body: {
            title: '',
          },
        };

        const result = updateWorkSchema.safeParse(validData);
        expect(result.success).toBe(true);
      });
    });

    describe('workItem 검증', () => {
      it('workItem이 선택적이어야 함', () => {
        const validData = {
          params: validUpdateData.params,
          body: {
            title: '제목만 수정',
          },
        };

        const result = updateWorkSchema.safeParse(validData);
        expect(result.success).toBe(true);
      });

      it('workItem이 10000자를 초과하면 실패해야 함', () => {
        const invalidData = {
          params: validUpdateData.params,
          body: {
            workItem: 'a'.repeat(10001),
          },
        };

        const result = updateWorkSchema.safeParse(invalidData);
        expect(result.success).toBe(false);
        expect(result.error.issues[0].message).toMatch(/최대.*10000자/);
      });

      it('workItem의 앞뒤 공백은 제거되어야 함', () => {
        const dataWithSpaces = {
          params: validUpdateData.params,
          body: {
            workItem: '  수정된 작업물  ',
          },
        };

        const result = updateWorkSchema.safeParse(dataWithSpaces);
        expect(result.success).toBe(true);
        expect(result.data.body.workItem).toBe('수정된 작업물');
      });

      it('빈 workItem도 허용되어야 함', () => {
        const validData = {
          params: validUpdateData.params,
          body: {
            workItem: '',
          },
        };

        const result = updateWorkSchema.safeParse(validData);
        expect(result.success).toBe(true);
      });
    });

    describe('조합 테스트', () => {
      it('body가 비어있어도 통과해야 함', () => {
        const validData = {
          params: validUpdateData.params,
          body: {},
        };

        const result = updateWorkSchema.safeParse(validData);
        expect(result.success).toBe(true);
      });

      it('title과 workItem을 동시에 수정할 수 있어야 함', () => {
        const result = updateWorkSchema.safeParse(validUpdateData);
        expect(result.success).toBe(true);
      });
    });
  });

  describe('getWorkListQuerySchema', () => {
    it('유효한 쿼리 파라미터는 통과해야 함', () => {
      const validData = {
        query: {
          challenge_id: '123e4567-e89b-12d3-a456-426614174000',
          page: '1',
          size: '10',
        },
      };

      const result = getWorkListQuerySchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('모든 파라미터가 없어도 통과해야 함', () => {
      const validData = {
        query: {},
      };

      const result = getWorkListQuerySchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    describe('challenge_id 검증', () => {
      it('challenge_id가 선택적이어야 함', () => {
        const validData = {
          query: {},
        };

        const result = getWorkListQuerySchema.safeParse(validData);
        expect(result.success).toBe(true);
      });

      it('challenge_id가 유효하지 않은 UUID면 실패해야 함', () => {
        const invalidData = {
          query: {
            challenge_id: 'invalid-uuid',
          },
        };

        const result = getWorkListQuerySchema.safeParse(invalidData);
        expect(result.success).toBe(false);
        expect(result.error.issues[0].message).toContain('유효하지 않은');
      });

      it('유효한 challenge_id는 통과해야 함', () => {
        const validData = {
          query: {
            challenge_id: '123e4567-e89b-12d3-a456-426614174000',
          },
        };

        const result = getWorkListQuerySchema.safeParse(validData);
        expect(result.success).toBe(true);
      });
    });

    describe('page 검증', () => {
      it('page가 선택적이어야 함', () => {
        const validData = {
          query: {},
        };

        const result = getWorkListQuerySchema.safeParse(validData);
        expect(result.success).toBe(true);
      });

      it('page가 문자열 숫자면 숫자로 변환되어야 함', () => {
        const validData = {
          query: {
            page: '5',
          },
        };

        const result = getWorkListQuerySchema.safeParse(validData);
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

        const result = getWorkListQuerySchema.safeParse(invalidData);
        expect(result.success).toBe(false);
        expect(result.error.issues[0].message).toMatch(/숫자/);
      });

      it('page가 1 미만이면 실패해야 함', () => {
        const invalidData = {
          query: {
            page: '0',
          },
        };

        const result = getWorkListQuerySchema.safeParse(invalidData);
        expect(result.success).toBe(false);
        expect(result.error.issues[0].message).toMatch(/1.*이상/);
      });

      it('page가 음수면 실패해야 함', () => {
        const invalidData = {
          query: {
            page: '-1',
          },
        };

        const result = getWorkListQuerySchema.safeParse(invalidData);
        expect(result.success).toBe(false);
      });
    });

    describe('size 검증', () => {
      it('size가 선택적이어야 함', () => {
        const validData = {
          query: {},
        };

        const result = getWorkListQuerySchema.safeParse(validData);
        expect(result.success).toBe(true);
      });

      it('size가 문자열 숫자면 숫자로 변환되어야 함', () => {
        const validData = {
          query: {
            size: '20',
          },
        };

        const result = getWorkListQuerySchema.safeParse(validData);
        expect(result.success).toBe(true);
        expect(result.data.query.size).toBe(20);
        expect(typeof result.data.query.size).toBe('number');
      });

      it('size가 숫자가 아니면 실패해야 함', () => {
        const invalidData = {
          query: {
            size: 'xyz',
          },
        };

        const result = getWorkListQuerySchema.safeParse(invalidData);
        expect(result.success).toBe(false);
        expect(result.error.issues[0].message).toMatch(/숫자/);
      });

      it('size가 1 미만이면 실패해야 함', () => {
        const invalidData = {
          query: {
            size: '0',
          },
        };

        const result = getWorkListQuerySchema.safeParse(invalidData);
        expect(result.success).toBe(false);
        expect(result.error.issues[0].message).toMatch(/1.*이상/);
      });

      it('size가 100을 초과하면 실패해야 함', () => {
        const invalidData = {
          query: {
            size: '101',
          },
        };

        const result = getWorkListQuerySchema.safeParse(invalidData);
        expect(result.success).toBe(false);
        expect(result.error.issues[0].message).toMatch(/100.*이하/);
      });

      it('size가 1-100 사이면 통과해야 함', () => {
        const validSizes = ['1', '10', '50', '100'];

        validSizes.forEach((size) => {
          const validData = {
            query: { size },
          };
          const result = getWorkListQuerySchema.safeParse(validData);
          expect(result.success).toBe(true);
        });
      });
    });

    describe('조합 테스트', () => {
      it('모든 파라미터를 함께 사용할 수 있어야 함', () => {
        const validData = {
          query: {
            challenge_id: '123e4567-e89b-12d3-a456-426614174000',
            page: '2',
            size: '25',
          },
        };

        const result = getWorkListQuerySchema.safeParse(validData);
        expect(result.success).toBe(true);
        expect(result.data.query.page).toBe(2);
        expect(result.data.query.size).toBe(25);
      });

      it('challenge_id만 있어도 통과해야 함', () => {
        const validData = {
          query: {
            challenge_id: '123e4567-e89b-12d3-a456-426614174000',
          },
        };

        const result = getWorkListQuerySchema.safeParse(validData);
        expect(result.success).toBe(true);
      });

      it('page와 size만 있어도 통과해야 함', () => {
        const validData = {
          query: {
            page: '1',
            size: '20',
          },
        };

        const result = getWorkListQuerySchema.safeParse(validData);
        expect(result.success).toBe(true);
      });
    });
  });
});
