import { createContext, useState, useCallback, useContext, use } from "react";
import UserContext from "../context/UserContext";
import axios from "axios";

const OwnerAppContext = createContext();

function OwnerAppProvider({ children }) {
    const { token, fetchProfile } = useContext(UserContext);
    const [message, setMessage] = useState("");
 
  const makeApp = useCallback(async (propID,token) => {
   
    try {
      const response = await axios.post(`http://127.0.0.1:5000/api/v1/ownerApps/create/${propID}`, 
      {}, 
      {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (response.status === 200 || response.status===202 || response.status===201) {
        console.log(response.data);
        setMessage("well done.");
      } else {
        console.error("Failed to make app",response.status);
        
      }
    } catch (error) {
     console.log(error.response.data)
     setMessage("You already made an application for this property.");
     console.error(error)
    }
    setTimeout(() => setMessage(""), 4000);
  }, []);


  const deleteApp = useCallback(async (appId,token) => {
     
    try {
      const response = await axios.delete(`http://127.0.0.1:5000/api/v1/ownerApps/delete/${appId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
 
     console.log("i use fetchprofile")
      if (response.status === 200 || response.status===202) {
       setMessage("well done.");
       
        console.log(response.data);
      
      } else {
        console.error("Failed to delete app");
      }
    } catch (error) {
      console.error("Failed to delete app", error);
    }
     fetchProfile();
     setTimeout(() => setMessage(""), 4000);
  }, []);
  
  

  const valueToShare = {
   makeApp,
   deleteApp,
   message
  };

  return (
    <OwnerAppContext.Provider value={valueToShare}>
      {children}
    </OwnerAppContext.Provider>
  );
}

export { OwnerAppProvider };
export default OwnerAppContext;
