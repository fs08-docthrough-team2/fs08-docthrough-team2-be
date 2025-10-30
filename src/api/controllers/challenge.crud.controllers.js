// 설명: 요청 파싱(params/query/body) + 입력 검증 결과 처리하는 파일입니다.
import challengeCRUDServices from '../services/challenge.crud.services.js';
import isUUID from 'is-uuid';

async function createChallengeInput(req, res) {
  // 입력값 불러오기
  const { title, source, field, type, deadline, capacity, content } = req.body;
  const userID = !isUUID.v4(req.auth?.userId) ? undefined : req.auth?.userId;

  // 입력값 검증
  if (userID === undefined) {
    return res.status(400).json({
      success: false,
      message: "유저 ID가 없거나 올바르지 않습니다."
    });
  }
  if (!title || !source || !field || !type || !deadline || !capacity || !content) {
    return res.status(400).json({ error: '챌린지 추가에 필요한 값이 입력되지 않았습니다.' });
  }
  if (typeof capacity !== 'string' || capacity <= 0) {
    return res.status(400).json({ error: '챌린지 인원은 2명 이상의 문자여야 합니다.' });
  }

  // 서비스 호출
  const response = await challengeCRUDServices.createChallenge(
    title, source, field, type, deadline, capacity, content, userID
  );

  // 호출 결과 반환
  return res.status(201).json(response);
}

async function updateChallengeInput(req, res) {
  // 입력값 불러오기 및 데이터 검증
  const userID = !isUUID.v4(req.auth?.userId) ? undefined : req.auth?.userId;

  // 입력값 검증
  if (userID === undefined) {
    return res.status(400).json({
      success: false,
      message: "유저 ID가 없거나 올바르지 않습니다."
    });
  }

  // 서비스 호출
  const response = await challengeCRUDServices.updateChallenge(req, userID);

  // 호출 결과 반환
  return res.status(200).json(response);
}

async function cancelChallengeInput(req, res) {
  // 입력값 불러오기 및 데이터 검증
  const userID = !isUUID.v4(req.auth?.userId) ? undefined : req.auth?.userId;
  const challengeID = !isUUID.v4(req.params.challengeId) ? undefined : req.params.challengeId;

  // 입력값 검증
  if (userID === undefined) {
    return res.status(400).json({
      success: false,
      message: "유저 ID가 없거나 올바르지 않습니다."
    });
  }
  if (challengeID === undefined) {
    return res.status(400).json({
      success: false,
      message: "챌린지 ID가 없거나 올바르지 않습니다."
    });
  }

  // 서비스 호출
  const response = await challengeCRUDServices.cancelChallenge(challengeID, userID);

  // 호출 결과 반환
  return res.status(200).json(response);
}

async function deleteChallengeInput(req, res) {
  // 입력값 불러오기 및 데이터 검증
  const userID = !isUUID.v4(req.auth?.userId) ? undefined : req.auth?.userId;
  const challengeID = !isUUID.v4(req.params.challengeId) ? undefined : req.params.challengeId;

  // 입력값 검증
  if (userID === undefined) {
    return res.status(400).json({
      success: false,
      message: "유저 ID가 없거나 올바르지 않습니다."
    });
  }
  if (challengeID === undefined) {
    return res.status(400).json({
      success: false,
      message: "챌린지 ID가 없거나 올바르지 않습니다."
    });
  }

  // 서비스 호출
  const response = await challengeCRUDServices.deleteChallenge(challengeID, userID);

  // 호출 결과 반환
  return res.status(200).json(response);
}

async function hardDeleteChallengeInput(req, res) {
  // 입력값 불러오기 및 데이터 검증
  const userID = !isUUID.v4(req.auth?.userId) ? undefined : req.auth?.userId;
  const challengeID = !isUUID.v4(req.params.challengeId) ? undefined : req.params.challengeId;

  // 입력값 검증
  if (userID === undefined) {
    return res.status(400).json({
      success: false,
      message: "유저 ID가 없거나 올바르지 않습니다."
    });
  }
  if (challengeID === undefined) {
    return res.status(400).json({
      success: false,
      message: "챌린지 ID가 없거나 올바르지 않습니다."
    });
  }

  // 서비스 호출
  const response = await challengeCRUDServices.hardDeleteChallenge(challengeID, userID);

  // 호출 결과 반환
  return res.status(200).json(response);
}

export default {
  createChallengeInput,
  updateChallengeInput,
  cancelChallengeInput,
  deleteChallengeInput,
  hardDeleteChallengeInput,
};
