import { API_URL } from "../api/client";
export { API_URL };

export const MAX_IMAGES = 10;

export const imageUrl = (path) => {
  if (!path) return null;
  if (path.startsWith("http")) return path;
  return `${API_URL}/${path.replace(/^\/+/, "")}`;
};

export const isApproved = (img) => !img.status || img.status === "APPROVED";

export const getImages = (property, { includePending = false } = {}) => {
  if (property?.images?.length) {
    return includePending ? property.images : property.images.filter(isApproved);
  }
  if (property?.image) return [{ id: null, path: property.image, position: 0, status: "APPROVED" }];
  return [];
};

export const pendingCount = (property) =>
  (property?.images || []).filter((img) => !isApproved(img)).length;

export const authHeaders = (token) => ({ Authorization: `Bearer ${token}` });

export const errorMessage = (err, fallback = "Something went wrong") => {
  const data = err?.response?.data;
  if (!data) return fallback;
  if (typeof data.error === "string") return data.error;
  if (data.errors) {
    return Object.entries(data.errors)
      .map(([field, msgs]) => `${field}: ${[].concat(msgs).join(", ")}`)
      .join(" · ");
  }
  return fallback;
};
