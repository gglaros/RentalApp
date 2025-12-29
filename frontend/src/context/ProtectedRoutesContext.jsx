// import { createContext, useState, useCallback, useContext, use } from "react";
// import { Outlet,useNavigate,Navigate } from "react-router-dom";
// import UserContext from "../context/UserContext";
// import axios from "axios";

// const ProtectedRoutesContext = createContext();

// function ProtectedRoutesProvider({ children }) {
//     const { userProfile, fetchProfile } = useContext(UserContext);
//     const navigate = useNavigate();
    
//     const AdminRoutes = () => {
//         console.log(userProfile.role)
//         return userProfile.role === "TENANT"
//         ? <Outlet />
//         : <Navigate to="/login" replace />;
//   }
 


// const valueToShare = {
//  AdminRoutes,
// };



//   return (
//     <ProtectedRoutesContext.Provider value={valueToShare}>
//       {children}
//     </ProtectedRoutesContext.Provider>
//   );

// }
// export { ProtectedRoutesProvider };
// export default ProtectedRoutesContext;