import express from "express";
import {
  getUsersForSidebar,
  searchUsers,
} from "../controllers/userController.js";
import { protectRoute } from "../middleware/protectRoute.js";

const router = express.Router();

router.use(protectRoute);

router.get("/contacts", getUsersForSidebar);

router.post("/search-contact", searchUsers);

export default router;
