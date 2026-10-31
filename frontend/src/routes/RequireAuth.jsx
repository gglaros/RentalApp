import { useContext } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import UserContext from "../context/UserContext";

const Loading = () => (
  <div className="min-h-[60vh] flex items-center justify-center">
    <div className="h-10 w-10 rounded-full border-4 border-slate-700 border-t-violet-500 animate-spin" />
  </div>
);

export const RequireAuth = ({ roles }) => {
  const { isAuthenticated, userProfile, loading } = useContext(UserContext);
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (loading) return <Loading />;

  if (!userProfile) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-slate-400">
        Could not load your profile. Please try again later.
      </div>
    );
  }

  if (roles && !roles.includes(userProfile.role)) {
    return <Navigate to="/home" replace />;
  }

  return <Outlet />;
};

export const GuestOnly = () => {
  const { isAuthenticated } = useContext(UserContext);
  return isAuthenticated ? <Navigate to="/profile" replace /> : <Outlet />;
};
