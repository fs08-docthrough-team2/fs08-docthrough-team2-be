import { ZodError } from 'zod';
import HTTP_STATUS from '../constants/http.constant.js';
import { errorResponse } from '../utils/response.util.js';

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
          writable: false,
          enumerable: true,
          configurable: true,
        });
      }

      if (validated.params) {
        Object.defineProperty(req, 'params', {
          value: validated.params,
          writable: false,
          enumerable: true,
          configurable: true,
        });
      }

      next();
    } catch (error) {
      if (error instanceof ZodError) {
        // Zod 검증 에러를 사용자 친화적인 형태로 변환
        const errors = error.errors.map((err) => ({
          field: err.path.join('.'),
          message: err.message,
        }));

        return res.status(HTTP_STATUS.BAD_REQUEST).json(
          errorResponse({
            code: 'VALIDATION_ERROR',
            message: errors[0].message, // 첫 번째 에러 메시지 표시
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
        const errors = error.errors.map((err) => ({
          field: err.path.join('.'),
          message: err.message,
        }));

        return res.status(HTTP_STATUS.BAD_REQUEST).json(
          errorResponse({
            code: 'VALIDATION_ERROR',
            message: errors[0].message,
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
        writable: false,
        enumerable: true,
        configurable: true,
      });

      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errors = error.errors.map((err) => ({
          field: err.path.join('.'),
          message: err.message,
        }));

        return res.status(HTTP_STATUS.BAD_REQUEST).json(
          errorResponse({
            code: 'VALIDATION_ERROR',
            message: errors[0].message,
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
        writable: false,
        enumerable: true,
        configurable: true,
      });

      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errors = error.errors.map((err) => ({
          field: err.path.join('.'),
          message: err.message,
        }));

        return res.status(HTTP_STATUS.BAD_REQUEST).json(
          errorResponse({
            code: 'VALIDATION_ERROR',
            message: errors[0].message,
            details: errors,
          })
        );
      }
      next(error);
    }
  };
};
