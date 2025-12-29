import { useState,useEffect,useCallback,useContext } from "react"
import UserContext from "../../context/UserContext"
import OwnerAppCotext from "../../context/OwnerAppContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export const  TenantApps = () => {
    const { userProfile, fetchProfile } = useContext(UserContext);
    const {makeApp,deleteApp,message} = useContext(OwnerAppCotext)
    const navigate = useNavigate();
    const token = sessionStorage.getItem("token");
  

return (
    <> 
    {
      message && (
      <p className="text-green-500 text-lg mt-2">{message}</p>
  )}
    <div className="container  min-h-100  flex flex-col items-center justify-center">
    <h1 className="text-2xl mb-4 w-50 hover:text-red-400">Apps</h1>
        <table className="w-full text-2xl">
        <thead>
          <tr>
            <th>Address</th>
            <th>Unit number</th>
            <th>Description</th>
            <th>Status</th>
            <th>Owner's email</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {userProfile.tenant_applications?.map((app, index) => (
            <tr className="border-4" key={app.id || index}>
              <td>{app.property.address}</td>
              <td>{app.property.unit_number}</td>
              <td>{app.property.description}</td>
              <td>{app.status}</td>
              <td>{app.property.owner.email}</td>
              <td>
              <button type="button"
                  className="mt-3 relative bottom-1.5  rounded-2xl text-2xl bg-red-500 text-black border-2"
                  onClick={ () => deleteApp(app.id,token)}>
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