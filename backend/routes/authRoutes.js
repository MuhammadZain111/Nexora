import express from "express";
import {
  signup,
  login,
  logOut,
  checkAuth,
  getUser,
} from "../controllers/authController.js";
import {protectRoute} from "../middleware/protectRoute.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logOut);
router.get('/user' , getUser);

router.get("/check", protectRoute, checkAuth);

export default router;
