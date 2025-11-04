// 설명: 애플리케이션 설정을 관리하는 파일입니다.
// 환경변수, DB 설정, API 설정 등을 관리합니다.

const sampleConfig = {
  // 데이터베이스 설정 예시
  database: {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    name: process.env.DB_NAME || 'sample_db',
  },

  // API 설정 예시
  api: {
    version: 'v1',
    prefix: '/api',
    timeout: 30000,
  },

  // 페이지네이션 설정 예시
  pagination: {
    defaultPage: 1,
    defaultLimit: 10,
    maxLimit: 100,
  },
};

export default sampleConfig;
