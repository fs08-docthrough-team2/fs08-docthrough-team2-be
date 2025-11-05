// 설명: 요청 파싱(params/query/body) + 입력 검증 결과 처리하는 파일입니다.
import challengeCRUDServices from '../services/challenge.crud.service.js';
import isUUID from 'is-uuid';
import HTTP_STATUS from '../../constants/http.constant.js';
import { VALIDATION_MESSAGE, CHALLENGE_MESSAGE } from '../../constants/message.constant.js';
import { errorResponse } from '../../utils/response.util.js';
import { VALIDATION_ERROR_CODE, CHALLENGE_ERROR_CODE } from '../../constants/error-code.constant.js';

async function createChallengeInput(req, res) {
  // 입력값 불러오기
  const { title, source, field, type, deadline, capacity, content } = req.body;
  const userID = !isUUID.v4(req.auth?.userId) ? undefined : req.auth?.userId;

  // 입력값 검증
  if (!userID) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json(
      errorResponse({
        code: VALIDATION_ERROR_CODE.INVALID_FIELD,
        message: VALIDATION_MESSAGE.INVALID_ID,
      })
    );
  }
  if (!title || !source || !field || !type || !deadline || !capacity || !content) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json(
      errorResponse({
        code: CHALLENGE_ERROR_CODE.REQUIRED_FIELDS_MISSING,
        message: CHALLENGE_MESSAGE.REQUIRED_FIELDS_MISSING,
      })
    );
  }
  if (typeof capacity !== 'string' || capacity <= 0) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json(
      errorResponse({
        code: CHALLENGE_ERROR_CODE.INVALID_CAPACITY,
        message: CHALLENGE_MESSAGE.INVALID_CAPACITY,
      })
    );
  }

  // 서비스 호출
  const response = await challengeCRUDServices.createChallenge(
    title, source, field, type, deadline, capacity, content, userID
  );

  // 호출 결과 반환
  return res.status(HTTP_STATUS.CREATED).json(response);
}

async function updateChallengeInput(req, res) {
  // 입력값 불러오기 및 데이터 검증
  const userID = !isUUID.v4(req.auth?.userId) ? undefined : req.auth?.userId;

  // 입력값 검증
  if (!userID) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json(
      errorResponse({
        code: VALIDATION_ERROR_CODE.INVALID_FIELD,
        message: VALIDATION_MESSAGE.INVALID_ID,
      })
    );
  }

  // 서비스 호출
  const response = await challengeCRUDServices.updateChallenge(req, userID);

  // 호출 결과 반환
  return res.status(HTTP_STATUS.OK).json(response);
}

async function cancelChallengeInput(req, res) {
  // 입력값 불러오기 및 데이터 검증
  const userID = !isUUID.v4(req.auth?.userId) ? undefined : req.auth?.userId;
  const challengeID = !isUUID.v4(req.params.challengeId) ? undefined : req.params.challengeId;

  // 입력값 검증
  if (!userID) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json(
      errorResponse({
        code: VALIDATION_ERROR_CODE.INVALID_FIELD,
        message: VALIDATION_MESSAGE.INVALID_ID,
      })
    );
  }
  if (!challengeID) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json(
      errorResponse({
        code: VALIDATION_ERROR_CODE.INVALID_CHALLENGE_ID,
        message: VALIDATION_MESSAGE.INVALID_CHALLENGE_ID,
      })
    );
  }

  // 서비스 호출
  const response = await challengeCRUDServices.cancelChallenge(challengeID, userID);

  // 호출 결과 반환
  return res.status(HTTP_STATUS.OK).json(response);
}

async function deleteChallengeInput(req, res) {
  // 입력값 불러오기 및 데이터 검증
  const userID = !isUUID.v4(req.auth?.userId) ? undefined : req.auth?.userId;
  const challengeID = !isUUID.v4(req.params.challengeId) ? undefined : req.params.challengeId;

  // 입력값 검증
  if (!userID) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json(
      errorResponse({
        code: VALIDATION_ERROR_CODE.INVALID_FIELD,
        message: VALIDATION_MESSAGE.INVALID_ID,
      })
    );
  }
  if (!challengeID) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json(
      errorResponse({
        code: VALIDATION_ERROR_CODE.INVALID_CHALLENGE_ID,
        message: VALIDATION_MESSAGE.INVALID_CHALLENGE_ID,
      })
    );
  }

  // 서비스 호출
  const response = await challengeCRUDServices.deleteChallenge(challengeID, userID);

  // 호출 결과 반환
  return res.status(HTTP_STATUS.OK).json(response);
}

async function hardDeleteChallengeInput(req, res) {
  // 입력값 불러오기 및 데이터 검증
  const userID = !isUUID.v4(req.auth?.userId) ? undefined : req.auth?.userId;
  const challengeID = !isUUID.v4(req.params.challengeId) ? undefined : req.params.challengeId;

  // 입력값 검증
  if (!userID) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json(
      errorResponse({
        code: VALIDATION_ERROR_CODE.INVALID_FIELD,
        message: VALIDATION_MESSAGE.INVALID_ID,
      })
    );
  }
  if (!challengeID) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json(
      errorResponse({
        code: VALIDATION_ERROR_CODE.INVALID_CHALLENGE_ID,
        message: VALIDATION_MESSAGE.INVALID_CHALLENGE_ID,
      })
    );
  }

  // 서비스 호출
  const response = await challengeCRUDServices.hardDeleteChallenge(challengeID, userID);

  // 호출 결과 반환
  return res.status(HTTP_STATUS.OK).json(response);
}

export default {
  createChallengeInput,
  updateChallengeInput,
  cancelChallengeInput,
  deleteChallengeInput,
  hardDeleteChallengeInput,
};
