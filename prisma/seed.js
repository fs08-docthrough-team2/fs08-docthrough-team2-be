import prisma from '../src/config/prisma.config.js';
import argon2 from 'argon2';
import crypto from 'crypto';

/**
 * 포괄적인 테스트 데이터 시드 (2배 증가 버전)
 *
 * 메인 테스트 계정: test@master.com (비밀번호: test1234)
 * - 실제 활성 유저처럼 다양한 활동 내역 보유
 * - 여러 작업물 참여, 좋아요, 댓글, 알림 등
 * - 프론트엔드에서 모든 기능 테스트 가능
 *
 * 비밀번호 규칙: 이메일 @ 앞부분 + 1234 (예: test@master.com → test1234)
 */

// ─────────────────────────────────────────────────────────────
// 유틸리티 함수
// ─────────────────────────────────────────────────────────────
function extractEmailPrefix(email) {
  return email.split('@')[0] + '1234';
}

async function hashPassword(password) {
  return argon2.hash(password);
}

async function generateRefreshToken() {
  const plain = crypto.randomBytes(48).toString('hex');
  return argon2.hash(plain);
}

function getRandomItem(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function getRandomItems(array, count) {
  const shuffled = [...array].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, array.length));
}

// ─────────────────────────────────────────────────────────────
// 사용자 시드 데이터 (38명)
// ─────────────────────────────────────────────────────────────
async function seedUsers() {
  console.log('👥 Creating users...');

  const users = [];

  // 1. 메인 테스트 계정
  const testMaster = await prisma.user.create({
    data: {
      email: 'test@master.com',
      nick_name: '테스트마스터',
      password: await hashPassword(extractEmailPrefix('test')),
      role: 'USER',
      refresh_token: await generateRefreshToken(),
      isDelete: false,
    },
  });
  users.push(testMaster);
  console.log('  ✓ Test Master: test@master.com (password: test1234)');

  // 2. 관리자 계정
  const admin = await prisma.user.create({
    data: {
      email: 'admin@example.com',
      nick_name: '관리자',
      password: await hashPassword(extractEmailPrefix('admin')),
      role: 'ADMIN',
      refresh_token: await generateRefreshToken(),
      isDelete: false,
    },
  });
  users.push(admin);

  // 3. 전문가 계정들 (4명으로 증가)
  const expertEmails = [
    'expert1@example.com',
    'expert2@example.com',
    'expert3@example.com',
    'expert4@example.com',
  ];
  const expertNames = ['번역전문가1', '번역전문가2', '번역전문가3', '번역전문가4'];

  for (let i = 0; i < expertEmails.length; i++) {
    const expert = await prisma.user.create({
      data: {
        email: expertEmails[i],
        nick_name: expertNames[i],
        password: await hashPassword(extractEmailPrefix(expertEmails[i])),
        role: 'EXPERT',
        refresh_token: await generateRefreshToken(),
        isDelete: false,
      },
    });
    users.push(expert);
  }

  // 4. 일반 사용자들 (30명으로 증가)
  const regularUserNames = [
    '개발자김씨', '코딩왕', '프론트마스터', '백엔드고수', 'React러버',
    'Node.js팬', 'Python마니아', 'Java개발자', 'TypeScript전문가', 'Vue.js전도사',
    'Angular마스터', 'Django러버', 'Spring개발자', 'DevOps엔지니어', '풀스택개발자',
    'Go언어매니아', 'Rust개발자', 'Kotlin전문가', 'Swift마스터', 'Flutter러버',
    'React Native전문가', 'GraphQL마스터', 'MongoDB전문가', 'PostgreSQL고수', 'Redis전문가',
    '클라우드엔지니어', 'AWS마스터', 'Azure전문가', 'GCP개발자', 'Docker마스터'
  ];

  for (let i = 0; i < regularUserNames.length; i++) {
    const email = `user${i + 1}@example.com`;
    const user = await prisma.user.create({
      data: {
        email: email,
        nick_name: regularUserNames[i],
        password: await hashPassword(extractEmailPrefix(email)),
        role: 'USER',
        refresh_token: await generateRefreshToken(),
        isDelete: false,
      },
    });
    users.push(user);
  }

  console.log(`  ✓ Created ${users.length} users total`);
  return users;
}

