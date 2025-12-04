// src/components/Avatar.jsx
import React from "react";

export default function Avatar({ src, name, size = 40, status }) {
  // If no image — generate initials
  const getInitials = (name) => {
    if (!name) return "A";
    const parts = name.split(" ");
    if (parts.length === 1) return parts[0][0].toUpperCase();
    return (parts[0][0] + parts[1][0]).toUpperCase();
  };

  // LinkedIn-style soft blue gradient fallback
  const gradient = "bg-gradient-to-br from-blue-400 to-blue-600";

  const dimension = `${size}px`;

  return (
    <div className="relative">
      {src ? (
        <img
          src={src}
          alt={name}
          className="rounded-full object-cover border border-gray-300 dark:border-gray-700"
          style={{ width: dimension, height: dimension }}
        />
      ) : (
        <div
          className={`rounded-full flex items-center justify-center text-white font-semibold ${gradient}`}
          style={{
            width: dimension,
            height: dimension,
            fontSize: size * 0.35,
          }}
        >
          {getInitials(name)}
        </div>
      )}

      {/* Online Badge */}
      {status === "online" && (
        <span
          className="absolute bottom-1 right-1 w-3 h-3 bg-green-500 rounded-full
          border-2 border-white dark:border-[#1b1c1d]"
        ></span>
      )}
    </div>
  );
}
