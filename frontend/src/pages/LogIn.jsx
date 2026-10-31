import { useState, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import UserContext from "../context/UserContext";

export const LogIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const [loading, setLoading] = useState(false);

  const { login } = useContext(UserContext);
  const navigate = useNavigate();
  const location = useLocation();

  const redirectTo = location.state?.from?.pathname || "/profile";

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");

    setLoading(true);
    try {
      await login(email, password);
      navigate(redirectTo, { replace: true });
    } catch {
      setError("Invalid email or password");
    } finally {
      setLoading(false);
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
              disabled={loading}
              className="w-full rounded-xl bg-emerald-500 disabled:opacity-50 px-4 py-3 font-semibold text-slate-950 transition hover:bg-emerald-400 active:scale-[0.98]"
            >
              {loading ? "Logging in..." : "Log in"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};