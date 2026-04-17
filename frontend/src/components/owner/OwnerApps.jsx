


import { useEffect, useContext } from "react";
import UserContext from "../../context/UserContext";
import OwnerAppCotext from "../../context/OwnerAppContext";

export const OwnerApps = () => {
  const { userProfile, fetchProfile } = useContext(UserContext);
  const { deleteApp, message } = useContext(OwnerAppCotext);
  const token = sessionStorage.getItem("token");

  useEffect(() => {
    fetchProfile();
  }, []);

  const getStatusStyle = (status) => {
    switch (status?.toUpperCase()) {
      case "APPROVED":
        return "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30";
      case "PENDING":
        return "bg-yellow-500/15 text-yellow-400 border border-yellow-500/30";
      case "REJECTED":
        return "bg-red-500/15 text-red-400 border border-red-500/30";
      default:
        return "bg-slate-500/15 text-slate-300 border border-slate-500/30";
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white px-4 py-10">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold tracking-tight">My Applications</h1>
          <p className="text-slate-400 mt-2">
            View and manage your property applications
          </p>
        </div>

        {message && (
          <div className="mb-6 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-emerald-400 shadow-lg">
            {message}
          </div>
        )}

        <div className="overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/80 shadow-2xl backdrop-blur">
          {userProfile.owner_applications?.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm md:text-base">
                <thead className="bg-slate-800/80 text-slate-300">
                  <tr>
                    <th className="px-6 py-4 font-semibold">Address</th>
                    <th className="px-6 py-4  font-semibold">Unit Number</th>
                    <th className="px-6 py-4  font-semibold">Status</th>
                    <th className="px-6 py-4 text-center font-semibold">Action</th>
                  </tr>
                </thead>

                <tbody>
                  {userProfile.owner_applications.map((app, index) => (
                    <tr
                      key={app.id || index}
                      className="border-t border-slate-800 hover:bg-slate-800/40 transition-colors"
                    >
                      <td className="px-6 py-4 font-medium text-slate-100">
                        {app.property.address}
                      </td>

                      <td className="px-6 py-4 text-slate-300">
                        {app.property.unit_number}
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-xs md:text-sm font-semibold ${getStatusStyle(
                            app.status
                          )}`}
                        >
                          {app.status}
                        </span>
                      </td>

                      <td className="px-6 py-4 text-center">
                        <button
                          type="button"
                          onClick={() => deleteApp(app.id, token)}
                          className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm font-medium text-red-400 transition-all hover:bg-red-500/20 hover:scale-105 active:scale-95"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
              <h2 className="text-2xl font-semibold text-slate-200">
                No applications yet
              </h2>
              <p className="mt-2 text-slate-400">
                Your submitted applications will appear here.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};