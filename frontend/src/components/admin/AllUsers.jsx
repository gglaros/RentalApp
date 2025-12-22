import { useState,useEffect,useCallback,useContext } from "react"
import { useNavigate } from "react-router-dom";
import UserContext from "../../context/UserContext"
import OwnerAppCotext from "../../context/OwnerAppContext";
import AdminContext from "../../context/AdminContext";
import axios from "axios";

export const  AllUsers = () => {

    const {makeApp,deleteApp,message} = useContext(OwnerAppCotext)
    const {getAllApps,apps,approveApp,getAllUsers,users,deleteUser} = useContext(AdminContext)
    const token = sessionStorage.getItem("token");
    const [refresh, setRefresh] = useState(false);
    const navigate = useNavigate();
    
    useEffect(() => {
      getAllUsers(token);
     }, [refresh]);
     
     const handleDeleteUser = async (id,token) => {
      console.log(id)
       await deleteUser(id, token);
       setRefresh(prev => !prev); 
     };
     
    
return (
    <> 
    <div className="container  min-h-100  flex flex-col items-center justify-center">
    <h1 className="text-2xl mb-4 w-50 hover:text-red-400">Users</h1>
        <table className="w-full text-2xl">
        <thead>
          <tr>
            <th>email</th>
            <th>phone number</th>
            <th>first_name</th>
            <th>Role</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {users?.map((user, index) => (
            <tr className="border-4" key={user.id || index}>
              <td>{user.email}</td>
              <td>{user.phone}</td>
              <td>{user.first_name}</td>
              <td>{user.role}</td>
              
              <td>
              <button type="button"
                  className="mt-3 relative bottom-1.5  rounded-2xl text-2xl bg-red-500 text-black border-2 "
                  onClick={ () => handleDeleteUser(user.id,token)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
        </table>
    </div>
    </>
)}