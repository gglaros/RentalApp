import { useState,useEffect,useCallback,useContext } from "react";
import { useNavigate } from "react-router-dom";
import UserContext from "../context/UserContext";
import axios from "axios"; 

export const Logout = () => {
  const { logout } = useContext(UserContext);

  useEffect(() => {
    logout();
  }, []);

return (
      <div>
        <h1>remove token</h1>
    </div>
)}

