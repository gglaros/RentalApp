import { createContext, useState, useCallback, use } from 'react';
import axios from 'axios';

const UserContext = createContext();

function UserProvider({ children }) {

 const [userProfile, setUserProfile] = useState([]);
 const token=sessionStorage.getItem("token");

  const fetchProfile = useCallback(async () => {
    let token = sessionStorage.getItem("token");
   
    
   try {
     const response = await axios.get("http://127.0.0.1:5000/api/v1/users/me", {
       headers: { Authorization: `Bearer ${token}` },
     });

    console.log("i use fetchprofile")
     if (response.status === 200) {
       setUserProfile(response.data);
       console.log(response.data);
     
     } else {
       console.error("Failed to fetch user profile");
     }
   } catch (error) {
     console.error("Failed to fetch user profile", error);
   }
 }, []);


  const valueToShare = {
    userProfile,
    fetchProfile
  };

return (
    <UserContext.Provider value={valueToShare}>
      {children}
    </UserContext.Provider>
  );
}

export { UserProvider };
export default UserContext;