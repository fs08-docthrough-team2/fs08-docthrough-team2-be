import { z } from 'zod';

/**
 * 피드백 생성 스키마
 */
export const createFeedbackSchema = z.object({
  body: z.object({
    attendId: z
      .string({
        required_error: '참여 ID를 입력해주세요. attendId는 필수 입력 항목입니다.',
      })
      .uuid('유효하지 않은 참여 ID 형식입니다. attendId는 UUID 형식이어야 합니다. (예: "123e4567-e89b-12d3-a456-426614174000")'),

    content: z
      .string({
        required_error: '피드백 내용을 입력해주세요. 피드백 내용은 필수 입력 항목입니다.',
      })
      .min(1, '피드백 내용이 입력되지 않았습니다. 피드백을 최소 1자 이상 작성해주세요.')
      .max(1000, '피드백 내용이 너무 깁니다. 피드백은 최대 1000자까지만 입력 가능합니다.')
      .trim()
      .refine(
        (val) => !/<script|javascript:/i.test(val),
        '피드백에 보안상 위험한 문자가 포함되어 있습니다. <script>, javascript: 등의 스크립트 관련 문자는 사용할 수 없습니다.'
      ),
  }),
});

/**
 * 피드백 수정 스키마
 */
export const updateFeedbackSchema = z.object({
  body: z.object({
    feedbackId: z
      .string({
        required_error: '피드백 ID를 입력해주세요. feedbackId는 필수 입력 항목입니다.',
      })
      .uuid('유효하지 않은 피드백 ID 형식입니다. feedbackId는 UUID 형식이어야 합니다. (예: "123e4567-e89b-12d3-a456-426614174000")'),

    content: z
      .string({
        required_error: '피드백 내용을 입력해주세요. 피드백 내용은 필수 입력 항목입니다.',
      })
      .min(1, '피드백 내용이 입력되지 않았습니다. 피드백을 최소 1자 이상 작성해주세요.')
      .max(1000, '피드백 내용이 너무 깁니다. 피드백은 최대 1000자까지만 입력 가능합니다.')
      .trim(),
  }),
});

/**
 * 피드백 조회 쿼리 스키마
 */
export const getFeedbackListQuerySchema = z.object({
  query: z.object({
    attendId: z
      .string()
      .uuid('유효하지 않은 참여 ID 형식입니다. attendId는 UUID 형식이어야 합니다. (예: "123e4567-e89b-12d3-a456-426614174000")')
      .optional(),

    page: z
      .string()
      .regex(/^\d+$/, '페이지 번호는 숫자여야 합니다. 정수 형식으로 입력해주세요. (예: "1", "2", "3")')
      .transform(Number)
      .optional(),

    size: z
      .string()
      .regex(/^\d+$/, '페이지 크기는 숫자여야 합니다. 정수 형식으로 입력해주세요. (예: "10", "20", "50")')
      .transform(Number)
      .optional(),
  }),
});
