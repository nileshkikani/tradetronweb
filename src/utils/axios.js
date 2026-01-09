import axios from "axios";
import { decode } from "jsonwebtoken";
import { API_ROUTER } from "src/services/routes";

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
    localStorage.removeItem("refreshToken");
    // Redirect to login page
    window.location.href = "/auth/login/cover";
  }
};

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

// Add a request interceptor to include the Authorization Bearer token
axiosInstance.interceptors.request.use(
  (config) => {
    // Get the access token from localStorage
    const accessToken =
      typeof window !== "undefined"
        ? localStorage.getItem("accessToken")
        : null;

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
  async (error) => {
    const originalRequest = error.config;

    // Check if the error is a 401 Unauthorized response
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise(function (resolve, reject) {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers["Authorization"] = "Bearer " + token;
            return axiosInstance(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = localStorage.getItem("refreshToken");

      if (!refreshToken) {
        handleTokenExpiration();
        return Promise.reject(error);
      }

      try {
        // Create a new instance to avoid interceptors for the refresh call
        const refreshInstance = axios.create({
          baseURL: process.env.EMA_SCALPING_URL,
        });

        const { data } = await refreshInstance.post(API_ROUTER.REFRESH_TOKEN, {
          refresh: refreshToken,
        });

        const { access } = data;

        if (access) {
          localStorage.setItem("accessToken", access);
          axiosInstance.defaults.headers.common["Authorization"] = "Bearer " + access;
          originalRequest.headers["Authorization"] = "Bearer " + access;
          processQueue(null, access);
          return axiosInstance(originalRequest);
        } else {
          throw new Error("No access token returned");
        }
      } catch (err) {
        processQueue(err, null);
        handleTokenExpiration();
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
