// import { useState ,useContext,useCallback,useEffect} from "react";
// import { useNavigate } from "react-router-dom";
// import UserContext from "../context/UserContext";
// import axios from "axios";

// export const Edit = () => {
//   const { userProfile, fetchProfile } = useContext(UserContext);
//   const [email, setEmail] = useState("");
//   const [name, setName] = useState("");
//   const [lastName, setlastName] = useState("");
//   const [role, setRole] = useState("OWNER");
//   const [password, setPassword] = useState("");
//   const [phone, setPhone] = useState("");
//   const navigate = useNavigate();


//   const token = sessionStorage.getItem("token");

//   useEffect(() => {
//     fetchProfile();
//   }, []);
  

// useEffect(() => {
//     if (userProfile) {
//       setEmail(userProfile.email || "");
//       setName(userProfile.first_name || "");
//       setlastName(userProfile.last_name || "");
//       setPhone(userProfile.phone || "");
//       setPassword(userProfile.password || "");
//       setRole(userProfile.role || "OWNER");
//       console.log(userProfile)
//     }
//   }, [userProfile]);
  
 
//   const onSumbit = async (e) => {
//     e.preventDefault();

//     console.log("submit");
//     console.log(email, name, role, phone);
//     console.log(userProfile.id)

//     const response = await axios.put(
//       `http://127.0.0.1:5000/api/v1/users/edit/${userProfile.id}`,
//       {
//         first_name: name,
//         last_name: lastName,
//         phone: phone,
//         password: password,
//         email: email,
//         // role: role,
//       },
//       {
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//       }
//     );
//   };

//   return (
//     <div className="container  flex items-center justify-center mt-10 bg-background text-foreground ">
//       <form
//         onSubmit={onSumbit}

//         className="bg-card border p-8 rounded-2xl shadow-lg w-full max-w-sm space-y-6"
//       >
//         <h1 className="text-3xl font-semibold text-center">Sign Up</h1>

//         {/* Email */}
//         <div className="flex flex-col text-left">
//           <label className="mb-1 font-medium">Email</label>
//           <input
//             type="email"
//             className="px-3 py-2 rounded-md border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
//             placeholder="name@example.com"
//             value={email}
//             required
//             onChange={(e) => setEmail(e.target.value)}
//           />
//         </div>

//         <div className="flex flex-col text-left">
//           <label className="mb-1 font-medium">Phone</label>
//           <input
//             type="text"
//             className="px-3 py-2 rounded-md border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
//             placeholder="phone"
//             value={phone}
//             required
//             minLength={1}
//             maxLength={10}
//             onChange={(e) => setPhone(e.target.value)}
//           />
//         </div>

//         <div className="flex flex-col text-left">
//           <label className="mb-1 font-medium">name</label>
//           <input
//             type="text"
//             className="px-3 py-2 rounded-md border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
//             placeholder="name"
//             value={name}
//             required
//             onChange={(e) => setName(e.target.value)}/>
//         </div>

//         <div className="flex flex-col text-left">
//           <label className="mb-1 font-medium">lastName</label>
//           <input
//             type="text"
//             className="px-3 py-2 rounded-md border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
//             placeholder="lastName"
//             value={lastName}
//             required
//             onChange={(e) => setlastName(e.target.value)}/>
//         </div>

//         Password
//         <div className="flex flex-col text-left">
//           <label className="mb-1 font-medium">Password</label>
//           <input
//             type="password"
//             className="px-3 py-2 rounded-md border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
//             placeholder="••••••••••"
//             value={password}
//             minLength={1}
//             onChange={(e) => setPassword(e.target.value)}
//           />
//         </div>

//         {/* Button */}
//         <button
//           type="submit"
//           className="w-full py-2 rounded-md bg-primary text-primary-foreground font-medium hover:opacity-90 transition"
//          >
//           Confirm
//         </button>

//         <p className="text-center text-sm text-foreground/60">
//           Don't have an account?{" "}
//           <a href="/signup" className="text-primary hover:underline">
//             Sign Up
//           </a>
//         </p>
//       </form>
//     </div>

//   );
// };







