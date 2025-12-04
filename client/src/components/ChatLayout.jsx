import React, { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import ChatWindow from "./ChatWindow";
import API from "../services/api";
import socket from "../socket";   // ✅ FIXED IMPORT

export default function ChatLayout() {
  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);

  useEffect(() => {
    if (!user || !token) return;

    // Load users list
    (async () => {
      try {
        const { data } = await API.get("/users", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setUsers(data.filter((u) => u._id !== user.id));
      } catch (error) {
        console.error("User fetch failed:", error);
      }
    })();

    // Setup socket auth and connect only once
    socket.auth = { token };
    if (!socket.connected) socket.connect();   // 🚀 avoids reconnect loop

    socket.emit("user:online", user.id);

    socket.on("users:online", setOnlineUsers);

    return () => {
      socket.off("users:online");
      // ❌ DO NOT DISCONNECT here
      // socket.disconnect();
    };
  }, [token, user]);

  if (!user || !token) {
    return (
      <div className="flex items-center justify-center h-screen text-gray-400 dark:text-gray-500">
        Please login to continue...
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar
        users={users}
        user={user}
        onlineUsers={onlineUsers}
        selectUser={setSelectedUser}
        onLogout={() => {
          localStorage.clear();
          socket.disconnect(); // logout only
          window.location.reload();
        }}
      />

      <ChatWindow
        currentUser={user}
        selectedUser={selectedUser}
        token={token}
        onlineUsers={onlineUsers}
      />
    </div>
  );
}
