// src/utils/auth.js
import { jwtDecode } from "jwt-decode";

export const isTokenExpired = (token) => {
  if (!token) return true;

  try {
    const { exp } = jwtDecode(token);
    return exp * 1000 < Date.now();
  } catch {
    return true;
  }
};
