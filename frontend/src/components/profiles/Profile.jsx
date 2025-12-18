import { useState, useEffect, useCallback, useContext } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import UserContext from "../../context/UserContext";
import PropertyContext from "../../context/PropertyContext";
import { OwnerProfile } from "../profiles/OwnerProfile";
import { AdminProfile } from "../profiles/AdminProfile";
import axios from "axios";

export const Profile = () => {
  const { userProfile, fetchProfile } = useContext(UserContext);
  const { deleteProperty } = useContext(PropertyContext);
  const navigate = useNavigate();

  const token = sessionStorage.getItem("token");

  if (token != null) {
    useEffect(() => {
      fetchProfile();
      console.log(userProfile.role);
    }, []);
  }



  if (token == null) {
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
        return <OwnerProfile/>;
    
        case "TENANT":
          return <TenantProfile user={userProfile} />;
    
        case "ADMIN":
          return <AdminProfile user={userProfile} />;
    
        default:
          return <div>Unknown role</div>;
      }

  
};
