// import { useState,useEffect,useCallback,useContext } from "react"
// import { useNavigate } from "react-router-dom";
// import UserContext from "../../context/UserContext"
// import OwnerAppCotext from "../../context/OwnerAppContext";
// import AdminContext from "../../context/AdminContext";
// import axios from "axios";

// export const  AllUsers = () => {

//     const {makeApp,deleteApp,message} = useContext(OwnerAppCotext)
//     const {getAllApps,apps,approveApp,getAllUsers,users,deleteUser} = useContext(AdminContext)
//     const token = sessionStorage.getItem("token");
//     const [refresh, setRefresh] = useState(false);
//     const navigate = useNavigate();
    
//     useEffect(() => {
//       getAllUsers(token);
//      }, [refresh]);
     
//      const handleDeleteUser = async (id,token) => {
//       console.log(id)
//        await deleteUser(id, token);
//        setRefresh(prev => !prev); 
//      };
     
    
// return (
//     <> 
//     <div className="container  min-h-100  flex flex-col items-center justify-center">
//     <h1 className="text-2xl mb-4 w-50 hover:text-red-400">Users</h1>
//         <table className="w-full text-2xl">
//         <thead>
//           <tr>
//             <th>email</th>
//             <th>phone number</th>
//             <th>first_name</th>
//             <th>Role</th>
//             <th>Delete</th>
//           </tr>
//         </thead>
//         <tbody>
//           {users?.map((user, index) => (
//             <tr className="border-4" key={user.id || index}>
//               <td>{user.email}</td>
//               <td>{user.phone}</td>
//               <td>{user.first_name}</td>
//               <td>{user.role}</td>
              
//               <td>
//               <button type="button"
//                   className="mt-3 relative bottom-1.5  rounded-2xl text-2xl bg-red-500 text-black border-2 "
//                   onClick={ () => handleDeleteUser(user.id,token)}>
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


import { useState, useEffect, useContext } from "react";
import AdminContext from "../../context/AdminContext";

export const AllUsers = () => {
  const { getAllUsers, users, deleteUser } = useContext(AdminContext);

  const token = sessionStorage.getItem("token");
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    getAllUsers(token);
  }, [refresh]);

  const handleDeleteUser = async (id) => {
    await deleteUser(id, token);
    setRefresh((prev) => !prev);
  };

  const getRoleStyle = (role) => {
    switch (role?.toUpperCase()) {
      case "ADMIN":
        return "bg-purple-500/15 text-purple-400 border border-purple-500/30";
      case "OWNER":
        return "bg-blue-500/15 text-blue-400 border border-blue-500/30";
      case "TENANT":
        return "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30";
      default:
        return "bg-slate-500/15 text-slate-300 border border-slate-500/30";
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white px-4 py-10">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold tracking-tight">All Users</h1>
          <p className="mt-2 text-slate-400">
            Manage all users in the system
          </p>
        </div>

        {/* Table */}
        <div className="overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/80 shadow-2xl backdrop-blur">
          {users?.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm md:text-base">
                
                <thead className="bg-slate-800/80 text-slate-300">
                  <tr>
                    <th className="px-6 py-4  font-semibold">Email</th>
                    <th className="px-6 py-4  font-semibold">Phone</th>
                    <th className="px-6 py-4  font-semibold">Name</th>
                    <th className="px-6 py-4  font-semibold">Role</th>
                    <th className="px-6 py-4 text-center font-semibold">Delete</th>
                  </tr>
                </thead>

                <tbody>
                  {users.map((user, index) => (
                    <tr
                      key={user.id || index}
                      className="border-t border-slate-800 hover:bg-slate-800/40 transition-colors"
                    >
                      <td className="px-6 py-4 font-medium text-slate-100">
                        {user.email}
                      </td>

                      <td className="px-6 py-4 text-slate-300">
                        {user.phone || "—"}
                      </td>

                      <td className="px-6 py-4 text-slate-300">
                        {user.first_name || "—"}
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-xs md:text-sm font-semibold ${getRoleStyle(
                            user.role
                          )}`}
                        >
                          {user.role}
                        </span>
                      </td>

                      <td className="px-6 py-4 text-center">
                        <button
                          type="button"
                          onClick={() => handleDeleteUser(user.id)}
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
                No users found
              </h2>
              <p className="mt-2 text-slate-400">
                Users will appear here once they are created.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};