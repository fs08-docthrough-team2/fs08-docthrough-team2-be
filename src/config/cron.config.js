// 설명: Cron 작업 스케줄 설정
// node-cron을 사용하여 정기적으로 deadline 체크 및 알림 전송
import cron from 'node-cron';
import prisma from './prisma.config.js';
import noticeService from '../api/services/notice.service.js';

/**
 * 스케줄러 시작 함수
 * 매시간 정각에 만료된 챌린지 체크
 */
export function startScheduler() {
  console.log('✅ Cron scheduler started: ', new Date().toLocaleString());

  // 매시간 정각에 실행 (0 * * * *)
  // 테스트용으로 1분마다 실행하려면: */1 * * * *
  const scheduleJob = cron.schedule(
    '*/1 * * * *',
    scheduleDeadlineCheck,
    {
      scheduled: true,
      timezone: 'Asia/Seoul'
    }
  );

  return scheduleJob;
}

/**
 * 스케줄러 중지 함수
 */
export function stopScheduler(job) {
  if (job) {
    job.stop();
    console.log('🛑 스케줄러가 중지되었습니다');
  }
}

/**
 * 만료된 챌린지 체크 및 알림 전송
 */
async function scheduleDeadlineCheck() {
  console.log('챌린지 데드라인 확인 스케줄러 실행 시작: ', new Date().toLocaleString());

  try {
    const now = new Date();

    // 만료된 챌린지 찾기 (deadline이 현재 시간보다 이전이고, 아직 진행 중인 챌린지)
    const overdueChallenges = await prisma.challenge.findMany({
      where: {
        deadline: { lt: now },  // ✅ deadline이 현재보다 이전 (이미 지남)
        status: { notIn: ['DEADLINE', 'DELETED', 'CANCELLED'] },   // ✅ 삭제/취소/마감되지 않은 챌린지
        isDelete: false,  // ✅ 삭제되지 않은 챌린지
      },
      include: {
        attends: {
          where: {
            isSave: false,  // 임시저장이 아닌 실제 참여자만
          },
          select: {
            user_id: true,
          },
        },
      },
    });

    if (overdueChallenges.length === 0) {
      console.log('데드라인이 지난 챌린지 없음');
      console.log('챌린지 데드라인 확인 스케줄러 실행 종료: ', new Date().toLocaleString());
      return;
    }

    // 각 챌린지 처리
    for (const challenge of overdueChallenges) {
      // 1. 챌린지 상태를 DEADLINE로 변경
      await prisma.challenge.update({
        where: {
          challenge_id: challenge.challenge_id,
        },
        data: {
          status: 'DEADLINE',
        },
      });

      console.log(`  📌 챌린지 "${challenge.title}" 상태를 DEADLINE로 변경`);

      // 2. 참여자들에게 알림 전송
      const participants = challenge.attends.map(attend => attend.user_id);
      const uniqueParticipants = [...new Set(participants)]; // 중복 제거

      for (const userId of uniqueParticipants) {
        await noticeService.addChallengeDeadlineNotice(userId, challenge.title);
      }

      console.log(`  📧 ${uniqueParticipants.length}명의 참여자에게 마감 알림 전송 완료`);
    }

  } catch (error) {
    console.error('❌ 챌린지 데드라인 확인 스케줄러 실행 중 오류 발생:', error);
  }

  console.log('✅ Cron scheduler end: ', new Date().toLocaleString());
}

export default {
  startScheduler,
  stopScheduler,
};