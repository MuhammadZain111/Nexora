import express from "express";
import { searchUsers } from "../controllers/userController.js";
import { protectRoute } from "../middleware/protectRoute.js";

const router = express.Router();

router.use(protectRoute);


router.post("/search-contact", searchUsers);


export default router;