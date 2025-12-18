import { createContext, useState, useCallback, useContext, use } from "react";
import axios from "axios";

const AdminContext = createContext();

function AdminProvider({ children }) {
   
  const getAllApps = useCallback(async (token) => {
    try {
      const response = await axios.get(
        " http://127.0.0.1:5000/api/v1/admin/all/ownerApps",
        {
          headers: {
            Authorization: `Bearer ${token}`,
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
      


const valueToShare = {
  getAllApps,
};



  return (
    <AdminContext.Provider value={valueToShare}>
      {children}
    </AdminContext.Provider>
  );

}
export { AdminProvider };
export default AdminContext;