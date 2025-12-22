import { useState,useEffect,useCallback,useContext } from "react"
import { useNavigate } from "react-router-dom";
import UserContext from "../../context/UserContext"
import OwnerAppCotext from "../../context/OwnerAppContext";
import AdminContext from "../../context/AdminContext";
import axios from "axios";

export const  AllOwnerApps = () => {

    const {makeApp,deleteApp,message} = useContext(OwnerAppCotext)
    const {getAllApps,apps,approveApp} = useContext(AdminContext)
    const token = sessionStorage.getItem("token");
    const [refresh, setRefresh] = useState(false);
    const navigate = useNavigate();
    
    useEffect(() => {
      getAllApps(token);
     }, [refresh]);
     
     const handleDeleteApp = async (id,token) => {
       await deleteApp(id, token);
       setRefresh(prev => !prev); 
     };
     
    // useEffect(() => {
    //   getAllApps(token);
    // }, []);


return (
    <> 
    <div className="container  min-h-100  flex flex-col items-center justify-center">
    <h1 className="text-2xl mb-4 w-50 hover:text-red-400">Apps</h1>
        <table className="w-full text-2xl">
        <thead>
          <tr>
            <th>Address</th>
            <th>Unit number</th>
            <th>Description</th>
            <th>year built</th>
            <th>owner email</th>
            <th>App Status</th>
            <th>Delete</th>
            <th>Approve</th>
          </tr>
        </thead>
        <tbody>
          {apps?.map((app, index) => (
            <tr className="border-4" key={app.id || index}>
              <td>{app.property.address}</td>
              <td>{app.property.unit_number}</td>
              <td>{app.property.description}</td>
              <td>{app.property.year_built}</td>
              <td>{app.property.owner.email}</td>
              <td>{app.status}</td>

              <td>
              <button type="button"
                  className="mt-3 relative bottom-1.5  rounded-2xl text-2xl bg-red-500 text-black border-2 "
                  onClick={ () => handleDeleteApp(app.id,token)}>
                  Delete
                </button>
              </td>
              <td>
              <button type="button" className="mt-3 rounded-2xl text-2xl bg-green-500 text-black border-2"
                onClick={() =>approveApp({ status: "APPROVED" },app.id,token)  }  >approve </button>
              </td>
            </tr>
          ))}
        </tbody>
        </table>
    </div>
    </>
)}