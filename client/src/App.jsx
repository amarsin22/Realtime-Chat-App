import React, { useState } from "react";
import ChatLayout from "./components/ChatLayout";
import Login from "./pages/Login.jsx";


export default function App() {
  const [dark, setDark] = useState(false);

  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  return (
    <div className={dark ? "dark" : ""}>
      {/* Dark Mode Button */}
      <button
        onClick={() => setDark(!dark)}
        className="fixed top-4 right-4 px-3 py-1 rounded-full text-sm 
        bg-gray-200 dark:bg-gray-700 dark:text-white shadow z-50"
      >
        {dark ? "Light Mode" : "Dark Mode"}
      </button>

      <div className="min-h-screen dark:bg-[#121212] dark:text-white transition-all">

        {/* MAIN AUTH LOGIC */}
        {!user || !token ? (
          <Login
            onAuth={(token, user) => {
              localStorage.setItem("token", token);
              localStorage.setItem("user", JSON.stringify(user));
              window.location.reload();
            }}
          />
        ) : (
          <ChatLayout />
        )}

      </div>
    </div>
  );
}
