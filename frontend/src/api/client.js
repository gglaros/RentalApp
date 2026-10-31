import axios from "axios";

export const API_URL = import.meta.env.VITE_API_URL ?? "http://127.0.0.1:5000";

const TOKEN_KEY = "token";

export const tokenStorage = {
  get: () => sessionStorage.getItem(TOKEN_KEY),
  set: (token) => sessionStorage.setItem(TOKEN_KEY, token),
  clear: () => sessionStorage.removeItem(TOKEN_KEY),
};

export const api = axios.create({
  baseURL: `${API_URL}/api/v1`,
});

api.interceptors.request.use((config) => {
  const token = tokenStorage.get();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

let unauthorizedHandler = null;
export const setUnauthorizedHandler = (handler) => {
  unauthorizedHandler = handler;
};

const isAuthError = (error) => {
  const status = error.response?.status;
  const message = String(error.response?.data?.error ?? "").toLowerCase();
  return status === 401 || (status === 409 && message.includes("token"));
};

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (isAuthError(error) && tokenStorage.get()) {
      tokenStorage.clear();
      unauthorizedHandler?.();
    }
    return Promise.reject(error);
  }
);