// ─────────────────────────────────────────────────────────────
// 챌린지 시드 데이터 (24개로 증가)
// ─────────────────────────────────────────────────────────────
async function seedChallenges(users) {
  console.log('📚 Creating challenges...');

  const testMaster = users[0];
  const admin = users[1];
  const experts = users.slice(2, 6); // 전문가 4명
  const regularUsers = users.slice(6);

  const challenges = [];

  // ====== test@master.com이 생성한 챌린지들 (12개로 증가) ======

  // 1. 진행 중, 승인됨
  const ch1 = await prisma.challenge.create({
    data: {
      user_id: testMaster.user_id,
      title: 'React 18 공식문서 번역 챌린지',
      content: 'React 18의 새로운 기능들을 한글로 번역하는 챌린지입니다. Concurrent Rendering, Suspense 등 최신 기능을 다룹니다.',
      type: 'OFFICIAL',
      status: 'APPROVED',
      field: 'WEB',
      source: 'https://react.dev/blog/2022/03/29/react-v18',
      deadline: new Date('2025-12-31T23:59:59Z'),
      capacity: '30',
      isDelete: false,
      isApprove: true,
      isClose: false,
      isReject: false,
      adminId: admin.user_id,
    },
  });
  challenges.push(ch1);

  // 2. 진행 중, 승인됨, 마감 임박
  const ch2 = await prisma.challenge.create({
    data: {
      user_id: testMaster.user_id,
      title: 'TypeScript 5.0 핸드북 번역',
      content: 'TypeScript 5.0 공식 핸드북을 한글로 번역합니다. 타입 시스템의 새로운 기능들을 학습합니다.',
      type: 'OFFICIAL',
      status: 'APPROVED',
      field: 'WEB',
      source: 'https://www.typescriptlang.org/docs/handbook/intro.html',
      deadline: new Date('2025-11-13T23:59:59Z'),
      capacity: '25',
      isDelete: false,
      isApprove: true,
      isClose: false,
      isReject: false,
      adminId: admin.user_id,
    },
  });
  challenges.push(ch2);

  // 3. 마감됨
  const ch3 = await prisma.challenge.create({
    data: {
      user_id: testMaster.user_id,
      title: 'Vue.js 3 가이드 번역 완료',
      content: 'Vue.js 3 공식 가이드 번역 챌린지. Composition API를 중심으로 학습합니다.',
      type: 'OFFICIAL',
      status: 'DEADLINE',
      field: 'WEB',
      source: 'https://vuejs.org/guide/introduction.html',
      deadline: new Date('2025-10-15T23:59:59Z'),
      capacity: '15',
      isDelete: false,
      isApprove: true,
      isClose: true,
      isReject: false,
      adminId: admin.user_id,
    },
  });
  challenges.push(ch3);

  // 4. 거절됨
  const ch4 = await prisma.challenge.create({
    data: {
      user_id: testMaster.user_id,
      title: '개인 블로그 글 번역',
      content: '개인 블로그의 기술 글을 번역하는 챌린지입니다.',
      type: 'BLOG',
      status: 'REJECTED',
      field: 'MODERN',
      source: 'https://example-blog.com/tech-article',
      deadline: new Date('2025-11-20T23:59:59Z'),
      capacity: '10',
      isDelete: false,
      isApprove: false,
      isClose: false,
      isReject: true,
      reject_content: '개인 블로그보다는 공식 문서 번역을 권장합니다. 더 공신력 있는 자료로 다시 신청해주세요.',
      adminId: admin.user_id,
    },
  });
  challenges.push(ch4);

  // 5. 대기 중
  const ch5 = await prisma.challenge.create({
    data: {
      user_id: testMaster.user_id,
      title: 'Svelte 공식문서 번역',
      content: 'Svelte 프레임워크의 공식 문서를 번역합니다.',
      type: 'OFFICIAL',
      status: 'PENDING',
      field: 'WEB',
      source: 'https://svelte.dev/docs',
      deadline: new Date('2025-12-15T23:59:59Z'),
      capacity: '20',
      isDelete: false,
      isApprove: false,
      isClose: false,
      isReject: false,
    },
  });
  challenges.push(ch5);

  // 6. 취소됨
  const ch6 = await prisma.challenge.create({
    data: {
      user_id: testMaster.user_id,
      title: 'Angular 가이드 번역 (취소됨)',
      content: 'Angular 공식 가이드 번역 챌린지 (사정으로 취소)',
      type: 'OFFICIAL',
      status: 'CANCELLED',
      field: 'WEB',
      source: 'https://angular.io/guide',
      deadline: new Date('2025-11-25T23:59:59Z'),
      capacity: '12',
      isDelete: false,
      isApprove: false,
      isClose: false,
      isReject: false,
    },
  });
  challenges.push(ch6);

  // 7-12. test@master.com이 생성한 추가 챌린지들
  const testMasterAdditionalChallenges = [
    {
      title: 'Remix 프레임워크 완벽 가이드',
      content: 'Remix의 최신 기능과 라우팅 시스템을 학습합니다.',
      type: 'OFFICIAL',
      status: 'APPROVED',
      field: 'NEXT',
      source: 'https://remix.run/docs',
      deadline: new Date('2025-12-25T23:59:59Z'),
      capacity: '18',
    },
    {
      title: 'Solid.js 리액티브 프로그래밍',
      content: 'Solid.js의 리액티브 프로그래밍 패러다임을 번역합니다.',
      type: 'OFFICIAL',
      status: 'APPROVED',
      field: 'WEB',
      source: 'https://www.solidjs.com/docs/latest',
      deadline: new Date('2025-12-20T23:59:59Z'),
      capacity: '15',
    },
    {
      title: 'Astro 정적 사이트 생성기',
      content: 'Astro의 Islands Architecture를 학습합니다.',
      type: 'OFFICIAL',
      status: 'APPROVED',
      field: 'WEB',
      source: 'https://docs.astro.build/',
      deadline: new Date('2025-12-18T23:59:59Z'),
      capacity: '12',
    },
    {
      title: 'Qwik 프레임워크 시작하기',
      content: 'Qwik의 Resumability 개념을 번역합니다.',
      type: 'OFFICIAL',
      status: 'PENDING',
      field: 'WEB',
      source: 'https://qwik.builder.io/docs/',
      deadline: new Date('2025-12-22T23:59:59Z'),
      capacity: '10',
    },
    {
      title: 'Nuxt 3 풀스택 프레임워크',
      content: 'Nuxt 3의 서버 엔진과 Auto-imports를 학습합니다.',
      type: 'OFFICIAL',
      status: 'APPROVED',
      field: 'WEB',
      source: 'https://nuxt.com/docs',
      deadline: new Date('2025-12-28T23:59:59Z'),
      capacity: '22',
    },
    {
      title: 'SvelteKit 앱 개발 가이드',
      content: 'SvelteKit의 라우팅과 서버사이드 렌더링을 번역합니다.',
      type: 'OFFICIAL',
      status: 'APPROVED',
      field: 'NEXT',
      source: 'https://kit.svelte.dev/docs',
      deadline: new Date('2025-12-30T23:59:59Z'),
      capacity: '20',
    },
  ];

  // 13. 삭제된 챌린지 예제 (delete_reason 포함)
  const ch_deleted = await prisma.challenge.create({
    data: {
      user_id: testMaster.user_id,
      title: 'Ember.js 가이드 번역 (삭제됨)',
      content: 'Ember.js 공식 가이드를 번역하는 챌린지입니다.',
      type: 'OFFICIAL',
      status: 'DELETED',
      field: 'WEB',
      source: 'https://guides.emberjs.com/',
      deadline: new Date('2025-11-15T23:59:59Z'),
      capacity: '10',
      isDelete: true,
      delete_reason: '참여자가 없어서 챌린지를 삭제했습니다.',
      isApprove: false,
      isClose: false,
      isReject: false,
    },
  });
  challenges.push(ch_deleted);

  for (const challengeData of testMasterAdditionalChallenges) {
    const ch = await prisma.challenge.create({
      data: {
        user_id: testMaster.user_id,
        ...challengeData,
        isDelete: false,
        isApprove: challengeData.status === 'APPROVED',
        isClose: false,
        isReject: false,
        adminId: challengeData.status === 'APPROVED' ? admin.user_id : null,
      },
    });
    challenges.push(ch);
  }

  // ====== 다른 사용자들이 생성한 챌린지들 (12개) ======

  // 전문가들이 생성
  const expertChallenges = [
    {
      user: experts[0],
      title: 'Next.js 14 App Router 완벽 가이드',
      content: 'Next.js 14의 App Router를 완벽하게 이해하고 번역합니다.',
      type: 'OFFICIAL',
      status: 'APPROVED',
      field: 'NEXT',
      source: 'https://nextjs.org/docs/app',
      deadline: new Date('2025-12-20T23:59:59Z'),
      capacity: '35',
    },
    {
      user: experts[1],
      title: 'Node.js 최신 API 문서 번역',
      content: 'Node.js의 최신 API 문서를 번역합니다.',
      type: 'OFFICIAL',
      status: 'APPROVED',
      field: 'API',
      source: 'https://nodejs.org/api/',
      deadline: new Date('2025-12-10T23:59:59Z'),
      capacity: '28',
    },
    {
      user: experts[2],
      title: 'Deno 런타임 공식 가이드',
      content: 'Deno의 보안 모델과 표준 라이브러리를 번역합니다.',
      type: 'OFFICIAL',
      status: 'APPROVED',
      field: 'API',
      source: 'https://deno.land/manual',
      deadline: new Date('2025-12-15T23:59:59Z'),
      capacity: '20',
    },
    {
      user: experts[3],
      title: 'Bun 자바스크립트 런타임',
      content: 'Bun의 빠른 성능과 내장 도구를 학습합니다.',
      type: 'OFFICIAL',
      status: 'APPROVED',
      field: 'MODERN',
      source: 'https://bun.sh/docs',
      deadline: new Date('2025-12-12T23:59:59Z'),
      capacity: '18',
    },
  ];

  for (const challengeData of expertChallenges) {
    const { user, ...data } = challengeData;
    const ch = await prisma.challenge.create({
      data: {
        user_id: user.user_id,
        ...data,
        isDelete: false,
        isApprove: true,
        isClose: false,
        isReject: false,
        adminId: admin.user_id,
      },
    });
    challenges.push(ch);
  }

  // 일반 사용자들이 생성
  const userChallenges = [
    {
      user: regularUsers[0],
      title: 'Python Django REST Framework 튜토리얼',
      content: 'Django REST Framework의 공식 튜토리얼을 번역합니다.',
      type: 'OFFICIAL',
      status: 'APPROVED',
      field: 'API',
      source: 'https://www.django-rest-framework.org/',
      deadline: new Date('2025-11-30T23:59:59Z'),
      capacity: '25',
    },
    {
      user: regularUsers[8],
      title: '개인 블로그 포스트 번역 (삭제됨)',
      content: '개인 기술 블로그의 게시글을 번역하는 챌린지입니다.',
      type: 'BLOG',
      status: 'DELETED',
      field: 'WEB',
      source: 'https://example.com/blog',
      deadline: new Date('2025-11-05T23:59:59Z'),
      capacity: '5',
      isDelete: true,
      delete_reason: '저작권 문제로 인해 삭제되었습니다.',
    },
    {
      user: regularUsers[1],
      title: 'Docker 공식 가이드 번역 완료',
      content: 'Docker 컨테이너 기술의 공식 가이드를 번역했습니다.',
      type: 'OFFICIAL',
      status: 'DEADLINE',
      field: 'MODERN',
      source: 'https://docs.docker.com/get-started/',
      deadline: new Date('2025-10-20T23:59:59Z'),
      capacity: '20',
    },
    {
      user: regularUsers[2],
      title: 'MDN Web Docs - CSS 그리드 레이아웃',
      content: 'MDN의 CSS Grid Layout 문서를 번역합니다.',
      type: 'BLOG',
      status: 'APPROVED',
      field: 'WEB',
      source: 'https://developer.mozilla.org/ko/docs/Web/CSS/CSS_Grid_Layout',
      deadline: new Date('2025-12-05T23:59:59Z'),
      capacity: '15',
    },
    {
      user: regularUsers[3],
      title: '개발자 면접 준비 가이드',
      content: '해외 유명 개발자 면접 준비 가이드를 번역합니다.',
      type: 'BLOG',
      status: 'APPROVED',
      field: 'CAREER',
      source: 'https://www.techinterviewhandbook.org/',
      deadline: new Date('2025-11-28T23:59:59Z'),
      capacity: '30',
    },
    {
      user: regularUsers[4],
      title: 'Kubernetes 완벽 가이드',
      content: 'Kubernetes의 핵심 개념과 오케스트레이션을 학습합니다.',
      type: 'OFFICIAL',
      status: 'APPROVED',
      field: 'MODERN',
      source: 'https://kubernetes.io/docs/home/',
      deadline: new Date('2025-12-08T23:59:59Z'),
      capacity: '25',
    },
    {
      user: regularUsers[5],
      title: 'Terraform 인프라스트럭처 코드',
      content: 'Terraform으로 클라우드 인프라를 코드로 관리합니다.',
      type: 'OFFICIAL',
      status: 'APPROVED',
      field: 'MODERN',
      source: 'https://www.terraform.io/docs',
      deadline: new Date('2025-12-18T23:59:59Z'),
      capacity: '20',
    },
    {
      user: regularUsers[6],
      title: 'GraphQL 스펙 완벽 이해',
      content: 'GraphQL의 쿼리 언어와 타입 시스템을 번역합니다.',
      type: 'OFFICIAL',
      status: 'APPROVED',
      field: 'API',
      source: 'https://graphql.org/learn/',
      deadline: new Date('2025-12-22T23:59:59Z'),
      capacity: '22',
    },
    {
      user: regularUsers[7],
      title: 'Redis 인메모리 데이터베이스',
      content: 'Redis의 데이터 구조와 캐싱 전략을 학습합니다.',
      type: 'OFFICIAL',
      status: 'APPROVED',
      field: 'API',
      source: 'https://redis.io/docs/',
      deadline: new Date('2025-12-16T23:59:59Z'),
      capacity: '18',
    },
  ];

  for (const challengeData of userChallenges) {
    const { user, ...data } = challengeData;
    const ch = await prisma.challenge.create({
      data: {
        user_id: user.user_id,
        ...data,
        isDelete: data.isDelete ?? false,
        isApprove: data.status === 'APPROVED',
        isClose: data.status === 'DEADLINE',
        isReject: false,
        adminId: data.status === 'APPROVED' || data.status === 'DEADLINE' ? admin.user_id : null,
      },
    });
    challenges.push(ch);
  }

  console.log(`  ✓ Created ${challenges.length} challenges`);
  return challenges;
}

