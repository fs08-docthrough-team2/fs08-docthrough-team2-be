// 설명: 요청 파싱(params/query/body) + 입력 검증 결과 처리하는 파일입니다.
import challengeCRUDServices from '../services/challenge.crud.service.js';
import isUUID from 'is-uuid';
import HTTP_STATUS from '../../constants/http.constant.js';
import { VALIDATION_MESSAGE } from '../../constants/message.constant.js';
import { errorResponse } from '../../utils/response.util.js';
import { VALIDATION_ERROR_CODE } from '../../constants/error-code.constant.js';

/**
 * 챌린지 생성 (Zod 검증 완료 후 호출)
 * SQL 인젝션, XSS 방지 완료
 */
async function createChallengeInput(req, res) {
  // Zod 미들웨어에서 이미 검증 완료
  const { title, source, field, type, deadline, capacity, content } = req.body;
  const userID = req.auth?.userId;

  // 사용자 ID 검증 (인증 미들웨어에서 제공)
  if (!userID || !isUUID.v4(userID)) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json(
      errorResponse({
        code: VALIDATION_ERROR_CODE.INVALID_FIELD,
        message: VALIDATION_MESSAGE.INVALID_ID,
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

/**
 * 챌린지 수정 (Zod 검증 완료 후 호출)
 */
async function updateChallengeInput(req, res) {
  // Zod 미들웨어에서 params 검증 완료
  const userID = req.auth?.userId;

  // 사용자 ID 검증
  if (!userID || !isUUID.v4(userID)) {
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

/**
 * 챌린지 취소 (Zod 검증 완료 후 호출)
 */
async function cancelChallengeInput(req, res) {
  // Zod 미들웨어에서 challengeId 검증 완료
  const userID = req.auth?.userId;
  const challengeID = req.params.challengeId;

  // 사용자 ID 검증
  if (!userID || !isUUID.v4(userID)) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json(
      errorResponse({
        code: VALIDATION_ERROR_CODE.INVALID_FIELD,
        message: VALIDATION_MESSAGE.INVALID_ID,
      })
    );
  }

  // 서비스 호출
  const response = await challengeCRUDServices.cancelChallenge(challengeID, userID);

  // 호출 결과 반환
  return res.status(HTTP_STATUS.OK).json(response);
}

/**
 * 챌린지 삭제 (Zod 검증 완료 후 호출)
 */
async function deleteChallengeInput(req, res) {
  // Zod 미들웨어에서 challengeId 검증 완료
  const userID = req.auth?.userId;
  const challengeID = req.params.challengeId;

  // 사용자 ID 검증
  if (!userID || !isUUID.v4(userID)) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json(
      errorResponse({
        code: VALIDATION_ERROR_CODE.INVALID_FIELD,
        message: VALIDATION_MESSAGE.INVALID_ID,
      })
    );
  }

  // 서비스 호출
  const response = await challengeCRUDServices.deleteChallenge(challengeID, userID);

  // 호출 결과 반환
  return res.status(HTTP_STATUS.OK).json(response);
}

/**
 * 챌린지 완전 삭제 (Zod 검증 완료 후 호출)
 */
async function hardDeleteChallengeInput(req, res) {
  // Zod 미들웨어에서 challengeId 검증 완료
  const userID = req.auth?.userId;
  const challengeID = req.params.challengeId;

  // 사용자 ID 검증
  if (!userID || !isUUID.v4(userID)) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json(
      errorResponse({
        code: VALIDATION_ERROR_CODE.INVALID_FIELD,
        message: VALIDATION_MESSAGE.INVALID_ID,
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
