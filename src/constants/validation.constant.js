// 검증 관련 상수

// 챌린지 필드 Enum (Prisma에서 가져오는 것이 더 안전하지만, 문서화 목적으로 정의)
export const CHALLENGE_FIELD = {
  NEXT: 'NEXT',
  MODERN: 'MODERN',
  API: 'API',
  WEB: 'WEB',
  CAREER: 'CAREER',
};

// 챌린지 타입 Enum
export const CHALLENGE_TYPE = {
  OFFICIAL: 'OFFICIAL',
  BLOG: 'BLOG',
};

// 챌린지 상태 Enum
export const CHALLENGE_STATUS = {
  RECRUITING: 'RECRUITING',
  IN_PROGRESS: 'IN_PROGRESS',
  COMPLETED: 'COMPLETED',
  DEADLINE: 'DEADLINE',
};

// 사용자 역할 Enum
export const USER_ROLE = {
  USER: 'USER',
  ADMIN: 'ADMIN',
};

// 정렬 순서
export const SORT_ORDER = {
  ASC: 'asc',
  DESC: 'desc',
};

// 검증 규칙
export const VALIDATION_RULES = {
  // 페이지네이션
  MIN_PAGE: 1,
  MIN_PAGE_SIZE: 1,
  MAX_PAGE_SIZE: 100,

  // 문자열 길이
  MIN_TITLE_LENGTH: 1,
  MAX_TITLE_LENGTH: 200,
  MIN_CONTENT_LENGTH: 1,
  MAX_CONTENT_LENGTH: 5000,
  MIN_NICKNAME_LENGTH: 2,
  MAX_NICKNAME_LENGTH: 20,

  // 비밀번호
  MIN_PASSWORD_LENGTH: 8,
  MAX_PASSWORD_LENGTH: 100,

  // 챌린지
  MIN_CAPACITY: 1,
  MAX_CAPACITY: 1000,
};

export default {
  CHALLENGE_FIELD,
  CHALLENGE_TYPE,
  CHALLENGE_STATUS,
  USER_ROLE,
  SORT_ORDER,
  VALIDATION_RULES,
};