// ─────────────────────────────────────────────────────────────
// 작업물(Attend) 시드 데이터 (증가)
// ─────────────────────────────────────────────────────────────
async function seedAttends(challenges, users) {
  console.log('📝 Creating work submissions (attends)...');

  const testMaster = users[0];
  const regularUsers = users.slice(6);

  const allAttends = [];

  // ====== test@master.com이 참여한 작업물들 (12개로 증가) ======

  const testMasterParticipations = [
    { challengeIndex: 13, title: 'Next.js Server Components 번역', isSave: false },
    { challengeIndex: 14, title: 'Node.js Worker Threads API', isSave: false },
    { challengeIndex: 15, title: 'Deno Permission 시스템', isSave: false },
    { challengeIndex: 16, title: 'Bun 빠른 시작 가이드', isSave: false },
    { challengeIndex: 17, title: 'Django Serializer 번역', isSave: false },
    { challengeIndex: 19, title: 'CSS Grid 완벽 가이드', isSave: false },
    { challengeIndex: 20, title: '기술 면접 알고리즘 문제', isSave: false },
    { challengeIndex: 21, title: 'Kubernetes Pod 개념', isSave: false },
    { challengeIndex: 22, title: 'Terraform Provider 설정', isSave: true }, // 임시 저장
    { challengeIndex: 23, title: 'GraphQL Schema 정의', isSave: true }, // 임시 저장
    { challengeIndex: 18, title: 'Docker Compose 가이드 (완료)', isSave: false }, // 마감된 챌린지
    { challengeIndex: 2, title: 'Vue.js Composition API (완료)', isSave: false }, // 마감된 챌린지
  ];

  for (const participation of testMasterParticipations) {
    const attend = await prisma.attend.create({
      data: {
        challenge_id: challenges[participation.challengeIndex].challenge_id,
        user_id: testMaster.user_id,
        title: participation.title,
        work_item: `${participation.title}에 대한 상세한 번역 작업물입니다. 원문의 의미를 정확히 전달하면서도 한국어로 자연스럽게 표현했습니다.`,
        isSave: participation.isSave,
        is_delete: false,
      },
    });
    allAttends.push(attend);
  }

  // test@master.com의 삭제된 작업물 예제 추가
  const deletedAttend1 = await prisma.attend.create({
    data: {
      challenge_id: challenges[0].challenge_id,
      user_id: testMaster.user_id,
      title: 'React 18 Concurrent Features (삭제됨)',
      work_item: '초기 번역 작업물입니다.',
      isSave: false,
      is_delete: true,
      delete_reason: '더 나은 버전으로 재작성하기 위해 삭제했습니다.',
    },
  });
  allAttends.push(deletedAttend1);

  // ====== 다른 사용자들의 작업물들 ======

  // 각 승인된 챌린지에 10-15명의 참여자 추가 (삭제되지 않은 챌린지만)
  const approvedChallenges = challenges.filter(
    c => c.status === 'APPROVED' && !c.isClose && !c.isDelete
  );

  for (const challenge of approvedChallenges) {
    const numParticipants = Math.floor(Math.random() * 6) + 10; // 10-15명
    const participants = getRandomItems(regularUsers, numParticipants);

    for (let i = 0; i < participants.length; i++) {
      const user = participants[i];
      const attend = await prisma.attend.create({
        data: {
          challenge_id: challenge.challenge_id,
          user_id: user.user_id,
          title: `${user.nick_name}의 ${challenge.title.substring(0, 20)} 번역`,
          work_item: `${challenge.title}의 ${i + 1}번째 섹션을 번역했습니다. 전문 용어를 정확히 번역하고 예제 코드도 함께 제공합니다.`,
          isSave: i % 5 === 0, // 일부는 임시 저장
          is_delete: i === 0 && Math.random() > 0.7, // 일부는 삭제됨
          delete_reason: i === 0 && Math.random() > 0.7 ? '내용이 부적절하여 삭제되었습니다.' : null,
        },
      });
      allAttends.push(attend);
    }
  }

  // 마감된 챌린지에도 참여자 추가
  const deadlineChallenges = challenges.filter(
    c => c.status === 'DEADLINE' || c.isClose
  );

  for (const challenge of deadlineChallenges) {
    const numParticipants = Math.floor(Math.random() * 5) + 5; // 5-9명
    const participants = getRandomItems(regularUsers, numParticipants);

    for (const user of participants) {
      const attend = await prisma.attend.create({
        data: {
          challenge_id: challenge.challenge_id,
          user_id: user.user_id,
          title: `${user.nick_name}의 ${challenge.title.substring(0, 20)} 완료`,
          work_item: `${challenge.title}에 대한 번역 작업을 완료했습니다.`,
          isSave: false,
          is_delete: false,
        },
      });
      allAttends.push(attend);
    }
  }

  console.log(`  ✓ Created ${allAttends.length} work submissions`);
  return allAttends;
}

