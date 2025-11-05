import { asyncHandler } from "../../middleware/error.middleware.js";
import { cookiesOption } from "../../middleware/auth.middleware.js";
import {
  getUserProfileFromToken,
  updateUserProfile,
  deleteUserProfile,
} from "../services/user.service.js";
import HTTP_STATUS from "../../constants/http.constant.js";

export const getMyInfoController = asyncHandler(async(req, res) => {
  const tokenPayload = req.auth;
  const result = await getUserProfileFromToken(tokenPayload);
  res.status(HTTP_STATUS.OK).json(result);
});


export const updateUserProfileController = asyncHandler(async(req, res) => {
  const result = await updateUserProfile(req);
  res.status(HTTP_STATUS.OK).json(result);
});

export const deleteUserProfileController = asyncHandler(async(req, res) => {
  const result = await deleteUserProfile(req);
  res.clearCookie("refreshToken", {
    ...cookiesOption,
    path: "/",
    maxAge: 0,
  });
  res.status(HTTP_STATUS.OK).json(result);
});