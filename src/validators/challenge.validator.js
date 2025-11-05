import { z } from 'zod';
import { ChallengeField, ChallengeType } from '@prisma/client';

/**
 * 챌린지 생성 스키마
 * SQL 인젝션 방지 및 입력값 검증
 */
export const createChallengeSchema = z.object({
  body: z.object({
    title: z
      .string({
        required_error: '제목은 필수 입력 항목입니다.',
        invalid_type_error: '제목은 문자열이어야 합니다.',
      })
      .min(1, '제목은 최소 1자 이상이어야 합니다.')
      .max(200, '제목은 최대 200자까지 입력 가능합니다.')
      .trim()
      // XSS 및 SQL 인젝션 방지 - 위험한 문자 패턴 차단
      .refine(
        (val) => !/<script|javascript:|onerror=|onclick=/i.test(val),
        '제목에 허용되지 않는 문자가 포함되어 있습니다.'
      ),

    source: z
      .string({
        required_error: '출처는 필수 입력 항목입니다.',
        invalid_type_error: '출처는 문자열이어야 합니다.',
      })
      .min(1, '출처는 최소 1자 이상이어야 합니다.')
      .max(500, '출처는 최대 500자까지 입력 가능합니다.')
      .trim()
      // URL 형식 검증 (선택적)
      .refine(
        (val) => {
          // URL이 아닌 일반 텍스트도 허용
          if (!val.startsWith('http')) return true;
          try {
            new URL(val);
            return true;
          } catch {
            return false;
          }
        },
        'URL 형식이 올바르지 않습니다.'
      ),

    field: z
      .nativeEnum(ChallengeField, {
        required_error: '분야는 필수 입력 항목입니다.',
        invalid_type_error: '유효하지 않은 분야입니다.',
      }),

    type: z
      .nativeEnum(ChallengeType, {
        required_error: '타입은 필수 입력 항목입니다.',
        invalid_type_error: '유효하지 않은 타입입니다.',
      }),

    deadline: z
      .string({
        required_error: '마감일은 필수 입력 항목입니다.',
      })
      .refine(
        (val) => !isNaN(Date.parse(val)),
        '유효하지 않은 날짜 형식입니다.'
      )
      .refine(
        (val) => new Date(val) > new Date(),
        '마감일은 현재 시간 이후여야 합니다.'
      ),

    capacity: z
      .string({
        required_error: '정원은 필수 입력 항목입니다.',
      })
      .refine(
        (val) => /^\d+$/.test(val),
        '정원은 숫자 형식이어야 합니다.'
      )
      .refine(
        (val) => parseInt(val) >= 2,
        '챌린지 정원은 2명 이상이어야 합니다.'
      )
      .refine(
        (val) => parseInt(val) <= 100,
        '챌린지 정원은 100명 이하여야 합니다.'
      ),

    content: z
      .string({
        required_error: '내용은 필수 입력 항목입니다.',
        invalid_type_error: '내용은 문자열이어야 합니다.',
      })
      .min(10, '내용은 최소 10자 이상이어야 합니다.')
      .max(5000, '내용은 최대 5000자까지 입력 가능합니다.')
      .trim()
      // XSS 방지 - script 태그 차단
      .refine(
        (val) => !/<script|javascript:/i.test(val),
        '내용에 허용되지 않는 문자가 포함되어 있습니다.'
      ),
  }),
});

/**
 * 챌린지 수정 스키마
 */
export const updateChallengeSchema = z.object({
  params: z.object({
    challengeId: z
      .string()
      .uuid('유효하지 않은 챌린지 ID 형식입니다.'),
  }),
  body: z.object({
    title: z
      .string()
      .min(1, '제목은 최소 1자 이상이어야 합니다.')
      .max(200, '제목은 최대 200자까지 입력 가능합니다.')
      .trim()
      .optional(),

    source: z
      .string()
      .min(1, '출처는 최소 1자 이상이어야 합니다.')
      .max(500, '출처는 최대 500자까지 입력 가능합니다.')
      .trim()
      .optional(),

    field: z
      .nativeEnum(ChallengeField)
      .optional(),

    type: z
      .nativeEnum(ChallengeType)
      .optional(),

    deadline: z
      .string()
      .refine((val) => !isNaN(Date.parse(val)), '유효하지 않은 날짜 형식입니다.')
      .optional(),

    capacity: z
      .string()
      .refine((val) => /^\d+$/.test(val), '정원은 숫자 형식이어야 합니다.')
      .refine((val) => parseInt(val) >= 2, '챌린지 정원은 2명 이상이어야 합니다.')
      .optional(),

    content: z
      .string()
      .min(10, '내용은 최소 10자 이상이어야 합니다.')
      .max(5000, '내용은 최대 5000자까지 입력 가능합니다.')
      .trim()
      .optional(),
  }),
});

/**
 * 챌린지 ID 파라미터 스키마
 */
export const challengeIdParamSchema = z.object({
  params: z.object({
    challengeId: z
      .string({
        required_error: '챌린지 ID는 필수입니다.',
      })
      .uuid('유효하지 않은 챌린지 ID 형식입니다.'),
  }),
});

/**
 * 챌린지 거절 스키마
 */
export const rejectChallengeSchema = z.object({
  params: z.object({
    challengeId: z
      .string()
      .uuid('유효하지 않은 챌린지 ID 형식입니다.'),
  }),
  body: z.object({
    reject_comment: z
      .string({
        required_error: '거절 사유를 입력해주세요.',
      })
      .min(10, '거절 사유는 최소 10자 이상이어야 합니다.')
      .max(500, '거절 사유는 최대 500자까지 입력 가능합니다.')
      .trim()
      .refine(
        (val) => !/<script|javascript:/i.test(val),
        '거절 사유에 허용되지 않는 문자가 포함되어 있습니다.'
      ),
  }),
});

/**
 * 챌린지 목록 조회 쿼리 스키마
 */
export const getChallengeListQuerySchema = z.object({
  query: z.object({
    title: z
      .string()
      .max(200, '제목 검색은 최대 200자까지 가능합니다.')
      .trim()
      .optional(),

    field: z
      .nativeEnum(ChallengeField)
      .optional(),

    type: z
      .nativeEnum(ChallengeType)
      .optional(),

    status: z
      .string()
      .optional(),

    page: z
      .string()
      .regex(/^\d+$/, '페이지는 숫자여야 합니다.')
      .transform(Number)
      .refine((val) => val >= 1, '페이지는 1 이상이어야 합니다.')
      .optional()
      .default('1'),

    pageSize: z
      .string()
      .regex(/^\d+$/, '페이지 크기는 숫자여야 합니다.')
      .transform(Number)
      .refine((val) => val >= 1, '페이지 크기는 1 이상이어야 합니다.')
      .refine((val) => val <= 100, '페이지 크기는 100 이하여야 합니다.')
      .optional()
      .default('10'),

    sort: z
      .enum(['asc', 'desc', '신청시간빠름순', '신청시간느림순', '마감기한빠름순', '마감기한느림순'])
      .optional()
      .default('desc'),

    searchKeyword: z
      .string()
      .max(100, '검색어는 최대 100자까지 입력 가능합니다.')
      .trim()
      .optional(),
  }),
});

/**
 * 참여자 목록 조회 스키마
 */
export const getParticipateListSchema = z.object({
  params: z.object({
    challengeId: z
      .string()
      .uuid('유효하지 않은 챌린지 ID 형식입니다.'),
  }),
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
