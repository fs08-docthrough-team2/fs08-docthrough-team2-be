import { z } from 'zod';

/**
 * 알림 ID 파라미터 스키마
 */
export const noticeIdParamSchema = z.object({
  params: z.object({
    noticeId: z
      .string({
        required_error: '알림 ID를 입력해주세요. 알림 ID는 필수 입력 항목입니다.',
      })
      .uuid('유효하지 않은 알림 ID 형식입니다. 알림 ID는 UUID 형식이어야 합니다. (예: "123e4567-e89b-12d3-a456-426614174000")'),
  }),
});

/**
 * 알림 목록 조회 쿼리 스키마
 */
export const getNoticeListQuerySchema = z.object({
  query: z.object({
    page: z
      .string()
      .regex(/^\d+$/, '페이지 번호는 숫자여야 합니다. 정수 형식으로 입력해주세요. (예: "1", "2", "3")')
      .transform(Number)
      .refine((val) => val >= 1, '페이지 번호가 올바르지 않습니다. 페이지 번호는 1 이상이어야 합니다.')
      .optional(),

    pageSize: z
      .string()
      .regex(/^\d+$/, '페이지 크기는 숫자여야 합니다. 정수 형식으로 입력해주세요. (예: "10", "20", "50")')
      .transform(Number)
      .refine((val) => val >= 1, '페이지 크기가 너무 작습니다. 페이지 크기는 최소 1 이상이어야 합니다.')
      .refine((val) => val <= 100, '페이지 크기가 너무 큽니다. 페이지 크기는 최대 100까지만 가능합니다.')
      .optional(),
  }),
});
