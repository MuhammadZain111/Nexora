import express from "express";

import {
  getConversations,
  getConversationById,
  createConversation,
  deleteConversation,
} from "../controllers/chatController.js";

import { protectRoute } from "../middleware/protectRoute.js";

const router = express.Router();

/*
 * All chat routes require authentication
 */
router.use(protectRoute);

/*
 * Conversations
 */

// Get all conversations of logged-in user
router.get("/conversations", getConversations);

// Get a specific conversation
router.get("/conversations/:conversationId", getConversationById);

// Create a new conversation
router.post("/conversations", createConversation);

// Delete a conversation
router.delete("/conversations/:conversationId", deleteConversation);








export default router;