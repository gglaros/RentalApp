import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import UserContext from "../../context/UserContext";
import PropertyContext from "../../context/PropertyContext";
import OwnerAppContext from "../../context/OwnerAppContext";

const API = "http://localhost:5000";

const StatusBadge = ({ status }) => {
  const styles = {
    available: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
    rented: "bg-amber-500/15 text-amber-400 border-amber-500/30",
    unavailable: "bg-red-500/15 text-red-400 border-red-500/30",
  };
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
        styles[status?.toLowerCase()] ??
        "bg-slate-500/15 text-slate-400 border-slate-500/30"
      }`}
    >
      {status ?? "—"}
    </span>
  );
};

const Avatar = ({ name }) => {
  const initials = name ? name.slice(0, 2).toUpperCase() : "?";
  return (
    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white text-xl font-bold shadow-lg shadow-violet-500/30">
      {initials}
    </div>
  );
};

export const OwnerProfile = () => {
  const { userProfile } = useContext(UserContext);
  const { deleteProperty } = useContext(PropertyContext);
  const { makeApp, message } = useContext(OwnerAppContext);
  const count = 1;
  const navigate = useNavigate();
  const token = sessionStorage.getItem("token");

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="max-w-6xl mx-auto px-4 py-10 space-y-8">
        {message && (
          <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-red-400 text-sm">
            {message}
          </div>
        )}

        {/* Profile card */}
        <div className="rounded-2xl border border-white/8 bg-slate-900/60 backdrop-blur p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
            <Avatar name={userProfile.first_name} />

            <div className="flex-1 space-y-1">
              <h1 className="text-2xl font-semibold">
                {userProfile.first_name}
              </h1>
              <p className="text-slate-400 text-sm">{userProfile.email}</p>
              <span className="inline-flex items-center gap-1.5 text-xs font-medium bg-violet-500/15 text-violet-300 border border-violet-500/30 px-2.5 py-1 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-violet-400" />
                {userProfile.role}
              </span>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => navigate("/ownerApps")}
                className="px-4 py-2 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-sm font-medium transition-colors"
              >
                Applications
              </button>
              <button
                onClick={() => navigate("/ownerRequests")}
                className="px-4 py-2 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-sm font-medium transition-colors"
              >
                Requests
              </button>
              <button
                onClick={() => navigate("/Edit")}
                className="px-4 py-2 rounded-xl border border-violet-500/40 bg-violet-500/15 hover:bg-violet-500/25 text-violet-300 text-sm font-medium transition-colors"
              >
                Edit profile
              </button>
            </div>
          </div>
        </div>

        {/* Properties */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">My Properties</h2>
            <button
              onClick={() => navigate("/propertyform")}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:opacity-90 text-sm font-semibold transition-opacity"
            >
              <span className="text-base leading-none">+</span> Add Property
            </button>
          </div>

          {/* Property cards grid */}
          {userProfile.properties?.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {userProfile.properties.map((property, index) => (
                <div
                  key={property.id || index}
                  className="group rounded-2xl border border-white/8 bg-slate-900/60 overflow-hidden hover:border-violet-500/30 transition-colors"
                >
                  {/* Image */}
                  <div className="relative h-44 bg-slate-800 overflow-hidden">
                    {property.image ? (
                      <img
                        src={`${API}/${property.image}`}
                        alt={property.address}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-slate-600 gap-2">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="w-10 h-10"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={1}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M3 9.75L12 3l9 6.75V21H3V9.75z"
                          />
                        </svg>
                        <span className="text-xs">No image</span>
                      </div>
                    )}
                    <div className="absolute top-2 right-2">
                      <StatusBadge status={property.status} />
                    </div>
                  </div>

                  {/* Info */}
                  <div className="p-4 space-y-3">
                    <div>
                      <p className="font-medium text-sm truncate">
                        {property.address}
                      </p>
                      <p className="text-slate-400 text-xs mt-0.5 line-clamp-2">
                        {property.description}
                      </p>
                    </div>

                    <div className="flex items-center justify-between text-xs text-slate-400">
                      <span>{property.square_feet} m²</span>
                      <span>{property.year_built}</span>
                      <span className="text-violet-400 font-semibold text-sm">
                        €{property.price}/mo
                      </span>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 pt-1">
                      <button
                        onClick={() => makeApp(property.id, token)}
                        disabled={property.status === "APPROVED"}
                        className={`flex-1 py-1.5 rounded-lg border text-xs font-medium transition-colors
    ${
      property.status === "APPROVED" 
        ? "border-slate-700 bg-slate-800 text-slate-500 cursor-not-allowed"
        : "border-emerald-500/30 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 cursor-pointer"
    }`}
                      >
                        {property.status === "approved" ? "Approved" : "Apply"}
                      </button>

                      <button
                        onClick={() => deleteProperty(property.id, token)}
                        className="flex-1 py-1.5 rounded-lg border border-red-500/30 bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-medium transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-white/10 py-16 flex flex-col items-center justify-center gap-3 text-slate-500">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-10 h-10"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 9.75L12 3l9 6.75V21H3V9.75z"
                />
              </svg>
              <p className="text-sm">No properties yet</p>
              <button
                onClick={() => navigate("/propertyform")}
                className="mt-1 px-4 py-2 rounded-xl bg-violet-600/20 border border-violet-500/30 text-violet-300 text-sm hover:bg-violet-600/30 transition-colors"
              >
                Add your first property
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
