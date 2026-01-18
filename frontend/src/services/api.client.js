import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { API_BASE_URL } from "./api.config";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");
    
    if (token) {
      try {
        const decoded = jwtDecode(token);
        const isExpired = decoded.exp < Date.now() / 1000;
        
        if (isExpired) {
          console.warn("Token expired! Redirecting to login or refreshing...");
        } else {
          config.headers.Authorization = `Bearer ${token}`;
        }
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
        console.error("Unauthorized! Token might be invalid.");
    }
    return Promise.reject(error);
  }
);

export default apiClient;