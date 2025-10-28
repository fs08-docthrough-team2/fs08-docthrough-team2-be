import { asyncHandler } from "../../common/error.js";
import{ 
  getAllUsers,
  getUserByEmail,
  updateUserRoleByEmail,
}
from "../services/admin.service.js";

export const getAllUsersController = asyncHandler(async(req, res)=> {
  const { page = 1, limit = 10, search = "" } = req.query;
  const result = await getAllUsers(Number(page), Number(limit), search);;

  res.status(200).json({
    success: true,
    ...result,
  });
});

export const getUserByEmailController = asyncHandler(async(req, res) => {
  const { email } = req.params;
  const user = await getUserByEmail(email);

  res.status(200).json({
    success: true,
    user,
  });
});

export const updateUserRoleByEmailController = asyncHandler(async(req, res) => {
  const { email } = req.params;
  const { role } = req.body;

  const result = await updateUserRoleByEmail(email, role);

  res.status(200).json({
    success: true,
    user:result.user,
  });
});