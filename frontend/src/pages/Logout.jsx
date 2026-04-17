import { useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import UserContext from "../context/UserContext";

export const Logout = () => {
  const { logout } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    logout();

    setTimeout(() => {
      navigate("/login");
    }, 1500);
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center px-4">
      <div className="w-full max-w-md rounded-3xl border border-slate-800 bg-slate-900/80 shadow-2xl backdrop-blur p-8 text-center">
        
        {/* Icon */}
        <div className="mb-6 flex justify-center">
          <div className="h-16 w-16 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center">
            <span className="text-2xl text-red-400">⎋</span>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-3xl font-bold mb-2">Logging out...</h1>
        <p className="text-slate-400 mb-6">
          You are being securely logged out
        </p>

        {/* Spinner */}
        <div className="flex justify-center mb-6">
          <div className="h-10 w-10 rounded-full border-4 border-slate-700 border-t-red-500 animate-spin" />
        </div>

        {/* Manual button (fallback) */}
        <button
          onClick={() => navigate("/login")}
          className="rounded-xl bg-red-500 px-5 py-3 font-semibold text-white transition hover:bg-red-400 active:scale-[0.98]"
        >
          Go to Login
        </button>
      </div>
    </div>
  );
};