import { useState, useContext, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import UserContext from "../context/UserContext";
import axios from "axios";

export const Edit = () => {
  const { userProfile, fetchProfile } = useContext(UserContext);

  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [lastName, setLastName] = useState("");
  const [role, setRole] = useState("OWNER");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const token = sessionStorage.getItem("token");

  useEffect(() => {
    fetchProfile();
  }, []);

  useEffect(() => {
    if (userProfile) {
      setEmail(userProfile.email || "");
      setName(userProfile.first_name || "");
      setLastName(userProfile.last_name || "");
      setPhone(userProfile.phone || "");
      setRole(userProfile.role || "OWNER");
    }
  }, [userProfile]);

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    try {
      await axios.put(
        `http://127.0.0.1:5000/api/v1/users/edit/${userProfile.id}`,
        {
          first_name: name,
          last_name: lastName,
          phone,
          password,
          email,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage("Profile updated successfully");
      fetchProfile();
      setTimeout(() => navigate("/profile"), 800);
    } catch (err) {
      setError("Failed to update profile");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white px-4 py-10 flex items-center justify-center">
      <div className="w-full max-w-xl">
        <div className="rounded-3xl border border-slate-800 bg-slate-900/80 shadow-2xl backdrop-blur p-8 md:p-10">
          <div className="mb-8 text-center">
            <h1 className="text-4xl font-bold tracking-tight">Edit Profile</h1>
            <p className="mt-2 text-slate-400">
              Update your personal information
            </p>
          </div>

          {message && (
            <div className="mb-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-400">
              {message}
            </div>
          )}

          {error && (
            <div className="mb-4 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
              {error}
            </div>
          )}

          <form onSubmit={onSubmit} className="space-y-5">
            <div className="grid gap-5 md:grid-cols-2">
              <div className="flex flex-col text-left">
                <label className="mb-2 text-sm font-medium text-slate-300">
                  First Name
                </label>
                <input
                  type="text"
                  className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white placeholder:text-slate-500 outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
                  placeholder="First name"
                  value={name}
                  required
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div className="flex flex-col text-left">
                <label className="mb-2 text-sm font-medium text-slate-300">
                  Last Name
                </label>
                <input
                  type="text"
                  className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white placeholder:text-slate-500 outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
                  placeholder="Last name"
                  value={lastName}
                  required
                  onChange={(e) => setLastName(e.target.value)}
                />
              </div>
            </div>

            <div className="flex flex-col text-left">
              <label className="mb-2 text-sm font-medium text-slate-300">
                Email
              </label>
              <input
                type="email"
                className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white placeholder:text-slate-500 outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
                placeholder="name@example.com"
                value={email}
                required
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <div className="flex flex-col text-left">
                <label className="mb-2 text-sm font-medium text-slate-300">
                  Phone
                </label>
                <input
                  type="text"
                  className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white placeholder:text-slate-500 outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
                  placeholder="Phone number"
                  value={phone}
                  required
                  maxLength={10}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>

              <div className="flex flex-col text-left">
                <label className="mb-2 text-sm font-medium text-slate-300">
                  Role
                </label>
                <input
                  type="text"
                  value={role}
                  disabled
                  className="rounded-xl border border-slate-800 bg-slate-800 px-4 py-3 text-slate-400 cursor-not-allowed"
                />
              </div>
            </div>

            <div className="flex flex-col text-left">
              <label className="mb-2 text-sm font-medium text-slate-300">
                New Password
              </label>
              <input
                type="password"
                className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white placeholder:text-slate-500 outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
                placeholder="Leave empty if you don't want to change it"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                disabled={loading}
                className={`flex-1 rounded-xl px-4 py-3 font-semibold transition ${
                  loading
                    ? "bg-slate-700 text-slate-400 cursor-not-allowed"
                    : "bg-purple-500 text-white hover:bg-purple-400 active:scale-[0.98]"
                }`}
              >
                {loading ? "Saving..." : "Confirm"}
              </button>

              <button
                type="button"
                onClick={() => navigate("/profile")}
                className="flex-1 rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 font-semibold text-slate-200 transition hover:bg-slate-700"
              >
                Cancel
              </button>
            </div>

            <p className="text-center text-sm text-slate-400 pt-2">
              Want a new account instead?{" "}
              <Link to="/signup" className="text-purple-400 hover:underline">
                Sign Up
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};