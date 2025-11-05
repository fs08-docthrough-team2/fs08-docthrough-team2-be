import { asyncHandler } from "../../middleware/error.middleware.js";
import { 
  getFeedbackList,
  getFeedbackDetail,
  createFeedback,
  updateFeedback,
  deleteFeedback 
} from "../services/challenge.feedback.service.js"


// 전체 리스트 컨트롤러
export const getFeedbackListController = asyncHandler( async (req, res) => {
  const { attendId, page, size } = req.query;
  const data = await getFeedbackList({
    attendId,
    page: Number(page) || 1,
    size: Number(size) || 10,
  });
  res.json({ success: true, data });
});

// 단일 조회 컨트롤러
export const getFeedbackDetailController = asyncHandler(async (req, res) => {
  const { feedbackId } = req.query;
  const data = await getFeedbackDetail({ feedbackId });
  res.json({ success: true, data });
});

// 생성 컨트롤러
export const createFeedbackController = asyncHandler(async (req, res) => {
  const { attendId, content } = req.body;
  const data = await   createFeedback(req, { attendId, content });
  res.status(201).json({ success: true, data });
});

// 수정 컨트롤러
export const updateFeedbackController = asyncHandler(async (req, res) => {
  const { feedbackId, content } = req.body;
  const data = await updateFeedback(req, { feedbackId, content });
  res.json({ success: true, data });
});

// 삭제 컨트롤러
export const deleteFeedbackController = asyncHandler(async (req, res) => {
  const { feedbackId } = req.query;
  const data = await deleteFeedback(req, { feedbackId });
  res.json({ success: true, data });
});