import jwt from "jsonwebtoken";
import User from "../models/UserModel.js";



export const protectRoute = async (req, res, next) => {
  const token = req.cookies.jwt;

  if (!token) {
    return res.status(401).json({ message: "Unauthorized - No token provided" });
  }

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    console.log("JWT verification failed:", error.message);
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Unauthorized - Token expired" });
    }
    return res.status(401).json({ message: "Unauthorized - Invalid token" });
  }

  try {
    const user = await User.findById(decoded.userId).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    req.user = user;
    next();
  } catch (error) {
    console.error("Database error in protectRoute:", error.message);
    return res.status(503).json({ message: "Service temporarily unavailable" });
  }
};