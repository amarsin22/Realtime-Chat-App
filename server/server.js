require("dotenv").config(); 
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const http = require("http");

const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const chatRoutes = require("./routes/chat");
const messageRoutes = require("./routes/message");

const socketHandler = require("./socket");

const app = express();
app.use(express.json());

app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true,
}));

// Connect DB
connectDB();

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/messages", messageRoutes);

// Start server
const server = http.createServer(app);

// Initialize WebSocket
socketHandler(server);

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
