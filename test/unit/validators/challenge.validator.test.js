import { describe, it, expect } from '@jest/globals';
import {
  createChallengeSchema,
  updateChallengeSchema,
  challengeIdParamSchema,
  rejectChallengeSchema,
  getChallengeListQuerySchema,
  getParticipateListSchema,
} from '../../../src/validators/challenge.validator.js';

describe('Challenge Validator Tests', () => {
  describe('createChallengeSchema', () => {
    const validChallengeData = {
      body: {
        title: '테스트 챌린지',
        source: 'https://example.com',
        field: 'WEB',
        type: 'BLOG',
        deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        capacity: '10',
        content: '이것은 테스트 챌린지 내용입니다. 최소 10자 이상이어야 합니다.',
      },
    };

    it('유효한 챌린지 생성 데이터는 통과해야 함', () => {
      const result = createChallengeSchema.safeParse(validChallengeData);
      expect(result.success).toBe(true);
    });

    describe('title 검증', () => {
      it('제목이 없으면 실패해야 함', () => {
        const invalidData = {
          body: { ...validChallengeData.body, title: undefined },
        };
        const result = createChallengeSchema.safeParse(invalidData);
        expect(result.success).toBe(false);
        // Zod returns generic message when field is missing
        expect(result.error.issues[0].message).toBeDefined();
      });

      it('제목이 빈 문자열이면 실패해야 함', () => {
        const invalidData = {
          body: { ...validChallengeData.body, title: '' },
        };
        const result = createChallengeSchema.safeParse(invalidData);
        expect(result.success).toBe(false);
        expect(result.error.issues[0].message).toMatch(/최소.*1자/);
      });

      it('제목이 200자를 초과하면 실패해야 함', () => {
        const invalidData = {
          body: { ...validChallengeData.body, title: 'a'.repeat(201) },
        };
        const result = createChallengeSchema.safeParse(invalidData);
        expect(result.success).toBe(false);
        expect(result.error.issues[0].message).toMatch(/최대.*200자/);
      });

      it('제목의 앞뒤 공백은 제거되어야 함', () => {
        const dataWithSpaces = {
          body: { ...validChallengeData.body, title: '  테스트 챌린지  ' },
        };
        const result = createChallengeSchema.safeParse(dataWithSpaces);
        expect(result.success).toBe(true);
        expect(result.data.body.title).toBe('테스트 챌린지');
      });

      it('제목에 script 태그가 있으면 실패해야 함 (XSS 방지)', () => {
        const invalidData = {
          body: { ...validChallengeData.body, title: '<script>alert("xss")</script>' },
        };
        const result = createChallengeSchema.safeParse(invalidData);
        expect(result.success).toBe(false);
        expect(result.error.issues[0].message).toMatch(/허용되지 않는 문자/);
      });

      it('제목에 javascript: 프로토콜이 있으면 실패해야 함', () => {
        const invalidData = {
          body: { ...validChallengeData.body, title: 'javascript:alert(1)' },
        };
        const result = createChallengeSchema.safeParse(invalidData);
        expect(result.success).toBe(false);
        expect(result.error.issues[0].message).toMatch(/허용되지 않는 문자/);
      });

      it('제목에 onerror 이벤트가 있으면 실패해야 함', () => {
        const invalidData = {
          body: { ...validChallengeData.body, title: '<img onerror=alert(1)>' },
        };
        const result = createChallengeSchema.safeParse(invalidData);
        expect(result.success).toBe(false);
      });
    });

    describe('source 검증', () => {
      it('출처가 없으면 실패해야 함', () => {
        const invalidData = {
          body: { ...validChallengeData.body, source: undefined },
        };
        const result = createChallengeSchema.safeParse(invalidData);
        expect(result.success).toBe(false);
        // Zod returns generic message when field is missing
        expect(result.error.issues[0].message).toBeDefined();
      });

      it('출처가 빈 문자열이면 실패해야 함', () => {
        const invalidData = {
          body: { ...validChallengeData.body, source: '' },
        };
        const result = createChallengeSchema.safeParse(invalidData);
        expect(result.success).toBe(false);
        expect(result.error.issues[0].message).toMatch(/최소.*1자/);
      });

      it('출처가 500자를 초과하면 실패해야 함', () => {
        const invalidData = {
          body: { ...validChallengeData.body, source: 'a'.repeat(501) },
        };
        const result = createChallengeSchema.safeParse(invalidData);
        expect(result.success).toBe(false);
        expect(result.error.issues[0].message).toMatch(/최대.*500자/);
      });

      it('출처의 앞뒤 공백은 제거되어야 함', () => {
        const dataWithSpaces = {
          body: { ...validChallengeData.body, source: '  https://example.com  ' },
        };
        const result = createChallengeSchema.safeParse(dataWithSpaces);
        expect(result.success).toBe(true);
        expect(result.data.body.source).toBe('https://example.com');
      });

      it('유효한 URL 형식이면 통과해야 함', () => {
        const validUrls = [
          'https://example.com',
          'http://example.com',
          'https://example.com/path',
          'https://example.com?query=value',
        ];

        validUrls.forEach((source) => {
          const data = {
            body: { ...validChallengeData.body, source },
          };
          const result = createChallengeSchema.safeParse(data);
          expect(result.success).toBe(true);
        });
      });

      it('일반 텍스트 출처도 허용해야 함', () => {
        const data = {
          body: { ...validChallengeData.body, source: '프로그래머스 레벨3' },
        };
        const result = createChallengeSchema.safeParse(data);
        expect(result.success).toBe(true);
      });

      it('유효하지 않은 URL 형식이면 실패해야 함', () => {
        const invalidData = {
          body: { ...validChallengeData.body, source: 'http://invalid url with spaces' },
        };
        const result = createChallengeSchema.safeParse(invalidData);
        expect(result.success).toBe(false);
        expect(result.error.issues[0].message).toMatch(/URL.*형식/);
      });
    });

    describe('field 검증', () => {
      it('분야가 없으면 실패해야 함', () => {
        const invalidData = {
          body: { ...validChallengeData.body, field: undefined },
        };
        const result = createChallengeSchema.safeParse(invalidData);
        expect(result.success).toBe(false);
        // Zod returns generic message when field is missing
        expect(result.error.issues[0].message).toBeDefined();
      });

      it('유효한 분야는 통과해야 함', () => {
        const validFields = ['NEXT', 'MODERN', 'API', 'WEB', 'CAREER'];

        validFields.forEach((field) => {
          const data = {
            body: { ...validChallengeData.body, field },
          };
          const result = createChallengeSchema.safeParse(data);
          expect(result.success).toBe(true);
        });
      });

      it('유효하지 않은 분야면 실패해야 함', () => {
        const invalidData = {
          body: { ...validChallengeData.body, field: 'INVALID_FIELD' },
        };
        const result = createChallengeSchema.safeParse(invalidData);
        expect(result.success).toBe(false);
      });
    });

    describe('type 검증', () => {
      it('타입이 없으면 실패해야 함', () => {
        const invalidData = {
          body: { ...validChallengeData.body, type: undefined },
        };
        const result = createChallengeSchema.safeParse(invalidData);
        expect(result.success).toBe(false);
        // Zod returns generic message when field is missing
        expect(result.error.issues[0].message).toBeDefined();
      });

      it('유효한 타입은 통과해야 함', () => {
        const validTypes = ['OFFICIAL', 'BLOG'];

        validTypes.forEach((type) => {
          const data = {
            body: { ...validChallengeData.body, type },
          };
          const result = createChallengeSchema.safeParse(data);
          expect(result.success).toBe(true);
        });
      });

      it('유효하지 않은 타입이면 실패해야 함', () => {
        const invalidData = {
          body: { ...validChallengeData.body, type: 'INVALID_TYPE' },
        };
        const result = createChallengeSchema.safeParse(invalidData);
        expect(result.success).toBe(false);
      });
    });

    describe('deadline 검증', () => {
      it('마감일이 없으면 실패해야 함', () => {
        const invalidData = {
          body: { ...validChallengeData.body, deadline: undefined },
        };
        const result = createChallengeSchema.safeParse(invalidData);
        expect(result.success).toBe(false);
        // Zod returns generic message when field is missing
        expect(result.error.issues[0].message).toBeDefined();
      });

      it('유효하지 않은 날짜 형식이면 실패해야 함', () => {
        const invalidData = {
          body: { ...validChallengeData.body, deadline: 'invalid-date' },
        };
        const result = createChallengeSchema.safeParse(invalidData);
        expect(result.success).toBe(false);
        expect(result.error.issues[0].message).toMatch(/유효하지 않은.*날짜/);
      });

      it('과거 날짜면 실패해야 함', () => {
        const pastDate = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
        const invalidData = {
          body: { ...validChallengeData.body, deadline: pastDate },
        };
        const result = createChallengeSchema.safeParse(invalidData);
        expect(result.success).toBe(false);
        expect(result.error.issues[0].message).toMatch(/현재.*시간.*이후/);
      });

      it('미래 날짜면 통과해야 함', () => {
        const futureDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
        const data = {
          body: { ...validChallengeData.body, deadline: futureDate },
        };
        const result = createChallengeSchema.safeParse(data);
        expect(result.success).toBe(true);
      });
    });

    describe('capacity 검증', () => {
      it('정원이 없으면 실패해야 함', () => {
        const invalidData = {
          body: { ...validChallengeData.body, capacity: undefined },
        };
        const result = createChallengeSchema.safeParse(invalidData);
        expect(result.success).toBe(false);
        // Zod returns generic message when field is missing
        expect(result.error.issues[0].message).toBeDefined();
      });

      it('정원이 숫자가 아니면 실패해야 함', () => {
        const invalidData = {
          body: { ...validChallengeData.body, capacity: 'abc' },
        };
        const result = createChallengeSchema.safeParse(invalidData);
        expect(result.success).toBe(false);
        expect(result.error.issues[0].message).toMatch(/숫자.*형식/);
      });

      it('정원이 2명 미만이면 실패해야 함', () => {
        const invalidData = {
          body: { ...validChallengeData.body, capacity: '1' },
        };
        const result = createChallengeSchema.safeParse(invalidData);
        expect(result.success).toBe(false);
        expect(result.error.issues[0].message).toMatch(/2.*이상/);
      });

      it('정원이 100명을 초과하면 실패해야 함', () => {
        const invalidData = {
          body: { ...validChallengeData.body, capacity: '101' },
        };
        const result = createChallengeSchema.safeParse(invalidData);
        expect(result.success).toBe(false);
        expect(result.error.issues[0].message).toMatch(/100.*이하/);
      });

      it('정원이 2-100명 사이면 통과해야 함', () => {
        const validCapacities = ['2', '10', '50', '100'];

        validCapacities.forEach((capacity) => {
          const data = {
            body: { ...validChallengeData.body, capacity },
          };
          const result = createChallengeSchema.safeParse(data);
          expect(result.success).toBe(true);
        });
      });
    });

    describe('content 검증', () => {
      it('내용이 없으면 실패해야 함', () => {
        const invalidData = {
          body: { ...validChallengeData.body, content: undefined },
        };
        const result = createChallengeSchema.safeParse(invalidData);
        expect(result.success).toBe(false);
        // Zod returns generic message when field is missing
        expect(result.error.issues[0].message).toBeDefined();
      });

      it('내용이 10자 미만이면 실패해야 함', () => {
        const invalidData = {
          body: { ...validChallengeData.body, content: '짧은내용' },
        };
        const result = createChallengeSchema.safeParse(invalidData);
        expect(result.success).toBe(false);
        expect(result.error.issues[0].message).toMatch(/최소.*10자/);
      });

      it('내용이 5000자를 초과하면 실패해야 함', () => {
        const invalidData = {
          body: { ...validChallengeData.body, content: 'a'.repeat(5001) },
        };
        const result = createChallengeSchema.safeParse(invalidData);
        expect(result.success).toBe(false);
        expect(result.error.issues[0].message).toMatch(/최대.*5000자/);
      });

      it('내용의 앞뒤 공백은 제거되어야 함', () => {
        const dataWithSpaces = {
          body: { ...validChallengeData.body, content: '  챌린지 내용입니다 최소 10자 이상  ' },
        };
        const result = createChallengeSchema.safeParse(dataWithSpaces);
        expect(result.success).toBe(true);
        expect(result.data.body.content).toBe('챌린지 내용입니다 최소 10자 이상');
      });

      it('내용에 script 태그가 있으면 실패해야 함 (XSS 방지)', () => {
        const invalidData = {
          body: { ...validChallengeData.body, content: '<script>alert("xss")</script> 챌린지 내용입니다' },
        };
        const result = createChallengeSchema.safeParse(invalidData);
        expect(result.success).toBe(false);
        expect(result.error.issues[0].message).toMatch(/허용되지 않는 문자/);
      });

      it('내용에 javascript: 프로토콜이 있으면 실패해야 함', () => {
        const invalidData = {
          body: { ...validChallengeData.body, content: 'javascript:alert(1) 챌린지 내용입니다' },
        };
        const result = createChallengeSchema.safeParse(invalidData);
        expect(result.success).toBe(false);
      });
    });
  });

  describe('updateChallengeSchema', () => {
    const validUpdateData = {
      params: {
        challengeId: '123e4567-e89b-12d3-a456-426614174000',
      },
      body: {
        title: '수정된 챌린지',
      },
    };

    it('유효한 챌린지 수정 데이터는 통과해야 함', () => {
      const result = updateChallengeSchema.safeParse(validUpdateData);
      expect(result.success).toBe(true);
    });

    it('challengeId가 없으면 실패해야 함', () => {
      const invalidData = {
        params: {},
        body: validUpdateData.body,
      };
      const result = updateChallengeSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('challengeId가 유효하지 않은 UUID면 실패해야 함', () => {
      const invalidData = {
        params: { challengeId: 'invalid-uuid' },
        body: validUpdateData.body,
      };
      const result = updateChallengeSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      expect(result.error.issues[0].message).toMatch(/유효하지 않은/);
    });

    it('모든 필드가 선택적이어야 함', () => {
      const dataWithEmptyBody = {
        params: validUpdateData.params,
        body: {},
      };
      const result = updateChallengeSchema.safeParse(dataWithEmptyBody);
      expect(result.success).toBe(true);
    });

    it('제목이 1자 미만이면 실패해야 함', () => {
      const invalidData = {
        params: validUpdateData.params,
        body: { title: '' },
      };
      const result = updateChallengeSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('여러 필드를 동시에 수정할 수 있어야 함', () => {
      const multipleFieldsData = {
        params: validUpdateData.params,
        body: {
          title: '수정된 제목',
          content: '수정된 내용입니다 최소 10자 이상',
          capacity: '20',
        },
      };
      const result = updateChallengeSchema.safeParse(multipleFieldsData);
      expect(result.success).toBe(true);
    });
  });

  describe('challengeIdParamSchema', () => {
    it('유효한 챌린지 ID는 통과해야 함', () => {
      const validData = {
        params: {
          challengeId: '123e4567-e89b-12d3-a456-426614174000',
        },
      };
      const result = challengeIdParamSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('챌린지 ID가 없으면 실패해야 함', () => {
      const invalidData = {
        params: {},
      };
      const result = challengeIdParamSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      // Zod returns generic message when field is missing
      expect(result.error.issues[0].message).toBeDefined();
    });

    it('챌린지 ID가 유효하지 않은 UUID면 실패해야 함', () => {
      const invalidData = {
        params: {
          challengeId: 'not-a-valid-uuid',
        },
      };
      const result = challengeIdParamSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      expect(result.error.issues[0].message).toMatch(/유효하지 않은/);
    });
  });

  describe('rejectChallengeSchema', () => {
    const validRejectData = {
      params: {
        challengeId: '123e4567-e89b-12d3-a456-426614174000',
      },
      body: {
        reject_comment: '부적절한 내용이 포함되어 있습니다.',
      },
    };

    it('유효한 거절 데이터는 통과해야 함', () => {
      const result = rejectChallengeSchema.safeParse(validRejectData);
      expect(result.success).toBe(true);
    });

    it('거절 사유가 없으면 실패해야 함', () => {
      const invalidData = {
        params: validRejectData.params,
        body: {},
      };
      const result = rejectChallengeSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      // Zod returns generic message when field is missing
      expect(result.error.issues[0].message).toBeDefined();
    });

    it('거절 사유가 10자 미만이면 실패해야 함', () => {
      const invalidData = {
        params: validRejectData.params,
        body: { reject_comment: '짧은사유' },
      };
      const result = rejectChallengeSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      expect(result.error.issues[0].message).toContain('최소 10자');
    });

    it('거절 사유가 500자를 초과하면 실패해야 함', () => {
      const invalidData = {
        params: validRejectData.params,
        body: { reject_comment: 'a'.repeat(501) },
      };
      const result = rejectChallengeSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      expect(result.error.issues[0].message).toContain('최대 500자');
    });

    it('거절 사유의 앞뒤 공백은 제거되어야 함', () => {
      const dataWithSpaces = {
        params: validRejectData.params,
        body: { reject_comment: '  부적절한 내용입니다  ' },
      };
      const result = rejectChallengeSchema.safeParse(dataWithSpaces);
      expect(result.success).toBe(true);
      expect(result.data.body.reject_comment).toBe('부적절한 내용입니다');
    });

    it('거절 사유에 XSS 공격 패턴이 있으면 실패해야 함', () => {
      const xssPatterns = [
        '<script>alert(1)</script> 부적절한 내용',
        'javascript:alert(1) 부적절한 내용',
      ];

      xssPatterns.forEach((reject_comment) => {
        const invalidData = {
          params: validRejectData.params,
          body: { reject_comment },
        };
        const result = rejectChallengeSchema.safeParse(invalidData);
        expect(result.success).toBe(false);
      });
    });
  });

  describe('getChallengeListQuerySchema', () => {
    it('유효한 쿼리 파라미터는 통과해야 함', () => {
      const validData = {
        query: {
          title: '테스트',
          field: 'WEB',
          type: 'BLOG',
          status: 'APPROVED',
          page: '1',
          pageSize: '10',
          sort: '신청시간느림순',
          searchKeyword: '검색어',
        },
      };
      const result = getChallengeListQuerySchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('모든 파라미터가 선택적이어야 함', () => {
      const validData = {
        query: {},
      };
      const result = getChallengeListQuerySchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('page 기본값은 1이어야 함', () => {
      const data = {
        query: {},
      };
      const result = getChallengeListQuerySchema.safeParse(data);
      expect(result.success).toBe(true);
      // Default is applied before transform, so it's a string
      expect(result.data.query.page).toBe('1');
    });

    it('pageSize 기본값은 10이어야 함', () => {
      const data = {
        query: {},
      };
      const result = getChallengeListQuerySchema.safeParse(data);
      expect(result.success).toBe(true);
      // Default is applied before transform, so it's a string
      expect(result.data.query.pageSize).toBe('10');
    });

    it('sort 기본값은 신청시간느림순이어야 함', () => {
      const data = {
        query: {},
      };
      const result = getChallengeListQuerySchema.safeParse(data);
      expect(result.success).toBe(true);
      expect(result.data.query.sort).toBe('신청시간느림순');
    });

    it('page가 문자열 숫자면 숫자로 변환되어야 함', () => {
      const data = {
        query: { page: '5' },
      };
      const result = getChallengeListQuerySchema.safeParse(data);
      expect(result.success).toBe(true);
      expect(result.data.query.page).toBe(5);
      expect(typeof result.data.query.page).toBe('number');
    });

    it('pageSize가 문자열 숫자면 숫자로 변환되어야 함', () => {
      const data = {
        query: { pageSize: '20' },
      };
      const result = getChallengeListQuerySchema.safeParse(data);
      expect(result.success).toBe(true);
      expect(result.data.query.pageSize).toBe(20);
      expect(typeof result.data.query.pageSize).toBe('number');
    });

    it('page가 1 미만이면 실패해야 함', () => {
      const invalidData = {
        query: { page: '0' },
      };
      const result = getChallengeListQuerySchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      expect(result.error.issues[0].message).toMatch(/1.*이상/);
    });

    it('pageSize가 100을 초과하면 실패해야 함', () => {
      const invalidData = {
        query: { pageSize: '101' },
      };
      const result = getChallengeListQuerySchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      expect(result.error.issues[0].message).toMatch(/100.*이하/);
    });

    it('title이 200자를 초과하면 실패해야 함', () => {
      const invalidData = {
        query: { title: 'a'.repeat(201) },
      };
      const result = getChallengeListQuerySchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('searchKeyword가 100자를 초과하면 실패해야 함', () => {
      const invalidData = {
        query: { searchKeyword: 'a'.repeat(101) },
      };
      const result = getChallengeListQuerySchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('sort가 유효하지 않은 값이면 실패해야 함', () => {
      const invalidData = {
        query: { sort: 'invalid-sort' },
      };
      const result = getChallengeListQuerySchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('유효한 sort 옵션은 모두 통과해야 함', () => {
      const validSortOptions = [
        '신청시간빠름순',
        '신청시간느림순',
        '마감기한빠름순',
        '마감기한느림순',
      ];

      validSortOptions.forEach((sort) => {
        const data = {
          query: { sort },
        };
        const result = getChallengeListQuerySchema.safeParse(data);
        expect(result.success).toBe(true);
      });
    });

    it('title과 searchKeyword의 공백은 제거되어야 함', () => {
      const data = {
        query: {
          title: '  테스트  ',
          searchKeyword: '  검색어  ',
        },
      };
      const result = getChallengeListQuerySchema.safeParse(data);
      expect(result.success).toBe(true);
      expect(result.data.query.title).toBe('테스트');
      expect(result.data.query.searchKeyword).toBe('검색어');
    });
  });

  describe('getParticipateListSchema', () => {
    const validParticipateData = {
      params: {
        challengeId: '123e4567-e89b-12d3-a456-426614174000',
      },
      query: {
        page: '1',
        pageSize: '10',
      },
    };

    it('유효한 참여자 목록 조회 데이터는 통과해야 함', () => {
      const result = getParticipateListSchema.safeParse(validParticipateData);
      expect(result.success).toBe(true);
    });

    it('challengeId가 없으면 실패해야 함', () => {
      const invalidData = {
        params: {},
        query: validParticipateData.query,
      };
      const result = getParticipateListSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('challengeId가 유효하지 않은 UUID면 실패해야 함', () => {
      const invalidData = {
        params: { challengeId: 'invalid-uuid' },
        query: validParticipateData.query,
      };
      const result = getParticipateListSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('쿼리 파라미터가 없어도 통과해야 함', () => {
      const dataWithoutQuery = {
        params: validParticipateData.params,
        query: {},
      };
      const result = getParticipateListSchema.safeParse(dataWithoutQuery);
      expect(result.success).toBe(true);
    });

    it('page가 문자열 숫자면 숫자로 변환되어야 함', () => {
      const result = getParticipateListSchema.safeParse(validParticipateData);
      expect(result.success).toBe(true);
      expect(typeof result.data.query.page).toBe('number');
      expect(result.data.query.page).toBe(1);
    });

    it('pageSize가 문자열 숫자면 숫자로 변환되어야 함', () => {
      const result = getParticipateListSchema.safeParse(validParticipateData);
      expect(result.success).toBe(true);
      expect(typeof result.data.query.pageSize).toBe('number');
      expect(result.data.query.pageSize).toBe(10);
    });

    it('page가 1 미만이면 실패해야 함', () => {
      const invalidData = {
        params: validParticipateData.params,
        query: { page: '0' },
      };
      const result = getParticipateListSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('pageSize가 100을 초과하면 실패해야 함', () => {
      const invalidData = {
        params: validParticipateData.params,
        query: { pageSize: '101' },
      };
      const result = getParticipateListSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });
  });
});
