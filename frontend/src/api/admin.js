import { api } from "./client";

export const adminApi = {
  listUsers: () => api.get("/admin/users").then((r) => r.data),

  deleteUser: (userId) => api.delete(`/admin/user/delete/${userId}`).then((r) => r.data),

  listOwnerApps: () => api.get("/admin/all/ownerApps").then((r) => r.data),

  changeOwnerAppStatus: (appId, status) =>
    api.patch(`/admin/change/status/${appId}`, { status }).then((r) => r.data),

  listPendingImages: () => api.get("/admin/images/pending").then((r) => r.data),

  reviewImage: (imageId, status) =>
    api.patch(`/admin/images/${imageId}`, { status }).then((r) => r.data),
};
