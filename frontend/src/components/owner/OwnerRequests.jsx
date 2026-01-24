import { useState,useEffect,useCallback,useContext } from "react"
import UserContext from "../../context/UserContext"
import OwnerAppCotext from "../../context/OwnerAppContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export const  OwnerRequests = () => {
    const { userProfile, fetchProfile } = useContext(UserContext);
    const {makeApp,deleteApp,message,getRequests,requests,deleteRequest} = useContext(OwnerAppCotext)
    const navigate = useNavigate();
    const token = sessionStorage.getItem("token");
   
   console.log(userProfile.tenant_applications_to_own_properties)
    useEffect(() => {
     fetchProfile();
      // getRequests(token)
    }, []);

   
return (
    <> 
    {
      message && (
      <p className="text-green-500 text-lg mt-2">{message}</p>
  )}
    <div className="container  min-h-100  flex flex-col items-center justify-center">
    <h1 className="text-2xl mb-4 w-50 hover:text-red-400">requests</h1>
        <table className="w-full text-2xl">
        <thead>
          <tr>
            <th>Address</th>
            <th>Unit number</th>
            <th>tenant's email</th>
            <th>tenant's phone</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {userProfile.tenant_applications_to_own_properties?.map((request, index) => (
            <tr className="border-4" key={request.id || index}>
              <td>{request.property.address}</td>
              <td>{request.property.unit_number}</td>
              <td>{request.tenant.email}</td>
              <td>{request.tenant.phone}</td>
              <td>{request.status}</td>
              
              <td>
              <button type="button"
                  className="mt-3 relative bottom-1.5  rounded-2xl text-2xl bg-red-500 text-black border-2"
                  onClick={ () => deleteRequest(request.id,token)}>
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