// ─────────────────────────────────────────────────────────────
// 좋아요(Like) 시드 데이터 (증가)
// ─────────────────────────────────────────────────────────────
async function seedLikes(attends, users) {
  console.log('❤️  Creating likes...');

  const testMaster = users[0];
  const regularUsers = users.slice(6);

  let likeCount = 0;

  // test@master.com이 받은 좋아요 (각 작업물당 10-20개)
  const testMasterAttends = attends.filter(a => a.user_id === testMaster.user_id && !a.isSave);

  for (const attend of testMasterAttends) {
    const numLikes = Math.floor(Math.random() * 11) + 10; // 10-20개
    const likers = getRandomItems(regularUsers, numLikes);

    for (const liker of likers) {
      await prisma.like.create({
        data: {
          user_id: liker.user_id,
          attend_id: attend.attend_id,
          liker: true,
        },
      });
      likeCount++;
    }
  }

  // test@master.com이 다른 사람 작업물에 좋아요 (20개)
  const otherAttends = attends.filter(a => a.user_id !== testMaster.user_id && !a.isSave);
  const attendsToLike = getRandomItems(otherAttends, 20);

  for (const attend of attendsToLike) {
    await prisma.like.create({
      data: {
        user_id: testMaster.user_id,
        attend_id: attend.attend_id,
        liker: true,
      },
    });
    likeCount++;
  }

  // 다른 사용자들끼리도 좋아요 (100개)
  for (let i = 0; i < 100; i++) {
    const attend = getRandomItem(otherAttends);
    const liker = getRandomItem(regularUsers);

    try {
      await prisma.like.create({
        data: {
          user_id: liker.user_id,
          attend_id: attend.attend_id,
          liker: true,
        },
      });
      likeCount++;
    } catch (e) {
      // 중복이면 스킵
    }
  }

  console.log(`  ✓ Created ${likeCount} likes`);
}

