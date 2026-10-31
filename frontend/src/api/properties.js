import { api } from "./client";

const cleanParams = (filters = {}) =>
  Object.fromEntries(
    Object.entries(filters).filter(([, v]) => v !== "" && v !== null && v !== undefined)
  );

export const propertiesApi = {
  listApproved: (filters) =>
    api.get("/properties/approved", { params: cleanParams(filters) }).then((r) => r.data),

  listAll: () => api.get("/properties/").then((r) => r.data),

  get: (id) => api.get(`/properties/${id}`).then((r) => r.data),

  getPublic: (id) => api.get(`/properties/public/${id}`).then((r) => r.data),

  create: (formData) => api.post("/properties/", formData).then((r) => r.data),

  update: (id, fields) => api.put(`/properties/${id}`, fields).then((r) => r.data),

  remove: (id) => api.delete(`/properties/${id}`).then((r) => r.data),

  uploadImages: (id, files) => {
    const formData = new FormData();
    files.forEach((f) => formData.append("images", f));
    return api.post(`/properties/${id}/images`, formData).then((r) => r.data);
  },

  deleteImage: (id, imageId) =>
    api.delete(`/properties/${id}/images/${imageId}`).then((r) => r.data),

  setCover: (id, imageId) =>
    api.patch(`/properties/${id}/images/${imageId}/cover`).then((r) => r.data),
};
