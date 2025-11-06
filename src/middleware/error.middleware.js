// Express, Prisma, JWT 등의 에러 처리는 이곳에서 할 수 있도록 수정해 주세요.
import { Prisma } from '@prisma/client';

export function asyncHandler(handler) {
  async function asyncReqHandler(req, res, next) {
    try {
      await handler(req, res, next);
    } catch (err) {
      // 에러를 중앙 에러 처리기로 전달
      next(err);
    }
  }
  return asyncReqHandler;
}

export function errorHandler(err, req, res, next) {
  // 이곳에서 공통 에러를 처리해주세요
  // Prisma Client 에러 처리
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    // 문서: https://www.prisma.io/docs/reference/api-reference/error-reference#prisma-client-known-request-error
    switch (err.code) {
      case 'P2002': {
        // Unique 제약 위반
        err.status = 409;
        err.code = 'DUPLICATE_KEY';
        const fields = err.meta?.target || [];
        const fieldNames = Array.isArray(fields) ? fields.join(', ') : fields;
        err.message = `고유 제약 조건 위반: ${fieldNames ? `'${fieldNames}' 필드가` : '해당 필드가'} 이미 데이터베이스에 존재합니다. 이 값은 고유해야 하며 중복될 수 없습니다. 다른 값을 사용하거나 기존 데이터를 확인해주세요.`;
        err.details = { fields };
        break;
      }
      case 'P2003': {
        // FK 제약 위반
        err.status = 409;
        err.code = 'FOREIGN_KEY_CONSTRAINT';
        const field = err.meta?.field_name || err.meta?.field;
        err.message = `외래 키 제약 조건 실패: ${field ? `'${field}' 필드의` : '참조하려는'} 값이 참조 테이블에 존재하지 않습니다. 연결하려는 데이터가 실제로 존재하는지 확인해주세요. 삭제되었거나 잘못된 ID를 참조하고 있을 수 있습니다.`;
        err.details = {
          field: field || undefined,
        };
        break;
      }
      case 'P2025': {
        // 요구 레코드 미존재 (update/delete where not found 등)
        err.status = 404;
        err.code = 'RECORD_NOT_FOUND';
        const cause = err.meta?.cause;
        err.message = `요청한 레코드를 찾을 수 없습니다. ${cause ? `사유: ${cause}` : '조건에 맞는 데이터가 존재하지 않거나 이미 삭제되었을 수 있습니다.'} 제공된 ID나 조건을 확인하고 다시 시도해주세요.`;
        err.details = { cause };
        break;
      }
      case 'P2000': {
        // 값이 컬럼 길이를 초과
        err.status = 400;
        err.code = 'VALUE_TOO_LONG';
        const column = err.meta?.column_name;
        err.message = `입력 값이 너무 깁니다. ${column ? `'${column}' 컬럼의` : '해당 필드의'} 최대 허용 길이를 초과했습니다. 더 짧은 값을 입력하거나 데이터를 줄여주세요.`;
        err.details = { column };
        break;
      }
      case 'P2001': {
        // where 조건에 부합하는 레코드 없음
        err.status = 404;
        err.code = 'RECORD_NOT_FOUND';
        err.message = '검색 조건에 부합하는 레코드를 찾을 수 없습니다. 제공된 where 조건이 올바른지 확인해주세요. 데이터가 존재하지 않거나 이미 삭제되었을 수 있습니다.';
        break;
      }
      case 'P2014': {
        // 잘못된 관계 사용
        err.status = 400;
        err.code = 'INVALID_RELATION';
        err.message = '잘못된 데이터베이스 관계 사용입니다. 테이블 간의 관계 설정이 올바르지 않거나, 존재하지 않는 관계를 참조하려고 시도했습니다. 데이터 모델과 관계를 확인해주세요.';
        break;
      }
      default: {
        // 기타 Prisma Known 에러
        err.status = 400;
        err.code = `PRISMA_${err.code}`;
        err.message = `데이터베이스 요청 중 오류가 발생했습니다 (코드: ${err.code}). 요청 내용을 확인하거나 잠시 후 다시 시도해주세요. 문제가 지속되면 관리자에게 문의해주세요.`;
        err.details = err.meta ?? undefined;
      }
    }
  } else if (err instanceof Prisma.PrismaClientValidationError) {
    // 스키마/입력값 검증 오류 (쿼리 시 타입/필드 불일치 등)
    err.status = 400;
    err.code = 'PRISMA_VALIDATION_ERROR';
    err.message = '데이터베이스 작업을 위한 입력값이 유효하지 않습니다. 쿼리의 타입이나 필드가 데이터베이스 스키마와 일치하지 않습니다. 필드 이름, 데이터 타입, 필수 필드 등을 확인해주세요.';
  } else if (err instanceof Prisma.PrismaClientInitializationError) {
    // DB 연결/초기화 실패
    err.status = 500;
    err.code = 'PRISMA_INIT_ERROR';
    err.message = '데이터베이스 초기화 중 오류가 발생했습니다. 데이터베이스에 연결할 수 없거나 설정이 올바르지 않습니다. 데이터베이스 서버가 실행 중인지, 연결 정보가 올바른지 확인해주세요. 문제가 지속되면 관리자에게 문의해주세요.';
  } else if (err instanceof Prisma.PrismaClientRustPanicError) {
    // 드물지만 드라이버 패닉
    err.status = 500;
    err.code = 'PRISMA_RUST_PANIC';
    err.message = '데이터베이스 엔진에서 예상치 못한 심각한 오류가 발생했습니다. 이는 드문 경우로, 시스템 관리자에게 즉시 문의해주세요. 로그를 확인하고 데이터베이스 재시작이 필요할 수 있습니다.';
  }
  // Superstruct 에러 처리
  else if (err.name === 'StructError') {
    err.status = 400;
    err.code = 'INVALID_INPUT';
    err.message = '입력 데이터의 형식이 올바르지 않습니다. 요청의 구조나 타입이 예상된 형식과 일치하지 않습니다. 각 필드의 데이터 타입과 필수 여부를 확인해주세요.';
    try {
      const failures = typeof err.failures === 'function' ? Array.from(err.failures()) : [];
      err.details = {
        fields: failures.map((f) => ({
          path: Array.isArray(f.path) && f.path.length ? f.path.join('.') : (f.key ?? ''),
          type: f.type,
          message: f.message,
        })),
      };
    } catch (_) {
      // noop: details는 선택 항목
    }
  }
  // express-jwt UnauthorizedError 처리 (JWT 검증 실패)
  else if (err.name === 'UnauthorizedError') {
    err.status = 401;
    if (err.code === 'invalid_token') {
      err.code = 'INVALID_TOKEN';
      err.message = '제공된 인증 토큰이 유효하지 않습니다. 토큰의 서명이 잘못되었거나, 형식이 올바르지 않거나, 변조되었을 수 있습니다. 다시 로그인하여 새로운 토큰을 발급받아주세요. Authorization 헤더에 "Bearer {token}" 형식으로 올바른 토큰을 포함했는지 확인해주세요.';
    } else if (err.code === 'credentials_required') {
      err.code = 'MISSING_TOKEN';
      err.message = '인증 토큰이 제공되지 않았습니다. 이 API를 사용하려면 로그인이 필요합니다. Authorization 헤더에 "Bearer {token}" 형식으로 Access Token을 포함해주세요.';
    } else if (err.inner?.name === 'TokenExpiredError') {
      err.code = 'TOKEN_EXPIRED';
      err.message = '인증 토큰이 만료되었습니다. 토큰의 유효 기간이 지났습니다. 보안을 위해 토큰은 일정 시간 후 자동으로 만료됩니다. 다시 로그인하거나 Refresh Token을 사용하여 새로운 Access Token을 발급받아주세요.';
    } else {
      err.code = 'UNAUTHORIZED';
      err.message = '인증에 실패했습니다. 제공된 인증 정보가 유효하지 않거나 권한이 부족합니다. 다시 로그인하거나 올바른 인증 정보를 제공해주세요.';
    }
  }
  // JWT 에러 처리 (직접 jwt.verify 사용 시)
  else if (err.name === 'JsonWebTokenError') {
    err.status = 401;
    err.code = 'INVALID_TOKEN';
    err.message = '제공된 인증 토큰이 유효하지 않습니다. 토큰의 서명이 잘못되었거나, 형식이 올바르지 않거나, 변조되었을 수 있습니다. 다시 로그인하여 새로운 토큰을 발급받아주세요. Authorization 헤더에 "Bearer {token}" 형식으로 올바른 토큰을 포함했는지 확인해주세요.';
  } else if (err.name === 'TokenExpiredError') {
    err.status = 401;
    err.code = 'TOKEN_EXPIRED';
    err.message = '인증 토큰이 만료되었습니다. 토큰의 유효 기간이 지났습니다. 보안을 위해 토큰은 일정 시간 후 자동으로 만료됩니다. 다시 로그인하거나 Refresh Token을 사용하여 새로운 Access Token을 발급받아주세요.';
  }

  // JSON Parse 에러
  else if (err instanceof SyntaxError && 'body' in err) {
    err.status = 400;
    err.code = 'INVALID_JSON';
    err.message = '요청 본문의 JSON 형식이 올바르지 않습니다. JSON 문법 오류가 있거나 형식이 잘못되었습니다. 중괄호({}), 대괄호([]), 따옴표("), 쉼표(,) 등의 문법을 확인해주세요. Content-Type 헤더가 "application/json"으로 설정되어 있는지도 확인해주세요.';
  }

  // Multer 업로드 에러
  else if (err.name === 'MulterError') {
    err.status = 400;
    err.code = 'UPLOAD_ERROR';
    err.message = '파일 업로드 중 오류가 발생했습니다. 파일 크기가 너무 크거나, 허용되지 않는 파일 형식이거나, 필드 이름이 잘못되었을 수 있습니다. 업로드 요구사항을 확인하고 다시 시도해주세요.';
  }

  // 응답 전송
  const status = err.status || 500;
  const code = err.code || 'INTERNAL_SERVER_ERROR';
  const message = err.message || 'Internal server error';

  res.status(status).json({
    success: false,
    error: {
      code,
      message,
      details: err.details || undefined,
    },
  });
}

export default { asyncHandler, errorHandler };
