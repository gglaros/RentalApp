import { createContext, useState, useCallback, useContext, use } from "react";
import axios from "axios";

const TenantContext = createContext();

function TenantProvider({ children }) {
console.log("good morning tenantcontext");
  const [message, setMessage] = useState("");

    const makeApp = useCallback(async (prop_id,token) => {
        try {
          const response = await axios.post(
            `http://127.0.0.1:5000/api/v1/tenants/create/app/prop/${prop_id}`,
            {}, 
            {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            }
          );
          if (response.status == 201) {
            console.log("all good!");
          }
        } catch (error) {
          console.log(error.response.data)
          setMessage("You already made an application for this property.");
          console.error(error)
        }
        setTimeout(() => setMessage(""), 4000);
      }, []);










const valueToShare = {
    makeApp,
    message

};



  return (
    <TenantContext.Provider value={valueToShare}>
      {children}
    </TenantContext.Provider>
  );

}
export { TenantProvider };
export default TenantContext;