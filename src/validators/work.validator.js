import { z } from 'zod';

/**
 * 작업물 생성 스키마
 */
export const createWorkSchema = z.object({
  body: z.object({
    challengeId: z
      .string({
        required_error: 'challenge_id는 필수입니다.',
      })
      .uuid('유효하지 않은 챌린지 ID 형식입니다.'),

    title: z
      .string()
      .max(200, '제목은 최대 200자까지 입력 가능합니다.')
      .trim()
      .refine(
        (val) => !/<script|javascript:/i.test(val),
        '제목에 허용되지 않는 문자가 포함되어 있습니다.'
      )
      .optional()
      .default(''),

    workItem: z
      .string({
        required_error: 'workItem은 필수입니다.',
      })
      .min(1, '작업물 내용을 입력해주세요.')
      .max(10000, '작업물 내용은 최대 10000자까지 입력 가능합니다.')
      .trim()
      .refine(
        (val) => !/<script|javascript:/i.test(val),
        '작업물에 허용되지 않는 문자가 포함되어 있습니다.'
      ),
  }),
});

/**
 * 작업물 수정 스키마
 */
export const updateWorkSchema = z.object({
  params: z.object({
    attend_id: z
      .string({
        required_error: 'attend_id는 필수입니다.',
      })
      .uuid('유효하지 않은 attend_id 형식입니다.'),
  }),
  body: z.object({
    title: z
      .string()
      .max(200, '제목은 최대 200자까지 입력 가능합니다.')
      .trim()
      .optional(),

    workItem: z
      .string()
      .max(10000, '작업물 내용은 최대 10000자까지 입력 가능합니다.')
      .trim()
      .optional(),
  }),
});

/**
 * 작업물 조회 쿼리 스키마
 */
export const getWorkListQuerySchema = z.object({
  query: z.object({
    challenge_id: z
      .string()
      .uuid('유효하지 않은 챌린지 ID 형식입니다.')
      .optional(),

    page: z
      .string()
      .regex(/^\d+$/, '페이지는 숫자여야 합니다.')
      .transform(Number)
      .refine((val) => val >= 1, '페이지는 1 이상이어야 합니다.')
      .optional(),

    size: z
      .string()
      .regex(/^\d+$/, '페이지 크기는 숫자여야 합니다.')
      .transform(Number)
      .refine((val) => val >= 1, '페이지 크기는 1 이상이어야 합니다.')
      .refine((val) => val <= 100, '페이지 크기는 100 이하여야 합니다.')
      .optional(),
  }),
});
