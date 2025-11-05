/**
 * API 응답 포맷 표준화 유틸리티
 *
 * 성공/실패 응답 구조를 일원화하여
 * 일관성 있는 API 응답을 제공합니다.
 */

/**
 * 성공 응답 생성
 * @param {Object} options - 응답 옵션
 * @param {*} options.data - 응답 데이터
 * @param {string} [options.message] - 성공 메시지 (선택)
 * @returns {Object} 표준화된 성공 응답
 *
 * @example
 * successResponse({ data: user, message: "사용자 조회 성공" })
 * // { success: true, data: user, message: "사용자 조회 성공" }
 *
 * successResponse({ data: users })
 * // { success: true, data: users }
 */
export function successResponse({ data, message }) {
  const response = {
    success: true,
    data,
  };

  if (message) {
    response.message = message;
  }

  return response;
}

/**
 * 에러 응답 생성
 * @param {Object} options - 응답 옵션
 * @param {string} options.code - 에러 코드
 * @param {string} options.message - 에러 메시지
 * @returns {Object} 표준화된 에러 응답
 *
 * @example
 * errorResponse({ code: "USER_NOT_FOUND", message: "사용자를 찾을 수 없습니다." })
 * // { success: false, error: { code: "USER_NOT_FOUND", message: "사용자를 찾을 수 없습니다." } }
 */
export function errorResponse({ code, message }) {
  return {
    success: false,
    error: {
      code,
      message,
    },
  };
}

/**
 * 페이지네이션 응답 생성
 * @param {Object} options - 응답 옵션
 * @param {Array} options.data - 데이터 배열
 * @param {number} options.page - 현재 페이지
 * @param {number} options.pageSize - 페이지 크기
 * @param {number} options.totalCount - 전체 데이터 개수
 * @param {string} [options.message] - 성공 메시지 (선택)
 * @returns {Object} 표준화된 페이지네이션 응답
 *
 * @example
 * paginationResponse({
 *   data: users,
 *   page: 1,
 *   pageSize: 10,
 *   totalCount: 100
 * })
 * // {
 * //   success: true,
 * //   data: users,
 * //   pagination: {
 * //     page: 1,
 * //     pageSize: 10,
 * //     totalCount: 100,
 * //     totalPages: 10
 * //   }
 * // }
 */
export function paginationResponse({ data, page, pageSize, totalCount, message }) {
  const response = {
    success: true,
    data,
    pagination: {
      page,
      pageSize,
      totalCount,
      totalPages: Math.ceil(totalCount / pageSize),
    },
  };

  if (message) {
    response.message = message;
  }

  return response;
}

export default {
  successResponse,
  errorResponse,
  paginationResponse,
};
