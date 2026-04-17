import { useState,useContext, useEffect } from "react";
import { Navbar } from "../components/Navbar";
import { ThemeToggle } from "../components/ThemeToggle";
import PropertyContext from "../context/PropertyContext";

export const Home = () => {
  const { fetchApprovedProperties, approvedProperties } =  useContext(PropertyContext);
  const [status, setStatus] = useState(""); 
  
  useEffect(() => {
    fetchApprovedProperties();
  }, []);

  return (
    <>
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center overflow-hidden bg-slate-950">
        {/* Subtle grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />

        <div className="container relative z-10 mx-auto px-6 py-24 flex flex-col lg:flex-row items-center gap-16">
          {/* Left — Text */}
          <div className="flex-1 flex flex-col gap-6 animate-fade-in-delay-1">
            {/* Eyebrow pill */}
            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-violet-500/30 bg-violet-500/10 px-4 py-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-violet-400 animate-pulse" />
              <span className="text-sm font-medium text-violet-300 tracking-wide">
                Find your next home
              </span>
            </div>

            <h1 className="text-5xl lg:text-6xl font-bold leading-tight text-white">
              The home you{" "}
              <span className="relative inline-block">
                <span className="relative z-10 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">
                  deserve
                </span>
                <span className="absolute bottom-1 left-0 w-full h-[6px] rounded-full bg-gradient-to-r from-violet-500/40 to-indigo-500/40 blur-sm" />
              </span>{" "}
              is one search away.
            </h1>

            <p className="text-lg text-slate-400 max-w-lg leading-relaxed">
              Browse hundreds of verified rental listings. No hidden fees, no
              endless calls — just find a place you love and move in.
            </p>
          </div>

          {/* Right — Property cards */}
          <div className="flex-1 relative hidden lg:flex flex-col items-center justify-center gap-4 animate-fade-in-delay-2">
            {approvedProperties?.slice(0, 3).map((property) => (
              <div
                key={property.id}
                className="w-full max-w-sm rounded-2xl overflow-hidden border border-white/10 bg-slate-900 shadow-xl shadow-violet-900/20"
              >
                {/* Image */}
                <div className="h-36 bg-slate-800 overflow-hidden relative">
                  {property.image ? (
                    <img
                      src={`http://localhost:5000/${property.image}`}
                      alt={property.address}
                      className="w-full h-full object-cover" 
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-violet-800 via-indigo-800 to-slate-800" />
                  )}
                  <span className="absolute top-3 right-3 rounded-full bg-emerald-500/20 border border-emerald-500/30 px-3 py-1 text-xs text-emerald-300 font-medium backdrop-blur-sm">
                    Available
                  </span>
                </div>

                {/* Info */}
                <div className="p-4 flex justify-between items-center">
                  <div>
                    <p className="text-white font-semibold text-sm">
                      📍 {property.address}
                    </p>
                    <p className="text-slate-400 text-xs mt-1">
                      {property.square_feet} m²
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-violet-400 font-bold text-lg">
                      €{property.price}
                    </p>
                    <p className="text-slate-500 text-xs">/month</p>
                  </div>
                </div>
              </div>
            ))}

            {/* Floating badge */}
            <div className="absolute -top-4 -right-4 z-20 bg-slate-800 border border-white/10 rounded-2xl px-4 py-3 shadow-xl flex items-center gap-2">
              <span className="text-green-400 text-lg">✓</span>
              <div>
                <p className="text-white text-xs font-semibold">Verified</p>
                <p className="text-slate-400 text-xs">No deposit scams</p>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-slate-950 to-transparent pointer-events-none" />
      </section>
    </>
  );
};
