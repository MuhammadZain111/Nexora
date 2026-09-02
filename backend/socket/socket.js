const { Server } = require("socket.io");

const io = new Server(3001, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// Declared ONCE, outside the connection handler, so it persists across connections
const userSocketMap = new Map();

io.on("connection", (socket) => {
  console.log("✅ User connected:", socket.id);

  const userId = socket.handshake.query.userId;

  if (userId) {
    userSocketMap.set(userId, socket.id);
    socket.userId = userId; // stash it on the socket for easy cleanup later
    console.log(`User ${userId} connected with socket ID: ${socket.id}`);
  } else {
    console.log("No userId provided in the handshake query.");
  }

  socket.on("send_message", (message) => {
    console.log("Message:", message);

    // Send only to the intended recipient, not everyone
    const recipientSocketId = userSocketMap.get(message.receiverId);
    if (recipientSocketId) {
      io.to(recipientSocketId).emit("receive_message", message);
    }

    // Optional: also echo back to sender so their own UI updates
    socket.emit("receive_message", message);
  });

  socket.on("disconnect", () => {
    console.log("❌ User disconnected:", socket.id);
    if (socket.userId) {
      userSocketMap.delete(socket.userId);
      console.log("User removed:", socket.userId);
    }
  });
});

// Manually force-disconnect a specific user (e.g. on ban/logout from an API route)
const disconnectUser = (userId) => {
  const socketId = userSocketMap.get(userId);
  if (socketId) {
    const socket = io.sockets.sockets.get(socketId);
    if (socket) {
      socket.disconnect(true);
      console.log(`User ${userId} disconnected.`);
    }
    userSocketMap.delete(userId);
  } else {
    console.log(`No active socket found for user ${userId}.`);
  }
};

console.log("🚀 Socket.IO server running on port 3001");

module.exports = { io, userSocketMap, disconnectUser };
