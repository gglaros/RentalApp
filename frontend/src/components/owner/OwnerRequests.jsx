import { useEffect, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import UserContext from "../../context/UserContext";
import OwnerAppCotext from "../../context/OwnerAppContext";

export const OwnerRequests = () => {
  const { userProfile, fetchProfile } = useContext(UserContext);
  const { message, deleteRequest, changeRequestStatus } = useContext(OwnerAppCotext);
  const token = sessionStorage.getItem("token");
  const navigate = useNavigate();
  const [busyId, setBusyId] = useState(null);
  const [filter, setFilter] = useState("ALL");

  const handleStatus = async (request, status) => {
    if (
      status === "APPROVED" &&
      !window.confirm(`Approve ${request.tenant.email} for ${request.property.address}?`)
    ) return;
    setBusyId(request.id);
    await changeRequestStatus(request.id, status, token);
    setBusyId(null);
  };

  const allRequests = userProfile?.tenant_applications_to_own_properties || [];
  const requests = filter === "ALL" ? allRequests : allRequests.filter((r) => r.status === filter);
  const count = (s) => allRequests.filter((r) => r.status === s).length;

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
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold tracking-tight">Owner Requests</h1>
          <p className="mt-2 text-slate-400">
            Requests from tenants for your properties
          </p>
        </div>

        {message && (
          <div className="mb-6 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-emerald-400 shadow-lg">
            {message}
          </div>
        )}

        <div className="mb-4 flex flex-wrap justify-center gap-2">
          {["ALL", "PENDING", "APPROVED", "REJECTED"].map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              className={`rounded-full px-4 py-1.5 text-sm border transition ${
                filter === f
                  ? "border-violet-500 bg-violet-500/20 text-violet-200"
                  : "border-slate-700 text-slate-400 hover:text-white"
              }`}
            >
              {f === "ALL" ? `All (${allRequests.length})` : `${f[0] + f.slice(1).toLowerCase()} (${count(f)})`}
            </button>
          ))}
        </div>

        <div className="overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/80 shadow-2xl backdrop-blur">
          {requests.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm md:text-base">
                <thead className="bg-slate-800/80 text-slate-300">
                  <tr>
                    <th className="px-6 py-4  font-semibold">Address</th>
                    <th className="px-6 py-4  font-semibold">Unit</th>
                    <th className="px-6 py-4  font-semibold">Tenant Email</th>
                    <th className="px-6 py-4  font-semibold">Tenant Phone</th>
                    <th className="px-6 py-4  font-semibold">Status</th>
                    <th className="px-6 py-4 text-center font-semibold">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {requests.map((request, index) => (
                    <tr
                      key={request.id || index}
                      className="border-t border-slate-800 hover:bg-slate-800/40 transition-colors"
                    >
                      <td
                        className="px-6 py-4 font-medium text-slate-100 cursor-pointer hover:text-violet-300"
                        onClick={() => request.property.id && navigate(`/property/${request.property.id}`)}
                      >
                        {request.property.address}
                      </td>

                      <td className="px-6 py-4 text-slate-300">
                        {request.property.unit_number}
                      </td>

                      <td className="px-6 py-4 text-slate-300">
                        {request.tenant.email}
                      </td>

                      <td className="px-6 py-4 text-slate-300">
                        {request.tenant.phone || "No phone"}
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-xs md:text-sm font-semibold ${getStatusStyle(
                            request.status
                          )}`}
                        >
                          {request.status}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        <div className={`flex flex-wrap justify-center gap-2 ${busyId === request.id ? "opacity-50 pointer-events-none" : ""}`}>
                          {request.status !== "APPROVED" && (
                            <button
                              type="button"
                              onClick={() => handleStatus(request, "APPROVED")}
                              className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-sm font-medium text-emerald-400 transition-all hover:bg-emerald-500/20"
                            >
                              Approve
                            </button>
                          )}
                          {request.status !== "REJECTED" && (
                            <button
                              type="button"
                              onClick={() => handleStatus(request, "REJECTED")}
                              className="rounded-xl border border-yellow-500/30 bg-yellow-500/10 px-3 py-2 text-sm font-medium text-yellow-400 transition-all hover:bg-yellow-500/20"
                            >
                              Reject
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => {
                              if (window.confirm("Delete this request?")) deleteRequest(request.id, token);
                            }}
                            className="rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm font-medium text-red-400 transition-all hover:bg-red-500/20"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
              <h2 className="text-2xl font-semibold text-slate-200">
                {allRequests.length ? "No requests in this category" : "No requests yet"}
              </h2>
              <p className="mt-2 text-slate-400">
                Tenant requests for your properties will appear here.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};