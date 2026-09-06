import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import http from "http";
import { Server } from "socket.io";
import connectDB from "./config/db.js";
import Conversation from "./models/conversationmodel.js";
import Message from "./models/Messagemodel.js";
import User from "./models/UserModel.js";
import authRoutes from "./routes/authRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";
import userRoutes from "./routes/userRoutes.js";

dotenv.config();

const app = express();

/* ================== Express Middleware ===================== */

app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);

/* =====================  Routes  ====================*/

app.use("/api/auth", authRoutes);

app.use("/api/chat", chatRoutes);

app.use("/api/users", userRoutes);
app.use("/api/messages", messageRoutes);

/* ==========Error Handling Middleware ============== */

/*  HTTP Server- */


const httpServer = http.createServer(app);

/* -- Socket.IO ------*/

const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

/* ----  Online Users --- */

const userSocketMap = new Map();

function getOnlineUserIds() {
  return Array.from(userSocketMap.keys());
}

/* --Socket Connection ---  */

io.on("connection", (socket) => {
  const userId = String(socket.handshake.query.userId || "");

  if (!userId) {
    console.log("⚠️ No userId provided");
    socket.disconnect(true);
    return;
  }

  socket.userId = userId;

  const sockets = userSocketMap.get(userId) || new Set();
  sockets.add(socket.id);
  userSocketMap.set(userId, sockets);

  console.log(`✅ User ${userId} connected`);

  io.emit("online_users", getOnlineUserIds());

  /* ========================= Send Message  ===========  */

  socket.on("send_message", async (payload) => {
    try {
      const { senderId, receiverId, text, tempId } = payload;
      const normalizedSenderId = String(senderId || "");
      const normalizedReceiverId = String(receiverId || "");

      if (
        normalizedSenderId !== userId ||
        !normalizedReceiverId ||
        !text?.trim()
      ) {
        console.log("⚠️ Invalid message:", payload);
        socket.emit("message_error", { tempId, error: "Invalid message" });
        return;
      }

      let conversation = await Conversation.findOne({
        participants: {
          $all: [normalizedSenderId, normalizedReceiverId],
          $size: 2,
        },
      });

      if (!conversation) {
        conversation = await Conversation.create({
          participants: [normalizedSenderId, normalizedReceiverId],
        });
      }

      const savedMessage = await Message.create({
        senderId: normalizedSenderId,
        receiverId: normalizedReceiverId,
        text,
        conversationId: conversation._id,
      });

      const sender = await User.findById(normalizedSenderId)
        .select("name email profilePic")
        .lean();

      conversation.messages.push(savedMessage._id);
      conversation.lastMessage = savedMessage._id;
      await conversation.save();

      const messageToSend = {
        _id: savedMessage._id,
        senderId: normalizedSenderId,
        receiverId: normalizedReceiverId,
        text,
        createdAt: savedMessage.createdAt,
        status: "sent",
        sender: sender
          ? {
              _id: sender._id,
              name: sender.name,
              email: sender.email,
              profilePic: sender.profilePic,
            }
          : null,
      };

      /* Send to receiver */

      const recipientSocketIds = userSocketMap.get(normalizedReceiverId) || [];

      for (const recipientSocketId of recipientSocketIds) {
        io.to(recipientSocketId).emit("receive_message", messageToSend);
      }

      /* Acknowledge sender */

      socket.emit("message_ack", {
        tempId,
        savedMessage: messageToSend,
      });
    } catch (error) {
      console.error("❌ Message error:", error);

      socket.emit("message_error", {
        tempId: payload?.tempId,
        error: "Failed to send message",
      });
    }
  });

  /* ========================= Disconnect ======================= */

  socket.on("disconnect", () => {
    console.log(`❌ User ${userId} disconnected`);

    const sockets = userSocketMap.get(userId);
    if (sockets) {
      sockets.delete(socket.id);
      if (sockets.size === 0) userSocketMap.delete(userId);
    }

    io.emit("online_users", getOnlineUserIds());
  });
});

/* ====================  Start Server   ======================= */

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();

    httpServer.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("❌ Failed to connect to database:", error);

    process.exit(1);
  }
};

startServer();

/* =========================
   Graceful Shutdown
========================= */

process.on("SIGTERM", () => {
  console.log("SIGTERM received");

  httpServer.close(() => {
    console.log("HTTP server closed");
    process.exit(0);
  });
});
