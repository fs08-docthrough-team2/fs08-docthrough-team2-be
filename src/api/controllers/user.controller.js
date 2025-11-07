import { asyncHandler } from "../../middleware/error.middleware.js";
import { cookiesOption } from "../../middleware/auth.middleware.js";
import {
  getUserProfileFromToken,
  updateUserProfile,
  deleteUserProfile,
} from "../services/user.service.js";
import HTTP_STATUS from "../../constants/http.constant.js";
import { successResponse } from "../../utils/response.util.js";

export const getMyInfoController = asyncHandler(async(req, res) => {
  const tokenPayload = req.auth;
  const result = await getUserProfileFromToken(tokenPayload);
  res.status(HTTP_STATUS.OK).json(
    successResponse({
      data: result,
    })
  );
});


export const updateUserProfileController = asyncHandler(async(req, res) => {
  const result = await updateUserProfile(req);
  res.status(HTTP_STATUS.OK).json(
    successResponse({
      data: result.user,
      message: result.message,
    })
  );
});

export const deleteUserProfileController = asyncHandler(async(req, res) => {
  const result = await deleteUserProfile(req);
  res.clearCookie("refreshToken", {
    ...cookiesOption,
    maxAge: 0,
  });
  res.status(HTTP_STATUS.OK).json(
    successResponse({
      data: null,
      message: result.message,
    })
  );
});