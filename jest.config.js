export default {
  // 테스트 환경
  testEnvironment: 'node',

  // ES6 모듈 지원
  transform: {},
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },

  // 테스트 파일 패턴
  testMatch: [
    '**/test/unit/**/*.test.js',
    '**/test/integration/**/*.test.js',
  ],

  // 커버리지 설정
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/app.js',
    '!src/config/**',
    '!src/swagger/**',
    '!**/node_modules/**',
  ],

  // 테스트 타임아웃 (10초)
  testTimeout: 10000,

  // 상세한 출력
  verbose: true,

  // Setup 파일
  setupFilesAfterEnv: ['<rootDir>/test/setup.js'],

  // 커버리지 리포트 디렉토리
  coverageDirectory: 'coverage',

  // 커버리지 리포터
  coverageReporters: ['text', 'lcov', 'html'],
};
