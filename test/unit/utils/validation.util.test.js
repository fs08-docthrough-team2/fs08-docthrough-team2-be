import { describe, it, expect, jest } from '@jest/globals';
import {
  validatePagination,
  validateEnum,
  sanitizeString,
} from '../../../src/utils/validation.util.js';

describe('Validation Utils Tests', () => {
  describe('validatePagination', () => {
    let mockRes;

    beforeEach(() => {
      mockRes = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
      };
    });

    it('유효한 페이지네이션 값은 true를 반환해야 함', () => {
      const result = validatePagination(1, 10, mockRes);
      expect(result).toBe(true);
      expect(mockRes.status).not.toHaveBeenCalled();
    });

    it('페이지가 정수가 아니면 에러 응답을 반환해야 함', () => {
      const result = validatePagination(1.5, 10, mockRes);
      expect(result).not.toBe(true);
      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalled();
    });

    it('페이지 크기가 정수가 아니면 에러 응답을 반환해야 함', () => {
      const result = validatePagination(1, 10.5, mockRes);
      expect(result).not.toBe(true);
      expect(mockRes.status).toHaveBeenCalledWith(400);
    });

    it('페이지가 1 미만이면 에러 응답을 반환해야 함', () => {
      const result = validatePagination(0, 10, mockRes);
      expect(result).not.toBe(true);
      expect(mockRes.status).toHaveBeenCalledWith(400);
    });

    it('페이지 크기가 1 미만이면 에러 응답을 반환해야 함', () => {
      const result = validatePagination(1, 0, mockRes);
      expect(result).not.toBe(true);
      expect(mockRes.status).toHaveBeenCalledWith(400);
    });

    it('페이지 크기가 100을 초과하면 에러 응답을 반환해야 함', () => {
      const result = validatePagination(1, 101, mockRes);
      expect(result).not.toBe(true);
      expect(mockRes.status).toHaveBeenCalledWith(400);
    });

    it('경계값 테스트: page=1, pageSize=1은 통과해야 함', () => {
      const result = validatePagination(1, 1, mockRes);
      expect(result).toBe(true);
    });

    it('경계값 테스트: page=1, pageSize=100은 통과해야 함', () => {
      const result = validatePagination(1, 100, mockRes);
      expect(result).toBe(true);
    });

    it('큰 페이지 번호도 유효해야 함', () => {
      const result = validatePagination(9999, 50, mockRes);
      expect(result).toBe(true);
    });
  });

  describe('validateEnum', () => {
    let mockRes;

    beforeEach(() => {
      mockRes = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
      };
    });

    it('값이 enum에 포함되어 있으면 true를 반환해야 함', () => {
      const enumObj = { A: 'A', B: 'B', C: 'C' };
      const result = validateEnum('A', enumObj, mockRes, 'TEST_ERROR', 'Error message');
      expect(result).toBe(true);
      expect(mockRes.status).not.toHaveBeenCalled();
    });

    it('값이 enum에 없으면 에러 응답을 반환해야 함', () => {
      const enumObj = { A: 'A', B: 'B', C: 'C' };
      const result = validateEnum('D', enumObj, mockRes, 'TEST_ERROR', 'Error message');
      expect(result).not.toBe(true);
      expect(mockRes.status).toHaveBeenCalledWith(400);
    });

    it('값이 없으면 true를 반환해야 함 (optional)', () => {
      const enumObj = { A: 'A', B: 'B', C: 'C' };
      const result = validateEnum(undefined, enumObj, mockRes, 'TEST_ERROR', 'Error message');
      expect(result).toBe(true);
    });

    it('값이 null이면 true를 반환해야 함 (optional)', () => {
      const enumObj = { A: 'A', B: 'B', C: 'C' };
      const result = validateEnum(null, enumObj, mockRes, 'TEST_ERROR', 'Error message');
      expect(result).toBe(true);
    });

    it('빈 문자열은 true를 반환해야 함 (optional)', () => {
      const enumObj = { A: 'A', B: 'B', C: 'C' };
      const result = validateEnum('', enumObj, mockRes, 'TEST_ERROR', 'Error message');
      expect(result).toBe(true);
    });

    it('배열 형태의 enum도 동작해야 함', () => {
      const enumArray = ['apple', 'banana', 'orange'];
      const result = validateEnum('apple', enumArray, mockRes, 'TEST_ERROR', 'Error message');
      expect(result).toBe(true);
    });

    it('배열 형태의 enum에서 없는 값은 실패해야 함', () => {
      const enumArray = ['apple', 'banana', 'orange'];
      const result = validateEnum('grape', enumArray, mockRes, 'TEST_ERROR', 'Error message');
      expect(result).not.toBe(true);
      expect(mockRes.status).toHaveBeenCalledWith(400);
    });

    it('대소문자를 구분해야 함', () => {
      const enumObj = { A: 'A', B: 'B', C: 'C' };
      const result = validateEnum('a', enumObj, mockRes, 'TEST_ERROR', 'Error message');
      expect(result).not.toBe(true);
    });
  });

  describe('sanitizeString', () => {
    it('유효한 문자열은 그대로 반환해야 함', () => {
      const result = sanitizeString('hello world');
      expect(result).toBe('hello world');
    });

    it('undefined는 undefined를 반환해야 함', () => {
      const result = sanitizeString(undefined);
      expect(result).toBeUndefined();
    });

    it('null은 undefined를 반환해야 함', () => {
      const result = sanitizeString(null);
      expect(result).toBeUndefined();
    });

    it('빈 문자열은 undefined를 반환해야 함', () => {
      const result = sanitizeString('');
      expect(result).toBeUndefined();
    });

    it('앞뒤 공백은 제거되어야 함', () => {
      const result = sanitizeString('  hello  ');
      expect(result).toBe('hello');
    });

    it('숫자를 전달하면 undefined를 반환해야 함', () => {
      const result = sanitizeString(123);
      expect(result).toBeUndefined();
    });

    it('객체를 전달하면 undefined를 반환해야 함', () => {
      const result = sanitizeString({});
      expect(result).toBeUndefined();
    });

    it('배열을 전달하면 undefined를 반환해야 함', () => {
      const result = sanitizeString([]);
      expect(result).toBeUndefined();
    });

    it('한글 문자열도 정상 처리되어야 함', () => {
      const result = sanitizeString('안녕하세요');
      expect(result).toBe('안녕하세요');
    });

    it('특수문자가 포함된 문자열도 정상 처리되어야 함', () => {
      const result = sanitizeString('hello@world!');
      expect(result).toBe('hello@world!');
    });
  });
});
