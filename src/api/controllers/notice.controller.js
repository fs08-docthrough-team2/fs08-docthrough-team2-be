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
  const userID = !isUUID.v4(req.auth?.userId) ? undefined : req.auth?.userId;
  const { page, pageSize } = req.query;
  const pageNum = Number(page);
  const pageSizeNum = Number(pageSize);

  if (!Number.isInteger(pageNum) || !Number.isInteger(pageSizeNum)) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json(
      errorResponse({
        code: VALIDATION_ERROR_CODE.INVALID_PAGINATION,
        message: VALIDATION_MESSAGE.INVALID_PAGINATION,
      })
    );
  }
  if (pageNum < 1 || pageSizeNum < 1) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json(
      errorResponse({
        code: VALIDATION_ERROR_CODE.INVALID_PAGE_MIN,
        message: VALIDATION_MESSAGE.INVALID_PAGE_MIN,
      })
    );
  }

  const noticeList = await noticeService.getUserNotice(userID, pageNum, pageSizeNum);

  res.status(HTTP_STATUS.OK).json(successResponse({ data: noticeList }));
});

export default {
  addMarkNoticeAsReadInput,
  getUserNoticeInput
};
