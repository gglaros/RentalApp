import { useState ,useContext,useCallback,useEffect} from "react";
import { useNavigate } from "react-router-dom";
import UserContext from "../context/UserContext";
import axios from "axios";

export const Edit = () => {
  const { userProfile, fetchProfile } = useContext(UserContext);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [lastName, setlastName] = useState("");
  const [role, setRole] = useState("OWNER");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const navigate = useNavigate();


  const token = sessionStorage.getItem("token");

  useEffect(() => {
    fetchProfile();
  }, []);
  

useEffect(() => {
    if (userProfile) {
      setEmail(userProfile.email || "");
      setName(userProfile.first_name || "");
      setlastName(userProfile.last_name || "");
      setPhone(userProfile.phone || "");
      setPassword(userProfile.password || "");
      setRole(userProfile.role || "OWNER");
      console.log(userProfile)
    }
  }, [userProfile]);
  
 
  const onSumbit = async (e) => {
    e.preventDefault();

    console.log("submit");
    console.log(email, name, role, phone);
    console.log(userProfile.id)

    const response = await axios.put(
      `http://127.0.0.1:5000/api/v1/users/edit/${userProfile.id}`,
      {
        first_name: name,
        last_name: lastName,
        phone: phone,
        password: password,
        email: email,
        // role: role,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
  };

  return (
    <div className="container  flex items-center justify-center mt-10 bg-background text-foreground ">
      <form
        onSubmit={onSumbit}

        className="bg-card border p-8 rounded-2xl shadow-lg w-full max-w-sm space-y-6"
      >
        <h1 className="text-3xl font-semibold text-center">Sign Up</h1>

        {/* Email */}
        <div className="flex flex-col text-left">
          <label className="mb-1 font-medium">Email</label>
          <input
            type="email"
            className="px-3 py-2 rounded-md border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="name@example.com"
            value={email}
            required
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="flex flex-col text-left">
          <label className="mb-1 font-medium">Phone</label>
          <input
            type="text"
            className="px-3 py-2 rounded-md border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="phone"
            value={phone}
            required
            minLength={1}
            maxLength={10}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>

        <div className="flex flex-col text-left">
          <label className="mb-1 font-medium">name</label>
          <input
            type="text"
            className="px-3 py-2 rounded-md border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="name"
            value={name}
            required
            onChange={(e) => setName(e.target.value)}/>
        </div>

        <div className="flex flex-col text-left">
          <label className="mb-1 font-medium">lastName</label>
          <input
            type="text"
            className="px-3 py-2 rounded-md border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="lastName"
            value={lastName}
            required
            onChange={(e) => setlastName(e.target.value)}/>
        </div>

        Password
        <div className="flex flex-col text-left">
          <label className="mb-1 font-medium">Password</label>
          <input
            type="password"
            className="px-3 py-2 rounded-md border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="••••••••••"
            value={password}
            minLength={1}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {/* Button */}
        <button
          type="submit"
          className="w-full py-2 rounded-md bg-primary text-primary-foreground font-medium hover:opacity-90 transition"
         >
          Confirm
        </button>

        <p className="text-center text-sm text-foreground/60">
          Don't have an account?{" "}
          <a href="/signup" className="text-primary hover:underline">
            Sign Up
          </a>
        </p>
      </form>
    </div>

  );
};





