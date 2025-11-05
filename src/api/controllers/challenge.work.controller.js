import { asyncHandler } from "../../middleware/error.middleware.js";
import {
  getWorkList,
  getWorkDetail,
  getSaveList,
  getSaveDetail,
  createWork,
  createSaveWork,
  updateWork,
  deleteWork,
  toggleLike,
}
from "../services/challenge.work.service.js";
import HTTP_STATUS from "../../constants/http.constant.js";
import { PAGINATION } from "../../constants/pagination.constant.js";
import { VALIDATION_MESSAGE } from "../../constants/message.constant.js";
import { successResponse, errorResponse } from "../../utils/response.util.js";
import { VALIDATION_ERROR_CODE } from "../../constants/error-code.constant.js";

// 작업물 리스트 조회
export const getWorkListController = asyncHandler(async (req, res) =>{
  const { challenge_id, page, size } = req.query;
  const data = await getWorkList({
    challenge_id,
    page: Number(page) || PAGINATION.DEFAULT_PAGE,
    size: Number(size) || PAGINATION.DEFAULT_PAGE_SIZE,
  });
  res.status(HTTP_STATUS.OK).json(successResponse({ data }));
});


// 임지 저장 리스트 조회
export const getSaveListController = asyncHandler(async (req, res) => {
  const { page, size } = req.query;
    const data = await getSaveList(req, {
    page: Number(page) || PAGINATION.DEFAULT_PAGE,
    size: Number(size) || PAGINATION.DEFAULT_PAGE_SIZE,
  });
  res.status(HTTP_STATUS.OK).json(successResponse({ data }));
});

// 작업물 상세 조회
export const getWorkDetailController = asyncHandler(async (req, res) => {
  const { attend_id }  = req.params;
  const data = await getWorkDetail(attend_id);
  res.status(HTTP_STATUS.OK).json(successResponse({ data }));
});

// 임시 저장 상세 조회
export const getSaveDetailController = asyncHandler(async (req, res) => {
  const { attend_id } = req.params;
  const data = await getSaveDetail(req, attend_id);
  res.status(HTTP_STATUS.OK).json(successResponse({ data }));
});

// 생성
export const createWorkController = asyncHandler(async (req, res) => {
  let { challengeId, title, workItem } = req.body;

  if (!challengeId) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json(
      errorResponse({
        code: VALIDATION_ERROR_CODE.REQUIRED_CHALLENGE_ID,
        message: VALIDATION_MESSAGE.REQUIRED_CHALLENGE_ID,
      })
    );
  }

  if (!title) {
    title = "";
  }

  if (!workItem) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json(
      errorResponse({
        code: VALIDATION_ERROR_CODE.REQUIRED_WORK_ITEM,
        message: VALIDATION_MESSAGE.REQUIRED_WORK_ITEM,
      })
    );
  }

  const data = await createWork(req, challengeId, title, workItem);
  res.status(HTTP_STATUS.OK).json(successResponse({ data }));
});


// 임시 저장 생성
export const createSaveWorkController = asyncHandler(async (req, res) => {
  let { challengeId, title, workItem } = req.body;

  if (!challengeId) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json(
      errorResponse({
        code: VALIDATION_ERROR_CODE.REQUIRED_CHALLENGE_ID,
        message: VALIDATION_MESSAGE.REQUIRED_CHALLENGE_ID,
      })
    );
  }

  if (!title) {
    title = "";
  }

  if (!workItem) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json(
      errorResponse({
        code: VALIDATION_ERROR_CODE.REQUIRED_WORK_ITEM,
        message: VALIDATION_MESSAGE.REQUIRED_WORK_ITEM,
      })
    );
  }

  const data = await createSaveWork(req, challengeId, title, workItem);
  res.status(HTTP_STATUS.OK).json(successResponse({ data }));
});


// 수정
export const updateWorkController = asyncHandler(async (req, res) => {
  const { attend_id } = req.params;
  const { title, workItem } = req.body;
  const data = await updateWork(req, attend_id, { title, workItem });
  res.status(HTTP_STATUS.OK).json(successResponse({ data }));
});


// 삭제
export const deleteWorkController = asyncHandler(async (req, res) => {
  const { attend_id } = req.params;
  const data = await deleteWork(req, attend_id);
  res.status(HTTP_STATUS.OK).json({ success: true, data});
});

//종아요 토글
export const toggleLikeController = asyncHandler(async (req, res) => {
  const { attend_id } = req.params;
  const data = await toggleLike(req, attend_id);
  res.status(HTTP_STATUS.OK).json(successResponse({ data }));
});

