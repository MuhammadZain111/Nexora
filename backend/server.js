import express from "express";
import http from "http";
import cookieParser from "cookie-parser";
import cors from "cors";
import { Server } from "socket.io";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import Message from "./models/Messagemodel.js";
import authRoutes from "./routes/authRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
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

/* =====================  Routes   ======================= */

app.use("/api/auth", authRoutes);

app.use("/api/chat", chatRoutes);

app.use("/api/users", userRoutes);

/* ===============Error Handling Middleware ===================== */

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
  const userId = socket.handshake.query.userId;

  if (!userId) {
    console.log("⚠️ No userId provided");
    socket.disconnect(true);
    return;
  }

  socket.userId = userId;

  userSocketMap.set(userId, socket.id);

  console.log(`✅ User ${userId} connected`);

  io.emit("online_users", getOnlineUserIds());

  /* ========================= Send Message  ===========  */

  socket.on("send_message", async (payload) => {
    try {
      const { senderId, receiverId, text, tempId } = payload;

      if (!senderId || !receiverId || !text?.trim()) {
        console.log("⚠️ Invalid message:", payload);
        return;
      }

      const savedMessage = await Message.create({
        senderId,
        receiverId,
        text,
      });

      const messageToSend = {
        _id: savedMessage._id,
        senderId,
        receiverId,
        text,
        createdAt: savedMessage.createdAt,
        status: "sent",
      };

      /* Send to receiver */

      const recipientSocketId = userSocketMap.get(receiverId);

      if (recipientSocketId) {
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

    userSocketMap.delete(userId);

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
