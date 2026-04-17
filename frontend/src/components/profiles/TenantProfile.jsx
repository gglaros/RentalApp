import { useEffect, useContext ,useState} from "react";
import { useNavigate } from "react-router-dom";
import UserContext from "../../context/UserContext";
import PropertyContext from "../../context/PropertyContext";
import TenantContext from "../../context/TenantContext";

export const TenantProfile = () => {
  const { userProfile, fetchProfile } = useContext(UserContext);
  const { fetchApprovedProperties, approvedProperties } =useContext(PropertyContext);
  const { makeApp, message } = useContext(TenantContext);
  const [refresh, setRefresh] = useState(false);

  const navigate = useNavigate();
  const token = sessionStorage.getItem("token");

 


  useEffect(() => {
    if (token) {
      fetchApprovedProperties();
    }
  }, [token]);

  return (
    <div className="min-h-screen bg-slate-950 text-white px-4 py-10">
      <div className="max-w-7xl mx-auto space-y-8">
        {message && (
          <div className="rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-red-400 shadow-lg">
            {message}
          </div>
        )}

        <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-8 shadow-2xl backdrop-blur">
          <div className="mb-8 text-center">
            <h1 className="text-4xl font-bold tracking-tight">
              Tenant Profile
            </h1>
            <p className="mt-2 text-slate-400">
              Browse approved properties and manage your applications
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-5">
              <p className="text-sm text-slate-400">Name</p>
              <p className="mt-2 text-lg font-semibold text-purple-400">
                {userProfile?.first_name || "—"}
              </p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-5">
              <p className="text-sm text-slate-400">Email</p>
              <p className="mt-2 text-lg font-semibold text-purple-400 break-all">
                {userProfile?.email || "—"}
              </p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-5">
              <p className="text-sm text-slate-400">Role</p>
              <p className="mt-2 text-lg font-semibold text-purple-400">
                {userProfile?.role || "—"}
              </p>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <button
              type="button"
              onClick={() => navigate("/TenantApps")}
              className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-5 py-3 text-sm font-medium text-emerald-400 transition-all hover:bg-emerald-500/20 hover:scale-105 active:scale-95"
            >
              See Apps
            </button>

            <button
              type="button"
              onClick={() => navigate("/Edit")}
              className="rounded-xl border border-blue-500/30 bg-blue-500/10 px-5 py-3 text-sm font-medium text-blue-400 transition-all hover:bg-blue-500/20 hover:scale-105 active:scale-95"
            >
              Edit Profile
            </button>
          </div>
        </div>

        <div className="overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/80 shadow-2xl backdrop-blur">
          <div className="border-b border-slate-800 px-6 py-5">
            <h2 className="text-2xl font-bold">Approved Properties</h2>
            <p className="mt-1 text-sm text-slate-400">
              Properties available for tenant applications
            </p>
          </div>

          {approvedProperties?.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm md:text-base">
                <thead className="bg-slate-800/80 text-slate-300">
                  <tr>
                    <th className="px-6 py-4 text-left font-semibold">
                      Address
                    </th>
                    <th className="px-6 py-4 text-left font-semibold">Price</th>
                    <th className="px-6 py-4 text-left font-semibold">
                      Description
                    </th>
                    <th className="px-6 py-4 text-left font-semibold">
                      Square Feet
                    </th>
                    <th className="px-6 py-4 text-left font-semibold">
                      Year Built
                    </th>
                    <th className="px-6 py-4 text-left font-semibold">
                      Owner Email
                    </th>
                    <th className="px-6 py-4 text-center font-semibold">
                      Action
                    </th>
                    <th className="px-6 py-4 text-center font-semibold">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {approvedProperties.map((property, index) => (
                    <tr
                      key={property.id || index}
                      className="border-t border-slate-800 hover:bg-slate-800/40 transition-colors"
                    >
                      <td className="px-6 py-4 font-medium text-slate-100">
                        {property.address}
                      </td>

                      <td className="px-6 py-4 text-slate-300">
                        €{property.price}
                      </td>

                      <td className="px-6 py-4 text-slate-300 max-w-xs truncate">
                        {property.description}
                      </td>

                      <td className="px-6 py-4 text-slate-300">
                        {property.square_feet}
                      </td>

                      <td className="px-6 py-4 text-slate-300">
                        {property.year_built}
                      </td>

                      <td className="px-6 py-4 text-slate-300 break-all">
                        {property.owner?.email || "—"}
                      </td>

                      <td className="px-6 py-4 text-center">
                        {(() => {
                          const existingApp =
                            userProfile.tenant_applications?.find(
                              (app) =>
                                app.property.address === property.address &&
                                app.status === "PENDING"
                            );

                          return (
                            <button
                              type="button"
                              onClick={() => {
                                if (!existingApp) {
                                  makeApp(property.id, token);
                                  setRefresh(!refresh);
                                }
                              }}
                              disabled={!!existingApp}
                              className={`rounded-xl border px-4 py-2 text-sm font-medium transition-all
          ${
            existingApp
              ? "border-slate-600/30 bg-slate-700/20 text-slate-500 cursor-not-allowed opacity-50"
              : "border-emerald-500/30 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 hover:scale-105 active:scale-95"
          }`}
                            >
                              {existingApp ? "Pending..." : "Make App"}
                            </button>
                          );
                        })()}
                      </td>

                      <td className="px-6 py-4 text-center">
                        <button
                          type="button"
                          onClick={() => navigate(`/property/${property.id}`)}
                          className="rounded-xl border border-green-500/30 bg-blue-500/10 px-4 py-2 text-sm font-medium text-green-400 transition-all hover:bg-blue-500/20 hover:scale-105 active:scale-95"
                        >
                          info
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="px-6 py-16 text-center">
              <h3 className="text-2xl font-semibold text-slate-200">
                No approved properties yet
              </h3>
              <p className="mt-2 text-slate-400">
                Approved properties will appear here when available.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
