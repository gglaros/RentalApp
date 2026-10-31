import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { usersApi } from "../api/users";
import { errorMessage } from "../utils/api";

const ROLES = ["OWNER", "TENANT"];

const inputClass =
  "w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none transition-all duration-200 focus:border-violet-500/60 focus:ring-2 focus:ring-violet-500/20";

export const SignIn = () => {
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
      await usersApi.signUp({
        first_name: form.name,
        last_name: form.lastName,
        phone: form.phone,
        password: form.password,
        email: form.email,
        role: form.role,
      });
      navigate("/login");
    } catch (err) {
      setError(errorMessage(err, "Something went wrong. Try again."));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-blue-900/40 flex items-center justify-center px-4 py-16">

      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-violet-600/10 blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">

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

        <div className="rounded-2xl border border-white/8 bg-slate-900/60 backdrop-blur-sm p-8">

          {error && (
            <div className="mb-6 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
              {error}
            </div>
          )}

          <form onSubmit={onSubmit} className="space-y-5">

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

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">I am a</label>
              <div className="grid grid-cols-2 gap-2">
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

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">Password</label>
              <input
                name="password"
                type="password"
                className={inputClass}
                placeholder="••••••••••"
                value={form.password}
                required
                minLength={8}
                autoComplete="new-password"
                onChange={handleChange}
              />
            </div>

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