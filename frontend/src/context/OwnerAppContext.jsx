import { createContext, useState, useCallback, useContext, use } from "react";
import UserContext from "../context/UserContext";
import axios from "axios";

const OwnerAppContext = createContext();

function OwnerAppProvider({ children }) {
    const { token, fetchProfile } = useContext(UserContext);
    const [requests, setRequests] = useState([]);
    const [message, setMessage] = useState("");
 
    console.log("good morning ownerAppconte");
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



  const getRequests = useCallback(async (token) => {
     
    try {
      const response = await axios.get("http://127.0.0.1:5000/api/v1/owners/requests", {
        headers: { Authorization: `Bearer ${token}` },
      });
 
      if (response.status === 200 || response.status===202) {
        console.log(response.data);
        setRequests(response.data);
      
      } else {
        console.error("Failed to get app");
      }
    } catch (error) {
      console.error("Failed to fetch requests", error);
    }
     
  }, []);




  const approveApp = useCallback(async (action,app_id,token) => {
    try {
      console.log(action)
      const response = await axios.patch(
        `http://127.0.0.1:5000/api/v1/owners//change/request/status/${app_id}`,
        action,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (response.status == 200) {
        console.log(response.data);
      }
    } catch (error) {
      console.error("Failed to fetch property", error);
    }
   
  }, []);




  // this app is owner app for admin to accept the property
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



  // this is the request who tenant has make to owner to see the property
  const deleteRequest = useCallback(async (appId,token) => {
     
    try {
      const response = await axios.delete(`http://127.0.0.1:5000/api/v1/owners/delete/request/${appId}`, {
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
   getRequests,
   requests,
   deleteRequest,
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
