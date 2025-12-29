import { Outlet,Navigate } from "react-router-dom";
import { createContext, useEffect, useCallback, useContext, use } from "react";
import UserContext from "../context/UserContext";


export const AdminRoutes = () => {
    const { userProfile, fetchProfile,loading} = useContext(UserContext);

    if (loading) return <div>Loading...</div>;
console.log(userProfile.role)
    if (!userProfile || userProfile.role !== "ADMIN") {
      return <Navigate to="/home" replace />;
    }
    
    return <Outlet />;

}

