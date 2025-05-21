import bcryptjs from "bcryptjs";
import { User } from "../models/User.js";
import { responseHandler } from "../helpers/responseHandler.js";
import { generateTokenAndSetCookie } from "../helpers/generateTokenAndSetCookie.js";
import { sanitizeUser } from "../helpers/sanitizeUser.js";

export const signup = async (req, res) => {
  try {
    const { fullName, username, password, confirmPassword, gender } = req.body;

    // Validate that all required fields are provided
    if (!fullName || !username || !password || !confirmPassword || !gender) {
      return responseHandler(res, {
        status: 400,
        success: false,
        message: "All fields are required"
      });
    }

    // Check if password and confirmPassword match
    if (password !== confirmPassword) {
      return responseHandler(res, {
        status: 400,
        success: false,
        message: "Passwords don't match"
      });
    }

    // Check if a user with the given username already exists
    const userAlreadyExists = await User.findOne({ username });
    if (userAlreadyExists) {
      return responseHandler(res, {
        status: 400,
        success: false,
        message: "Username already exists",
      });
    }

    // Hash the password
    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);

    // Generate avatar based on gender
    // https://avatar-placeholder.iran.liara.run/
    const boyProfilePic = `https://avatar.iran.liara.run/public/boy?username=${username}`;
    const girlProfilePic = `https://avatar.iran.liara.run/public/girl?username=${username}`;

    const newUser = new User({
      fullName,
      username,
      password: hashedPassword,
      gender,
      profilePic: gender === "male" ? boyProfilePic : girlProfilePic,
    });

    if (newUser) {
      // Generate a JWT token and set it as a cookie in the response
      generateTokenAndSetCookie(res, newUser._id);
      await newUser.save();

      return responseHandler(res, {
        status: 201,
        success: true,
        message: "User created successfully",
        data: sanitizeUser(newUser),
      });
    } else {
      return responseHandler(res, {
        status: 400,
        success: false,
        error: "Invalid user data",
      });
    }
  } catch (error) {
    return responseHandler(res, {
      status: 500,
      success: false,
      message: "An error occurred while creating your account",
      error: error.message,
    });
  }
};