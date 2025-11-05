import { asyncHandler } from "../../middleware/error.middleware.js";
import {
  getFeedbackList,
  getFeedbackDetail,
  createFeedback,
  updateFeedback,
  deleteFeedback
} from "../services/challenge.feedback.service.js"
import HTTP_STATUS from "../../constants/http.constant.js";
import { PAGINATION } from "../../constants/pagination.constant.js";
import { successResponse } from "../../utils/response.util.js";


// 전체 리스트 컨트롤러
export const getFeedbackListController = asyncHandler( async (req, res) => {
  const { attendId, page, size } = req.query;
  const data = await getFeedbackList({
    attendId,
    page: Number(page) || PAGINATION.DEFAULT_PAGE,
    size: Number(size) || PAGINATION.DEFAULT_PAGE_SIZE,
  });
  res.status(HTTP_STATUS.OK).json(successResponse({ data }));
});

// 단일 조회 컨트롤러
export const getFeedbackDetailController = asyncHandler(async (req, res) => {
  const { feedbackId } = req.query;
  const data = await getFeedbackDetail({ feedbackId });
  res.status(HTTP_STATUS.OK).json(successResponse({ data }));
});

// 생성 컨트롤러
export const createFeedbackController = asyncHandler(async (req, res) => {
  const { attendId, content } = req.body;
  const data = await createFeedback(req, { attendId, content });
  res.status(HTTP_STATUS.CREATED).json(successResponse({ data }));
});

// 수정 컨트롤러
export const updateFeedbackController = asyncHandler(async (req, res) => {
  const { feedbackId, content } = req.body;
  const data = await updateFeedback(req, { feedbackId, content });
  res.status(HTTP_STATUS.OK).json(successResponse({ data }));
});

// 삭제 컨트롤러
export const deleteFeedbackController = asyncHandler(async (req, res) => {
  const { feedbackId } = req.query;
  const data = await deleteFeedback(req, { feedbackId });
  res.status(HTTP_STATUS.OK).json(successResponse({ data }));
});