"use client";
import { useState } from "react";
import axiosInstance from "@/utils/axios";
import { API_ROUTER } from "@/services/routes";

const VerifyCode = () => {
  const [code, setCode] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleVerify = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await axiosInstance.post(API_ROUTER.VERIFY_CODE, {
        code,
      });

      if (response.status === 200) {
        setSuccess(true);
      } else {
        throw new Error("Verification failed");
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    }
  };

  return (
    <div className="bg-white rounded-lg p-6 w-1/3 mx-auto mt-20">
      <h2 className="text-lg font-semibold mb-4">Verify Your Code</h2>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      {success && (
        <div className="text-green-500 mb-4">Code verified successfully!</div>
      )}
      {!success && (
        <form onSubmit={handleVerify}>
          <div className="mb-4">
            <label className="block text-gray-700">Verification Code</label>
            <input
              type="text"
              className="border rounded w-full py-2 px-3"
              placeholder="Enter your verification code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="bg-[#ff7781] text-white rounded py-2 px-4 hover:bg-[#ff4a5b] transition-colors duration-300"
          >
            Verify
          </button>
        </form>
      )}
    </div>
  );
};

export default VerifyCode;
