// src/components/ChatWindow.jsx
import React, { useEffect, useState, useRef } from "react";
import MessageInput from "./MessageInput";
import socket from "../socket";        // ✅ FIXED IMPORT
import API from "../services/api";

export default function ChatWindow({ currentUser, selectedUser, token, onlineUsers }) {
  const [messages, setMessages] = useState([]);
  const [chatId, setChatId] = useState(null);
  const [typingUser, setTypingUser] = useState(null);
  const scrollRef = useRef();

  // -----------------------------
  // LOAD CHAT WHEN USER SELECTS
  // -----------------------------
  useEffect(() => {
    if (!selectedUser) return;

    const loadChat = async () => {
      const { data: chat } = await API.post(
        "/chat/get-or-create",
        { user1: currentUser.id, user2: selectedUser._id },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setChatId(chat._id);

      // join room
      socket.emit("join:chat", chat._id);

      // load old messages
      const { data: msgs } = await API.get(`/messages/${chat._id}`);
      setMessages(msgs);
      scrollToBottom();
    };

    loadChat();
  }, [selectedUser]);

  // -----------------------------
  // SOCKET LISTENERS
  // -----------------------------
  useEffect(() => {
    const handleMessage = (msg) => {
      setMessages((prev) => [...prev, msg]); // Prevent duplication
      scrollToBottom();
    };

    const handleTyping = ({ userId }) => {
      if (userId !== currentUser.id) setTypingUser(userId);
    };

    const handleStopTyping = () => setTypingUser(null);

    socket.on("message", handleMessage);
    socket.on("typing", handleTyping);
    socket.on("stopTyping", handleStopTyping);

    return () => {
      socket.off("message", handleMessage);
      socket.off("typing", handleTyping);
      socket.off("stopTyping", handleStopTyping);
    };
  }, [currentUser.id]);

  const scrollToBottom = () => {
    setTimeout(() => {
      scrollRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 50);
  };

  const sendMessage = (text) => {
    if (!chatId || !text.trim()) return;

    socket.emit("sendMessage", {
      chatId,
      sender: currentUser.id,
      text,
    });
  };

  if (!selectedUser)
    return (
      <div className="flex-1 flex items-center justify-center text-gray-400 dark:text-gray-500">
        Select a conversation to start chatting
      </div>
    );

  return (
    <div className="flex-1 flex flex-col bg-gray-50 dark:bg-[#121212] transition-all duration-300">

      {/* Header */}
      <div className="p-4 flex items-center gap-3 border-b bg-white dark:bg-[#1E1E1E] dark:border-gray-700 shadow-sm">
        <img
          src={selectedUser.avatar || "https://i.pravatar.cc/150"}
          className="w-10 h-10 rounded-full object-cover"
        />
        <div>
          <div className="font-semibold dark:text-white">{selectedUser.name}</div>
          <div className="text-xs text-gray-500 dark:text-gray-400">
            {onlineUsers.includes(selectedUser._id) ? "Active now" : "Offline"}
            {typingUser === selectedUser._id && (
              <span className="text-blue-400 ml-2">typing...</span>
            )}
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((msg, i) => {
          const isMe =
            msg.sender === currentUser.id ||
            msg.sender?._id === currentUser.id;

          return (
            <div key={i} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-xs px-4 py-2 rounded-2xl shadow text-sm 
                ${isMe
                  ? "bg-blue-500 text-white rounded-br-none"
                  : "bg-white dark:bg-[#2A2A2A] dark:text-gray-200 rounded-bl-none"}`}
              >
                {msg.text}
                <div className="text-[10px] text-gray-400 dark:text-gray-500 mt-1">
                  {new Date(msg.createdAt).toLocaleTimeString()}
                </div>
              </div>
            </div>
          );
        })}
        <div ref={scrollRef} />
      </div>

      {/* Input */}
      <div className="border-t dark:border-gray-700 p-3 bg-white dark:bg-[#1E1E1E]">
        <MessageInput onSend={sendMessage} />
      </div>
    </div>
  );
}