// ─────────────────────────────────────────────────────────────
// 피드백(Feedback) 시드 데이터 (증가)
// ─────────────────────────────────────────────────────────────
async function seedFeedbacks(attends, users) {
  console.log('💬 Creating feedbacks...');

  const testMaster = users[0];
  const experts = users.slice(2, 6);
  const regularUsers = users.slice(6);

  const feedbackTemplates = [
    '번역이 매우 자연스럽고 이해하기 쉽습니다! 훌륭한 작업입니다.',
    '전문 용어 번역이 정확하네요. 좋은 레퍼런스가 될 것 같습니다.',
    '문장 구조가 조금 어색한 부분이 있어요. 좀 더 의역하면 좋을 것 같습니다.',
    '오타가 몇 군데 보이네요. 재확인 부탁드립니다.',
    '용어 통일에 신경 써주시면 감사하겠습니다.',
    '코드 예제까지 함께 번역해주셔서 이해가 더 잘 됩니다.',
    '원문의 뉘앙스를 잘 살린 번역이에요!',
    '일부 기술 용어는 영문 그대로 두는 것이 더 나을 것 같습니다.',
    '문단 나누기가 잘 되어 있어서 읽기 편합니다.',
    '추가 설명을 넣어주셔서 초보자도 이해하기 쉬워요.',
    '예제 코드의 주석도 번역해주셔서 좋습니다.',
    '기술적으로 정확한 번역이에요. 감사합니다!',
    '일관된 번역 스타일을 유지해주셔서 읽기 편합니다.',
    '복잡한 개념을 쉽게 풀어서 설명해주셨네요.',
    '번역 품질이 매우 높습니다. 프로페셔널한 작업이에요!',
  ];

  let feedbackCount = 0;

  // test@master.com이 받은 피드백 (각 작업물당 3-6개)
  const testMasterAttends = attends.filter(a => a.user_id === testMaster.user_id && !a.isSave);

  for (const attend of testMasterAttends) {
    const numFeedbacks = Math.floor(Math.random() * 4) + 3; // 3-6개

    for (let i = 0; i < numFeedbacks; i++) {
      const author = i === 0 ? getRandomItem(experts) : getRandomItem([...regularUsers, ...experts]);

      await prisma.feedback.create({
        data: {
          attend_id: attend.attend_id,
          user_id: author.user_id,
          content: getRandomItem(feedbackTemplates),
        },
      });
      feedbackCount++;
    }
  }

  // test@master.com이 다른 사람에게 남긴 피드백 (30개)
  const otherAttends = attends.filter(a => a.user_id !== testMaster.user_id && !a.isSave);
  const attendsToFeedback = getRandomItems(otherAttends, 30);

  for (const attend of attendsToFeedback) {
    await prisma.feedback.create({
      data: {
        attend_id: attend.attend_id,
        user_id: testMaster.user_id,
        content: getRandomItem(feedbackTemplates),
      },
    });
    feedbackCount++;
  }

  // 다른 사용자들끼리도 피드백 (80개)
  for (let i = 0; i < 80; i++) {
    const attend = getRandomItem(otherAttends);
    const author = getRandomItem(regularUsers);

    await prisma.feedback.create({
      data: {
        attend_id: attend.attend_id,
        user_id: author.user_id,
        content: getRandomItem(feedbackTemplates),
      },
    });
    feedbackCount++;
  }

  console.log(`  ✓ Created ${feedbackCount} feedbacks`);
}

