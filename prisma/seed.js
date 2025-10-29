import prisma from '../src/common/prisma.js';
import argon2 from 'argon2';
import crypto from 'crypto';

// ─────────────────────────────────────────────────────────────
// 1) JSON에서 추출해 상수로 내장한 데이터
// ─────────────────────────────────────────────────────────────
const NICKNAMES = [
  '어드민 유저',
  '유저2',
  '유저3',
  '유저4',
  '유저5',
  '유저6',
  '유저7',
  '유저8',
  '유저9',
  '유저10',
  '유저11',
  '유저12',
  '유저13',
  '유저14',
  '유저15',
  '유저16',
  '유저17',
  '유저18',
  '유저19',
  '유저20',
];
const EMAILS = [
  'admin@example.com',
  'user2@example.com',
  'user3@example.com',
  'user4@example.com',
  'user5@example.com',
  'user6@example.com',
  'user7@example.com',
  'user8@example.com',
  'user9@example.com',
  'user10@example.com',
  'user11@example.com',
  'user12@example.com',
  'user13@example.com',
  'user14@example.com',
  'user15@example.com',
  'user16@example.com',
  'user17@example.com',
  'user18@example.com',
  'user19@example.com',
  'user20@example.com',
];
const PASSWORDS = [
  'pw1000',
  'pw1001',
  'pw1002',
  'pw1003',
  'pw1004',
  'pw1005',
  'pw1006',
  'pw1007',
  'pw1008',
  'pw1009',
  'pw1010',
  'pw1011',
  'pw1012',
  'pw1013',
  'pw1014',
  'pw1015',
  'pw1016',
  'pw1017',
  'pw1018',
  'pw1019',
]; // 해시로 저장
const ROLES_BY_INDEX = [
  'ADMIN',
  'USER',
  'USER',
  'USER',
  'USER',
  'USER',
  'USER',
  'USER',
  'USER',
  'USER',
  'USER',
  'USER',
  'USER',
  'USER',
  'USER',
  'USER',
  'USER',
  'USER',
  'USER',
  'USER',
]; // ADMIN/USER

const CHALLENGE_TITLES = [
  '파이썬 초급',
  '리액트 hooks',
  'Node.js 비동기 프로그래밍',
  'Django 기초',
  'Docker 시작하기',
  'Next.js App Router',
  'Jest test framework',
];
const CHALLENGE_FIELDS_RAW = [
  'backend',
  'frontend',
  'backend',
  'backend',
  'devops',
  'frontend',
  'test',
]; // backend|frontend|devops|test
const CHALLENGE_DOC_TYPES_RAW = [
  'official',
  'article',
  'official',
  'official',
  'official',
  'article',
  'official',
]; // official|article
const CHALLENGE_DOC_URLS = [
  'https://docs.python.org/3/tutorial/index.html',
  'https://reactjs.org/docs/hooks-intro.html',
  'https://nodejs.org/en/docs/guides/event-loop-timers-and-nexttick/',
  'https://docs.djangoproject.com/en/4.0/intro/',
  'https://docs.docker.com/get-started/',
  'https://nextjs.org/docs/app/building-your-application/routing',
  'https://jestjs.io/docs/getting-started',
];
const CHALLENGE_DEADLINES_ISO = [
  '2025-06-05T23:59:59Z',
  '2025-06-07T23:59:59Z',
  '2025-06-09T23:59:59Z',
  '2025-06-11T23:59:59Z',
  '2025-06-13T23:59:59Z',
  '2025-06-15T23:59:59Z',
  '2025-06-17T23:59:59Z',
];
const CHALLENGE_PROGRESS = [false, false, false, false, false, false, false]; // true=INPROGRESS, false=DEADLINE
const CHALLENGE_CAPACITY = ['10', '11', '12', '13', '14', '10', '11']; // String 저장
const CHALLENGE_CREATED_BY_INDEX_1BASED = [14, 13, 13, 7, 11, 2, 6]; // 생성자: 유저 인덱스(1부터)

