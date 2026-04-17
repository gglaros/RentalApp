// import { useState,useEffect,useCallback,useContext } from "react"
// import UserContext from "../../context/UserContext"
// import OwnerAppCotext from "../../context/OwnerAppContext";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";

// export const  OwnerRequests = () => {
//     const { userProfile, fetchProfile } = useContext(UserContext);
//     const {makeApp,deleteApp,message,getRequests,requests,deleteRequest} = useContext(OwnerAppCotext)
//     const navigate = useNavigate();
//     const token = sessionStorage.getItem("token");
   
//    console.log(userProfile.tenant_applications_to_own_properties)
//     useEffect(() => {
//      fetchProfile();
//       // getRequests(token)
//     }, []);

   
// return (
//     <> 
//     {
//       message && (
//       <p className="text-green-500 text-lg mt-2">{message}</p>
//   )}
//     <div className="container  min-h-100  flex flex-col items-center justify-center">
//     <h1 className="text-2xl mb-4 w-50 hover:text-red-400">requests</h1>
//         <table className="w-full text-2xl">
//         <thead>
//           <tr>
//             <th>Address</th>
//             <th>Unit number</th>
//             <th>tenant's email</th>
//             <th>tenant's phone</th>
//             <th>Status</th>
//             <th>Action</th>
//           </tr>
//         </thead>
//         <tbody>
//           {userProfile.tenant_applications_to_own_properties?.map((request, index) => (
//             <tr className="border-4" key={request.id || index}>
//               <td>{request.property.address}</td>
//               <td>{request.property.unit_number}</td>
//               <td>{request.tenant.email}</td>
//               <td>{request.tenant.phone}</td>
//               <td>{request.status}</td>
              
//               <td>
//               <button type="button"
//                   className="mt-3 relative bottom-1.5  rounded-2xl text-2xl bg-red-500 text-black border-2"
//                   onClick={ () => deleteRequest(request.id,token)}>
//                   Delete
//                 </button>
//               </td>

//             </tr>
//           ))}
//         </tbody>
//         </table>
//     </div>
//     </>
// )}



import { useEffect, useContext } from "react";
import UserContext from "../../context/UserContext";
import OwnerAppCotext from "../../context/OwnerAppContext";

export const OwnerRequests = () => {
  const { userProfile, fetchProfile } = useContext(UserContext);
  const { message, deleteRequest } = useContext(OwnerAppCotext);
  const token = sessionStorage.getItem("token");

  useEffect(() => {
    fetchProfile();
  }, []);

  const getStatusStyle = (status) => {
    switch (status?.toUpperCase()) {
      case "APPROVED":
        return "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30";
      case "PENDING":
        return "bg-yellow-500/15 text-yellow-400 border border-yellow-500/30";
      case "REJECTED":
        return "bg-red-500/15 text-red-400 border border-red-500/30";
      default:
        return "bg-slate-500/15 text-slate-300 border border-slate-500/30";
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white px-4 py-10">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold tracking-tight">Owner Requests</h1>
          <p className="mt-2 text-slate-400">
            Requests from tenants for your properties
          </p>
        </div>

        {message && (
          <div className="mb-6 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-emerald-400 shadow-lg">
            {message}
          </div>
        )}

        <div className="overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/80 shadow-2xl backdrop-blur">
          {userProfile.tenant_applications_to_own_properties?.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm md:text-base">
                <thead className="bg-slate-800/80 text-slate-300">
                  <tr>
                    <th className="px-6 py-4  font-semibold">Address</th>
                    <th className="px-6 py-4  font-semibold">Unit</th>
                    <th className="px-6 py-4  font-semibold">Tenant Email</th>
                    <th className="px-6 py-4  font-semibold">Tenant Phone</th>
                    <th className="px-6 py-4  font-semibold">Status</th>
                    <th className="px-6 py-4 text-center font-semibold">Action</th>
                  </tr>
                </thead>

                <tbody>
                  {userProfile.tenant_applications_to_own_properties.map((request, index) => (
                    <tr
                      key={request.id || index}
                      className="border-t border-slate-800 hover:bg-slate-800/40 transition-colors"
                    >
                      <td className="px-6 py-4 font-medium text-slate-100">
                        {request.property.address}
                      </td>

                      <td className="px-6 py-4 text-slate-300">
                        {request.property.unit_number}
                      </td>

                      <td className="px-6 py-4 text-slate-300">
                        {request.tenant.email}
                      </td>

                      <td className="px-6 py-4 text-slate-300">
                        {request.tenant.phone || "No phone"}
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-xs md:text-sm font-semibold ${getStatusStyle(
                            request.status
                          )}`}
                        >
                          {request.status}
                        </span>
                      </td>

                      <td className="px-6 py-4 text-center">
                        <button
                          type="button"
                          onClick={() => deleteRequest(request.id, token)}
                          className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm font-medium text-red-400 transition-all hover:bg-red-500/20 hover:scale-105 active:scale-95"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
              <h2 className="text-2xl font-semibold text-slate-200">
                No requests yet
              </h2>
              <p className="mt-2 text-slate-400">
                Tenant requests for your properties will appear here.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};