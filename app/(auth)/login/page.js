import { API_ROUTER } from "@/services/routes";
import axiosInstance from "@/utils/axios";
import React, { useState } from "react";

const Login = ({ onClose }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await axiosInstance.post(API_ROUTER.LOG_IN, {
        email,
        password,
      });

      const data = response.data;
      localStorage.setItem("token", data.token);
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    }
  };

  return (
    <div className="bg-white rounded-lg p-6 w-1/3">
      <h2 className="text-lg font-semibold mb-4">Login</h2>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      <form onSubmit={handleLogin}>
        <div className="mb-4">
          <label className="block text-gray-700">Email</label>
          <input
            type="email"
            className="border rounded w-full py-2 px-3"
            placeholder="Your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Password</label>
          <input
            type="password"
            className="border rounded w-full py-2 px-3"
            placeholder="Your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className="flex justify-between">
          <button
            type="submit"
            className="bg-[#ff7781] text-white rounded py-2 px-4 hover:bg-[#ff4a5b] transition-colors duration-300"
          >
            Submit
          </button>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-600 underline"
          >
            Close
          </button>
        </div>
      </form>
    </div>
  );
};

export default Login;
