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
// 사용자 시드 데이터 (300명 이상)
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

  // 3. 전문가 계정들 (20명으로 증가)
  for (let i = 1; i <= 20; i++) {
    const email = `expert${i}@example.com`;
    const expert = await prisma.user.create({
      data: {
        email: email,
        nick_name: `번역전문가${i}`,
        password: await hashPassword(extractEmailPrefix(email)),
        role: 'EXPERT',
        refresh_token: await generateRefreshToken(),
        isDelete: false,
      },
    });
    users.push(expert);
  }

  // 4. 일반 사용자들 (280명으로 증가)
  const baseNames = [
    '개발자', '코딩왕', '프론트마스터', '백엔드고수', 'React러버',
    'Node.js팬', 'Python마니아', 'Java개발자', 'TypeScript전문가', 'Vue.js전도사',
    'Angular마스터', 'Django러버', 'Spring개발자', 'DevOps엔지니어', '풀스택개발자',
    'Go언어매니아', 'Rust개발자', 'Kotlin전문가', 'Swift마스터', 'Flutter러버',
    'React Native전문가', 'GraphQL마스터', 'MongoDB전문가', 'PostgreSQL고수', 'Redis전문가',
    '클라우드엔지니어', 'AWS마스터', 'Azure전문가', 'GCP개발자', 'Docker마스터',
    'Kubernetes전문가', 'CI/CD마스터', '데이터분석가', 'AI개발자', '머신러닝엔지니어',
    '프론트엔드개발자', '백엔드개발자', '웹개발자', '앱개발자', '게임개발자'
  ];

  for (let i = 1; i <= 280; i++) {
    const email = `user${i}@example.com`;
    const baseName = baseNames[i % baseNames.length];
    const nickname = i <= baseNames.length ? baseName : `${baseName}${Math.floor(i / baseNames.length)}`;

    const user = await prisma.user.create({
      data: {
        email: email,
        nick_name: nickname,
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
// 챌린지 시드 데이터 (200개 이상)
// ─────────────────────────────────────────────────────────────
async function seedChallenges(users) {
  console.log('📚 Creating challenges...');

  const testMaster = users[0];
  const admin = users[1];
  const experts = users.slice(2, 22); // 전문가 20명
  const regularUsers = users.slice(22);

  const challenges = [];

  // 챌린지 제목 템플릿 (대량 생성용)
  const challengeTemplates = [
    { title: 'React', field: 'WEB', type: 'OFFICIAL', source: 'https://react.dev/' },
    { title: 'Vue.js', field: 'WEB', type: 'OFFICIAL', source: 'https://vuejs.org/' },
    { title: 'Angular', field: 'WEB', type: 'OFFICIAL', source: 'https://angular.io/' },
    { title: 'Svelte', field: 'WEB', type: 'OFFICIAL', source: 'https://svelte.dev/' },
    { title: 'Next.js', field: 'NEXT', type: 'OFFICIAL', source: 'https://nextjs.org/' },
    { title: 'Nuxt', field: 'NEXT', type: 'OFFICIAL', source: 'https://nuxt.com/' },
    { title: 'Remix', field: 'NEXT', type: 'OFFICIAL', source: 'https://remix.run/' },
    { title: 'SvelteKit', field: 'NEXT', type: 'OFFICIAL', source: 'https://kit.svelte.dev/' },
    { title: 'Node.js', field: 'API', type: 'OFFICIAL', source: 'https://nodejs.org/' },
    { title: 'Express', field: 'API', type: 'OFFICIAL', source: 'https://expressjs.com/' },
    { title: 'Fastify', field: 'API', type: 'OFFICIAL', source: 'https://fastify.io/' },
    { title: 'NestJS', field: 'API', type: 'OFFICIAL', source: 'https://nestjs.com/' },
    { title: 'TypeScript', field: 'WEB', type: 'OFFICIAL', source: 'https://typescriptlang.org/' },
    { title: 'JavaScript MDN', field: 'WEB', type: 'OFFICIAL', source: 'https://developer.mozilla.org/' },
    { title: 'Python', field: 'API', type: 'OFFICIAL', source: 'https://python.org/' },
    { title: 'Django', field: 'API', type: 'OFFICIAL', source: 'https://djangoproject.com/' },
    { title: 'FastAPI', field: 'API', type: 'OFFICIAL', source: 'https://fastapi.tiangolo.com/' },
    { title: 'Flask', field: 'API', type: 'OFFICIAL', source: 'https://flask.palletsprojects.com/' },
    { title: 'Docker', field: 'MODERN', type: 'OFFICIAL', source: 'https://docs.docker.com/' },
    { title: 'Kubernetes', field: 'MODERN', type: 'OFFICIAL', source: 'https://kubernetes.io/' },
    { title: 'AWS', field: 'MODERN', type: 'OFFICIAL', source: 'https://aws.amazon.com/' },
    { title: 'GraphQL', field: 'API', type: 'OFFICIAL', source: 'https://graphql.org/' },
    { title: 'PostgreSQL', field: 'API', type: 'OFFICIAL', source: 'https://postgresql.org/' },
    { title: 'MongoDB', field: 'API', type: 'OFFICIAL', source: 'https://mongodb.com/' },
    { title: 'Redis', field: 'API', type: 'OFFICIAL', source: 'https://redis.io/' },
    { title: 'Git', field: 'MODERN', type: 'OFFICIAL', source: 'https://git-scm.com/' },
    { title: 'Tailwind CSS', field: 'WEB', type: 'OFFICIAL', source: 'https://tailwindcss.com/' },
    { title: 'CSS Grid', field: 'WEB', type: 'BLOG', source: 'https://developer.mozilla.org/' },
    { title: 'Flexbox', field: 'WEB', type: 'BLOG', source: 'https://developer.mozilla.org/' },
    { title: 'Webpack', field: 'MODERN', type: 'OFFICIAL', source: 'https://webpack.js.org/' },
    { title: 'Vite', field: 'MODERN', type: 'OFFICIAL', source: 'https://vitejs.dev/' },
    { title: 'Jest', field: 'MODERN', type: 'OFFICIAL', source: 'https://jestjs.io/' },
    { title: 'Vitest', field: 'MODERN', type: 'OFFICIAL', source: 'https://vitest.dev/' },
    { title: 'Playwright', field: 'MODERN', type: 'OFFICIAL', source: 'https://playwright.dev/' },
    { title: 'Cypress', field: 'MODERN', type: 'OFFICIAL', source: 'https://cypress.io/' },
    { title: 'Go', field: 'API', type: 'OFFICIAL', source: 'https://go.dev/' },
    { title: 'Rust', field: 'API', type: 'OFFICIAL', source: 'https://rust-lang.org/' },
    { title: 'Deno', field: 'API', type: 'OFFICIAL', source: 'https://deno.land/' },
    { title: 'Bun', field: 'MODERN', type: 'OFFICIAL', source: 'https://bun.sh/' },
    { title: 'Solid.js', field: 'WEB', type: 'OFFICIAL', source: 'https://solidjs.com/' },
  ];

  const statuses = ['APPROVED', 'PENDING', 'REJECTED', 'DEADLINE', 'CANCELLED', 'DELETED'];
  const statusWeights = [0.7, 0.1, 0.05, 0.1, 0.03, 0.02]; // APPROVED가 70%

  // 가중치 기반 랜덤 상태 선택 함수
  function getRandomStatus() {
    const random = Math.random();
    let cumulative = 0;
    for (let i = 0; i < statuses.length; i++) {
      cumulative += statusWeights[i];
      if (random < cumulative) return statuses[i];
    }
    return 'APPROVED';
  }

  // 랜덤 마감일 생성 (현재부터 1~60일 후)
  function getRandomDeadline() {
    const days = Math.floor(Math.random() * 60) + 1;
    const deadline = new Date();
    deadline.setDate(deadline.getDate() + days);
    return deadline;
  }

  // 챌린지 suffixes
  const suffixes = ['공식 문서 번역', '완벽 가이드', '시작하기', '기초부터 고급까지',
                    '핵심 개념', '실전 예제', '베스트 프랙티스', '심화 가이드'];

  // test@master.com이 생성한 챌린지 (20개)
  for (let i = 0; i < 20; i++) {
    const template = challengeTemplates[i % challengeTemplates.length];
    const suffix = suffixes[i % suffixes.length];
    const status = i < 15 ? 'APPROVED' : getRandomStatus();

    const ch = await prisma.challenge.create({
      data: {
        user_id: testMaster.user_id,
        title: `${template.title} ${suffix} ${i + 1}`,
        content: `${template.title}에 대한 ${suffix}입니다. 상세한 번역과 실전 예제를 포함합니다.`,
        type: template.type,
        status: status,
        field: template.field,
        source: template.source,
        deadline: getRandomDeadline(),
        capacity: String(Math.floor(Math.random() * 30) + 10),
        isDelete: status === 'DELETED',
        isApprove: status === 'APPROVED' || status === 'DEADLINE',
        isClose: status === 'DEADLINE',
        isReject: status === 'REJECTED',
        delete_reason: status === 'DELETED' ? '참여자가 부족하여 삭제되었습니다.' : null,
        reject_content: status === 'REJECTED' ? '더 공신력 있는 자료를 권장합니다.' : null,
        adminId: (status === 'APPROVED' || status === 'DEADLINE' || status === 'REJECTED') ? admin.user_id : null,
      },
    });
    challenges.push(ch);
  }

  // 전문가들이 생성한 챌린지 (각 전문가당 5개, 총 100개)
  for (let i = 0; i < experts.length; i++) {
    for (let j = 0; j < 5; j++) {
      const templateIndex = (i * 5 + j) % challengeTemplates.length;
      const template = challengeTemplates[templateIndex];
      const suffix = suffixes[j % suffixes.length];
      const status = Math.random() < 0.85 ? 'APPROVED' : getRandomStatus();

      const ch = await prisma.challenge.create({
        data: {
          user_id: experts[i].user_id,
          title: `${template.title} ${suffix} [전문가 ${i + 1}-${j + 1}]`,
          content: `${template.title}에 대한 ${suffix}입니다. 전문가가 검증한 번역 자료를 제공합니다.`,
          type: template.type,
          status: status,
          field: template.field,
          source: template.source,
          deadline: getRandomDeadline(),
          capacity: String(Math.floor(Math.random() * 40) + 15),
          isDelete: status === 'DELETED',
          isApprove: status === 'APPROVED' || status === 'DEADLINE',
          isClose: status === 'DEADLINE',
          isReject: status === 'REJECTED',
          delete_reason: status === 'DELETED' ? '운영 정책 위반으로 삭제되었습니다.' : null,
          reject_content: status === 'REJECTED' ? '내용 검토 결과 부적합하여 거절되었습니다.' : null,
          adminId: (status === 'APPROVED' || status === 'DEADLINE' || status === 'REJECTED') ? admin.user_id : null,
        },
      });
      challenges.push(ch);
    }
  }

  // 일반 사용자들이 생성한 챌린지 (각 10명당 1개, 총 약 28개)
  const challengeCreators = getRandomItems(regularUsers, 28);
  for (let i = 0; i < challengeCreators.length; i++) {
    const template = challengeTemplates[i % challengeTemplates.length];
    const suffix = suffixes[Math.floor(Math.random() * suffixes.length)];
    const status = getRandomStatus();

    const ch = await prisma.challenge.create({
      data: {
        user_id: challengeCreators[i].user_id,
        title: `${template.title} ${suffix} [일반-${i + 1}]`,
        content: `${template.title}를 함께 번역하고 학습하는 챌린지입니다.`,
        type: template.type,
        status: status,
        field: template.field,
        source: template.source,
        deadline: getRandomDeadline(),
        capacity: String(Math.floor(Math.random() * 25) + 5),
        isDelete: status === 'DELETED',
        isApprove: status === 'APPROVED' || status === 'DEADLINE',
        isClose: status === 'DEADLINE',
        isReject: status === 'REJECTED',
        delete_reason: status === 'DELETED' ? '참여자 부족으로 삭제되었습니다.' : null,
        reject_content: status === 'REJECTED' ? '공식 문서 번역을 권장합니다.' : null,
        adminId: (status === 'APPROVED' || status === 'DEADLINE' || status === 'REJECTED') ? admin.user_id : null,
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
  const regularUsers = users.slice(22); // 일반 사용자는 22번째부터 (0=test, 1=admin, 2-21=experts)

  const allAttends = [];

  // ====== test@master.com이 참여한 작업물들 (20개) ======
  const approvedForTest = challenges.filter(c => c.status === 'APPROVED' && !c.isClose).slice(0, 20);

  for (let i = 0; i < approvedForTest.length; i++) {
    const challenge = approvedForTest[i];
    const attend = await prisma.attend.create({
      data: {
        challenge_id: challenge.challenge_id,
        user_id: testMaster.user_id,
        title: `테스트마스터의 ${challenge.title.substring(0, 30)} 번역`,
        work_item: `${challenge.title}에 대한 상세한 번역 작업물입니다. 원문의 의미를 정확히 전달하면서도 한국어로 자연스럽게 표현했습니다.`,
        isSave: i >= 18, // 마지막 2개는 임시 저장
        is_delete: false,
      },
    });
    allAttends.push(attend);
  }

  // test@master.com의 삭제된 작업물 예제 2개 추가
  for (let i = 0; i < 2; i++) {
    const deletedAttend = await prisma.attend.create({
      data: {
        challenge_id: challenges[i].challenge_id,
        user_id: testMaster.user_id,
        title: `작업물 ${i + 1} (삭제됨)`,
        work_item: '초기 번역 작업물입니다.',
        isSave: false,
        is_delete: true,
        delete_reason: '더 나은 버전으로 재작성하기 위해 삭제했습니다.',
      },
    });
    allAttends.push(deletedAttend);
  }

  // ====== 다른 사용자들의 작업물들 ======

  // 각 승인된 챌린지에 15-30명의 참여자 추가 (대폭 증가)
  const approvedChallenges = challenges.filter(
    c => c.status === 'APPROVED' && !c.isClose && !c.isDelete
  );

  for (const challenge of approvedChallenges) {
    const numParticipants = Math.floor(Math.random() * 16) + 15; // 15-30명
    const participants = getRandomItems(regularUsers, numParticipants);

    for (let i = 0; i < participants.length; i++) {
      const user = participants[i];
      const attend = await prisma.attend.create({
        data: {
          challenge_id: challenge.challenge_id,
          user_id: user.user_id,
          title: `${user.nick_name}의 ${challenge.title.substring(0, 30)} 번역 ${i + 1}`,
          work_item: `${challenge.title}의 섹션을 번역했습니다. 전문 용어를 정확히 번역하고 예제 코드도 함께 제공합니다.`,
          isSave: i % 8 === 0, // 일부는 임시 저장
          is_delete: i % 25 === 0, // 일부는 삭제됨
          delete_reason: i % 25 === 0 ? '내용이 부적절하여 삭제되었습니다.' : null,
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
    const numParticipants = Math.floor(Math.random() * 11) + 10; // 10-20명
    const participants = getRandomItems(regularUsers, numParticipants);

    for (const user of participants) {
      const attend = await prisma.attend.create({
        data: {
          challenge_id: challenge.challenge_id,
          user_id: user.user_id,
          title: `${user.nick_name}의 ${challenge.title.substring(0, 30)} 완료`,
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
  const regularUsers = users.slice(22); // 일반 사용자는 22번째부터

  let likeCount = 0;

  // test@master.com이 받은 좋아요 (각 작업물당 20-40개)
  const testMasterAttends = attends.filter(a => a.user_id === testMaster.user_id && !a.isSave && !a.is_delete);

  for (const attend of testMasterAttends) {
    const numLikes = Math.floor(Math.random() * 21) + 20; // 20-40개
    const likers = getRandomItems(regularUsers, numLikes);

    for (const liker of likers) {
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
        // 중복 스킵
      }
    }
  }

  // test@master.com이 다른 사람 작업물에 좋아요 (50개)
  const otherAttends = attends.filter(a => a.user_id !== testMaster.user_id && !a.isSave && !a.is_delete);
  const attendsToLike = getRandomItems(otherAttends, Math.min(50, otherAttends.length));

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

  // 다른 사용자들끼리도 좋아요 (대량 생성: 각 작업물당 5-15개)
  for (const attend of otherAttends) {
    const numLikes = Math.floor(Math.random() * 11) + 5; // 5-15개
    const likers = getRandomItems(regularUsers, numLikes);

    for (const liker of likers) {
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
  }

  console.log(`  ✓ Created ${likeCount} likes`);
}

// ─────────────────────────────────────────────────────────────
// 피드백(Feedback) 시드 데이터 (증가)
// ─────────────────────────────────────────────────────────────
async function seedFeedbacks(attends, users) {
  console.log('💬 Creating feedbacks...');

  const testMaster = users[0];
  const experts = users.slice(2, 22); // 전문가 20명
  const regularUsers = users.slice(22); // 일반 사용자는 22번째부터

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

  // test@master.com이 받은 피드백 (각 작업물당 5-10개)
  const testMasterAttends = attends.filter(a => a.user_id === testMaster.user_id && !a.isSave && !a.is_delete);

  for (const attend of testMasterAttends) {
    const numFeedbacks = Math.floor(Math.random() * 6) + 5; // 5-10개

    for (let i = 0; i < numFeedbacks; i++) {
      const author = i < 2 ? getRandomItem(experts) : getRandomItem([...regularUsers, ...experts]);

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

  // test@master.com이 다른 사람에게 남긴 피드백 (80개)
  const otherAttends = attends.filter(a => a.user_id !== testMaster.user_id && !a.isSave && !a.is_delete);
  const attendsToFeedback = getRandomItems(otherAttends, Math.min(80, otherAttends.length));

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

  // 다른 사용자들끼리도 피드백 (대량 생성: 각 작업물당 1-4개)
  for (const attend of otherAttends.slice(0, Math.min(500, otherAttends.length))) {
    const numFeedbacks = Math.floor(Math.random() * 4) + 1; // 1-4개

    for (let i = 0; i < numFeedbacks; i++) {
      const author = Math.random() < 0.3 ? getRandomItem(experts) : getRandomItem(regularUsers);

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

  console.log(`  ✓ Created ${feedbackCount} feedbacks`);
}

// ─────────────────────────────────────────────────────────────
// 알림(Notice) 시드 데이터 (증가)
// ─────────────────────────────────────────────────────────────
async function seedNotices(challenges, users, attends) {
  console.log('🔔 Creating notices...');

  const testMaster = users[0];
  const regularUsers = users.slice(22); // 일반 사용자는 22번째부터

  let noticeCount = 0;

  // test@master.com의 작업물 가져오기 (attend_id 연결용)
  const testMasterAttends = attends.filter(a => a.user_id === testMaster.user_id && !a.isSave && !a.is_delete);

  // test@master.com에게 다양한 알림들 (50개로 증가)

  const testMasterNotices = [
    { type: 'CHALLENGE', content: '챌린지 "React 18 공식문서 번역 챌린지"가 생성되었습니다.', isRead: true },
    { type: 'APPROVAL', content: '챌린지 "React 18 공식문서 번역 챌린지"가 승인되었습니다.', isRead: true },
    { type: 'APPROVAL', content: '챌린지 "TypeScript 5.0 핸드북 번역"이 승인되었습니다.', isRead: true },
    { type: 'APPROVAL', content: '챌린지 "개인 블로그 글 번역"이 거절되었습니다. 사유: 개인 블로그보다는 공식 문서 번역을 권장합니다.', isRead: false },
    { type: 'DEADLINE', content: '챌린지 "TypeScript 5.0 핸드북 번역"의 마감이 7일 남았습니다.', isRead: false },
    { type: 'ATTEND', content: '작업물 "Next.js Server Components 번역"이 성공적으로 제출되었습니다.', isRead: true, attendIndex: 0 },
    { type: 'FEEDBACK', content: '작업물에 새로운 피드백이 등록되었습니다.', isRead: false, attendIndex: 1 },
    { type: 'FEEDBACK', content: '"번역전문가1"님이 피드백을 남겼습니다.', isRead: false, attendIndex: 1 },
    { type: 'FEEDBACK', content: '"코딩왕"님이 피드백을 남겼습니다.', isRead: false, attendIndex: 2 },
    { type: 'FEEDBACK', content: '작업물 "Node.js Worker Threads API"에 새 피드백이 있습니다.', isRead: true, attendIndex: 2 },
    { type: 'FEEDBACK', content: '작업물 "Deno Permission 시스템"에 새 피드백이 있습니다.', isRead: true, attendIndex: 3 },
    { type: 'ATTEND', content: '"개발자김씨"님이 "React 18 공식문서 번역 챌린지"에 참여했습니다.', isRead: false },
    { type: 'ATTEND', content: '"코딩왕"님이 "React 18 공식문서 번역 챌린지"에 작업물을 제출했습니다.', isRead: false },
    { type: 'ATTEND', content: '"프론트마스터"님이 "TypeScript 5.0 핸드북 번역"에 참여했습니다.', isRead: false },
    { type: 'DEADLINE', content: '챌린지 "Vue.js 3 가이드 번역 완료"가 마감되었습니다.', isRead: true },
    { type: 'CHALLENGE', content: '챌린지 "Remix 프레임워크 완벽 가이드"가 생성되었습니다.', isRead: true },
    { type: 'CHALLENGE', content: '챌린지 "Solid.js 리액티브 프로그래밍"이 생성되었습니다.', isRead: true },
    { type: 'APPROVAL', content: '챌린지 "Nuxt 3 풀스택 프레임워크"가 승인되었습니다.', isRead: false },
    { type: 'DEADLINE', content: '챌린지 "Astro 정적 사이트 생성기"의 마감이 임박했습니다.', isRead: false },
    { type: 'ATTEND', content: '작업물 "Kubernetes Pod 개념"이 제출되었습니다.', isRead: true, attendIndex: 4 },
  ];

  for (const notice of testMasterNotices) {
    await prisma.notice.create({
      data: {
        user_id: testMaster.user_id,
        attend_id: notice.attendIndex !== undefined && testMasterAttends[notice.attendIndex]
          ? testMasterAttends[notice.attendIndex].attend_id
          : null,
        type: notice.type,
        content: notice.content,
        isRead: notice.isRead,
      },
    });
    noticeCount++;
  }

  // test@master.com에게 추가 알림 30개 더 생성
  for (let i = 0; i < 30; i++) {
    const types = ['FEEDBACK', 'ATTEND', 'DEADLINE'];
    const type = getRandomItem(types);
    const validAttends = testMasterAttends.filter(a => !a.is_delete);
    const attendId = type === 'FEEDBACK' && validAttends.length > 0
      ? getRandomItem(validAttends).attend_id
      : null;

    await prisma.notice.create({
      data: {
        user_id: testMaster.user_id,
        attend_id: attendId,
        type: type,
        content: `${type === 'FEEDBACK' ? '새로운 피드백이 도착했습니다' : type === 'ATTEND' ? '새로운 참여가 있습니다' : '챌린지 마감이 임박했습니다'}.`,
        isRead: Math.random() > 0.6,
      },
    });
    noticeCount++;
  }

  // 다른 사용자들에게도 알림 (각 사용자당 3-8개, 총 300명 중 50명에게)
  const noticeReceivers = getRandomItems(regularUsers, 50);
  for (const user of noticeReceivers) {
    const numNotices = Math.floor(Math.random() * 6) + 3; // 3-8개
    const userAttends = attends.filter(a => a.user_id === user.user_id && !a.isSave && !a.is_delete);

    for (let i = 0; i < numNotices; i++) {
      const types = ['CHALLENGE', 'FEEDBACK', 'ATTEND', 'APPROVAL', 'DEADLINE'];
      const type = getRandomItem(types);
      const attendId = type === 'FEEDBACK' && userAttends.length > 0
        ? getRandomItem(userAttends).attend_id
        : null;

      await prisma.notice.create({
        data: {
          user_id: user.user_id,
          attend_id: attendId,
          type: type,
          content: `새로운 ${type} 활동이 있습니다.`,
          isRead: Math.random() > 0.4,
        },
      });
      noticeCount++;
    }
  }

  console.log(`  ✓ Created ${noticeCount} notices`);
}

// ─────────────────────────────────────────────────────────────
// 메인 시드 함수
// ─────────────────────────────────────────────────────────────
async function main() {
  console.log('\n🌱 Starting comprehensive seed process (8x~16x data)...\n');
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

    await seedNotices(challenges, users, attends);
    console.log('');

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    console.log('✅ Seed completed successfully!\n');
    console.log('📋 Test Account Credentials:');
    console.log('   Email: test@master.com');
    console.log('   Password: test1234');
    console.log('   Role: USER\n');
    console.log('💡 Password Rule: 이메일 @ 앞부분 + 1234 (예: admin@example.com → admin1234)\n');
    console.log('📊 Summary:');
    console.log(`   Users: ${users.length} (8x increase)`);
    console.log(`   Challenges: ${challenges.length} (6x increase)`);
    console.log(`   Work Submissions: ${attends.length} (10x+ increase)`);
    console.log('   Likes: Many (15x+ increase)');
    console.log('   Feedbacks: Many (12x+ increase)');
    console.log('   Notices: Many (8x+ increase)\n');
    console.log('🎯 Test Scenarios Available:');
    console.log('   ✓ 300+ users with realistic data');
    console.log('   ✓ 150+ challenges with various statuses');
    console.log('   ✓ 2000+ work submissions with likes and feedbacks');
    console.log('   ✓ Massive realistic dataset for performance testing');
    console.log('   ✓ Read/Unread notifications with attend_id relations');
    console.log('   ✓ Approved/Rejected/Pending/Deadline/Deleted challenges');
    console.log('   ✓ Active/Expired challenges with various dates');
    console.log('   ✓ Comprehensive feedback and like interactions');
    console.log('   ✓ Perfect for load testing and UI pagination\n');

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
