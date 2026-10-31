import { createContext, useState, useCallback, useContext } from "react";
import UserContext from "../context/UserContext";
import { ownerAppsApi, tenantAppsApi } from "../api/applications";
import { errorMessage } from "../utils/api";

const OwnerAppContext = createContext();

function OwnerAppProvider({ children }) {
  const { fetchProfile } = useContext(UserContext);
  const [requests, setRequests] = useState([]);
  const [message, setMessage] = useState("");

  const flash = (msg) => {
    setMessage(msg);
    setTimeout(() => setMessage(""), 4000);
  };

  const makeApp = useCallback(async (propertyId) => {
    try {
      await ownerAppsApi.create(propertyId);
      flash("Application sent to the admin.");
    } catch (error) {
      console.error(error);
      flash(
        error?.response?.status === 409
          ? "You already made an application for this property."
          : errorMessage(error, "Failed to send application.")
      );
    }
  }, []);

  const deleteApp = useCallback(async (appId) => {
    try {
      await ownerAppsApi.remove(appId);
      flash("Application deleted.");
    } catch (error) {
      console.error(error);
      flash(errorMessage(error, "Failed to delete application."));
    }
    fetchProfile();
  }, [fetchProfile]);

  const getRequests = useCallback(async () => {
    try {
      setRequests(await tenantAppsApi.listForOwner());
    } catch (error) {
      console.error("Failed to fetch requests", error);
    }
  }, []);

  const changeRequestStatus = useCallback(async (appId, status) => {
    try {
      const data = await tenantAppsApi.changeStatus(appId, status);
      flash(status === "APPROVED" ? "Request approved." : status === "REJECTED" ? "Request rejected." : "Request updated.");
      return data;
    } catch (error) {
      console.error(error);
      flash(errorMessage(error, "Failed to change request status."));
      return null;
    } finally {
      await fetchProfile();
    }
  }, [fetchProfile]);

  const deleteRequest = useCallback(async (appId) => {
    try {
      await tenantAppsApi.removeForOwner(appId);
      flash("Request deleted.");
    } catch (error) {
      console.error(error);
      flash(errorMessage(error, "Failed to delete request."));
    }
    fetchProfile();
  }, [fetchProfile]);

  const valueToShare = {
    makeApp,
    deleteApp,
    getRequests,
    requests,
    deleteRequest,
    changeRequestStatus,
    message,
  };

  return (
    <OwnerAppContext.Provider value={valueToShare}>
      {children}
    </OwnerAppContext.Provider>
  );
}

export { OwnerAppProvider };
export default OwnerAppContext;
