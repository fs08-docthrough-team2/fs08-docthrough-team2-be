import { asyncHandler } from "../../middleware/error.middleware.js";
import { 
  getFeedbackList,
  getFeedbackDetail,
  createFeedback,
  updateFeedback,
  deleteFeedback 
} from "../services/challenge.feedback.serices.js"


// 전체 리스트 컨트롤러
export const getFeedbackListController = asyncHandler( async (req, res) => {
  const { attend_id, page, size } = req.query;
  const data = await getFeedbackList({
    attend_id,
    page: Number(page) || 1,
    size: Number(size) || 10,
  });
  res.json({ success: true, data });
});

// 단일 조회 컨트롤러
export const getFeedbackDetailController = asyncHandler(async (req, res) => {
  const { feedback_id } = req.query;
  const data = await getFeedbackDetail({ feedback_id });
  res.json({ success: true, data });
});

// 생성 컨트롤러
export const createFeedbackController = asyncHandler(async (req, res) => {
  const { attend_id, content } = req.body;
  const data = await   createFeedback(req, { attend_id, content });
  res.status(201).json({ success: true, data });
});

// 수정 컨트롤러
export const updateFeedbackController = asyncHandler(async (req, res) => {
  const { feedback_id, content } = req.body;
  const data = await updateFeedback(req, { feedback_id, content });
  res.json({ success: true, data });
});

// 삭제 컨트롤러
export const deleteFeedbackController = asyncHandler(async (req, res) => {
  const { feedback_id } = req.query;
  const data = await deleteFeedback(req, { feedback_id });
  res.json({ success: true, data });
});