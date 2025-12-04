import React, { useState } from "react";
import API from "../services/api";

export default function Login({ onAuth }) {
  const [isRegister, setIsRegister] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "" });

  const submit = async (e) => {
    e.preventDefault();
    try {
      const url = isRegister ? "/auth/register" : "/auth/login";
      const { data } = await API.post(url, form);
      onAuth(data.token, data.user);
    } catch (err) {
      alert(err.response?.data?.message || "Error occurred");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen dark:bg-[#121212]">
      <div className="bg-white dark:bg-[#1E1E1E] p-6 rounded-xl shadow w-full max-w-md">

        <h2 className="text-2xl font-semibold mb-4 dark:text-white">
          {isRegister ? "Create Account" : "Login"}
        </h2>

        <form className="space-y-3" onSubmit={submit}>
          {isRegister && (
            <input
              type="text"
              required
              placeholder="Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full p-3 border rounded-lg dark:bg-[#2A2A2A] dark:text-white dark:border-gray-600"
            />
          )}

          <input
            type="email"
            required
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full p-3 border rounded-lg dark:bg-[#2A2A2A] dark:text-white dark:border-gray-600"
          />

          <input
            type="password"
            required
            placeholder="Password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="w-full p-3 border rounded-lg dark:bg-[#2A2A2A] dark:text-white dark:border-gray-600"
          />

          <button
            className="w-full p-3 bg-blue-500 text-white rounded-lg"
          >
            {isRegister ? "Register" : "Login"}
          </button>
        </form>

        <p className="mt-3 text-center dark:text-gray-300">
          <button className="text-blue-500" onClick={() => setIsRegister(!isRegister)}>
            {isRegister ? "Already have an account? Login" : "Create an account"}
          </button>
        </p>
      </div>
    </div>
  );
}
