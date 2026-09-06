import express from "express";
import { getMessages } from "../controllers/messageController.js";
import { protectRoute } from "../middleware/protectRoute.js";

const router = express.Router();

router.use(protectRoute);
router.get("/:id", getMessages);

export default router;