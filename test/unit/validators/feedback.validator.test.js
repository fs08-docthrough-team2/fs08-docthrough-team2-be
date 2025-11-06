import { describe, it, expect } from '@jest/globals';
import {
  createFeedbackSchema,
  updateFeedbackSchema,
  getFeedbackListQuerySchema,
} from '../../../src/validators/feedback.validator.js';

describe('Feedback Validator Tests', () => {
  describe('createFeedbackSchema', () => {
    it('유효한 피드백 생성 데이터는 통과해야 함', () => {
      const validData = {
        body: {
          attend_id: '123e4567-e89b-12d3-a456-426614174000',
          content: '이것은 유효한 피드백입니다.',
        },
      };

      const result = createFeedbackSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('attend_id가 없으면 실패해야 함', () => {
      const invalidData = {
        body: {
          content: '피드백 내용',
        },
      };

      const result = createFeedbackSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      // Zod returns generic message when field is missing
      expect(result.error.issues[0].message).toBeDefined();
    });

    it('attend_id가 유효하지 않은 UUID면 실패해야 함', () => {
      const invalidData = {
        body: {
          attend_id: 'invalid-uuid',
          content: '피드백 내용',
        },
      };

      const result = createFeedbackSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      expect(result.error.issues[0].message).toMatch(/유효하지 않은/);
    });

    it('content가 없으면 실패해야 함', () => {
      const invalidData = {
        body: {
          attend_id: '123e4567-e89b-12d3-a456-426614174000',
        },
      };

      const result = createFeedbackSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      // Zod returns generic message when field is missing
      expect(result.error.issues[0].message).toBeDefined();
    });

    it('content가 빈 문자열이면 실패해야 함', () => {
      const invalidData = {
        body: {
          attend_id: '123e4567-e89b-12d3-a456-426614174000',
          content: '',
        },
      };

      const result = createFeedbackSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      expect(result.error.issues[0].message).toMatch(/최소.*1자/);
    });

    it('content가 1000자를 초과하면 실패해야 함', () => {
      const invalidData = {
        body: {
          attend_id: '123e4567-e89b-12d3-a456-426614174000',
          content: 'a'.repeat(1001),
        },
      };

      const result = createFeedbackSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      expect(result.error.issues[0].message).toMatch(/최대.*1000자/);
    });

    it('content에 script 태그가 있으면 실패해야 함 (XSS 방지)', () => {
      const invalidData = {
        body: {
          attend_id: '123e4567-e89b-12d3-a456-426614174000',
          content: '이것은 <script>alert("xss")</script> 공격입니다.',
        },
      };

      const result = createFeedbackSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      expect(result.error.issues[0].message).toMatch(/허용되지 않는 문자/);
    });

    it('content에 javascript: 프로토콜이 있으면 실패해야 함 (XSS 방지)', () => {
      const invalidData = {
        body: {
          attend_id: '123e4567-e89b-12d3-a456-426614174000',
          content: '<a href="javascript:alert(1)">클릭</a>',
        },
      };

      const result = createFeedbackSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      expect(result.error.issues[0].message).toMatch(/허용되지 않는 문자/);
    });

    it('content의 앞뒤 공백은 제거되어야 함', () => {
      const dataWithSpaces = {
        body: {
          attend_id: '123e4567-e89b-12d3-a456-426614174000',
          content: '  피드백 내용  ',
        },
      };

      const result = createFeedbackSchema.safeParse(dataWithSpaces);
      expect(result.success).toBe(true);
      expect(result.data.body.content).toBe('피드백 내용');
    });
  });

  describe('updateFeedbackSchema', () => {
    it('유효한 피드백 수정 데이터는 통과해야 함', () => {
      const validData = {
        body: {
          feedback_id: '123e4567-e89b-12d3-a456-426614174000',
          content: '수정된 피드백 내용입니다.',
        },
      };

      const result = updateFeedbackSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('feedback_id가 없으면 실패해야 함', () => {
      const invalidData = {
        body: {
          content: '피드백 내용',
        },
      };

      const result = updateFeedbackSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      // Zod returns generic message when field is missing
      expect(result.error.issues[0].message).toBeDefined();
    });

    it('feedback_id가 유효하지 않은 UUID면 실패해야 함', () => {
      const invalidData = {
        body: {
          feedback_id: 'not-a-uuid',
          content: '피드백 내용',
        },
      };

      const result = updateFeedbackSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      expect(result.error.issues[0].message).toMatch(/유효하지 않은/);
    });

    it('content가 1000자를 초과하면 실패해야 함', () => {
      const invalidData = {
        body: {
          feedback_id: '123e4567-e89b-12d3-a456-426614174000',
          content: 'x'.repeat(1001),
        },
      };

      const result = updateFeedbackSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      expect(result.error.issues[0].message).toMatch(/최대.*1000자/);
    });
  });

  describe('getFeedbackListQuerySchema', () => {
    it('유효한 쿼리 파라미터는 통과해야 함', () => {
      const validData = {
        query: {
          attend_id: '123e4567-e89b-12d3-a456-426614174000',
          page: '1',
          size: '10',
        },
      };

      const result = getFeedbackListQuerySchema.safeParse(validData);
      expect(result.success).toBe(true);
      expect(result.data.query.page).toBe(1);
      expect(result.data.query.size).toBe(10);
    });

    it('선택적 파라미터 없이도 통과해야 함', () => {
      const validData = {
        query: {},
      };

      const result = getFeedbackListQuerySchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('attend_id가 유효하지 않은 UUID면 실패해야 함', () => {
      const invalidData = {
        query: {
          attend_id: 'invalid-uuid-format',
        },
      };

      const result = getFeedbackListQuerySchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('page가 숫자가 아니면 실패해야 함', () => {
      const invalidData = {
        query: {
          page: 'abc',
        },
      };

      const result = getFeedbackListQuerySchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      expect(result.error.issues[0].message).toMatch(/숫자/);
    });

    it('size가 숫자가 아니면 실패해야 함', () => {
      const invalidData = {
        query: {
          size: 'xyz',
        },
      };

      const result = getFeedbackListQuerySchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      expect(result.error.issues[0].message).toMatch(/숫자/);
    });

    it('문자열 숫자는 숫자로 변환되어야 함', () => {
      const validData = {
        query: {
          page: '5',
          size: '20',
        },
      };

      const result = getFeedbackListQuerySchema.safeParse(validData);
      expect(result.success).toBe(true);
      expect(result.data.query.page).toBe(5);
      expect(result.data.query.size).toBe(20);
      expect(typeof result.data.query.page).toBe('number');
      expect(typeof result.data.query.size).toBe('number');
    });
  });
});
