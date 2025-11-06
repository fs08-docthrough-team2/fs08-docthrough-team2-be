import { z } from 'zod';

/**
 * 이메일 파라미터 스키마
 */
export const emailParamSchema = z.object({
  params: z.object({
    email: z
      .string({
        required_error: '이메일을 입력해주세요. 이메일은 필수 입력 항목입니다.',
      })
      .email('유효하지 않은 이메일 형식입니다. 이메일 형식은 "example@domain.com"과 같아야 합니다.')
      .toLowerCase()
      .trim()
      // SQL 인젝션 방지
      .refine(
        (val) => !/['";<>\\]/.test(val),
        '이메일에 허용되지 않는 특수문자가 포함되어 있습니다. 작은따옴표(\'), 큰따옴표("), 세미콜론(;), 꺾쇠괄호(<, >), 백슬래시(\\)는 사용할 수 없습니다.'
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
      .regex(/^\d+$/, '페이지 번호는 숫자여야 합니다. 정수 형식으로 입력해주세요. (예: "1", "2", "3")')
      .transform(Number)
      .refine((val) => val >= 1, '페이지 번호가 올바르지 않습니다. 페이지 번호는 1 이상이어야 합니다.')
      .optional()
      .default('1'),

    limit: z
      .string()
      .regex(/^\d+$/, '페이지 크기는 숫자여야 합니다. 정수 형식으로 입력해주세요. (예: "10", "20", "50")')
      .transform(Number)
      .refine((val) => val >= 1, '페이지 크기가 너무 작습니다. 페이지 크기는 최소 1 이상이어야 합니다.')
      .refine((val) => val <= 100, '페이지 크기가 너무 큽니다. 페이지 크기는 최대 100까지만 가능합니다.')
      .optional()
      .default('10'),

    search: z
      .string()
      .max(100, '검색어가 너무 깁니다. 검색어는 최대 100자까지만 입력 가능합니다.')
      .trim()
      // SQL 인젝션 방지
      .refine(
        (val) => !/(--|;|'|"|\\|\/\*|\*\/)/.test(val),
        '검색어에 허용되지 않는 문자가 포함되어 있습니다. SQL 주석(--, /* */), 따옴표(\', "), 세미콜론(;), 백슬래시(\\)는 사용할 수 없습니다.'
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
      .email('유효하지 않은 이메일 형식입니다. 이메일 형식은 "example@domain.com"과 같아야 합니다.')
      .toLowerCase()
      .trim(),
  }),
  body: z.object({
    role: z
      .enum(['USER', 'EXPERT', 'ADMIN'], {
        required_error: '역할을 선택해주세요. 역할은 필수 입력 항목입니다.',
        invalid_type_error: '유효하지 않은 역할입니다. USER, EXPERT, ADMIN 중 하나를 선택해주세요.',
      }),
  }),
});
