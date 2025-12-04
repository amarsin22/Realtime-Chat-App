import React from "react";

export default function UserItem({ user, onClick, online }) {
  return (
    <div
      onClick={onClick}
      className="
        flex items-center gap-3 p-3 rounded-lg cursor-pointer 
        hover:bg-gray-100 dark:hover:bg-[#2A2A2A] transition-all duration-200">
      
      <div className="relative">
        <img
          src={user.avatar || "https://i.pravatar.cc/150"}
          className="w-12 h-12 rounded-full object-cover"
        />
        {online && (
          <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white dark:border-[#1A1A1A] rounded-full"></span>
        )}
      </div>

      <div>
        <div className="font-medium dark:text-white">{user.name}</div>
        <div className="text-xs text-gray-500 dark:text-gray-400">
          {online ? "Active now" : "Offline"}
        </div>
      </div>
    </div>
  );
}
