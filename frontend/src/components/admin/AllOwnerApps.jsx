

import { useState, useEffect, useContext } from "react";
import OwnerAppCotext from "../../context/OwnerAppContext";
import AdminContext from "../../context/AdminContext";

export const AllOwnerApps = () => {
  const { deleteApp } = useContext(OwnerAppCotext);
  const { getAllApps, apps, approveApp } = useContext(AdminContext);

  const token = sessionStorage.getItem("token");
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    getAllApps(token);
  }, [refresh]);

  const handleDeleteApp = async (id, token) => {
    await deleteApp(id, token);
    setRefresh((prev) => !prev);
  };

  const handleApproveApp = async (action, id, token) => {
    await approveApp(action, id, token);
    setRefresh((prev) => !prev);
  };

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
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold tracking-tight">All Owner Applications</h1>
          <p className="mt-2 text-slate-400">
            Review, approve, or remove owner applications
          </p>
        </div>

        <div className="overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/80 shadow-2xl backdrop-blur">
          {apps?.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm md:text-base">
                <thead className="bg-slate-800/80 text-slate-300">
                  <tr>
                    <th className="px-6 py-4 text-left font-semibold">Address</th>
                    <th className="px-6 py-4 text-left font-semibold">Unit</th>
                    <th className="px-6 py-4 text-left font-semibold">Description</th>
                    <th className="px-6 py-4 text-left font-semibold">Year Built</th>
                    <th className="px-6 py-4 text-left font-semibold">Owner Email</th>
                    <th className="px-6 py-4 text-left font-semibold">Status</th>
                    <th className="px-6 py-4 text-center font-semibold">Delete</th>
                    <th className="px-6 py-4 text-center font-semibold">Approve</th>
                  </tr>
                </thead>

                <tbody>
                  {apps.map((app, index) => {
                    const isApproved = app.status?.toUpperCase() === "APPROVED";

                    return (
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

                        <td className="px-6 py-4 text-slate-300 max-w-xs truncate">
                          {app.property.description}
                        </td>

                        <td className="px-6 py-4 text-slate-300">
                          {app.property.year_built}
                        </td>

                        <td className="px-6 py-4 text-slate-300">
                          {app.property.owner.email}
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
                            onClick={() => handleDeleteApp(app.id, token)}
                            className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm font-medium text-red-400 transition-all hover:bg-red-500/20 hover:scale-105 active:scale-95"
                          >
                            Delete
                          </button>
                        </td>

                        <td className="px-6 py-4 text-center">
                          <button
                            type="button"
                            disabled={isApproved}
                            onClick={() =>
                              handleApproveApp({ status: "APPROVED" }, app.id, token)
                            }
                            className={`rounded-xl px-4 py-2 text-sm font-medium transition-all ${
                              isApproved
                                ? "border border-slate-700 bg-slate-800 text-slate-500 cursor-not-allowed"
                                : "border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 hover:scale-105 active:scale-95"
                            }`}
                          >
                            {isApproved ? "Approved" : "Approve"}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
              <h2 className="text-2xl font-semibold text-slate-200">
                No applications found
              </h2>
              <p className="mt-2 text-slate-400">
                Owner applications will appear here when available.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};