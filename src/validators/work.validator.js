import { z } from 'zod';

/**
 * 작업물 생성 스키마
 */
export const createWorkSchema = z.object({
  body: z.object({
    challengeId: z
      .string({
        required_error: '챌린지 ID를 입력해주세요. challengeId는 필수 입력 항목입니다.',
      })
      .uuid('유효하지 않은 챌린지 ID 형식입니다. 챌린지 ID는 UUID 형식이어야 합니다. (예: "123e4567-e89b-12d3-a456-426614174000")'),

    title: z
      .string()
      .max(200, '작업물 제목이 너무 깁니다. 제목은 최대 200자까지만 입력 가능합니다.')
      .trim()
      .refine(
        (val) => !/<script|javascript:/i.test(val),
        '제목에 보안상 위험한 문자가 포함되어 있습니다. <script>, javascript: 등의 스크립트 관련 문자는 사용할 수 없습니다.'
      )
      .optional()
      .default(''),

    workItem: z
      .string({
        required_error: '작업물 내용을 입력해주세요. workItem은 필수 입력 항목입니다.',
      })
      .min(1, '작업물 내용이 입력되지 않았습니다. 작업물 내용을 입력해주세요.')
      .max(10000, '작업물 내용이 너무 깁니다. 작업물 내용은 최대 10000자까지만 입력 가능합니다.')
      .trim()
      .refine(
        (val) => !/<script|javascript:/i.test(val),
        '작업물에 보안상 위험한 문자가 포함되어 있습니다. <script>, javascript: 등의 스크립트 관련 문자는 사용할 수 없습니다.'
      ),
  }),
});

/**
 * 작업물 수정 스키마
 */
export const updateWorkSchema = z.object({
  params: z.object({
    attendId: z
      .string({
        required_error: '참여 ID를 입력해주세요. attendId는 필수 입력 항목입니다.',
      })
      .uuid('유효하지 않은 참여 ID 형식입니다. attendId는 UUID 형식이어야 합니다. (예: "123e4567-e89b-12d3-a456-426614174000")'),
  }),
  body: z.object({
    title: z
      .string()
      .max(200, '작업물 제목이 너무 깁니다. 제목은 최대 200자까지만 입력 가능합니다.')
      .trim()
      .optional(),

    workItem: z
      .string()
      .max(10000, '작업물 내용이 너무 깁니다. 작업물 내용은 최대 10000자까지만 입력 가능합니다.')
      .trim()
      .optional(),
  }),
});

/**
 * 작업물 조회 쿼리 스키마
 */
export const getWorkListQuerySchema = z.object({
  query: z.object({
    challengeId: z
      .string()
      .uuid('유효하지 않은 챌린지 ID 형식입니다. 챌린지 ID는 UUID 형식이어야 합니다. (예: "123e4567-e89b-12d3-a456-426614174000")')
      .optional(),

    page: z
      .string()
      .regex(/^\d+$/, '페이지 번호는 숫자여야 합니다. 정수 형식으로 입력해주세요. (예: "1", "2", "3")')
      .transform(Number)
      .refine((val) => val >= 1, '페이지 번호가 올바르지 않습니다. 페이지 번호는 1 이상이어야 합니다.')
      .optional(),

    size: z
      .string()
      .regex(/^\d+$/, '페이지 크기는 숫자여야 합니다. 정수 형식으로 입력해주세요. (예: "10", "20", "50")')
      .transform(Number)
      .refine((val) => val >= 1, '페이지 크기가 너무 작습니다. 페이지 크기는 최소 1 이상이어야 합니다.')
      .refine((val) => val <= 100, '페이지 크기가 너무 큽니다. 페이지 크기는 최대 100까지만 가능합니다.')
      .optional(),
  }),
});
