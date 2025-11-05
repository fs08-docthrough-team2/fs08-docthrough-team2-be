import { z } from 'zod';

/**
 * 알림 ID 파라미터 스키마
 */
export const noticeIdParamSchema = z.object({
  params: z.object({
    noticeId: z
      .string({
        required_error: '알림 ID는 필수입니다.',
      })
      .uuid('유효하지 않은 알림 ID 형식입니다.'),
  }),
});

/**
 * 알림 목록 조회 쿼리 스키마
 */
export const getNoticeListQuerySchema = z.object({
  query: z.object({
    page: z
      .string()
      .regex(/^\d+$/, '페이지는 숫자여야 합니다.')
      .transform(Number)
      .refine((val) => val >= 1, '페이지는 1 이상이어야 합니다.')
      .optional(),

    pageSize: z
      .string()
      .regex(/^\d+$/, '페이지 크기는 숫자여야 합니다.')
      .transform(Number)
      .refine((val) => val >= 1, '페이지 크기는 1 이상이어야 합니다.')
      .refine((val) => val <= 100, '페이지 크기는 100 이하여야 합니다.')
      .optional(),
  }),
});
