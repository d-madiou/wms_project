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
    const token = localStorage.getItem("access");
    
    if (token) {
      const decoded = jwtDecode(token);
      const isExpired = decoded.exp < Date.now() / 1000;
      
      if (isExpired) {
        console.log("Token expired! (We need to handle refresh here later)");
      }
      
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default apiClient;