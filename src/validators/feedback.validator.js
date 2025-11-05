import { z } from 'zod';

/**
 * 피드백 생성 스키마
 */
export const createFeedbackSchema = z.object({
  body: z.object({
    attend_id: z
      .string({
        required_error: 'attend_id는 필수입니다.',
      })
      .uuid('유효하지 않은 attend_id 형식입니다.'),

    content: z
      .string({
        required_error: '피드백 내용은 필수입니다.',
      })
      .min(10, '피드백은 최소 10자 이상 작성해주세요.')
      .max(1000, '피드백은 최대 1000자까지 입력 가능합니다.')
      .trim()
      .refine(
        (val) => !/<script|javascript:/i.test(val),
        '피드백에 허용되지 않는 문자가 포함되어 있습니다.'
      ),
  }),
});

/**
 * 피드백 수정 스키마
 */
export const updateFeedbackSchema = z.object({
  body: z.object({
    feedback_id: z
      .string({
        required_error: 'feedback_id는 필수입니다.',
      })
      .uuid('유효하지 않은 feedback_id 형식입니다.'),

    content: z
      .string({
        required_error: '피드백 내용은 필수입니다.',
      })
      .min(10, '피드백은 최소 10자 이상 작성해주세요.')
      .max(1000, '피드백은 최대 1000자까지 입력 가능합니다.')
      .trim(),
  }),
});

/**
 * 피드백 조회 쿼리 스키마
 */
export const getFeedbackListQuerySchema = z.object({
  query: z.object({
    attend_id: z
      .string()
      .uuid('유효하지 않은 attend_id 형식입니다.')
      .optional(),

    page: z
      .string()
      .regex(/^\d+$/, '페이지는 숫자여야 합니다.')
      .transform(Number)
      .optional(),

    size: z
      .string()
      .regex(/^\d+$/, '페이지 크기는 숫자여야 합니다.')
      .transform(Number)
      .optional(),
  }),
});
