import prisma from '../src/config/prisma.config.js';

async function resetDatabase() {
  try {
    console.log('🔄 데이터베이스 리셋을 시작합니다...');

    // 외래키 제약조건을 고려하여 역순으로 삭제
    // 1. Like 테이블 삭제 (다른 테이블을 참조)
    console.log('📝 Like 데이터 삭제 중...');
    await prisma.like.deleteMany();
    console.log('✅ Like 데이터 삭제 완료');

    // 2. Feedback 테이블 삭제 (Attend를 참조)
    console.log('📝 Feedback 데이터 삭제 중...');
    await prisma.feedback.deleteMany();
    console.log('✅ Feedback 데이터 삭제 완료');

    // 3. Notice 테이블 삭제 (User를 참조)
    console.log('📝 Notice 데이터 삭제 중...');
    await prisma.notice.deleteMany();
    console.log('✅ Notice 데이터 삭제 완료');

    // 4. Attend 테이블 삭제 (User와 Challenge를 참조)
    console.log('📝 Attend 데이터 삭제 중...');
    await prisma.attend.deleteMany();
    console.log('✅ Attend 데이터 삭제 완료');

    // 5. Challenge 테이블 삭제 (User를 참조)
    console.log('📝 Challenge 데이터 삭제 중...');
    await prisma.challenge.deleteMany();
    console.log('✅ Challenge 데이터 삭제 완료');

    // 6. User 테이블 삭제 (최상위 테이블)
    console.log('📝 User 데이터 삭제 중...');
    await prisma.user.deleteMany();
    console.log('✅ User 데이터 삭제 완료');

    console.log('🎉 데이터베이스 리셋이 완료되었습니다!');
    console.log('📊 모든 테이블이 비워졌습니다.');
  } catch (error) {
    console.error('❌ 데이터베이스 리셋 중 오류가 발생했습니다:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// 스크립트가 직접 실행될 때만 resetDatabase 함수 실행
if (import.meta.url === `file://${process.argv[1]}`) {
  resetDatabase()
    .then(() => {
      console.log('✅ 스크립트 실행 완료');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ 스크립트 실행 실패:', error);
      process.exit(1);
    });
}

export default resetDatabase;
