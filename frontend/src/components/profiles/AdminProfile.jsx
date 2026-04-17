import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import UserContext from "../../context/UserContext";
import PropertyContext from "../../context/PropertyContext";

export const AdminProfile = () => {
  const { userProfile } = useContext(UserContext);
  const { deleteProperty, fetchProperties, properties } =
    useContext(PropertyContext);

  const [refresh, setRefresh] = useState(false);
  const navigate = useNavigate();
  const token = sessionStorage.getItem("token");

  useEffect(() => {
    fetchProperties(token);
  }, [refresh]);

  const handleDelete = async (id, token) => {
    await deleteProperty(id, token);
    setRefresh((prev) => !prev);
  };

  const handleUsers = (event) => {
    if (event.metaKey || event.ctrlKey) {
      window.open("/AllUsers", "_blank");
      return;
    }
    navigate("/AllUsers");
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
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-8 shadow-2xl backdrop-blur">
          <div className="mb-8 text-center">
            <h1 className="text-4xl font-bold tracking-tight">Admin Profile</h1>
            <p className="mt-2 text-slate-400">
              Manage users, applications, and all properties
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
              onClick={() => navigate("/AllOwnerApps")}
              className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-5 py-3 text-sm font-medium text-emerald-400 transition-all hover:bg-emerald-500/20 hover:scale-105 active:scale-95"
            >
              See Apps
            </button>

            <button
              type="button"
              onClick={handleUsers}
              className="rounded-xl border border-cyan-500/30 bg-cyan-500/10 px-5 py-3 text-sm font-medium text-cyan-400 transition-all hover:bg-cyan-500/20 hover:scale-105 active:scale-95"
            >
              See All Users
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

        <div className="rounded-3xl border border-slate-800 bg-slate-900/80 shadow-2xl backdrop-blur overflow-hidden">
          <div className="border-b border-slate-800 px-6 py-5">
            <h2 className="text-2xl font-bold">All Properties</h2>
            <p className="mt-1 text-sm text-slate-400">
              Overview of every property in the platform
            </p>
          </div>

          {properties?.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm md:text-base">
                <thead className="bg-slate-800/80 text-slate-300">
                  <tr>
                    <th className="px-6 py-4  font-semibold">Address</th>
                    <th className="px-6 py-4  font-semibold">Price</th>
                    <th className="px-6 py-4  font-semibold">Description</th>
                    <th className="px-6 py-4  font-semibold">Square Feet</th>
                    <th className="px-6 py-4  font-semibold">Year Built</th>
                    <th className="px-6 py-4  font-semibold">Status</th>
                    <th className="px-6 py-4  font-semibold">Owner Email</th>
                    <th className="px-6 py-4 text-center font-semibold">
                      Action
                    </th>
                    <th className="px-6 py-4 text-center font-semibold">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {properties.map((property, index) => (
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
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-xs md:text-sm font-semibold ${getStatusStyle(
                            property.status
                          )}`}
                        >
                          {property.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-slate-300 break-all">
                        {property.owner?.email || "—"}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <button
                          type="button"
                          onClick={() => handleDelete(property.id, token)}
                          className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm font-medium text-red-400 transition-all hover:bg-red-500/20 hover:scale-105 active:scale-95"
                        >
                          Delete
                        </button>
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
                No properties found
              </h3>
              <p className="mt-2 text-slate-400">
                Properties will appear here when they are created.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
