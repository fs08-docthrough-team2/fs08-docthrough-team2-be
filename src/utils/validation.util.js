import isUUID from 'is-uuid';
import HTTP_STATUS from '../constants/http.constant.js';
import { VALIDATION_MESSAGE } from '../constants/message.constant.js';
import { VALIDATION_ERROR_CODE } from '../constants/error-code.constant.js';
import { PAGINATION } from '../constants/pagination.constant.js';
import { errorResponse } from './response.util.js';

/**
 * 검증 에러를 생성하고 응답을 반환하는 헬퍼 함수
 */
function sendValidationError(res, code, message) {
  return res.status(HTTP_STATUS.BAD_REQUEST).json(
    errorResponse({ code, message })
  );
}

/**
 * UUID 검증
 * @param {string} value - 검증할 UUID 값
 * @param {object} res - Express response 객체
 * @param {string} errorCode - 에러 코드
 * @param {string} errorMessage - 에러 메시지
 * @returns {boolean|Response} - 유효하면 true, 유효하지 않으면 error response
 */
export function validateUUID(value, res, errorCode, errorMessage) {
  if (!value || !isUUID.v4(value)) {
    return sendValidationError(res, errorCode, errorMessage);
  }
  return true;
}

/**
 * Pagination 검증 (page, pageSize)
 * @param {number} page - 페이지 번호
 * @param {number} pageSize - 페이지 크기
 * @param {object} res - Express response 객체
 * @returns {boolean|Response} - 유효하면 true, 유효하지 않으면 error response
 */
export function validatePagination(page, pageSize, res) {
  // Integer 체크
  if (!Number.isInteger(page) || !Number.isInteger(pageSize)) {
    return sendValidationError(
      res,
      VALIDATION_ERROR_CODE.INVALID_PAGINATION,
      VALIDATION_MESSAGE.INVALID_PAGINATION
    );
  }

  // 최소값 체크
  if (page < PAGINATION.MIN_PAGE || pageSize < PAGINATION.MIN_PAGE_SIZE) {
    return sendValidationError(
      res,
      VALIDATION_ERROR_CODE.INVALID_PAGE_MIN,
      VALIDATION_MESSAGE.INVALID_PAGE_MIN
    );
  }

  // 최대값 체크
  if (pageSize > PAGINATION.MAX_PAGE_SIZE) {
    return sendValidationError(
      res,
      VALIDATION_ERROR_CODE.INVALID_PAGE_SIZE_MAX,
      VALIDATION_MESSAGE.INVALID_PAGE_SIZE_MAX
    );
  }

  return true;
}

/**
 * Enum 값 검증
 * @param {string|array} value - 검증할 값 (단일 값 또는 배열)
 * @param {object|array} enumObject - Enum 객체 또는 배열
 * @param {object} res - Express response 객체
 * @param {string} errorCode - 에러 코드
 * @param {string} errorMessage - 에러 메시지
 * @returns {boolean|Response} - 유효하면 true, 유효하지 않으면 error response
 */
export function validateEnum(value, enumObject, res, errorCode, errorMessage) {
  if (!value) return true; // optional 값이면 통과

  const validValues = Array.isArray(enumObject)
    ? enumObject
    : Object.values(enumObject);

  // 배열인 경우 모든 값 검증
  if (Array.isArray(value)) {
    for (const item of value) {
      if (!validValues.includes(item)) {
        return sendValidationError(res, errorCode, errorMessage);
      }
    }
    return true;
  }

  // 단일 값인 경우
  if (!validValues.includes(value)) {
    return sendValidationError(res, errorCode, errorMessage);
  }

  return true;
}

/**
 * String trim 검증 및 정리
 * @param {string} value - 검증할 문자열
 * @returns {string|undefined} - trim된 문자열 또는 undefined
 */
export function sanitizeString(value) {
  if (!value || typeof value !== 'string') return undefined;
  const trimmed = value.trim();
  return trimmed === '' ? undefined : trimmed;
}

/**
 * 필수 문자열 검증
 * @param {string} value - 검증할 문자열
 * @param {object} res - Express response 객체
 * @param {string} errorCode - 에러 코드
 * @param {string} errorMessage - 에러 메시지
 * @returns {boolean|Response} - 유효하면 true, 유효하지 않으면 error response
 */
export function validateRequiredString(value, res, errorCode, errorMessage) {
  if (!value || typeof value !== 'string' || value.trim() === '') {
    return sendValidationError(res, errorCode, errorMessage);
  }
  return true;
}

/**
 * ChallengeField 검증
 */
export function validateChallengeField(field, res, ChallengeField) {
  return validateEnum(
    field,
    ChallengeField,
    res,
    VALIDATION_ERROR_CODE.INVALID_FIELD,
    VALIDATION_MESSAGE.INVALID_FIELD
  );
}

/**
 * ChallengeType 검증
 */
export function validateChallengeType(type, res, ChallengeType) {
  return validateEnum(
    type,
    ChallengeType,
    res,
    VALIDATION_ERROR_CODE.INVALID_TYPE,
    VALIDATION_MESSAGE.INVALID_TYPE
  );
}

/**
 * ChallengeStatus 검증
 */
export function validateChallengeStatus(status, res, ChallengeStatus) {
  return validateEnum(
    status,
    ChallengeStatus,
    res,
    VALIDATION_ERROR_CODE.INVALID_STATUS,
    VALIDATION_MESSAGE.INVALID_STATUS
  );
}

/**
 * Sort 검증
 */
export function validateSort(sort, res, SORT_ORDER) {
  return validateEnum(
    sort,
    SORT_ORDER,
    res,
    VALIDATION_ERROR_CODE.INVALID_SORT,
    VALIDATION_MESSAGE.INVALID_SORT
  );
}

/**
 * challengeId 검증
 */
export function validateChallengeId(challengeId, res) {
  return validateUUID(
    challengeId,
    res,
    VALIDATION_ERROR_CODE.INVALID_CHALLENGE_ID,
    VALIDATION_MESSAGE.INVALID_CHALLENGE_ID
  );
}

/**
 * userId 검증
 */
export function validateUserId(userId, res) {
  return validateUUID(
    userId,
    res,
    VALIDATION_ERROR_CODE.INVALID_FIELD,
    VALIDATION_MESSAGE.INVALID_ID
  );
}

export default {
  validateUUID,
  validatePagination,
  validateEnum,
  sanitizeString,
  validateRequiredString,
  validateChallengeField,
  validateChallengeType,
  validateChallengeStatus,
  validateSort,
  validateChallengeId,
  validateUserId,
};
