import { useState, useEffect, useCallback, useContext } from "react";
import { jwtDecode } from "jwt-decode";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import UserContext from "../../context/UserContext";
import PropertyContext from "../../context/PropertyContext";
import { OwnerProfile } from "../profiles/OwnerProfile";
import { AdminProfile } from "../profiles/AdminProfile";
import { TenantProfile } from "./TenantProfile";
import { isTokenExpired } from "../../utils/auth";
import axios from "axios";

export const Profile = () => {
  const { userProfile, fetchProfile,loading } = useContext(UserContext);
  const { deleteProperty } = useContext(PropertyContext);
  const navigate = useNavigate();

  const token = sessionStorage.getItem("token");

    useEffect(() => {
      if (isTokenExpired(token)) {
        console.log("Token expired");
        sessionStorage.removeItem("token");
        return;
      }

    }, []);


  if (token == null || userProfile==null) {
    return (
      <div className="flex items-center justify-center min-h-[320px]">
        <div className="text-center max-w-xs px-4 py-8">
    
          {/* Avatar placeholder */}
          <div className="w-14 h-14 rounded-full border border-white/10 bg-slate-800 flex items-center justify-center mx-auto mb-5">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
              className="text-slate-500">
              <circle cx="12" cy="8" r="4" />
              <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
            </svg>
          </div>
    
          <p className="text-lg font-semibold text-white mb-1.5">No user found</p>
          <p className="text-sm text-slate-400 mb-6 leading-relaxed">
            You need an account to continue.
          </p>
    
          <div className="flex gap-2 justify-center">
            <Link to="/login"
              className="px-5 py-2 text-sm font-medium rounded-xl border border-white/10 bg-slate-900 text-white hover:bg-slate-800 transition-colors">
              Log in
            </Link>
            <Link to="/signin"
              className="px-5 py-2 text-sm font-medium rounded-xl border border-violet-500/40 bg-violet-500/15 text-violet-300 hover:bg-violet-500/25 transition-colors">
              Sign up
            </Link>
          </div>
    
        </div>
      </div>
    );
  }

  switch (userProfile.role) {
        case "OWNER":  
        return <OwnerProfile  user={userProfile}/>;
    
        case "TENANT":
          return <TenantProfile user={userProfile} />;
    
        case "ADMIN":
          return <AdminProfile user={userProfile} />;
    
        default:
          return <div>Unknown role</div>;
      }

  
};
