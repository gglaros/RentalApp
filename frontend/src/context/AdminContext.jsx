import { createContext, useState, useCallback } from "react";
import { adminApi } from "../api/admin";

const AdminContext = createContext();

function AdminProvider({ children }) {
  const [apps, setApps] = useState([]);
  const [users, setUsers] = useState([]);

  const getAllApps = useCallback(async () => {
    try {
      setApps(await adminApi.listOwnerApps());
    } catch (error) {
      console.error("Failed to fetch owner applications", error);
    }
  }, []);

  const getAllUsers = useCallback(async () => {
    try {
      setUsers(await adminApi.listUsers());
    } catch (error) {
      console.error("Failed to fetch users", error);
    }
  }, []);

  const approveApp = useCallback(async (action, appId) => {
    try {
      await adminApi.changeOwnerAppStatus(appId, action.status);
    } catch (error) {
      console.error("Failed to change application status", error);
    }
  }, []);

  const deleteUser = useCallback(async (userId) => {
    try {
      await adminApi.deleteUser(userId);
    } catch (error) {
      console.error("Failed to delete user", error);
    }
  }, []);

  const valueToShare = {
    getAllApps,
    getAllUsers,
    approveApp,
    deleteUser,
    apps,
    users,
  };

  return (
    <AdminContext.Provider value={valueToShare}>
      {children}
    </AdminContext.Provider>
  );
}
export { AdminProvider };
export default AdminContext;
