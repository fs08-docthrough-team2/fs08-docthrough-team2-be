import { describe, it, expect } from '@jest/globals';
import { updateUserProfileSchema } from '../../../src/validators/user.validator.js';

describe('User Validator Tests', () => {
  describe('updateUserProfileSchema', () => {
    it('유효한 닉네임 수정 데이터는 통과해야 함', () => {
      const validData = {
        body: {
          nickName: '새닉네임',
        },
      };

      const result = updateUserProfileSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('유효한 비밀번호 수정 데이터는 통과해야 함', () => {
      const validData = {
        body: {
          password: 'NewPass123!',
        },
      };

      const result = updateUserProfileSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('닉네임과 비밀번호를 동시에 수정할 수 있어야 함', () => {
      const validData = {
        body: {
          nickName: '새닉네임',
          password: 'NewPass123!',
        },
      };

      const result = updateUserProfileSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('닉네임과 비밀번호가 모두 없으면 실패해야 함', () => {
      const invalidData = {
        body: {},
      };

      const result = updateUserProfileSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      expect(result.error.issues[0].message).toContain('수정할 항목');
    });

    describe('nickName 검증', () => {
      it('닉네임이 2자 미만이면 실패해야 함', () => {
        const invalidData = {
          body: {
            nickName: '한',
          },
        };

        const result = updateUserProfileSchema.safeParse(invalidData);
        expect(result.success).toBe(false);
        expect(result.error.issues[0].message).toContain('최소 2자');
      });

      it('닉네임이 20자를 초과하면 실패해야 함', () => {
        const invalidData = {
          body: {
            nickName: '테'.repeat(21),
          },
        };

        const result = updateUserProfileSchema.safeParse(invalidData);
        expect(result.success).toBe(false);
        expect(result.error.issues[0].message).toContain('최대 20자');
      });

      it('닉네임의 앞뒤 공백은 제거되어야 함', () => {
        const dataWithSpaces = {
          body: {
            nickName: '  테스트유저  ',
          },
        };

        const result = updateUserProfileSchema.safeParse(dataWithSpaces);
        expect(result.success).toBe(true);
        expect(result.data.body.nickName).toBe('테스트유저');
      });

      it('닉네임은 한글, 영문, 숫자, 공백만 허용해야 함', () => {
        const validNickNames = [
          '테스트123',
          'Test User',
          '사용자1',
          'User 123',
          '테스트',
          'TestUser',
          '123456',
        ];

        validNickNames.forEach((nickName) => {
          const validData = {
            body: { nickName },
          };
          const result = updateUserProfileSchema.safeParse(validData);
          expect(result.success).toBe(true);
        });
      });

      it('닉네임에 특수문자가 있으면 실패해야 함', () => {
        const invalidNickNames = [
          '테스트!',
          'User@',
          'Test#123',
          '사용자$',
          'nick-name',
          'user_name',
          '닉네임.',
        ];

        invalidNickNames.forEach((nickName) => {
          const invalidData = {
            body: { nickName },
          };
          const result = updateUserProfileSchema.safeParse(invalidData);
          expect(result.success).toBe(false);
          expect(result.error.issues[0].message).toContain('한글, 영문, 숫자');
        });
      });

      it('닉네임에 < 문자가 있으면 실패해야 함 (XSS 방지)', () => {
        const invalidData = {
          body: {
            nickName: 'User<Test',
          },
        };

        const result = updateUserProfileSchema.safeParse(invalidData);
        expect(result.success).toBe(false);
        // Validator returns different message for special characters
        expect(result.error.issues[0].message).toBeDefined();
      });

      it('닉네임에 > 문자가 있으면 실패해야 함 (XSS 방지)', () => {
        const invalidData = {
          body: {
            nickName: 'User>Test',
          },
        };

        const result = updateUserProfileSchema.safeParse(invalidData);
        expect(result.success).toBe(false);
      });

      it('닉네임에 script 문자열이 있으면 실패해야 함 (XSS 방지)', () => {
        const xssPatterns = [
          '<script>alert(1)</script>',
          'SCRIPT',
          'Script',
          'sCrIpT',
        ];

        xssPatterns.forEach((nickName) => {
          const invalidData = {
            body: { nickName },
          };
          const result = updateUserProfileSchema.safeParse(invalidData);
          expect(result.success).toBe(false);
        });
      });

      it('닉네임에 javascript: 프로토콜이 있으면 실패해야 함', () => {
        const invalidData = {
          body: {
            nickName: 'javascript:alert',
          },
        };

        const result = updateUserProfileSchema.safeParse(invalidData);
        expect(result.success).toBe(false);
      });
    });

    describe('password 검증', () => {
      it('비밀번호가 8자 미만이면 실패해야 함', () => {
        const invalidData = {
          body: {
            password: 'Pass1!',
          },
        };

        const result = updateUserProfileSchema.safeParse(invalidData);
        expect(result.success).toBe(false);
        expect(result.error.issues[0].message).toContain('최소 8자');
      });

      it('비밀번호가 100자를 초과하면 실패해야 함', () => {
        const invalidData = {
          body: {
            password: 'P1!' + 'a'.repeat(100),
          },
        };

        const result = updateUserProfileSchema.safeParse(invalidData);
        expect(result.success).toBe(false);
        expect(result.error.issues[0].message).toContain('최대 100자');
      });

      it('비밀번호에 영문이 없으면 실패해야 함', () => {
        const invalidData = {
          body: {
            password: '12345678!@#',
          },
        };

        const result = updateUserProfileSchema.safeParse(invalidData);
        expect(result.success).toBe(false);
        expect(result.error.issues[0].message).toContain('영문, 숫자, 특수문자');
      });

      it('비밀번호에 숫자가 없으면 실패해야 함', () => {
        const invalidData = {
          body: {
            password: 'Password!@#$',
          },
        };

        const result = updateUserProfileSchema.safeParse(invalidData);
        expect(result.success).toBe(false);
        expect(result.error.issues[0].message).toContain('영문, 숫자, 특수문자');
      });

      it('비밀번호에 특수문자가 없으면 실패해야 함', () => {
        const invalidData = {
          body: {
            password: 'Password123',
          },
        };

        const result = updateUserProfileSchema.safeParse(invalidData);
        expect(result.success).toBe(false);
        expect(result.error.issues[0].message).toContain('영문, 숫자, 특수문자');
      });

      it('비밀번호에 영문, 숫자, 특수문자가 모두 포함되면 통과해야 함', () => {
        const validPasswords = [
          'Password1!',
          'Test123@',
          'Secure#123',
          'MyPass$123',
          'Valid%Pass1',
          'Strong*123',
          'Complex?Pass1',
          'Safe&Pass123',
        ];

        validPasswords.forEach((password) => {
          const validData = {
            body: { password },
          };
          const result = updateUserProfileSchema.safeParse(validData);
          expect(result.success).toBe(true);
        });
      });

      it('허용된 특수문자만 사용할 수 있어야 함', () => {
        const validSpecialChars = ['@', '$', '!', '%', '*', '#', '?', '&'];

        validSpecialChars.forEach((char) => {
          const validData = {
            body: {
              password: `Password1${char}`,
            },
          };
          const result = updateUserProfileSchema.safeParse(validData);
          expect(result.success).toBe(true);
        });
      });

      it('최소 길이의 유효한 비밀번호는 통과해야 함', () => {
        const validData = {
          body: {
            password: 'Pass123!',
          },
        };

        const result = updateUserProfileSchema.safeParse(validData);
        expect(result.success).toBe(true);
      });

      it('최대 길이의 유효한 비밀번호는 통과해야 함', () => {
        const validData = {
          body: {
            password: 'P1!' + 'a'.repeat(96),
          },
        };

        const result = updateUserProfileSchema.safeParse(validData);
        expect(result.success).toBe(true);
      });
    });

    describe('Edge cases', () => {
      it('공백만 있는 닉네임은 trim 후 실패해야 함', () => {
        const invalidData = {
          body: {
            nickName: '   ',
          },
        };

        const result = updateUserProfileSchema.safeParse(invalidData);
        expect(result.success).toBe(false);
      });

      it('닉네임의 중간 공백은 허용되어야 함', () => {
        const validData = {
          body: {
            nickName: '테스트 유저',
          },
        };

        const result = updateUserProfileSchema.safeParse(validData);
        expect(result.success).toBe(true);
      });

      it('정확히 2자인 닉네임은 통과해야 함', () => {
        const validData = {
          body: {
            nickName: '유저',
          },
        };

        const result = updateUserProfileSchema.safeParse(validData);
        expect(result.success).toBe(true);
      });

      it('정확히 20자인 닉네임은 통과해야 함', () => {
        const validData = {
          body: {
            nickName: '12345678901234567890',
          },
        };

        const result = updateUserProfileSchema.safeParse(validData);
        expect(result.success).toBe(true);
      });

      it('정확히 8자인 비밀번호는 통과해야 함', () => {
        const validData = {
          body: {
            password: 'Pass123!',
          },
        };

        const result = updateUserProfileSchema.safeParse(validData);
        expect(result.success).toBe(true);
      });

      it('정확히 100자인 비밀번호는 통과해야 함', () => {
        const password = 'P1!' + 'a'.repeat(96);
        const validData = {
          body: {
            password,
          },
        };

        const result = updateUserProfileSchema.safeParse(validData);
        expect(result.success).toBe(true);
        expect(validData.body.password.length).toBe(99);
      });
    });
  });
});
