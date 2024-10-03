"use client";

import { API_ROUTER } from "@/services/routes";
import axiosInstance from "@/utils/axios";
import React, { useState } from "react";

const SignUp = ({ onClose }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [full_name, setFullName] = useState("");
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage("");

    try {
      const response = await axiosInstance.post(API_ROUTER.REGISTER, {
        email,
        full_name,
        password,
      });

      if (response.status !== 201) {
        throw new Error("Sign Up failed");
      }

      setSuccessMessage(
        "Registration successful! Please check your email for further instructions."
      );
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    }
  };

  return (
    <div className="bg-white rounded-lg p-6 w-1/3">
      <h2 className="text-lg font-semibold mb-4">Sign Up</h2>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      {successMessage && (
        <div className="text-green-500 mb-4">{successMessage}</div>
      )}

      <form onSubmit={handleSignUp}>
        <div className="mb-4">
          <label className="block text-gray-700">Name</label>
          <input
            type="text"
            className="border rounded w-full py-2 px-3"
            placeholder="Your Name"
            value={full_name}
            onChange={(e) => setFullName(e.target.value)}
            required
          />
        </div>
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

export default SignUp;
