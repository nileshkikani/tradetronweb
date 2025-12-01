import axios from "axios";

const axiosInstance = axios.create({
  baseURL: process.env.EMA_SCALPING_URL,
});

// Add a request interceptor to include the Authorization Bearer token
axiosInstance.interceptors.request.use(
  (config) => {
    // Get the access token from localStorage
    const accessToken = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
    
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

export default axiosInstance;
