// 설명: 요청 파싱(params/query/body) + 입력 검증 결과 처리하는 파일입니다.
import challengeCRUDServices from '../services/challenge.crud.services.js';

async function createChallengeInput(req, res, next) {
  const { title, source, field, type, deadline, capacity, content, email } = req.body;

  if (!title || !source || !field || !type || !deadline || !capacity || !content || !email) {
    return res.status(400).json({ error: '챌린지 추가에 필요한 값이 입력되지 않았습니다.' });
  }

  if (typeof capacity !== 'string' || capacity <= 0) {
    return res.status(400).json({ error: '챌린지 인원은 2명 이상의 문자여야 합니다.' });
  }

  const response = await challengeCRUDServices.createChallenge(
    title, source, field, type, deadline, capacity, content, email, res, next
  );

  return res.status(201).json(response);
}

async function updateChallengeInput(req, res, next) {
  const response = await challengeCRUDServices.updateChallenge(req, res, next);
  return res.status(200).json(response);
}

async function cancelChallengeInput(req, res, next) {
  const response = await challengeCRUDServices.cancelChallenge(req, res, next);
  return res.status(200).json(response);
}

async function deleteChallengeInput(req, res, next) {
  const response = await challengeCRUDServices.deleteChallenge(req, res, next);
  return res.status(200).json(response);
}

async function hardDeleteChallengeInput(req, res, next) {
  const response = await challengeCRUDServices.hardDeleteChallenge(req, res, next);
  return res.status(200).json(response);
}

export default {
  createChallengeInput,
  updateChallengeInput,
  cancelChallengeInput,
  deleteChallengeInput,
  hardDeleteChallengeInput,
};
