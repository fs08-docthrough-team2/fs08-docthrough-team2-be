// 설명: 요청 파싱(params/query/body) + 입력 검증 결과 처리하는 파일입니다.
import noticeService from '../services/notice.service.js';
import isUUID from 'is-uuid';
import HTTP_STATUS from '../../constants/http.constant.js';
import { VALIDATION_MESSAGE } from '../../constants/message.constant.js';

async function addMarkNoticeAsReadInput(req, res) {
  try{
    const noticeID = req.params.noticeId;
    await noticeService.addMarkNoticeAsRead(noticeID, res);
  } catch (error) {
    throw error;
  }
}

async function getUserNoticeInput(req, res) {
  try {
    const userID = !isUUID.v4(req.auth?.userId) ? undefined : req.auth?.userId;
    const { page, pageSize } = req.query;
    const pageNum = Number(page);
    const pageSizeNum = Number(pageSize);

    if (!Number.isInteger(pageNum) || !Number.isInteger(pageSizeNum)) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        message: VALIDATION_MESSAGE.INVALID_PAGINATION,
      });
    }
    if (pageNum < 1 || pageSizeNum < 1) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        message: VALIDATION_MESSAGE.INVALID_PAGE_MIN,
      });
    }

    const noticeList = await noticeService.getUserNotice(userID, pageNum, pageSizeNum);

    res.status(HTTP_STATUS.CREATED).json(noticeList);
  } catch (error) {
    throw error;
  }
}

export default {
  addMarkNoticeAsReadInput,
  getUserNoticeInput
};