// works.json에서 발췌한 설명(도메인 컨텍스트상 챌린지 안내문으로 활용)
const CHALLENGE_CONTENTS = [
  '파이썬은 고급 범용 프로그래밍 언어입니다.',
  'Node.js는 이벤트 기반, 논블로킹 I/O 모델을 사용하여 가볍고 효율적입니다.',
  'Django는 파이썬 기반의 강력한 웹 프레임워크입니다.',
  'Next.js의 App Router는 파일 기반 라우팅을 지원합니다.',
  'Jest는 자바스크립트 테스트 프레임워크입니다.',
  '컨테이너 이미지는 Dockerfile로 정의합니다.',
]; // works.json에서 발췌한 설명
const WORK_ITEMS = [
  '파이썬은 고급 범용 프로그래밍 언어입니다.',
  'Node.js는 이벤트 기반, 논블로킹 I/O 모델을 사용하여 가볍고 효율적입니다.',
  'Django는 파이썬 기반의 강력한 웹 프레임워크입니다.',
  'Next.js의 App Router는 파일 기반 라우팅을 지원합니다.',
  'Jest는 자바스크립트 테스트 프레임워크입니다.',
  '컨테이너 이미지는 Dockerfile로 정의합니다.',
  '파이썬이란 무엇인가요?',
  'React Hooks는 함수 컴포넌트에서 React state와 생명주기 기능에 "hook into(접근)"할 수 있게 해주는 함수입니다.',
  'Docker는 컨테이너 기반의 가상화 플랫폼입니다.',
  '테스트 코드는 코드 품질을 높여줍니다.',
]; // works.json의 유니크 description
const FEEDBACK_TEMPLATES = [
  '용어 통일에 신경 써주세요.',
  '매우 훌륭한 번역입니다.',
  '오타가 있습니다. 확인 부탁드려요.',
  '전문 용어 번역이 인상적입니다.',
  '문맥에 맞는 번역이 필요해요.',
  '더 간결하게 표현할 수 있을 것 같아요.',
  '조금 더 직역하면 좋을 것 같아요.',
  '문장 구조가 어색한 부분이 있어요.',
  '번역이 자연스럽고 이해하기 쉬워요!',
];

// ─────────────────────────────────────────────────────────────
// 2) 매핑/유틸
// ─────────────────────────────────────────────────────────────
function toChallengeType(docType) {
  const s = String(docType || '').toLowerCase();
  return s === 'official' ? 'OFFICIAL' : 'BLOG';
}

function toChallengeStatus(progress) {
  return progress ? 'INPROGRESS' : 'DEADLINE';
}

function toChallengeField(field) {
  const s = String(field || '').toLowerCase();
  switch (s) {
    case 'backend':
      return 'API';
    case 'frontend':
      return 'WEB';
    case 'devops':
    case 'test':
      return 'MODERN';
    case 'career':
      return 'CAREER';
    default:
      return 'NEXT';
  }
}

function toRoleEnum(r) {
  return String(r).toUpperCase() === 'ADMIN' ? 'ADMIN' : 'USER';
}

function toDate(iso) {
  const d = new Date(iso);
  return isNaN(d.getTime()) ? new Date() : d;
}

async function newRefreshTokenHash() {
  const plain = crypto.randomBytes(48).toString('hex');
  return argon2.hash(plain);
}

// ─────────────────────────────────────────────────────────────
// 3) 시드
// ─────────────────────────────────────────────────────────────
async function seedUsers() {
  const created = [];
  for (let i = 0; i < NICKNAMES.length; i++) {
    const hashedPw = await argon2.hash(String(PASSWORDS[i] || 'changeme'));
    const refreshHash = await newRefreshTokenHash();
    const role = toRoleEnum(ROLES_BY_INDEX[i] || 'USER');

    const u = await prisma.user.create({
      data: {
        email: EMAILS[i],
        nick_name: NICKNAMES[i],
        password: hashedPw,
        role,
        provider: null,
        refresh_token: refreshHash,
        isDelete: false,
      },
      select: { user_id: true, email: true, nick_name: true },
    });
    created.push(u);
  }
  console.log(`[Seed][User] ${created.length} rows`);
  return created; // [{user_id, email, nick_name}...]
}

