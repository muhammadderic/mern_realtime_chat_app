import { User } from "../models/User.js";

export const getUsersForSidebar = async (req, res) => {
  try {
    // Get the ID of the currently logged-in user from the request
    const loggedInUserId = req.user._id;

    // Find all users except the logged-in user
    const filteredUsers = await User.find({ _id: { $ne: loggedInUserId } }).select("-password");

    return responseHandler(res, {
      status: 200,
      success: true,
      message: "Users fetched successfully",
      data: filteredUsers
    });
  } catch (error) {
    console.error("Error in getUsersForSidebar: ", error.message);
    return responseHandler(res, {
      status: 500,
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
};
