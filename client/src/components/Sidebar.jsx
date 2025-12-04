// src/components/Sidebar.jsx
import React from "react";
import Avatar from "./Avatar";

export default function Sidebar({
  users,
  user,
  onlineUsers,
  selectUser,
  onLogout,
}) {
  return (
    <div className="w-72 bg-white dark:bg-[#1E1E1E] border-r dark:border-gray-700 flex flex-col">
      
      {/* Header */}
      <div className="p-4 flex items-center justify-between border-b dark:border-gray-700">
        <div className="flex items-center gap-3">
          <Avatar src={user.avatar} name={user.name} size={45} status="online" />
          
          <div>
            <div className="font-semibold text-gray-800 dark:text-gray-100">
              {user.name}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              Connected · Professional Mode
            </div>
          </div>
        </div>

        <button
          onClick={onLogout}
          className="text-sm text-red-500 hover:underline"
        >
          Logout
        </button>
      </div>

      {/* User List */}
      <div className="flex-1 overflow-y-auto">
        {users.length === 0 && (
          <p className="text-center text-gray-400 p-4">
            No users available
          </p>
        )}

        {users.map((u) => {
          const isOnline = onlineUsers.includes(u._id);

          return (
            <div
              key={u._id}
              onClick={() => selectUser(u)}
              className="px-4 py-3 flex items-center gap-3 cursor-pointer hover:bg-gray-100 
                         dark:hover:bg-[#2A2A2A] transition rounded-md mx-2 my-1"
            >
              <Avatar
                src={u.avatar}
                name={u.name}
                size={40}
                status={isOnline ? "online" : "offline"}
              />

              <div className="flex flex-col">
                <span className="font-medium text-gray-800 dark:text-gray-200">
                  {u.name}
                </span>

                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {isOnline ? "Active now" : "Offline"}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
