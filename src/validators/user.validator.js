import { z } from 'zod';

/**
 * 사용자 프로필 수정 스키마
 */
export const updateUserProfileSchema = z.object({
  body: z.object({
    nickName: z
      .string()
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
      )
      .optional(),

    password: z
      .string()
      .min(8, '비밀번호는 최소 8자 이상이어야 합니다.')
      .max(100, '비밀번호는 최대 100자까지 입력 가능합니다.')
      .refine(
        (val) => /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]/.test(val),
        '비밀번호는 영문, 숫자, 특수문자를 포함해야 합니다.'
      )
      .optional(),
  }).refine(
    (data) => data.nickName || data.password,
    {
      message: '수정할 항목(닉네임 또는 비밀번호)을 입력해주세요.',
      path: ['body'],
    }
  ),
});
