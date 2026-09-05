import jwt from "jsonwebtoken";

const generateTokenAndSetCookie = (userId, res) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "15d",
  });

  res.cookie("jwt", token, {
    maxAge: 15 * 24 * 60 * 60 * 1000, // 15 days in ms
    httpOnly: true, // JS can't access this cookie — XSS protection
    sameSite: "lax", // CSRF protection
    secure: process.env.NODE_ENV === "production", // HTTPS only in prod
  });

  return token;
};

export default generateTokenAndSetCookie;
