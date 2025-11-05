// 에러 및 응답 메시지 상수

// 인증 관련 메시지
export const AUTH_MESSAGE = {
  UNAUTHORIZED: '인증이 필요합니다.',
  INVALID_TOKEN: '유효하지 않은 토큰입니다.',
  TOKEN_EXPIRED: '토큰이 만료되었습니다.',
  FORBIDDEN: '접근 권한이 없습니다.',
  ADMIN_ONLY: '관리자만 접근할 수 있습니다.',
  NO_REFRESH_TOKEN: 'Refresh Token이 없습니다.',
  SIGNUP_SUCCESS: '회원가입 성공',
  LOGIN_SUCCESS: '로그인 성공',
  LOGOUT_SUCCESS: '로그아웃 성공',
  INVALID_USER: '유효하지 않은 사용자입니다.',
  TOKEN_VERIFICATION_FAILED: '토큰 검증 중 오류가 발생했습니다.',
  REFRESH_TOKEN_VALID: 'Refresh Token 유효함',
  ACCESS_TOKEN_REFRESH_SUCCESS: 'Access Token 재발급 성공',
};

// 챌린지 관련 메시지
export const CHALLENGE_MESSAGE = {
  NOT_FOUND: '챌린지를 찾을 수 없습니다.',
  INVALID_ID: '챌린지 ID가 없거나 올바르지 않습니다.',
  CREATE_SUCCESS: '챌린지가 생성되었습니다.',
  UPDATE_SUCCESS: '챌린지가 수정되었습니다.',
  DELETE_SUCCESS: '챌린지가 삭제되었습니다.',
  ALREADY_PARTICIPATING: '이미 참여 중인 챌린지입니다.',
  CAPACITY_FULL: '챌린지 참여 인원이 가득 찼습니다.',
  DEADLINE_PASSED: '챌린지 마감 기한이 지났습니다.',
  REQUIRED_FIELDS_MISSING: '챌린지 추가에 필요한 값이 입력되지 않았습니다.',
  INVALID_CAPACITY: '챌린지 인원은 2명 이상의 문자여야 합니다.',
};

// 사용자 관련 메시지
export const USER_MESSAGE = {
  NOT_FOUND: '사용자를 찾을 수 없습니다.',
  INVALID_ID: '유저 ID가 없거나 올바르지 않습니다.',
  EMAIL_ALREADY_EXISTS: '이미 사용 중인 이메일입니다.',
  NICKNAME_ALREADY_EXISTS: '이미 사용 중인 닉네임입니다.',
  INVALID_CREDENTIALS: '이메일 또는 비밀번호가 올바르지 않습니다.',
};

// 검증 관련 메시지
export const VALIDATION_MESSAGE = {
  // 필드 검증
  INVALID_FIELD: '필드 값이 올바르지 않습니다.',
  INVALID_TYPE: '타입 값이 올바르지 않습니다.',
  INVALID_STATUS: '상태 값이 올바르지 않습니다.',
  INVALID_SORT: '정렬 값이 올바르지 않습니다.',

  // 페이지네이션 검증
  INVALID_PAGINATION: '페이지 또는 페이지 크기 값이 올바르지 않습니다.',
  INVALID_PAGE_MIN: '페이지 또는 페이지 크기 값은 1 이상이어야 합니다.',
  INVALID_PAGE_SIZE_MAX: '페이지 크기는 100 이하여야 합니다.',

  // UUID 검증
  INVALID_UUID: '유효하지 않은 UUID 형식입니다.',
  INVALID_CHALLENGE_ID: '유효하지 않은 챌린지 ID 형식입니다.',

  // 필수 필드
  REQUIRED_FIELD: '필수 입력 항목입니다.',
  REQUIRED_TITLE: '제목은 필수 입력 항목입니다.',
  REQUIRED_CONTENT: '내용은 필수 입력 항목입니다.',
  REQUIRED_REJECT_COMMENT: '거절 사유를 입력해주세요.',
  REQUIRED_CHALLENGE_ID: 'challenge_id는 필수입니다.',
  REQUIRED_WORK_ITEM: 'workItem은 필수입니다.',
};

// 서버 에러 메시지
export const SERVER_MESSAGE = {
  INTERNAL_ERROR: '서버 오류가 발생했습니다.',
  DATABASE_ERROR: '데이터베이스 오류가 발생했습니다.',
  UNKNOWN_ERROR: '알 수 없는 오류가 발생했습니다.',
};

// 성공 메시지
export const SUCCESS_MESSAGE = {
  OPERATION_SUCCESS: '작업이 성공적으로 완료되었습니다.',
  CREATE_SUCCESS: '생성되었습니다.',
  UPDATE_SUCCESS: '수정되었습니다.',
  DELETE_SUCCESS: '삭제되었습니다.',
};

export default {
  AUTH_MESSAGE,
  CHALLENGE_MESSAGE,
  USER_MESSAGE,
  VALIDATION_MESSAGE,
  SERVER_MESSAGE,
  SUCCESS_MESSAGE,
};
