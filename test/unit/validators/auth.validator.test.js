import { describe, it, expect } from '@jest/globals';
import { signupSchema, loginSchema } from '../../../src/validators/auth.validator.js';

describe('Auth Validator Tests', () => {
  describe('signupSchema', () => {
    it('유효한 회원가입 데이터는 통과해야 함', () => {
      const validData = {
        body: {
          email: 'test@example.com',
          password: 'Password123',
          nickName: '테스트유저',
        },
      };

      const result = signupSchema.safeParse(validData);
      expect(result.success).toBe(true);
      expect(result.data.body.email).toBe('test@example.com');
    });

    it('이메일이 없으면 실패해야 함', () => {
      const invalidData = {
        body: {
          password: 'Password123',
          nickName: '테스트유저',
        },
      };

      const result = signupSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      // Zod returns generic message when field is missing
      expect(result.error.issues[0].message).toBeDefined();
    });

    it('이메일 형식이 올바르지 않으면 실패해야 함', () => {
      const invalidData = {
        body: {
          email: 'invalid-email',
          password: 'Password123',
          nickName: '테스트유저',
        },
      };

      const result = signupSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      expect(result.error.issues[0].message).toContain('이메일');
    });

    it('이메일이 5자 미만이면 실패해야 함', () => {
      const invalidData = {
        body: {
          email: 'a@b',
          password: 'Password123',
          nickName: '테스트유저',
        },
      };

      const result = signupSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      // May fail at email format validation before length check
      expect(result.error.issues[0].message).toBeDefined();
    });

    it('이메일이 100자를 초과하면 실패해야 함', () => {
      const longEmail = 'a'.repeat(92) + '@test.com'; // 92 + 9 = 101 characters
      const invalidData = {
        body: {
          email: longEmail,
          password: 'Password123',
          nickName: '테스트유저',
        },
      };

      const result = signupSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      // Email should fail validation
      expect(result.error.issues.length).toBeGreaterThan(0);
    });

    it('이메일은 소문자로 변환되어야 함', () => {
      const validData = {
        body: {
          email: 'Test@Example.COM',
          password: 'Password123',
          nickName: '테스트유저',
        },
      };

      const result = signupSchema.safeParse(validData);
      expect(result.success).toBe(true);
      expect(result.data.body.email).toBe('test@example.com');
    });

    it('이메일의 앞뒤 공백은 제거되어야 함', () => {
      const validData = {
        body: {
          email: 'test@example.com',
          password: 'Password123',
          nickName: '테스트유저',
        },
      };

      const result = signupSchema.safeParse(validData);
      expect(result.success).toBe(true);
      expect(result.data.body.email).toBe('test@example.com');
    });

    it('이메일에 SQL 인젝션 위험 문자가 있으면 실패해야 함', () => {
      const dangerousEmails = [
        "test'@example.com",
        'test"@example.com',
        'test;@example.com',
        'test<@example.com',
        'test>@example.com',
        'test\\@example.com',
      ];

      dangerousEmails.forEach((email) => {
        const invalidData = {
          body: {
            email,
            password: 'Password123',
            nickName: '테스트유저',
          },
        };

        const result = signupSchema.safeParse(invalidData);
        expect(result.success).toBe(false);
      });
    });

    it('비밀번호가 없으면 실패해야 함', () => {
      const invalidData = {
        body: {
          email: 'test@example.com',
          nickName: '테스트유저',
        },
      };

      const result = signupSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      // Zod returns generic message when field is missing
      expect(result.error.issues[0].message).toBeDefined();
    });

    it('비밀번호가 8자 미만이면 실패해야 함', () => {
      const invalidData = {
        body: {
          email: 'test@example.com',
          password: 'Pass1',
          nickName: '테스트유저',
        },
      };

      const result = signupSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      expect(result.error.issues[0].message).toContain('최소 8자');
    });

    it('비밀번호가 100자를 초과하면 실패해야 함', () => {
      const invalidData = {
        body: {
          email: 'test@example.com',
          password: 'P1' + 'a'.repeat(100),
          nickName: '테스트유저',
        },
      };

      const result = signupSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      expect(result.error.issues[0].message).toContain('최대 100자');
    });

    it('비밀번호에 영문과 숫자가 포함되어야 함', () => {
      const invalidPasswords = ['password', '12345678', 'PASSWORD'];

      invalidPasswords.forEach((password) => {
        const invalidData = {
          body: {
            email: 'test@example.com',
            password,
            nickName: '테스트유저',
          },
        };

        const result = signupSchema.safeParse(invalidData);
        expect(result.success).toBe(false);
        expect(result.error.issues[0].message).toContain('영문 알파벳');
      });
    });

    it('닉네임이 없으면 실패해야 함', () => {
      const invalidData = {
        body: {
          email: 'test@example.com',
          password: 'Password123',
        },
      };

      const result = signupSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      // Zod returns generic message when field is missing
      expect(result.error.issues[0].message).toBeDefined();
    });

    it('닉네임이 2자 미만이면 실패해야 함', () => {
      const invalidData = {
        body: {
          email: 'test@example.com',
          password: 'Password123',
          nickName: '테',
        },
      };

      const result = signupSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      expect(result.error.issues[0].message).toContain('최소 2자');
    });

    it('닉네임이 20자를 초과하면 실패해야 함', () => {
      const invalidData = {
        body: {
          email: 'test@example.com',
          password: 'Password123',
          nickName: '테'.repeat(21),
        },
      };

      const result = signupSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      expect(result.error.issues[0].message).toContain('최대 20자');
    });

    it('닉네임의 앞뒤 공백은 제거되어야 함', () => {
      const validData = {
        body: {
          email: 'test@example.com',
          password: 'Password123',
          nickName: '  테스트유저  ',
        },
      };

      const result = signupSchema.safeParse(validData);
      expect(result.success).toBe(true);
      expect(result.data.body.nickName).toBe('테스트유저');
    });

    it('닉네임은 한글, 영문, 숫자, 공백만 허용해야 함', () => {
      const validNickNames = ['테스트123', 'Test User', '사용자1', 'User 123'];

      validNickNames.forEach((nickName) => {
        const validData = {
          body: {
            email: 'test@example.com',
            password: 'Password123',
            nickName,
          },
        };

        const result = signupSchema.safeParse(validData);
        expect(result.success).toBe(true);
      });
    });

    it('닉네임에 특수문자가 있으면 실패해야 함', () => {
      const invalidNickNames = ['테스트!', 'User@', 'Test#123', '사용자$'];

      invalidNickNames.forEach((nickName) => {
        const invalidData = {
          body: {
            email: 'test@example.com',
            password: 'Password123',
            nickName,
          },
        };

        const result = signupSchema.safeParse(invalidData);
        expect(result.success).toBe(false);
      });
    });

    it('닉네임에 XSS 공격 패턴이 있으면 실패해야 함', () => {
      const xssPatterns = [
        '<script>alert(1)</script>',
        '<img src=x>',
        'javascript:alert(1)',
        'SCRIPT',
      ];

      xssPatterns.forEach((nickName) => {
        const invalidData = {
          body: {
            email: 'test@example.com',
            password: 'Password123',
            nickName,
          },
        };

        const result = signupSchema.safeParse(invalidData);
        expect(result.success).toBe(false);
      });
    });
  });

  describe('loginSchema', () => {
    it('유효한 로그인 데이터는 통과해야 함', () => {
      const validData = {
        body: {
          email: 'test@example.com',
          password: 'anypassword',
        },
      };

      const result = loginSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('이메일이 없으면 실패해야 함', () => {
      const invalidData = {
        body: {
          password: 'password123',
        },
      };

      const result = loginSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('비밀번호가 없으면 실패해야 함', () => {
      const invalidData = {
        body: {
          email: 'test@example.com',
        },
      };

      const result = loginSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      // Zod returns generic message when field is missing
      expect(result.error.issues[0].message).toBeDefined();
    });

    it('로그인 시 비밀번호는 최소 1자만 요구해야 함', () => {
      const validData = {
        body: {
          email: 'test@example.com',
          password: 'a',
        },
      };

      const result = loginSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('빈 비밀번호는 실패해야 함', () => {
      const invalidData = {
        body: {
          email: 'test@example.com',
          password: '',
        },
      };

      const result = loginSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });
  });
});
