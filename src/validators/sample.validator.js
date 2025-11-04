// 설명: 입력값 검증 함수를 정의하는 파일입니다.
// 요청 데이터의 유효성을 검증하고 에러를 발생시킵니다.

// 이메일 검증
export function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw new Error('유효하지 않은 이메일 형식입니다.');
  }
  return true;
}

// 비밀번호 검증
export function validatePassword(password) {
  if (password.length < 8) {
    throw new Error('비밀번호는 최소 8자 이상이어야 합니다.');
  }
  if (!/[A-Za-z]/.test(password) || !/\d/.test(password)) {
    throw new Error('비밀번호는 영문자와 숫자를 모두 포함해야 합니다.');
  }
  return true;
}

// 필수 필드 검증
export function validateRequiredFields(data, requiredFields) {
  const missingFields = requiredFields.filter((field) => !data[field]);
  if (missingFields.length > 0) {
    throw new Error(`필수 필드가 누락되었습니다: ${missingFields.join(', ')}`);
  }
  return true;
}

// 숫자 범위 검증
export function validateNumberRange(value, min, max) {
  const num = Number(value);
  if (isNaN(num)) {
    throw new Error('숫자 형식이 아닙니다.');
  }
  if (num < min || num > max) {
    throw new Error(`값은 ${min}에서 ${max} 사이여야 합니다.`);
  }
  return true;
}

// Express 미들웨어 형태의 검증 함수
export function validateSampleInput(req, res, next) {
  try {
    const { email, password, age } = req.body;

    // 필수 필드 검증
    validateRequiredFields(req.body, ['email', 'password']);

    // 이메일 검증
    validateEmail(email);

    // 비밀번호 검증
    validatePassword(password);

    // 나이 검증 (선택 필드)
    if (age !== undefined) {
      validateNumberRange(age, 1, 150);
    }

    next();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

export default {
  validateEmail,
  validatePassword,
  validateRequiredFields,
  validateNumberRange,
  validateSampleInput,
};
