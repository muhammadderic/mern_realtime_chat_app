import jwt from "jsonwebtoken";
import User from "../models/User.js";

const protectRoute = async (req, res, next) => {
  try {
    // Retrieve the JWT token from cookies
    const token = req.cookies.jwt;
    if (!token) {
      return responseHandler(res, {
        status: 401,
        success: false,
        message: "Unauthorized - No Token Provided"
      });
    }

    // Verify the token using the secret key
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
      return responseHandler(res, {
        status: 401,
        success: false,
        message: "Unauthorized - Invalid Token"
      });
    }

    // Find the user from the decoded token's userId, excluding the password field
    const user = await User.findById(decoded.userId).select("-password");
    if (!user) {
      return responseHandler(res, {
        status: 404,
        success: false,
        message: "User not found"
      });
    }

    // Attach the user object to the request for use in downstream middleware or routes
    req.user = user;
    next();

  } catch (error) {
    console.log("Error in protectRoute middleware: ", error.message);
    return responseHandler(res, {
      status: 500,
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
};

export default protectRoute;
