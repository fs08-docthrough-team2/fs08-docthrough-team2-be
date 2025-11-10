// 설명: 요청 파싱(params/query/body) + 입력 검증 결과 처리하는 파일입니다.
import { asyncHandler } from '../../middleware/error.middleware.js';
import noticeService from '../services/notice.service.js';
import isUUID from 'is-uuid';
import HTTP_STATUS from '../../constants/http.constant.js';
import { VALIDATION_MESSAGE } from '../../constants/message.constant.js';
import { successResponse, errorResponse } from '../../utils/response.util.js';
import { VALIDATION_ERROR_CODE } from '../../constants/error-code.constant.js';

const addMarkNoticeAsReadInput = asyncHandler(async (req, res) => {
  const noticeID = req.params.noticeId;

  // 입력값 검증
  if (!noticeID || !isUUID.v4(noticeID)) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json(
      errorResponse({
        code: VALIDATION_ERROR_CODE.INVALID_FIELD,
        message: VALIDATION_MESSAGE.INVALID_ID,
      })
    );
  }

  // 서비스 호출
  await noticeService.addMarkNoticeAsRead(noticeID);

  // 성공 응답
  res.status(HTTP_STATUS.OK).json(
    successResponse({
      data: null,
      message: '알림이 읽음 상태로 업데이트되었습니다.',
    })
  );
});

const getUserNoticeInput = asyncHandler(async (req, res) => {
  const userID = req.auth?.userId;

  // userID 검증 추가
  if (!userID) {
    return res.status(HTTP_STATUS.UNAUTHORIZED).json(
      errorResponse({
        code: 'UNAUTHORIZED',
        message: '인증되지 않은 사용자입니다.',
      })
    );
  }

  const noticeList = await noticeService.getUserNotice(userID);

  // service에서 이미 success를 반환하므로 직접 반환
  res.status(HTTP_STATUS.OK).json(noticeList);
});

export default {
  addMarkNoticeAsReadInput,
  getUserNoticeInput
};
