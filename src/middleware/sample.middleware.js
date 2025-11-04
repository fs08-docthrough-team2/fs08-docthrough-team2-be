// 설명: Express 미들웨어를 정의하는 파일입니다.
// 요청 전처리, 로깅, 검증 등의 미들웨어를 관리합니다.

// 요청 로깅 미들웨어
export function requestLogger(req, res, next) {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
}

// 요청 시간 측정 미들웨어
export function requestTimer(req, res, next) {
  const start = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`Request to ${req.path} took ${duration}ms`);
  });

  next();
}

// IP 기반 접근 제한 미들웨어
export function ipWhitelist(allowedIps = []) {
  return (req, res, next) => {
    const clientIp = req.ip || req.connection.remoteAddress;

    if (allowedIps.length === 0 || allowedIps.includes(clientIp)) {
      next();
    } else {
      res.status(403).json({ error: 'Access denied' });
    }
  };
}

// 사용자 정의 헤더 추가 미들웨어
export function addCustomHeaders(req, res, next) {
  res.setHeader('X-Powered-By', 'Sample API');
  res.setHeader('X-Response-Time', Date.now());
  next();
}

export default {
  requestLogger,
  requestTimer,
  ipWhitelist,
  addCustomHeaders,
};
