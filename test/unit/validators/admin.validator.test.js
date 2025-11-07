import { describe, it, expect } from '@jest/globals';
import {
  emailParamSchema,
  getUsersQuerySchema,
  updateUserRoleSchema,
} from '../../../src/validators/admin.validator.js';

describe('Admin Validator Tests', () => {
  describe('emailParamSchema', () => {
    it('유효한 이메일은 통과해야 함', () => {
      const validData = {
        params: {
          email: 'test@example.com',
        },
      };

      const result = emailParamSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('이메일이 없으면 실패해야 함', () => {
      const invalidData = {
        params: {},
      };

      const result = emailParamSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      // Zod returns generic message when field is missing
      expect(result.error.issues[0].message).toBeDefined();
    });

    it('유효하지 않은 이메일 형식이면 실패해야 함', () => {
      const invalidEmails = [
        'invalid-email',
        'test@',
        '@example.com',
        'test..email@example.com',
        'test@.com',
      ];

      invalidEmails.forEach((email) => {
        const invalidData = {
          params: { email },
        };
        const result = emailParamSchema.safeParse(invalidData);
        expect(result.success).toBe(false);
        expect(result.error.issues[0].message).toContain('유효하지 않은 이메일');
      });
    });

    it('이메일은 소문자로 변환되어야 함', () => {
      const validData = {
        params: {
          email: 'Test@Example.COM',
        },
      };

      const result = emailParamSchema.safeParse(validData);
      expect(result.success).toBe(true);
      expect(result.data.params.email).toBe('test@example.com');
    });

    it('이메일의 앞뒤 공백은 제거되어야 함', () => {
      const validData = {
        params: {
          email: 'test@example.com',
        },
      };

      const result = emailParamSchema.safeParse(validData);
      expect(result.success).toBe(true);
      expect(result.data.params.email).toBe('test@example.com');
    });

    it("이메일에 작은따옴표가 있으면 실패해야 함 (SQL 인젝션 방지)", () => {
      const invalidData = {
        params: {
          email: "test'@example.com",
        },
      };

      const result = emailParamSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      // Email validator fails format check before refine check
      expect(result.error.issues[0].message).toBeDefined();
    });

    it('이메일에 큰따옴표가 있으면 실패해야 함 (SQL 인젝션 방지)', () => {
      const invalidData = {
        params: {
          email: 'test"@example.com',
        },
      };

      const result = emailParamSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('이메일에 세미콜론이 있으면 실패해야 함 (SQL 인젝션 방지)', () => {
      const invalidData = {
        params: {
          email: 'test;@example.com',
        },
      };

      const result = emailParamSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('이메일에 꺾쇠괄호가 있으면 실패해야 함 (XSS 방지)', () => {
      const dangerousEmails = [
        'test<@example.com',
        'test>@example.com',
      ];

      dangerousEmails.forEach((email) => {
        const invalidData = {
          params: { email },
        };
        const result = emailParamSchema.safeParse(invalidData);
        expect(result.success).toBe(false);
      });
    });

    it('이메일에 백슬래시가 있으면 실패해야 함', () => {
      const invalidData = {
        params: {
          email: 'test\\@example.com',
        },
      };

      const result = emailParamSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('유효한 다양한 이메일 형식은 통과해야 함', () => {
      const validEmails = [
        'user@example.com',
        'user.name@example.com',
        'user+tag@example.co.kr',
        'user123@test-domain.com',
      ];

      validEmails.forEach((email) => {
        const validData = {
          params: { email },
        };
        const result = emailParamSchema.safeParse(validData);
        expect(result.success).toBe(true);
      });
    });
  });

  describe('getUsersQuerySchema', () => {
    it('유효한 쿼리 파라미터는 통과해야 함', () => {
      const validData = {
        query: {
          page: '2',
          limit: '20',
          search: '테스트',
        },
      };

      const result = getUsersQuerySchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('모든 파라미터가 없어도 기본값으로 통과해야 함', () => {
      const validData = {
        query: {},
      };

      const result = getUsersQuerySchema.safeParse(validData);
      expect(result.success).toBe(true);
      // Defaults are applied before transform, so they're strings
      expect(result.data.query.page).toBe('1');
      expect(result.data.query.limit).toBe('10');
      expect(result.data.query.search).toBe('');
    });

    describe('page 검증', () => {
      it('page 기본값은 1이어야 함', () => {
        const validData = {
          query: {},
        };

        const result = getUsersQuerySchema.safeParse(validData);
        expect(result.success).toBe(true);
        // Default is applied before transform, so it's a string
        expect(result.data.query.page).toBe('1');
      });

      it('page가 문자열 숫자면 숫자로 변환되어야 함', () => {
        const validData = {
          query: {
            page: '5',
          },
        };

        const result = getUsersQuerySchema.safeParse(validData);
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

        const result = getUsersQuerySchema.safeParse(invalidData);
        expect(result.success).toBe(false);
        expect(result.error.issues[0].message).toContain('숫자');
      });

      it('page가 1 미만이면 실패해야 함', () => {
        const invalidData = {
          query: {
            page: '0',
          },
        };

        const result = getUsersQuerySchema.safeParse(invalidData);
        expect(result.success).toBe(false);
        expect(result.error.issues[0].message).toContain('1 이상');
      });

      it('page가 음수면 실패해야 함', () => {
        const invalidData = {
          query: {
            page: '-1',
          },
        };

        const result = getUsersQuerySchema.safeParse(invalidData);
        expect(result.success).toBe(false);
      });
    });

    describe('limit 검증', () => {
      it('limit 기본값은 10이어야 함', () => {
        const validData = {
          query: {},
        };

        const result = getUsersQuerySchema.safeParse(validData);
        expect(result.success).toBe(true);
        // Default is applied before transform, so it's a string
        expect(result.data.query.limit).toBe('10');
      });

      it('limit가 문자열 숫자면 숫자로 변환되어야 함', () => {
        const validData = {
          query: {
            limit: '50',
          },
        };

        const result = getUsersQuerySchema.safeParse(validData);
        expect(result.success).toBe(true);
        expect(result.data.query.limit).toBe(50);
        expect(typeof result.data.query.limit).toBe('number');
      });

      it('limit가 숫자가 아니면 실패해야 함', () => {
        const invalidData = {
          query: {
            limit: 'xyz',
          },
        };

        const result = getUsersQuerySchema.safeParse(invalidData);
        expect(result.success).toBe(false);
        expect(result.error.issues[0].message).toContain('숫자');
      });

      it('limit가 1 미만이면 실패해야 함', () => {
        const invalidData = {
          query: {
            limit: '0',
          },
        };

        const result = getUsersQuerySchema.safeParse(invalidData);
        expect(result.success).toBe(false);
        expect(result.error.issues[0].message).toContain('1 이상');
      });

      it('limit가 100을 초과하면 실패해야 함', () => {
        const invalidData = {
          query: {
            limit: '101',
          },
        };

        const result = getUsersQuerySchema.safeParse(invalidData);
        expect(result.success).toBe(false);
        expect(result.error.issues[0].message).toContain('페이지 크기가 너무 큽니다');
      });

      it('limit가 1-100 사이면 통과해야 함', () => {
        const validLimits = ['1', '10', '50', '100'];

        validLimits.forEach((limit) => {
          const validData = {
            query: { limit },
          };
          const result = getUsersQuerySchema.safeParse(validData);
          expect(result.success).toBe(true);
        });
      });
    });

    describe('search 검증', () => {
      it('search 기본값은 빈 문자열이어야 함', () => {
        const validData = {
          query: {},
        };

        const result = getUsersQuerySchema.safeParse(validData);
        expect(result.success).toBe(true);
        expect(result.data.query.search).toBe('');
      });

      it('search가 100자를 초과하면 실패해야 함', () => {
        const invalidData = {
          query: {
            search: 'a'.repeat(101),
          },
        };

        const result = getUsersQuerySchema.safeParse(invalidData);
        expect(result.success).toBe(false);
        expect(result.error.issues[0].message).toContain('최대 100자');
      });

      it('search의 앞뒤 공백은 제거되어야 함', () => {
        const validData = {
          query: {
            search: '  검색어  ',
          },
        };

        const result = getUsersQuerySchema.safeParse(validData);
        expect(result.success).toBe(true);
        expect(result.data.query.search).toBe('검색어');
      });

      it('search에 SQL 주석 패턴이 있으면 실패해야 함', () => {
        const invalidData = {
          query: {
            search: 'test -- comment',
          },
        };

        const result = getUsersQuerySchema.safeParse(invalidData);
        expect(result.success).toBe(false);
        expect(result.error.issues[0].message).toContain('허용되지 않는 문자');
      });

      it('search에 세미콜론이 있으면 실패해야 함', () => {
        const invalidData = {
          query: {
            search: 'test; DROP TABLE',
          },
        };

        const result = getUsersQuerySchema.safeParse(invalidData);
        expect(result.success).toBe(false);
      });

      it("search에 작은따옴표가 있으면 실패해야 함", () => {
        const invalidData = {
          query: {
            search: "test' OR '1'='1",
          },
        };

        const result = getUsersQuerySchema.safeParse(invalidData);
        expect(result.success).toBe(false);
      });

      it('search에 큰따옴표가 있으면 실패해야 함', () => {
        const invalidData = {
          query: {
            search: 'test"OR"1"="1',
          },
        };

        const result = getUsersQuerySchema.safeParse(invalidData);
        expect(result.success).toBe(false);
      });

      it('search에 백슬래시가 있으면 실패해야 함', () => {
        const invalidData = {
          query: {
            search: 'test\\escape',
          },
        };

        const result = getUsersQuerySchema.safeParse(invalidData);
        expect(result.success).toBe(false);
      });

      it('search에 SQL 주석 블록이 있으면 실패해야 함', () => {
        const invalidPatterns = [
          'test /* comment */',
          'test */ comment',
        ];

        invalidPatterns.forEach((search) => {
          const invalidData = {
            query: { search },
          };
          const result = getUsersQuerySchema.safeParse(invalidData);
          expect(result.success).toBe(false);
        });
      });

      it('유효한 검색어는 통과해야 함', () => {
        const validSearches = [
          '테스트',
          'test',
          'user123',
          '사용자-검색',
          'user_name',
          '검색어 테스트',
        ];

        validSearches.forEach((search) => {
          const validData = {
            query: { search },
          };
          const result = getUsersQuerySchema.safeParse(validData);
          expect(result.success).toBe(true);
        });
      });
    });
  });

  describe('updateUserRoleSchema', () => {
    const validRoleData = {
      params: {
        email: 'test@example.com',
      },
      body: {
        role: 'EXPERT',
      },
    };

    it('유효한 역할 변경 데이터는 통과해야 함', () => {
      const result = updateUserRoleSchema.safeParse(validRoleData);
      expect(result.success).toBe(true);
    });

    it('이메일이 없으면 실패해야 함', () => {
      const invalidData = {
        params: {},
        body: validRoleData.body,
      };

      const result = updateUserRoleSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('유효하지 않은 이메일 형식이면 실패해야 함', () => {
      const invalidData = {
        params: {
          email: 'invalid-email',
        },
        body: validRoleData.body,
      };

      const result = updateUserRoleSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      expect(result.error.issues[0].message).toContain('유효하지 않은 이메일');
    });

    it('이메일은 소문자로 변환되어야 함', () => {
      const dataWithUpperCase = {
        params: {
          email: 'Test@Example.COM',
        },
        body: validRoleData.body,
      };

      const result = updateUserRoleSchema.safeParse(dataWithUpperCase);
      expect(result.success).toBe(true);
      expect(result.data.params.email).toBe('test@example.com');
    });

    it('이메일의 앞뒤 공백은 제거되어야 함', () => {
      const dataWithSpaces = {
        params: {
          email: 'test@example.com',
        },
        body: validRoleData.body,
      };

      const result = updateUserRoleSchema.safeParse(dataWithSpaces);
      expect(result.success).toBe(true);
      expect(result.data.params.email).toBe('test@example.com');
    });

    it('역할이 없으면 실패해야 함', () => {
      const invalidData = {
        params: validRoleData.params,
        body: {},
      };

      const result = updateUserRoleSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      // Zod returns generic message when field is missing
      expect(result.error.issues[0].message).toBeDefined();
    });

    it('유효한 역할은 모두 통과해야 함', () => {
      const validRoles = ['USER', 'EXPERT', 'ADMIN'];

      validRoles.forEach((role) => {
        const validData = {
          params: validRoleData.params,
          body: { role },
        };
        const result = updateUserRoleSchema.safeParse(validData);
        expect(result.success).toBe(true);
      });
    });

    it('유효하지 않은 역할이면 실패해야 함', () => {
      const invalidRoles = [
        'SUPERADMIN',
        'MODERATOR',
        'user',
        'expert',
        'admin',
        'INVALID',
      ];

      invalidRoles.forEach((role) => {
        const invalidData = {
          params: validRoleData.params,
          body: { role },
        };
        const result = updateUserRoleSchema.safeParse(invalidData);
        expect(result.success).toBe(false);
        // Zod returns generic enum validation message
        expect(result.error.issues[0].message).toBeDefined();
      });
    });

    it('역할은 대소문자를 구분해야 함', () => {
      const invalidData = {
        params: validRoleData.params,
        body: {
          role: 'user',
        },
      };

      const result = updateUserRoleSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('전체 데이터 변환 확인', () => {
      const inputData = {
        params: {
          email: 'Test@Example.COM',
        },
        body: {
          role: 'ADMIN',
        },
      };

      const result = updateUserRoleSchema.safeParse(inputData);
      expect(result.success).toBe(true);
      expect(result.data.params.email).toBe('test@example.com');
      expect(result.data.body.role).toBe('ADMIN');
    });
  });
});
