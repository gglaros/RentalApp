import { api } from "./client";

export const usersApi = {
  login: (email, password) =>
    api.post("/users/login", { email, password }).then((r) => r.data),

  signUp: (user) => api.post("/users/", user).then((r) => r.data),

  getMe: () => api.get("/users/me").then((r) => r.data),

  update: (userId, fields) =>
    api.put(`/users/edit/${userId}`, fields).then((r) => r.data),

  logout: () => api.post("/users/logout").then((r) => r.data),
};
