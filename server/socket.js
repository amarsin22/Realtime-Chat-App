const { Server } = require("socket.io");
const messageController = require("./controllers/messageController");
const User = require("./models/User");

module.exports = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "http://localhost:5173",
      credentials: true,
    },
    transports: ["websocket"],
  });

  const onlineUsers = new Map();

  io.on("connection", (socket) => {
    console.log("Socket connected:", socket.id);

    socket.on("user:online", async (userId) => {
      onlineUsers.set(userId, socket.id);
      socket.userId = userId;

      await User.findByIdAndUpdate(userId, { online: true });

      io.emit("users:online", Array.from(onlineUsers.keys()));
    });

    socket.on("join:chat", (chatId) => {
      socket.join(chatId);
    });

    socket.on("typing", ({ chatId, userId }) => {
      socket.to(chatId).emit("typing", { userId });
    });

    socket.on("stopTyping", ({ chatId, userId }) => {
      socket.to(chatId).emit("stopTyping", { userId });
    });

    socket.on("sendMessage", async (data) => {
      try {
        const savedMsg = await messageController.saveMessage(data);
        io.to(data.chatId).emit("message", savedMsg);
      } catch (err) {
        console.log("Message Save Error:", err.message);
      }
    });

    socket.on("disconnect", async () => {
      console.log("Socket disconnected:", socket.id);

      if (socket.userId) {
        onlineUsers.delete(socket.userId);

        await User.findByIdAndUpdate(socket.userId, {
          online: false,
          lastSeen: new Date(),
        });

        io.emit("users:online", Array.from(onlineUsers.keys()));
      }
    });
  });

  return io; // IMPORTANT
};
