import axios from "axios";
import { decode } from "jsonwebtoken";

const axiosInstance = axios.create({
  baseURL: process.env.EMA_SCALPING_URL,
});

// Helper function to check if token is expired
const isTokenExpired = (token) => {
  if (!token) return true;
  try {
    const decoded = decode(token);
    if (!decoded.exp) return true;
    return Date.now() >= decoded.exp * 1000;
  } catch (error) {
    return true;
  }
};

// Helper function to handle logout and redirect
const handleTokenExpiration = () => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("accessToken");
    // Redirect to login page
    window.location.href = "/auth/login/cover";
  }
};

// Add a request interceptor to include the Authorization Bearer token
axiosInstance.interceptors.request.use(
  (config) => {
    // Get the access token from localStorage
    const accessToken =
      typeof window !== "undefined"
        ? localStorage.getItem("accessToken")
        : null;

    // Check if token is expired before making the request
    if (accessToken && isTokenExpired(accessToken)) {
      handleTokenExpiration();
      return Promise.reject(new Error("Token expired"));
    }

    // If token exists, add it to the Authorization header
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle 401 errors and token expiration
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Check if the error is a 401 Unauthorized response
    if (error.response && error.response.status === 401) {
      // Token is invalid or expired, redirect to login
      handleTokenExpiration();
      return Promise.reject(error);
    }

    // For other errors, check if token exists and is expired
    if (typeof window !== "undefined") {
      const accessToken = localStorage.getItem("accessToken");
      if (accessToken && isTokenExpired(accessToken)) {
        handleTokenExpiration();
        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