async function seedChallenges(users) {
  const created = [];
  for (let i = 0; i < CHALLENGE_TITLES.length; i++) {
    const ownerIndex =
      Math.max(1, Math.min(NICKNAMES.length, Number(CHALLENGE_CREATED_BY_INDEX_1BASED[i] || 1))) -
      1;
    const owner = users[ownerIndex];

    const ch = await prisma.challenge.create({
      data: {
        user_id: owner.user_id,
        title: CHALLENGE_TITLES[i],
        content: CHALLENGE_CONTENTS[i % CHALLENGE_CONTENTS.length],
        type: toChallengeType(CHALLENGE_DOC_TYPES_RAW[i]),
        status: toChallengeStatus(!!CHALLENGE_PROGRESS[i]),
        field: toChallengeField(CHALLENGE_FIELDS_RAW[i]),
        source: CHALLENGE_DOC_URLS[i],
        deadline: toDate(CHALLENGE_DEADLINES_ISO[i]),
        capacity: String(CHALLENGE_CAPACITY[i] ?? ''),
        isDelete: false,
        isApprove: false,
        isClose: false,
        isReject: false,
        reject_content: null,
      },
    });
    created.push(ch);

    // 생성 알림
    await prisma.notice.create({
      data: {
        user_id: owner.user_id,
        type: 'CHALLENGE',
        content: `챌린지가 생성되었습니다: ${CHALLENGE_TITLES[i]}`,
        isRead: false,
      },
    });

    // 마감 임박 알림(진행중 + 3일 이내)
    if (!!CHALLENGE_PROGRESS[i]) {
      const now = Date.now();
      const diff = toDate(CHALLENGE_DEADLINES_ISO[i]).getTime() - now;
      if (diff > 0 && diff <= 3 * 24 * 60 * 60 * 1000) {
        await prisma.notice.create({
          data: {
            user_id: owner.user_id,
            type: 'DEADLINE',
            content: `마감 임박: ${CHALLENGE_TITLES[i]}`,
            isRead: false,
          },
        });
      }
    }
  }
  console.log(`[Seed][Challenge] ${created.length} rows`);
  return created;
}

async function seedAttends(challenges, users) {
  const created = [];
  for (const ch of challenges) {
    // 소유자 제외 랜덤 3~5명 선택
    const ownerId = ch.user_id;
    const candidates = users.filter((u) => u.user_id !== ownerId);
    const count = Math.min(5, Math.max(3, Math.floor(Math.random() * 5) + 1));
    const shuffled = candidates.sort(() => Math.random() - 0.5).slice(0, count);

    let wi = 0;
    for (const u of shuffled) {
      const attend = await prisma.attend.create({
        data: {
          challenge_id: ch.challenge_id,
          user_id: u.user_id,
          title: `${u.nick_name}의 ${ch.title} 참여`,
          work_item: WORK_ITEMS[wi % WORK_ITEMS.length],
          isSave: Math.random() < 0.6,
        },
      });
      wi += 1;

      // 참여 알림
      await prisma.notice.create({
        data: {
          user_id: u.user_id,
          type: 'ATTEND',
          content: '챌린지 참석/작업이 등록되었습니다.',
          isRead: false,
        },
      });

      // 간단 피드백 0~2개
      const fbN = Math.floor(Math.random() * 3);
      for (let k = 0; k < fbN; k++) {
        const author = users[Math.floor(Math.random() * users.length)];
        await prisma.feedback.create({
          data: {
            attend_id: attend.attend_id,
            user_id: author.user_id,
            content: FEEDBACK_TEMPLATES[(wi + k) % FEEDBACK_TEMPLATES.length],
          },
        });
        await prisma.notice.create({
          data: {
            user_id: u.user_id,
            type: 'FEEDBACK',
            content: '새 피드백이 등록되었습니다.',
            isRead: false,
          },
        });
      }

      // 간단 좋아요 1~3개
      const likeN = Math.floor(Math.random() * 3) + 1;
      for (let t = 0; t < likeN; t++) {
        const liker = users[Math.floor(Math.random() * users.length)];
        await prisma.like.create({
          data: {
            user_id: liker.user_id,
            attend_id: attend.attend_id,
            liker: true,
          },
        });
      }
    }
  }
  console.log('[Seed][Attend/Feedback/Like] done');
}

async function main() {
  console.log('🌱 Start seeding (static)…');

  const users = await seedUsers();
  const challenges = await seedChallenges(users);
  await seedAttends(challenges, users);

  console.log('✅ Seeding completed');
}

main()
  .catch(async (e) => {
    console.error('❌ Seed failed:', e);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
