import { Outlet, Navigate } from "react-router-dom";
import {  useContext, use } from "react";
import UserContext from "../context/UserContext";

export const OwnerRoutes = () => {
  const { userProfile, loading } = useContext(UserContext);

  if (loading) return <div>Loading...</div>;

  if (!userProfile || userProfile.role !== "OWNER") {
    return <Navigate to="/home" replace />;
  }

  return <Outlet />;
};
