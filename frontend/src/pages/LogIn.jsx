import { useState, useEffect, useCallback, useContext } from "react";
import { useNavigate } from "react-router-dom";
import UserContext from "../context/UserContext";
import axios from "axios"; 


export const LogIn = () => {
    const [email, setEmail] = useState("");
    const [password,setPassword] = useState("");
    const { userProfile, fetchProfile,setToken } = useContext(UserContext);
    const navigate = useNavigate();

    useEffect(() => {
      if (userProfile) {
        navigate("/profile");
      }
    }, [userProfile, navigate]);


    const onSumbit = async (e) =>{
        e.preventDefault();

        const response = await axios.post(
          "http://127.0.0.1:5000/api/v1/users/login",
          {
            password: password,
            email: email,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (response.data.token) {
            sessionStorage.setItem("token", response.data.token);
            setToken(response.data.token)
        }
    }
    

    return (
       <div className="container  flex items-center justify-center  h-[600px] bg-background text-foreground ">
        <form onSubmit={onSumbit} className="bg-card border p-8 rounded-2xl shadow-lg w-full max-w-sm space-y-6">
          <h1 className="text-3xl text-center">Log in</h1>

          <div className="flex flex-col text-left">
            
            <label>Email</label>
            <input type="text"
            className="px-3 py-2 rounded-md border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            ></input>
          </div>


          <div className="flex flex-col text-left">
            <label className="mb-1">Password</label>
            <input type="text"
            className="px-3 py-2 rounded-md border bg-background"
            placeholder="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            >
            </input>
          </div>

         <button type="submit" className="w-full py-2 rounded-md bg-primary hover:opacity-90 transition" >Log in </button>     
        </form>
       </div>

    )

    }
