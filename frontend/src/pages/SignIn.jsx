// import { useState ,useContext,useCallback,useEffect} from "react";
// import { useNavigate } from "react-router-dom";
// import UserContext from "../context/UserContext";
// import axios from "axios";

// export const SignIn = () => {
//   const { userProfile, fetchProfile } = useContext(UserContext);
//   const [email, setEmail] = useState("");
//   const [name, setName] = useState("");
//   const [lastName, setlastName] = useState("");
//   const [role, setRole] = useState("OWNER");
//   const [password, setPassword] = useState("");
//   const [phone, setPhone] = useState("");
//   const navigate = useNavigate();


//   const token = sessionStorage.getItem("token");

//   // useEffect(() => {
//   //   fetchProfile();
//   // }, []);
  
  

//   const onSumbit = async (e) => {
//     e.preventDefault();

//     console.log("submit");
//     console.log(email, name, role, phone);

//     const response = await axios.post(
//       "http://127.0.0.1:5000/api/v1/users/",
//       {
//         first_name: name,
//         last_name: lastName,
//         phone: phone,
//         password: password,
//         email: email,
//         role: role,
//       },
//       {
//         headers: {
//           "Content-Type": "application/json",
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

//         <div className="flex flex-col text-left">
//           <label className="mb-1 font-medium">role</label>
//           <select
//             className="px-3 py-2 rounded-md border bg-background  focus:ring-primary"
//             value={role}
//             onChange={(e) => setRole(e.target.value)}
//           >
//             <option value="OWNER">OWNER</option>
//             <option value="TENANT">TENANT</option>
//             <option value="ADMIN">ADMIN</option>
//           </select>
//         </div>

//         {/* Password */}
//         <div className="flex flex-col text-left">
//           <label className="mb-1 font-medium">Password</label>
//           <input
//             type="password"
//             className="px-3 py-2 rounded-md border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
//             placeholder="••••••••••"
//             value={password}
//             required
//             minLength={1}
//             onChange={(e) => setPassword(e.target.value)}
//           />
//         </div>

//         {/* Button */}
//         <button
//           type="submit"
//           className="w-full py-2 rounded-md bg-primary text-primary-foreground font-medium hover:opacity-90 transition"
//           onClick={() => navigate("/login")}>
//           Sign In
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


import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import UserContext from "../context/UserContext";
import axios from "axios";

const ROLES = ["OWNER", "TENANT", "ADMIN"];

const inputClass =
  "w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none transition-all duration-200 focus:border-violet-500/60 focus:ring-2 focus:ring-violet-500/20";

export const SignIn = () => {
  const { } = useContext(UserContext);
  const [form, setForm] = useState({
    email: "",
    name: "",
    lastName: "",
    role: "OWNER",
    password: "",
    phone: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await axios.post(
        "http://127.0.0.1:5000/api/v1/users/",
        {
          first_name: form.name,
          last_name: form.lastName,
          phone: form.phone,
          password: form.password,
          email: form.email,
          role: form.role,
        },
        { headers: { "Content-Type": "application/json" } }
      );
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-blue-900/40 flex items-center justify-center px-4 py-16">

      {/* Ambient glow */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-violet-600/10 blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">

        {/* Header */}
        <div className="mb-8 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-violet-500/30 bg-ted-500/10 px-4 py-1.5 mb-6">
            <span className="h-1.5 w-1.5 rounded-full bg-violet-400 animate-pulse" />
            <span className="text-xs font-medium text-violet-300 tracking-wide">Create your account</span>
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Sign Up</h1>
          <p className="mt-2 text-sm text-slate-400">
            Already have an account?{" "}
            <a href="/login" className="text-violet-400 hover:text-violet-300 transition-colors">
              Log in
            </a>
          </p>
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-white/8 bg-slate-900/60 backdrop-blur-sm p-8">

          {error && (
            <div className="mb-6 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
              {error}
            </div>
          )}

          <form onSubmit={onSubmit} className="space-y-5">

            {/* Name row */}
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">First name</label>
                <input
                  name="name"
                  type="text"
                  className={inputClass}
                  placeholder="John"
                  value={form.name}
                  required
                  onChange={handleChange}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">Last name</label>
                <input
                  name="lastName"
                  type="text"
                  className={inputClass}
                  placeholder="Doe"
                  value={form.lastName}
                  required
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Email */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">Email</label>
              <input
                name="email"
                type="email"
                className={inputClass}
                placeholder="john@example.com"
                value={form.email}
                required
                onChange={handleChange}
              />
            </div>

            {/* Phone */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">Phone</label>
              <input
                name="phone"
                type="text"
                className={inputClass}
                placeholder="69xxxxxxxx"
                value={form.phone}
                required
                maxLength={10}
                onChange={handleChange}
              />
            </div>

            {/* Role */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">I am a</label>
              <div className="grid grid-cols-3 gap-2">
                {ROLES.map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setForm((prev) => ({ ...prev, role: r }))}
                    className={`py-2 rounded-xl border text-xs font-semibold tracking-wide transition-all duration-200
                      ${form.role === r
                        ? "border-blue-500/60 bg-violet-500/20 text-violet-300"
                        : "border-white/10 bg-slate-900 text-slate-500 hover:border-white/20 hover:text-slate-300"
                      }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">Password</label>
              <input
                name="password"
                type="password"
                className={inputClass}
                placeholder="••••••••••"
                value={form.password}
                required
                minLength={1}
                onChange={handleChange}
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 mt-2 rounded-xl bg-gradient-to-r from-red-600 to-indigo-600 text-sm font-semibold text-white hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Creating account..." : "Create account"}
            </button>

          </form>
        </div>
      </div>
    </div>
  );
};