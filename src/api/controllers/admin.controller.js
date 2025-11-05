import { asyncHandler } from "../../middleware/error.middleware.js";
import{
  getAllUsers,
  getUserByEmail,
  updateUserRoleByEmail,
}
from "../services/admin.service.js";
import HTTP_STATUS from "../../constants/http.constant.js";
import { PAGINATION } from "../../constants/pagination.constant.js";

export const getAllUsersController = asyncHandler(async(req, res)=> {
  const { page = PAGINATION.DEFAULT_PAGE, limit = PAGINATION.DEFAULT_PAGE_SIZE, search = "" } = req.query;
  const result = await getAllUsers(Number(page), Number(limit), search);

  res.status(HTTP_STATUS.OK).json({
    success: true,
    ...result,
  });
});

export const getUserByEmailController = asyncHandler(async(req, res) => {
  const { email } = req.params;
  const user = await getUserByEmail(email);

  res.status(HTTP_STATUS.OK).json({
    success: true,
    user,
  });
});

export const updateUserRoleByEmailController = asyncHandler(async(req, res) => {
  const { email } = req.params;
  const { role } = req.body;

  const result = await updateUserRoleByEmail(email, role);

  res.status(HTTP_STATUS.OK).json({
    success: true,
    user:result.user,
  });
});