// ─────────────────────────────────────────────────────────────
// 알림(Notice) 시드 데이터 (증가)
// ─────────────────────────────────────────────────────────────
async function seedNotices(challenges, users) {
  console.log('🔔 Creating notices...');

  const testMaster = users[0];
  const regularUsers = users.slice(6);

  let noticeCount = 0;

  // test@master.com에게 다양한 알림들 (20개)

  const testMasterNotices = [
    { type: 'CHALLENGE', content: '챌린지 "React 18 공식문서 번역 챌린지"가 생성되었습니다.', isRead: true },
    { type: 'APPROVAL', content: '챌린지 "React 18 공식문서 번역 챌린지"가 승인되었습니다.', isRead: true },
    { type: 'APPROVAL', content: '챌린지 "TypeScript 5.0 핸드북 번역"이 승인되었습니다.', isRead: true },
    { type: 'APPROVAL', content: '챌린지 "개인 블로그 글 번역"이 거절되었습니다. 사유: 개인 블로그보다는 공식 문서 번역을 권장합니다.', isRead: false },
    { type: 'DEADLINE', content: '챌린지 "TypeScript 5.0 핸드북 번역"의 마감이 7일 남았습니다.', isRead: false },
    { type: 'ATTEND', content: '작업물 "Next.js Server Components 번역"이 성공적으로 제출되었습니다.', isRead: true },
    { type: 'FEEDBACK', content: '작업물에 새로운 피드백이 등록되었습니다.', isRead: false },
    { type: 'FEEDBACK', content: '"번역전문가1"님이 피드백을 남겼습니다.', isRead: false },
    { type: 'FEEDBACK', content: '"코딩왕"님이 피드백을 남겼습니다.', isRead: false },
    { type: 'FEEDBACK', content: '작업물 "Node.js Worker Threads API"에 새 피드백이 있습니다.', isRead: true },
    { type: 'FEEDBACK', content: '작업물 "Deno Permission 시스템"에 새 피드백이 있습니다.', isRead: true },
    { type: 'ATTEND', content: '"개발자김씨"님이 "React 18 공식문서 번역 챌린지"에 참여했습니다.', isRead: false },
    { type: 'ATTEND', content: '"코딩왕"님이 "React 18 공식문서 번역 챌린지"에 작업물을 제출했습니다.', isRead: false },
    { type: 'ATTEND', content: '"프론트마스터"님이 "TypeScript 5.0 핸드북 번역"에 참여했습니다.', isRead: false },
    { type: 'DEADLINE', content: '챌린지 "Vue.js 3 가이드 번역 완료"가 마감되었습니다.', isRead: true },
    { type: 'CHALLENGE', content: '챌린지 "Remix 프레임워크 완벽 가이드"가 생성되었습니다.', isRead: true },
    { type: 'CHALLENGE', content: '챌린지 "Solid.js 리액티브 프로그래밍"이 생성되었습니다.', isRead: true },
    { type: 'APPROVAL', content: '챌린지 "Nuxt 3 풀스택 프레임워크"가 승인되었습니다.', isRead: false },
    { type: 'DEADLINE', content: '챌린지 "Astro 정적 사이트 생성기"의 마감이 임박했습니다.', isRead: false },
    { type: 'ATTEND', content: '작업물 "Kubernetes Pod 개념"이 제출되었습니다.', isRead: true },
  ];

  for (const notice of testMasterNotices) {
    await prisma.notice.create({
      data: {
        user_id: testMaster.user_id,
        type: notice.type,
        content: notice.content,
        isRead: notice.isRead,
      },
    });
    noticeCount++;
  }

  // 다른 사용자들에게도 알림 (30개)
  for (let i = 0; i < 30; i++) {
    const user = getRandomItem(regularUsers);
    const types = ['CHALLENGE', 'FEEDBACK', 'ATTEND', 'APPROVAL', 'DEADLINE'];

    await prisma.notice.create({
      data: {
        user_id: user.user_id,
        type: getRandomItem(types),
        content: '새로운 활동이 있습니다.',
        isRead: Math.random() > 0.5,
      },
    });
    noticeCount++;
  }

  console.log(`  ✓ Created ${noticeCount} notices`);
}

