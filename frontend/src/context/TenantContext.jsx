import { createContext, useState, useCallback } from "react";
import { tenantAppsApi } from "../api/applications";
import { errorMessage } from "../utils/api";

const TenantContext = createContext();

function TenantProvider({ children }) {
  const [message, setMessage] = useState("");

  const flash = (msg) => {
    setMessage(msg);
    setTimeout(() => setMessage(""), 4000);
  };

  const makeApp = useCallback(async (propertyId) => {
    try {
      await tenantAppsApi.apply(propertyId);
      flash("Application sent to the owner.");
      return true;
    } catch (error) {
      console.error(error);
      flash(
        error?.response?.status === 409
          ? "You already made an application for this property."
          : errorMessage(error, "Failed to send application.")
      );
      return false;
    }
  }, []);

  const cancelApp = useCallback(async (appId) => {
    try {
      await tenantAppsApi.cancel(appId);
      flash("Application cancelled.");
      return true;
    } catch (error) {
      console.error(error);
      flash(errorMessage(error, "Failed to cancel application."));
      return false;
    }
  }, []);

  const valueToShare = {
    makeApp,
    cancelApp,
    message,
  };

  return (
    <TenantContext.Provider value={valueToShare}>
      {children}
    </TenantContext.Provider>
  );
}
export { TenantProvider };
export default TenantContext;
