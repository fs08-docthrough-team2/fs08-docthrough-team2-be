import { asyncHandler } from "../../middleware/error.middleware.js";
import { getUserProfileFromToken } from "../services/user.service.js";

export const getMyInfoController = asyncHandler(async(req, res) => {
  const tokenPayload = req.auth;
  const result = await getUserProfileFromToken(tokenPayload);
  res.status(200).json(result);
});
