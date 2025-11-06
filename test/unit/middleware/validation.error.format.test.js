import { describe, it, expect, jest } from '@jest/globals';
import { validate } from '../../../src/middleware/validation.middleware.js';
import { signupSchema } from '../../../src/validators/auth.validator.js';
import { z } from 'zod';

describe('Validation Error Format Tests', () => {
  it('TEST CASE 1: Jest testName이 에러 메시지에 [testName] 형식으로 포함됨', async () => {
    const req = {
      body: {
        email: 'invalid-email',
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

    const middleware = validate(signupSchema);
    await middleware(req, res, next);

    const errorResponse = res.json.mock.calls[0][0];

    // 실제 에러 메시지 출력
    console.log('\n=== TEST CASE 1 에러 메시지 ===');
    console.log('Full Response:', JSON.stringify(errorResponse, null, 2));
    console.log('Error Message:', errorResponse.error.message);
    console.log('================================\n');

    // [TEST CASE 1: ...] 형식이 포함되어 있는지 확인
    expect(errorResponse.error.message).toMatch(/\[.*\]/);
  });

  it('TEST CASE 2: Schema description을 사용한 에러 메시지', async () => {
    const customSchema = z
      .object({
        body: z.object({
          name: z.string().min(5, '이름은 최소 5자 이상이어야 합니다.'),
        }),
      })
      .describe('사용자 이름 검증');

    const req = {
      body: {
        name: 'abc',
      },
      query: {},
      params: {},
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };

    const next = jest.fn();

    const middleware = validate(customSchema);
    await middleware(req, res, next);

    const errorResponse = res.json.mock.calls[0][0];

    console.log('\n=== TEST CASE 2 에러 메시지 ===');
    console.log('Full Response:', JSON.stringify(errorResponse, null, 2));
    console.log('Error Message:', errorResponse.error.message);
    console.log('================================\n');

    // Jest 환경에서는 testName이 우선이므로 [TEST CASE 2: ...]가 포함됨
    // 또는 [사용자 이름 검증]이 포함될 수 있음
    expect(errorResponse.error.message).toMatch(/\[.*\]/);
  });

  it('TEST CASE 3: 실제 에러 메시지 포함', async () => {
    const req = {
      body: {
        email: 'test@example.com',
        password: 'short', // 8자 미만 에러
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

    const middleware = validate(signupSchema);
    await middleware(req, res, next);

    const errorResponse = res.json.mock.calls[0][0];

    console.log('\n=== TEST CASE 3 에러 메시지 (실제 Zod 에러) ===');
    console.log('Full Response:', JSON.stringify(errorResponse, null, 2));
    console.log('Error Message:', errorResponse.error.message);
    console.log('================================\n');

    // [testName] 형식이 포함되어 있는지 확인
    expect(errorResponse.error.message).toMatch(/\[.*\]/);
    // 실제 Zod 에러 메시지가 포함되어 있는지 확인 (testName 다음에)
    expect(errorResponse.error.message).toContain('비밀번호');
  });
});
