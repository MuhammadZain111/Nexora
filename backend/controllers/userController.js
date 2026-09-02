import { searchUsersService } from "../services/userService.js";

export const searchUsers = async (req, res, next) => {
  try {
    const { query } = req.query;

    if (!query || query.trim().length < 2) {
      return res.status(400).json({
        success: false,
        message: "Please enter at least 2 characters",
      });
    }

    const users = await searchUsersService(
      query.trim(),
      req.user.id
    );

    res.status(200).json({
      success: true,
      data: users,
    });
  } catch (error) {
    next(error);
  }
};