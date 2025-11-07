/**
 * 커스텀 에러 클래스
 * HTTP 상태 코드와 에러 코드를 포함한 에러 객체
 */
export class AppError extends Error {
  /**
   * @param {string} message - 에러 메시지
   * @param {number} status - HTTP 상태 코드
   * @param {string} code - 에러 코드
   */
  constructor(message, status = 500, code = 'INTERNAL_SERVER_ERROR') {
    super(message);
    this.status = status;
    this.code = code;
    this.name = 'AppError';
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * 400 Bad Request 에러
 */
export class BadRequestError extends AppError {
  constructor(message, code = 'BAD_REQUEST') {
    super(message, 400, code);
    this.name = 'BadRequestError';
  }
}

/**
 * 401 Unauthorized 에러
 */
export class UnauthorizedError extends AppError {
  constructor(message, code = 'UNAUTHORIZED') {
    super(message, 401, code);
    this.name = 'UnauthorizedError';
  }
}

/**
 * 404 Not Found 에러
 */
export class NotFoundError extends AppError {
  constructor(message, code = 'NOT_FOUND') {
    super(message, 404, code);
    this.name = 'NotFoundError';
  }
}

/**
 * 409 Conflict 에러
 */
export class ConflictError extends AppError {
  constructor(message, code = 'CONFLICT') {
    super(message, 409, code);
    this.name = 'ConflictError';
  }
}
