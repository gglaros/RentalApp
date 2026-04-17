// import { useState, useEffect, useCallback, useContext } from "react";
// import { useNavigate } from "react-router-dom";
// import UserContext from "../context/UserContext";
// import axios from "axios"; 


// export const LogIn = () => {
//     const [email, setEmail] = useState("");
//     const [password,setPassword] = useState("");
//     const { userProfile, fetchProfile,setToken } = useContext(UserContext);
//     const navigate = useNavigate();

//     useEffect(() => {
//       if (userProfile) {
//         navigate("/profile");
//       }
//     }, [userProfile, navigate]);


//     const onSumbit = async (e) =>{
//         e.preventDefault();

//         const response = await axios.post(
//           "http://127.0.0.1:5000/api/v1/users/login",
//           {
//             password: password,
//             email: email,
//           },
//           {
//             headers: {
//               "Content-Type": "application/json",
//             },
//           }
//         );

//         if (response.data.token) {
//             sessionStorage.setItem("token", response.data.token);
//             setToken(response.data.token)
//         }
//     }
    

//     return (
//        <div className="container  flex items-center justify-center  h-[600px] bg-background text-foreground ">
//         <form onSubmit={onSumbit} className="bg-card border p-8 rounded-2xl shadow-lg w-full max-w-sm space-y-6">
//           <h1 className="text-3xl text-center">Log in</h1>

//           <div className="flex flex-col text-left">
            
//             <label>Email</label>
//             <input type="text"
//             className="px-3 py-2 rounded-md border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
//             placeholder="email"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             ></input>
//           </div>


//           <div className="flex flex-col text-left">
//             <label className="mb-1">Password</label>
//             <input type="text"
//             className="px-3 py-2 rounded-md border bg-background"
//             placeholder="password"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             >
//             </input>
//           </div>

//          <button type="submit" className="w-full py-2 rounded-md bg-primary hover:opacity-90 transition" >Log in </button>     
//         </form>
//        </div>

//     )

//     }



import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import UserContext from "../context/UserContext";
import axios from "axios";

export const LogIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const { userProfile, setToken } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (userProfile) {
      navigate("/profile");
    }
  }, [userProfile, navigate]);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await axios.post(
        "http://127.0.0.1:5000/api/v1/users/login",
        {
          email,
          password,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.token) {
        sessionStorage.setItem("token", response.data.token);
        setToken(response.data.token);
        navigate("/profile");
      }
    } catch (err) {
      setError("Invalid email or password");
      console.error(err);
    }
  };

  return (
    <div className="h-219 bg-slate-950 text-white flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="rounded-3xl border border-slate-800 bg-slate-900/80 shadow-2xl backdrop-blur p-8">
          <div className="mb-8 text-center">
            <h1 className="text-4xl font-bold tracking-tight">Welcome </h1>
            <p className="mt-2 text-slate-400">
              Sign in to access your account
            </p>
          </div>

          {error && (
            <div className="mb-4 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
              {error}
            </div>
          )}

          <form onSubmit={onSubmit} className="space-y-5">
            <div className="flex flex-col text-left">
              <label className="mb-2 text-sm font-medium text-slate-300">
                Email
              </label>
              <input
                type="email"
                className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white placeholder:text-slate-500 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="flex flex-col text-left">
              <label className="mb-2 text-sm font-medium text-slate-300">
                Password
              </label>
              <input
                type="password"
                className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white placeholder:text-slate-500 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className="w-full rounded-xl bg-emerald-500 px-4 py-3 font-semibold text-slate-950 transition hover:bg-emerald-400 active:scale-[0.98]"
            >
              Log in
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};