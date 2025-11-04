// 설명: 애플리케이션에서 사용하는 상수를 정의하는 파일입니다.
// 에러 메시지, 상태 코드, 고정값 등을 관리합니다.

// HTTP 상태 코드
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
};

// 사용자 역할
export const USER_ROLES = {
  ADMIN: 'ADMIN',
  USER: 'USER',
  GUEST: 'GUEST',
};

// 에러 메시지
export const ERROR_MESSAGES = {
  NOT_FOUND: '요청한 리소스를 찾을 수 없습니다.',
  UNAUTHORIZED: '인증이 필요합니다.',
  FORBIDDEN: '접근 권한이 없습니다.',
  INVALID_INPUT: '입력값이 올바르지 않습니다.',
};

// 정규 표현식
export const REGEX = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PASSWORD: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/,
  PHONE: /^\d{3}-\d{3,4}-\d{4}$/,
};
