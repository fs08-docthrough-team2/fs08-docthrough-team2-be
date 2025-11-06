# 테스트 가이드

이 프로젝트는 Jest 프레임워크를 사용하여 테스트를 작성합니다.

## 📁 테스트 구조

```
test/
├── setup.js                      # Jest 설정 파일
├── unit/                         # 단위 테스트
│   ├── validators/              # Validator 테스트
│   │   ├── auth.validator.test.js
│   │   └── feedback.validator.test.js
│   ├── utils/                   # Utility 함수 테스트
│   │   └── validation.util.test.js
│   └── services/                # Service 레이어 테스트
│       └── notice.service.test.js
└── integration/                 # 통합 테스트 (추후 추가)
```

## 🚀 Jest 및 의존성 설치

먼저 Jest와 필요한 의존성을 설치합니다:

```bash
npm install --save-dev jest @jest/globals
```

## 📝 테스트 실행 방법

### 1. package.json에 스크립트 추가

```json
{
  "scripts": {
    "test": "NODE_OPTIONS='--experimental-vm-modules --no-warnings' jest",
    "test:watch": "NODE_OPTIONS='--experimental-vm-modules --no-warnings' jest --watch",
    "test:coverage": "NODE_OPTIONS='--experimental-vm-modules --no-warnings' jest --coverage",
    "test:unit": "NODE_OPTIONS='--experimental-vm-modules --no-warnings' jest test/unit",
    "test:verbose": "NODE_OPTIONS='--experimental-vm-modules --no-warnings' jest --verbose"
  }
}
```

### 2. 테스트 실행

```bash
# 모든 테스트 실행
npm test

# 파일 변경 감지 모드
npm run test:watch

# 커버리지 리포트와 함께 실행
npm run test:coverage

# 단위 테스트만 실행
npm run test:unit

# 상세한 출력으로 실행
npm run test:verbose
```

### 3. 특정 테스트 파일만 실행

```bash
# 특정 파일 실행
npm test -- feedback.validator.test.js

# 패턴 매칭으로 실행
npm test -- --testPathPattern=validator
```

## 📚 테스트 작성 가이드

### Validator 테스트 예시

```javascript
import { describe, it, expect } from '@jest/globals';
import { createFeedbackSchema } from '../../../src/validators/feedback.validator.js';

describe('Feedback Validator Tests', () => {
  it('유효한 데이터는 통과해야 함', () => {
    const validData = {
      body: {
        attend_id: '123e4567-e89b-12d3-a456-426614174000',
        content: '유효한 피드백',
      },
    };

    const result = createFeedbackSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it('잘못된 데이터는 실패해야 함', () => {
    const invalidData = {
      body: {
        content: '피드백',
        // attend_id 누락
      },
    };

    const result = createFeedbackSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });
});
```

### Service 테스트 예시 (Mock 사용)

```javascript
import { describe, it, expect, jest, beforeEach } from '@jest/globals';

// Repository Mock
jest.unstable_mockModule('../../../src/api/repositories/notice.repository.js', () => ({
  createNotice: jest.fn(),
  findNoticeById: jest.fn(),
}));

const noticeService = await import('../../../src/api/services/notice.service.js');
const noticeRepository = await import('../../../src/api/repositories/notice.repository.js');

describe('Notice Service Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('알림을 생성해야 함', async () => {
    noticeRepository.createNotice.mockResolvedValue({ id: 'test-id' });

    await noticeService.addModifyNotice('챌린지', '수정', 'user-123', '제목');

    expect(noticeRepository.createNotice).toHaveBeenCalled();
  });
});
```

## ✅ 테스트 커버리지

테스트 커버리지를 확인하려면:

```bash
npm run test:coverage
```

커버리지 리포트는 `coverage/` 폴더에 생성됩니다:
- `coverage/lcov-report/index.html` - HTML 리포트 (브라우저로 열기)
- `coverage/lcov.info` - CI/CD 통합용

## 🎯 테스트 작성 원칙

### 1. AAA 패턴 사용
- **Arrange**: 테스트 데이터 준비
- **Act**: 테스트 대상 실행
- **Assert**: 결과 검증

### 2. 테스트 이름 규칙
- 명확하고 설명적인 이름 사용
- "~해야 함", "~을/를 반환해야 함" 형태 권장
- 영어: "should return user when valid id"
- 한글: "유효한 ID를 전달하면 사용자를 반환해야 함"

### 3. 독립적인 테스트
- 각 테스트는 독립적으로 실행 가능해야 함
- 테스트 간 의존성 제거
- beforeEach/afterEach로 초기화

### 4. Edge Case 테스트
- 정상 케이스 뿐만 아니라 경계값, 에러 케이스도 테스트
- null, undefined, 빈 문자열, 0 등

### 5. Mock 사용 가이드
- 외부 의존성(DB, API)은 Mock 처리
- Mock은 테스트할 함수의 관심사가 아닌 것들만
- 과도한 Mocking은 지양

## 🔧 문제 해결

### Jest와 ES Modules 이슈

Node.js ES Modules를 사용하는 경우 다음 설정이 필요합니다:

```bash
# 실행 시
NODE_OPTIONS='--experimental-vm-modules --no-warnings' jest
```

### Mock이 동작하지 않는 경우

1. `jest.unstable_mockModule`을 import 전에 호출했는지 확인
2. `await import()`로 모듈을 불러왔는지 확인
3. `jest.clearAllMocks()`를 beforeEach에서 호출했는지 확인

## 📖 참고 자료

- [Jest 공식 문서](https://jestjs.io/)
- [Jest ES Modules 지원](https://jestjs.io/docs/ecmascript-modules)
- [Testing Best Practices](https://github.com/goldbergyoni/javascript-testing-best-practices)
