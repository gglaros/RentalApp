import { createContext, useState, useCallback, use,useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

const UserContext = createContext();

function UserProvider({ children }) {
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true); 
  const [token, setToken] = useState(() =>
    sessionStorage.getItem("token")
  );
  console.log("good morning userContext");

  const logout = () => {
    console.log("remove again")
    sessionStorage.clear();
    setToken(null);
    setUserProfile(null)
  };

  const fetchProfile = useCallback(async () => {
    const token = sessionStorage.getItem("token");
    console.log("good morning userContext fectprofile");
    try {
      const response = await axios.get(
        "http://127.0.0.1:5000/api/v1/users/me",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      console.log("i use fetchprofile");
      if (response.status === 200) {
        setUserProfile(response.data);
        console.log(response.data);
      } else {
        console.error("Failed to fetch user profile");
      }
    } catch (error) {
      console.error("Failed to fetch user profile", error);
    } finally{
      setLoading(false);
    }
  }, []);


  useEffect(() => {
    if (token) {
      fetchProfile();
    } else {
      setUserProfile(null);
      setLoading(false);
    }
  }, [token, fetchProfile]);
 

  const valueToShare = {
    userProfile,
    fetchProfile,
    logout,
    setToken,
    loading,
  };

  return (
    <UserContext.Provider value={valueToShare}>{children}</UserContext.Provider>
  );
}

export { UserProvider };
export default UserContext;
