import { ZodError } from 'zod';
import HTTP_STATUS from '../constants/http.constant.js';
import { errorResponse } from '../utils/response.util.js';

/**
 * Schema description 또는 Jest testName 추출
 * @param {ZodSchema} schema - Zod 검증 스키마
 * @returns {string|null} Schema description 또는 testName
 */
const getSchemaIdentifier = (schema) => {
  // Jest 테스트 환경에서 현재 실행 중인 테스트 이름 추출
  if (typeof expect !== 'undefined' && expect.getState) {
    const testName = expect.getState().currentTestName;
    if (testName) {
      return testName;
    }
  }

  // Production 또는 테스트 이름이 없는 경우 schema description 사용
  return schema._def?.description || null;
};

/**
 * 에러 메시지 포맷팅
 * @param {string} message - 원본 에러 메시지
 * @param {string|null} identifier - Schema 식별자 (testName 또는 description)
 * @returns {string} 포맷된 에러 메시지
 */
const formatErrorMessage = (message, identifier) => {
  if (identifier) {
    return `[${identifier}] ${message}`;
  }
  return message;
};

/**
 * Zod 스키마 검증 미들웨어
 * @param {ZodSchema} schema - Zod 검증 스키마
 * @returns {Function} Express 미들웨어 함수
 */
export const validate = (schema) => {
  return async (req, res, next) => {
    try {
      // 요청 객체 전체를 검증
      const validated = await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });

      // 검증된 데이터로 요청 객체 업데이트
      req.body = validated.body || req.body;

      // req.query와 req.params는 읽기 전용이므로 defineProperty 사용
      if (validated.query) {
        Object.defineProperty(req, 'query', {
          value: validated.query,
          writable: true,
          enumerable: true,
          configurable: true,
        });
      }

      if (validated.params) {
        Object.defineProperty(req, 'params', {
          value: validated.params,
          writable: true,
          enumerable: true,
          configurable: true,
        });
      }

      next();
    } catch (error) {
      if (error instanceof ZodError) {
        // Schema 식별자 추출 (Jest testName 또는 schema description)
        const identifier = getSchemaIdentifier(schema);

        // Zod 검증 에러를 사용자 친화적인 형태로 변환
        // Zod는 error.issues를 사용함
        const errors = (error.issues || error.errors || []).map((err) => ({
          field: err.path.join('.'),
          message: err.message,
        }));

        // 첫 번째 에러 메시지에 식별자 추가
        const formattedMessage = formatErrorMessage(
          errors[0]?.message || 'Validation failed',
          identifier
        );

        return res.status(HTTP_STATUS.BAD_REQUEST).json(
          errorResponse({
            code: 'VALIDATION_ERROR',
            message: formattedMessage, // 식별자가 포함된 에러 메시지
            details: errors, // 모든 에러 정보
          })
        );
      }

      // 예상치 못한 에러는 다음 미들웨어로 전달
      next(error);
    }
  };
};

/**
 * 바디만 검증하는 미들웨어 (간단한 경우)
 */
export const validateBody = (schema) => {
  return async (req, res, next) => {
    try {
      const validated = await schema.parseAsync(req.body);
      req.body = validated;
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        // Schema 식별자 추출 (Jest testName 또는 schema description)
        const identifier = getSchemaIdentifier(schema);

        // Zod는 error.issues를 사용함
        const errors = (error.issues || error.errors || []).map((err) => ({
          field: err.path.join('.'),
          message: err.message,
        }));

        // 첫 번째 에러 메시지에 식별자 추가
        const formattedMessage = formatErrorMessage(
          errors[0]?.message || 'Validation failed',
          identifier
        );

        return res.status(HTTP_STATUS.BAD_REQUEST).json(
          errorResponse({
            code: 'VALIDATION_ERROR',
            message: formattedMessage,
            details: errors,
          })
        );
      }
      next(error);
    }
  };
};

/**
 * 쿼리만 검증하는 미들웨어
 */
export const validateQuery = (schema) => {
  return async (req, res, next) => {
    try {
      const validated = await schema.parseAsync(req.query);

      // req.query는 읽기 전용이므로 defineProperty 사용
      Object.defineProperty(req, 'query', {
        value: validated,
        writable: true,
        enumerable: true,
        configurable: true,
      });

      next();
    } catch (error) {
      if (error instanceof ZodError) {
        // Schema 식별자 추출 (Jest testName 또는 schema description)
        const identifier = getSchemaIdentifier(schema);

        // Zod는 error.issues를 사용함
        const errors = (error.issues || error.errors || []).map((err) => ({
          field: err.path.join('.'),
          message: err.message,
        }));

        // 첫 번째 에러 메시지에 식별자 추가
        const formattedMessage = formatErrorMessage(
          errors[0]?.message || 'Validation failed',
          identifier
        );

        return res.status(HTTP_STATUS.BAD_REQUEST).json(
          errorResponse({
            code: 'VALIDATION_ERROR',
            message: formattedMessage,
            details: errors,
          })
        );
      }
      next(error);
    }
  };
};

/**
 * 파라미터만 검증하는 미들웨어
 */
export const validateParams = (schema) => {
  return async (req, res, next) => {
    try {
      const validated = await schema.parseAsync(req.params);

      // req.params는 읽기 전용이므로 defineProperty 사용
      Object.defineProperty(req, 'params', {
        value: validated,
        writable: true,
        enumerable: true,
        configurable: true,
      });

      next();
    } catch (error) {
      if (error instanceof ZodError) {
        // Schema 식별자 추출 (Jest testName 또는 schema description)
        const identifier = getSchemaIdentifier(schema);

        // Zod는 error.issues를 사용함
        const errors = (error.issues || error.errors || []).map((err) => ({
          field: err.path.join('.'),
          message: err.message,
        }));

        // 첫 번째 에러 메시지에 식별자 추가
        const formattedMessage = formatErrorMessage(
          errors[0]?.message || 'Validation failed',
          identifier
        );

        return res.status(HTTP_STATUS.BAD_REQUEST).json(
          errorResponse({
            code: 'VALIDATION_ERROR',
            message: formattedMessage,
            details: errors,
          })
        );
      }
      next(error);
    }
  };
};
