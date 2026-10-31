import { api } from "./client";

export const ownerAppsApi = {
  create: (propertyId) => api.post(`/ownerApps/create/${propertyId}`).then((r) => r.data),

  remove: (appId) => api.delete(`/ownerApps/delete/${appId}`).then((r) => r.data),
};

export const tenantAppsApi = {
  apply: (propertyId) =>
    api.post(`/tenants/create/app/prop/${propertyId}`).then((r) => r.data),

  mine: () => api.get("/tenants/my/applications").then((r) => r.data),

  cancel: (appId) => api.delete(`/tenants/applications/${appId}`).then((r) => r.data),

  listForOwner: () => api.get("/owners/requests").then((r) => r.data),

  changeStatus: (appId, status) =>
    api.patch(`/owners/change/request/status/${appId}`, { status }).then((r) => r.data),

  removeForOwner: (appId) =>
    api.delete(`/owners/delete/request/${appId}`).then((r) => r.data),
};
