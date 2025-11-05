import { z } from 'zod';

/**
 * 이메일 검증 패턴
 * - SQL 인젝션 방지
 * - 표준 이메일 형식 검증
 */
const emailSchema = z
  .string({
    required_error: '이메일은 필수 입력 항목입니다.',
    invalid_type_error: '이메일은 문자열이어야 합니다.',
  })
  .email('유효하지 않은 이메일 형식입니다.')
  .min(5, '이메일은 최소 5자 이상이어야 합니다.')
  .max(100, '이메일은 최대 100자까지 입력 가능합니다.')
  .toLowerCase()
  .trim()
  // SQL 인젝션 방지 - 위험한 문자 차단
  .refine(
    (val) => !/['";<>\\]/.test(val),
    '이메일에 허용되지 않는 문자가 포함되어 있습니다.'
  );

/**
 * 비밀번호 검증 패턴
 * - 최소 8자, 최대 100자
 * - 영문, 숫자 포함
 */
const passwordSchema = z
  .string({
    required_error: '비밀번호는 필수 입력 항목입니다.',
    invalid_type_error: '비밀번호는 문자열이어야 합니다.',
  })
  .min(8, '비밀번호는 최소 8자 이상이어야 합니다.')
  .max(100, '비밀번호는 최대 100자까지 입력 가능합니다.')
  .refine(
    (val) => /^(?=.*[A-Za-z])(?=.*\d)/.test(val),
    '비밀번호는 영문과 숫자를 포함해야 합니다.'
  );

/**
 * 닉네임 검증 패턴
 * - XSS 및 SQL 인젝션 방지
 */
const nickNameSchema = z
  .string({
    required_error: '닉네임은 필수 입력 항목입니다.',
    invalid_type_error: '닉네임은 문자열이어야 합니다.',
  })
  .min(2, '닉네임은 최소 2자 이상이어야 합니다.')
  .max(20, '닉네임은 최대 20자까지 입력 가능합니다.')
  .trim()
  // 특수문자 제한 (한글, 영문, 숫자, 공백만 허용)
  .refine(
    (val) => /^[가-힣a-zA-Z0-9\s]+$/.test(val),
    '닉네임은 한글, 영문, 숫자만 사용할 수 있습니다.'
  )
  // XSS 방지
  .refine(
    (val) => !/<|>|script|javascript:/i.test(val),
    '닉네임에 허용되지 않는 문자가 포함되어 있습니다.'
  );

/**
 * 회원가입 스키마
 */
export const signupSchema = z.object({
  body: z.object({
    email: emailSchema,
    password: passwordSchema,
    nickName: nickNameSchema,
  }),
});

/**
 * 로그인 스키마
 */
export const loginSchema = z.object({
  body: z.object({
    email: emailSchema,
    password: z
      .string({
        required_error: '비밀번호는 필수 입력 항목입니다.',
      })
      .min(1, '비밀번호를 입력해주세요.'),
  }),
});
