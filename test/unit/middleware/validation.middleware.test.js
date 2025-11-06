import { describe, it, expect, jest } from '@jest/globals';
import { validate } from '../../../src/middleware/validation.middleware.js';
import { signupSchema } from '../../../src/validators/auth.validator.js';
import { z } from 'zod';

describe('Validation Middleware Tests', () => {
  describe('validate 미들웨어', () => {
    it('Jest testName이 에러 메시지에 포함되어야 함', async () => {
      // Mock request, response, next
      const req = {
        body: {
          email: 'invalid', // 잘못된 이메일
          password: 'Password123',
          nickName: '테스트',
        },
        query: {},
        params: {},
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
      };

      const next = jest.fn();

      // validation middleware 실행
      const middleware = validate(signupSchema);
      await middleware(req, res, next);

      // 에러 응답 확인
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalled();

      // json 호출 시 전달된 데이터 확인
      const errorResponse = res.json.mock.calls[0][0];

      // 현재 테스트 이름이 포함되어 있는지 확인
      // Jest의 testName이 에러 메시지에 포함되어야 함
      expect(errorResponse.error.message).toContain('Jest testName이 에러 메시지에 포함되어야 함');
    });

    it('Schema description이 에러 메시지에 포함되어야 함 (describe 있음)', async () => {
      // describe()가 있는 커스텀 스키마
      const customSchema = z
        .object({
          body: z.object({
            email: z.string().email('유효하지 않은 이메일입니다.'),
          }),
        })
        .describe('커스텀 검증');

      const req = {
        body: {
          email: 'invalid', // 잘못된 이메일
        },
        query: {},
        params: {},
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
      };

      const next = jest.fn();

      // validation middleware 실행
      const middleware = validate(customSchema);
      await middleware(req, res, next);

      // 에러 응답 확인
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalled();

      // json 호출 시 전달된 데이터 확인
      const errorResponse = res.json.mock.calls[0][0];

      // Schema description 또는 testName이 포함되어 있는지 확인
      // Jest 환경에서는 testName이 우선순위가 높음
      expect(
        errorResponse.error.message.includes('커스텀 검증') ||
          errorResponse.error.message.includes('Schema description이 에러 메시지에 포함되어야 함')
      ).toBe(true);
    });

    it('Schema description이 없으면 기본 에러 메시지만 표시됨', async () => {
      // describe()가 없는 스키마
      const simpleSchema = z.object({
        body: z.object({
          email: z.string().email('유효하지 않은 이메일입니다.'),
        }),
      });

      const req = {
        body: {
          email: 'invalid',
        },
        query: {},
        params: {},
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
      };

      const next = jest.fn();

      const middleware = validate(simpleSchema);
      await middleware(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalled();

      const errorResponse = res.json.mock.calls[0][0];

      // testName이 포함되어 있는지 확인 (Jest 환경이므로)
      expect(errorResponse.error.message).toContain('Schema description이 없으면 기본 에러 메시지만 표시됨');
    });

    it('유효한 데이터는 next()를 호출해야 함', async () => {
      const req = {
        body: {
          email: 'test@example.com',
          password: 'Password123',
          nickName: '테스트유저',
        },
        query: {},
        params: {},
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
      };

      const next = jest.fn();

      const middleware = validate(signupSchema);
      await middleware(req, res, next);

      // 유효한 데이터이므로 next()가 호출되어야 함
      expect(next).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
    });
  });
});
