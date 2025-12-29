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
  // fetchProfile();
    }, []);


  if (token == null || userProfile==null) {
    return (
      <div className="containerList">
        <h2 className="text-2xl text-bold">
          No user found{" "}
          <Link to="/login" className="underline text-blue-500">
            Login{" "}
          </Link>
          or{" "}
          <Link to="/signin" className="underline text-blue-500">
            Sign up
          </Link>
        </h2>
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
