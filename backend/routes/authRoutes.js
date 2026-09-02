import express from "express";
import {
  signup,
  login,
  logOut,
  checkAuth,
} from "../controllers/authController.js";
import {protectRoute} from "../middleware/protectRoute.js";

const router = express.Router();

router.post("/api/auth/signup", signup);
router.post("/api/auth/login", login);
router.post("/api/auth/logout", logOut);
router.get("/check", protectRoute, checkAuth);

export default router;
