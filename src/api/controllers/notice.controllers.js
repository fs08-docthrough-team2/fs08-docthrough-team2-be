// 설명: 요청 파싱(params/query/body) + 입력 검증 결과 처리하는 파일입니다.
import noticeService from '../services/notice.services.js';
import isUUID from 'is-uuid';

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
      return res.status(400).json({
        message: '페이지 또는 페이지 크기 값이 올바르지 않습니다.',
      });
    }
    if (pageNum < 1 || pageSizeNum < 1) {
      return res.status(400).json({
        message: '페이지 또는 페이지 크기 값은 1 이상이어야 합니다.',
      });
    }

    const noticeList = await noticeService.getUserNotice(userID, pageNum, pageSizeNum);

    res.status(201).json(noticeList);
  } catch (error) {
    throw error;
  }
}

export default {
  addMarkNoticeAsReadInput,
  getUserNoticeInput
};
