import { asyncHandler } from "../../common/error.js";
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
from "../services/challenge.work.services.js";

// 작업물 리스트 조회
export const getWorkListController = asyncHandler(async (req, res) =>{
  const { challenge_id, page, size } = req.query;
  const data = await getWorkList({
    challenge_id,
    page: Number(page) || 1,
    size: Number(size) || 10,
  });
  res.json({ success: true, data });
});


// 임지 저장 리스트 조회
export const getSaveListController = asyncHandler(async (req, res) => {
  const { page, size } = req.query;
    const data = await getSaveList(req, {
    page: Number(page) || 1,
    size: Number(size) || 5,
  });
  res.json({ success: true, data });
});

// 작업물 상세 조회
export const getWorkDetailController = asyncHandler(async (req, res) => {
  const { attend_id }  = req.params;
  const data = await getWorkDetail(attend_id);
  res.json( { success: true, data });
});

// 임시 저장 상세 조회
export const getSaveDetailController = asyncHandler(async (req, res) => {
  const { attend_id } = req.params;
  const data = await getSaveDetail(req, attend_id);
  res.json( { success: true, data });
});

// 생성
export const createWorkController = asyncHandler(async (req, res) => {
  let { challengeId, title, workItem } = req.body;

  if (!challengeId) {
    res.status(400);
    throw new Error("challenge_id는 필수입니다.");
  }

  if (!title) {
    title = "";
  }

  if (!workItem) {
    res.status(400);
    throw new Error("workItem은 필수입니다.");
  }

  const data = await createWork(req, challengeId, title, workItem);
  res.json( { success: true, data });
});


// 임시 저장 생성
export const createSaveWorkController = asyncHandler(async (req, res) => {
  let { challengeId, title, workItem } = req.body;

  if (!challengeId) {
    res.status(400);
    throw new Error("challenge_id는 필수입니다.");
  }

  if (!title) {
    title = "";
  }

  if (!workItem) {
    res.status(400);
    throw new Error("workItem은 필수입니다.");
  }

  const data = await createSaveWork(req, challengeId, title, workItem);
  res.json( { success: true, data });
});


// 수정 
export const updateWorkController = asyncHandler(async (req, res) => {
  const { attend_id } = req.params;
  const { title, workItem } = req.body;
  const data = await updateWork(req, attend_id, { title, workItem });
  res.json({ success: true, data });
});


// 삭제
export const deleteWorkController = asyncHandler(async (req, res) => {
  const { attend_id } = req.params;
  const data = await deleteWork(req, attend_id);
  res.json({ success: true, data});
});

//종아요 토글
export const toggleLikeController = asyncHandler(async (req, res) => {
  const { attend_id } = req.params;
  const data = await toggleLike(req, attend_id);
  res.json({ success: true, data });
});