// ─────────────────────────────────────────────────────────────
// 메인 시드 함수
// ─────────────────────────────────────────────────────────────
async function main() {
  console.log('\n🌱 Starting comprehensive seed process (2x data)...\n');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  try {
    // 기존 데이터 삭제 (역순으로)
    console.log('🗑️  Cleaning existing data...');
    await prisma.notice.deleteMany({});
    await prisma.feedback.deleteMany({});
    await prisma.like.deleteMany({});
    await prisma.attend.deleteMany({});
    await prisma.challenge.deleteMany({});
    await prisma.user.deleteMany({});
    console.log('  ✓ Cleaned\n');

    // 새 데이터 생성
    const users = await seedUsers();
    console.log('');

    const challenges = await seedChallenges(users);
    console.log('');

    const attends = await seedAttends(challenges, users);
    console.log('');

    await seedLikes(attends, users);
    console.log('');

    await seedFeedbacks(attends, users);
    console.log('');

    await seedNotices(challenges, users);
    console.log('');

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    console.log('✅ Seed completed successfully!\n');
    console.log('📋 Test Account Credentials:');
    console.log('   Email: test@master.com');
    console.log('   Password: test1234');
    console.log('   Role: USER\n');
    console.log('💡 Password Rule: 이메일 @ 앞부분 + 1234 (예: admin@example.com → admin1234)\n');
    console.log('📊 Summary:');
    console.log(`   Users: ${users.length} (2x increase)`);
    console.log(`   Challenges: ${challenges.length} (2x increase)`);
    console.log(`   Work Submissions: ${attends.length} (2x+ increase)`);
    console.log('   Likes: Many (2x+ increase)');
    console.log('   Feedbacks: Many (2x+ increase)');
    console.log('   Notices: Many (increased)\n');
    console.log('🎯 Test Scenarios Available:');
    console.log('   ✓ User created challenges (various statuses)');
    console.log('   ✓ User participated challenges');
    console.log('   ✓ Submitted works with likes and feedbacks');
    console.log('   ✓ Draft works (temporary saves)');
    console.log('   ✓ Read/Unread notifications');
    console.log('   ✓ Approved/Rejected/Pending challenges');
    console.log('   ✓ Active/Expired challenges');
    console.log('   ✓ Given/Received likes and feedbacks');
    console.log('   ✓ More diverse test scenarios with doubled data\n');

  } catch (error) {
    console.error('\n❌ Seed failed:', error);
    throw error;
  }
}

// 실행
main()
  .catch(async (e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
