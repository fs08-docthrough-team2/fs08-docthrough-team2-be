import * as challengeCrudRepository from '../repositories/challenge.crud.repository.js';
import noticeService from '../../api/services/notice.service.js';

async function createChallenge(title, source, field, type, deadline, capacity, content, userID) {
  try {
    // 새로운 챌린지를 DB에 추가하고, 내용을 반환 받음
    const createChallenge = await challengeCrudRepository.createChallenge({
      user_id: userID,
      title,
      source,
      field,
      type,
      deadline,
      capacity,
      content,
      status: 'PENDING',
      isDelete: false,
      isClose: false,
      isReject: false,
    });

    // 결과를 반환
    return {
      success: true,
      message: '챌린지가 성공적으로 생성되었습니다.',
      data: {
        createChallenge: createChallenge,
      }
    };
  } catch (error) {
    throw error;
  }
}

async function updateChallenge(req, userID) {
  try{
    // 챌린지를 DB에 업데이트하고, 내용을 반환 받음
    const updateChallenge = await challengeCrudRepository.updateChallengeById(
      req.params.challengeId,
      req.body
    );

    // 챌린지 수정 알림 함수 호출
    await noticeService.addModifyNotice("챌린지","수정", userID, updateChallenge.title);

    // 결과를 반환
    return {
      success: true,
      message: '챌린지가 성공적으로 수정되었습니다.',
      data: {
        updateChallenge: updateChallenge,
      }
    };
  } catch(error) {
    throw error;
  }
}

async function cancelChallenge(challengeID, userID) {
  try{
    // 챌린지를 DB에 업데이트하고, 내용을 반환 받음
    const cancelChallenge = await challengeCrudRepository.cancelChallengeById(challengeID);

    // 챌린지 취소 알림 함수 호출
    await noticeService.addModifyNotice("챌린지","취소", userID, cancelChallenge.title);

    // 결과를 반환
    return {
      success: true,
      message: '챌린지가 성공적으로 취소되었습니다.',
      data: {
        cancelChallenge: cancelChallenge,
      }
    };
  } catch(error) {
    throw error;
  }
}

async function deleteChallenge(challengeID, userID) {
  try{
    // 챌린지를 DB에 업데이트하고, 내용을 반환 받음
    const deletedChallenge = await challengeCrudRepository.deleteChallengeById(challengeID);

    // 챌린지 삭제 알림 함수 호출
    await noticeService.addModifyNotice("챌린지","삭제", userID, deletedChallenge.title);

    // 결과를 반환
    return {
      success: true,
      message: '챌린지가 성공적으로 삭제되었습니다.',
      data: {
        deletedChallenge: deletedChallenge,
      }
    };
  } catch (error) {
    throw error;
  }
}

async function hardDeleteChallenge(challengeID, userID) {
  try {
    // 챌린지를 DB에서 삭제하고, 내용을 반환 받음
    const deletedChallenge = await challengeCrudRepository.hardDeleteChallengeById(challengeID);

    // 챌린지 완전 삭제 알림 함수 호출
    await noticeService.addModifyNotice("챌린지","완전 삭제", userID, deletedChallenge.title);

    // 결과를 반환
    return {
      success: true,
      message: '챌린지가 성공적으로 영구 삭제되었습니다.',
      data: {
        deletedChallenge: deletedChallenge,
      }
    };
  } catch (error) {
    throw error;
  }
}

export default {
  createChallenge,
  updateChallenge,
  cancelChallenge,
  deleteChallenge,
  hardDeleteChallenge,
}