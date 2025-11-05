import { z } from 'zod';

/**
 * 이메일 파라미터 스키마
 */
export const emailParamSchema = z.object({
  params: z.object({
    email: z
      .string({
        required_error: '이메일은 필수입니다.',
      })
      .email('유효하지 않은 이메일 형식입니다.')
      .toLowerCase()
      .trim()
      // SQL 인젝션 방지
      .refine(
        (val) => !/['";<>\\]/.test(val),
        '이메일에 허용되지 않는 문자가 포함되어 있습니다.'
      ),
  }),
});

/**
 * 사용자 목록 조회 쿼리 스키마
 */
export const getUsersQuerySchema = z.object({
  query: z.object({
    page: z
      .string()
      .regex(/^\d+$/, '페이지는 숫자여야 합니다.')
      .transform(Number)
      .refine((val) => val >= 1, '페이지는 1 이상이어야 합니다.')
      .optional()
      .default('1'),

    limit: z
      .string()
      .regex(/^\d+$/, '페이지 크기는 숫자여야 합니다.')
      .transform(Number)
      .refine((val) => val >= 1, '페이지 크기는 1 이상이어야 합니다.')
      .refine((val) => val <= 100, '페이지 크기는 100 이하여야 합니다.')
      .optional()
      .default('10'),

    search: z
      .string()
      .max(100, '검색어는 최대 100자까지 입력 가능합니다.')
      .trim()
      // SQL 인젝션 방지
      .refine(
        (val) => !/(--|;|'|"|\\|\/\*|\*\/)/.test(val),
        '검색어에 허용되지 않는 문자가 포함되어 있습니다.'
      )
      .optional()
      .default(''),
  }),
});

/**
 * 사용자 역할 변경 스키마
 */
export const updateUserRoleSchema = z.object({
  params: z.object({
    email: z
      .string()
      .email('유효하지 않은 이메일 형식입니다.')
      .toLowerCase()
      .trim(),
  }),
  body: z.object({
    role: z
      .enum(['USER', 'EXPERT', 'ADMIN'], {
        required_error: '역할은 필수입니다.',
        invalid_type_error: '유효하지 않은 역할입니다. USER, EXPERT, ADMIN 중 하나를 선택하세요.',
      }),
  }),
});
