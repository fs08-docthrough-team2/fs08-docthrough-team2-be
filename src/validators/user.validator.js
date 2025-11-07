import { z } from 'zod';

/**
 * 사용자 프로필 수정 스키마
 */
export const updateUserProfileSchema = z.object({
  body: z.object({
    nickName: z
      .string()
      .min(2, '닉네임이 너무 짧습니다. 닉네임은 최소 2자 이상이어야 합니다.')
      .max(20, '닉네임이 너무 깁니다. 닉네임은 최대 20자까지만 입력 가능합니다.')
      .trim()
      // 특수문자 제한 (한글, 영문, 숫자, 공백만 허용)
      .refine(
        (val) => /^[가-힣a-zA-Z0-9\s]+$/.test(val),
        '닉네임에 허용되지 않는 문자가 포함되어 있습니다. 닉네임은 한글(가-힣), 영문(A-Z, a-z), 숫자(0-9), 공백만 사용할 수 있습니다. 특수문자는 사용할 수 없습니다.'
      )
      // XSS 방지
      .refine(
        (val) => !/<|>|script|javascript:/i.test(val),
        '닉네임에 보안상 위험한 문자가 포함되어 있습니다. 꺾쇠괄호(<, >), script, javascript 등의 문자는 사용할 수 없습니다.'
      )
      .optional(),

    password: z
      .string()
      .min(8, '비밀번호가 너무 짧습니다. 비밀번호는 최소 8자 이상이어야 합니다. 현재 입력한 비밀번호의 길이를 확인해주세요.')
      .max(100, '비밀번호가 너무 깁니다. 비밀번호는 최대 100자까지만 입력 가능합니다.')
      .refine(
        (val) => /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]/.test(val),
        '비밀번호가 보안 규칙을 만족하지 않습니다. 비밀번호는 영문 알파벳(A-Z, a-z), 숫자(0-9), 특수문자(@, $, !, %, *, #, ?, &)를 모두 포함해야 합니다. 예: "MyPass123!", "SecureP@ss456"'
      )
      .optional(),
  }).refine(
    (data) => data.nickName || data.password,
    {
      message: '수정할 항목이 없습니다. 프로필을 수정하려면 닉네임 또는 비밀번호 중 최소 하나를 입력해주세요.',
      path: ['body'],
    }
  ),
});
