import { createContext, useState, useCallback, useContext, use } from "react";
import axios from "axios";

const AdminContext = createContext();

function AdminProvider({ children }) {

  const [apps,setApps] = useState([]);
  const [users,setUsers] = useState([]);
  console.log("good morning Admin");
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
        setApps(response.data);
       
      }
    } catch (error) {
      console.error("Failed to fetch property", error);
    }
   
  }, []);
      


  const getAllUsers = useCallback(async (token) => {
    console.log("good morning admincontext users");
    try {
      const response = await axios.get(
        " http://127.0.0.1:5000/api/v1/admin/users",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status == 200) {
        console.log(response.data);
        setUsers(response.data);
       
      }
    } catch (error) {
      console.error("Failed to fetch property", error);
    }
   
  }, []);




  const approveApp = useCallback(async (action,app_id,token) => {
    try {
      console.log(action)
      const response = await axios.patch(
        `http://127.0.0.1:5000/api/v1/admin/change/status/${app_id}`,
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




  const deleteUser = useCallback(async (user_id,token) => {
     
    try {
      const response = await axios.delete(`http://127.0.0.1:5000/api/v1/admin/user/delete/${user_id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
 
      if (response.status === 200 || response.status===202) {
        console.log(response.data);
      
      } else {
        console.error("Failed to delete user");
      }
    } catch (error) {
      console.error("Failed to delete user", error);
    }
  }, []);



const valueToShare = {
  getAllApps,
  getAllUsers,
  approveApp,
  deleteUser,
  apps,
  users
};



  return (
    <AdminContext.Provider value={valueToShare}>
      {children}
    </AdminContext.Provider>
  );

}
export { AdminProvider };
export default AdminContext;