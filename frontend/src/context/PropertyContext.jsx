import { createContext, useState, useCallback, useContext, use } from "react";
import UserContext from "../context/UserContext";
import axios from "axios";

const PropertyContext = createContext();

function PropertyProvider({ children }) {
  const { userProfile, fetchProfile } = useContext(UserContext);
  const [properties,setProperties] = useState([]);
 

  const fetchProperties = useCallback(async (token) => {
    try {
      const response = await axios.get(
        "http://127.0.0.1:5000/api/v1/properties/",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status == 200) {
        console.log(response.data);
        setProperties(response.data);
        
      }
    } catch (error) {
      console.error("Failed to fetch property", error);
    }
   
  }, []);


  const deleteProperty = useCallback(async (id, token) => {
    try {
      const response = await axios.delete(
        `http://127.0.0.1:5000/api/v1/properties/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
  
      if (response.status === 200) {
        console.log("Deleted:", response.data);
       
      };
  
    } catch (error) {
      console.error("Failed to delete property", error);
    }
   
  fetchProfile();
  }, []);
  
  

  
  const addProperty = useCallback(
    async (data,token) => {
      try {
        const response = await axios.post(
          "http://127.0.0.1:5000/api/v1/properties/",
          data,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        console.log("Property added:", response.data);

      } catch (error) {
        console.error("Failed to add property", error);
      }
    },
    [ ]
  );

  const valueToShare = {
    deleteProperty,
    addProperty,
    fetchProperties,
    properties
  };

  return (
    <PropertyContext.Provider value={valueToShare}>
      {children}
    </PropertyContext.Provider>
  );
}

export { PropertyProvider };
export default PropertyContext;
