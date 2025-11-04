import { asyncHandler } from "../../middleware/error.middleware.js";
import { cookiesOption } from "../../middleware/auth.middleware.js";
import { 
  getUserProfileFromToken,
  updateUserProfile,
  deleteUserProfile,
} from "../services/user.service.js";

export const getMyInfoController = asyncHandler(async(req, res) => {
  const tokenPayload = req.auth;
  const result = await getUserProfileFromToken(tokenPayload);
  res.status(200).json(result);
});


export const updateUserProfileController = asyncHandler(async(req, res) => {
  const result = await updateUserProfile(req);
  res.status(200).json(result);
});

export const deleteUserProfileController = asyncHandler(async(req, res) => {
  const result = await deleteUserProfile(req);
  res.clearCookie("refreshToken", {
    ...cookiesOption,
    path: "/",
    maxAge: 0,
  });
  res.status(200).json(result);
});