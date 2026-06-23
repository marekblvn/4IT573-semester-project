import axios from "axios";

const API_URL: string = import.meta.env.VITE_API_URL;

export interface LoginResponse {
  token: string;
  username: string;
}

const api = axios.create({
  baseURL: API_URL + "/api",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      globalThis.location.href = "/login";
    }
    return Promise.reject(error);
  },
);

export default api;
