import React, { useEffect, useState, useRef } from 'react';
import API from '../services/api';
import Sidebar from '../components/Sidebar';
import ChatWindow from '../components/ChatWindow';
import { socket } from '../socket';

export default function ChatPage({ token, user, onLogout }) {
  const [users, setUsers] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);

  useEffect(() => {
    socket.auth = { token };
    socket.connect();
    socket.emit('user:online', user.id);

    socket.on('users:online', (list) => setOnlineUsers(list));
    (async () => {
      const { data } = await API.get('/users', { headers: { Authorization: `Bearer ${token}` } });
      setUsers(data.filter(u => u._id !== user.id));
    })();

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <div className="h-screen flex">
      <Sidebar users={users} selectUser={setSelectedChat} onlineUsers={onlineUsers} user={user} onLogout={onLogout} />
      <ChatWindow currentUser={user} selectedUser={selectedChat} token={token} onlineUsers={onlineUsers} />
    </div>
  );
}
