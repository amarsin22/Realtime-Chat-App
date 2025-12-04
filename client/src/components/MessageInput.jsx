import React, { useState, useEffect } from 'react';
import socket from '../socket';

export default function MessageInput({ onSend, chatId, senderId }) {
  const [text, setText] = useState('');
  const [typing, setTyping] = useState(false);
  let typingTimeout;

  useEffect(() => {
    return () => clearTimeout(typingTimeout);
  }, []);

  const handleChange = (e) => {
    setText(e.target.value);
    if (!typing) {
      setTyping(true);
      socket.emit('typing', { chatId, userId: senderId });
    }
    clearTimeout(typingTimeout);
    typingTimeout = setTimeout(() => {
      setTyping(false);
      socket.emit('stopTyping', { chatId, userId: senderId });
    }, 1000);
  };

  const submit = (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    onSend(text.trim());
    setText('');
    setTyping(false);
    socket.emit('stopTyping', { chatId, userId: senderId });
  };

  return (
    <form onSubmit={submit} className="flex items-center gap-2">
      <input value={text} onChange={handleChange} placeholder="Message..." className="flex-1 p-2 border rounded-full" />
      <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded-full">Send</button>
    </form>
  );
}
