// import { useParams } from "react-router-dom";
// import { useEffect, useState } from "react";
// import axios from "axios";

// export const PropertyDetails = () => {
//   const { id } = useParams();
//   const [property, setProperty] = useState(null);
//   const token = sessionStorage.getItem("token");
//   useEffect(() => {
//     const fetchProperty = async () => {
//       const res = await axios.get(
//         `http://127.0.0.1:5000/api/v1/properties/${id}`,
//         {
//             headers: { Authorization: `Bearer ${token}` },
//           }
//       );
//       setProperty(res.data);
//       console.log(res.data)
//     };

//     fetchProperty();
//   }, [id]);

//   if (!property) return <p className="text-white">Loading...</p>;

//   return (
//     <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
//       <div className="bg-slate-900 p-6 rounded-3xl shadow-xl max-w-lg w-full">
        
//         <h1 className="text-3xl mb-4">{property.address}</h1>

//         <div className="h-full bg-slate-800 overflow-hidden relative">
//                   {property.image ? (
//                     <img
//                       src={`http://localhost:5000/${property.image}`}
//                       alt={property.address}
//                       className="w-full h-full object-cover" 
//                     />
//                   ) : (
//                     <div className="w-full h-full bg-gradient-to-br from-violet-800 via-indigo-800 to-slate-800" />
//                   )}
                 
//                 </div>

//         <p className="text-slate-300 mb-2">{property.description}</p>
//         <p>Price: €{property.price}</p>
//         <p>Square feet: {property.square_feet}</p>
//         <p>Year built: {property.year_built}</p>
//       </div>
//     </div>
//   );
// };



import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

export const PropertyDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const token = sessionStorage.getItem("token");

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        setLoading(true);
        setError("");

        const res = await axios.get(
          `http://127.0.0.1:5000/api/v1/properties/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setProperty(res.data);
      } catch (err) {
        setError("Failed to load property details");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
  }, [id, token]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="h-12 w-12 rounded-full border-4 border-slate-700 border-t-violet-500 animate-spin mx-auto mb-4" />
          <p className="text-slate-400 text-lg">Loading property...</p>
        </div>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center px-4">
        <div className="w-full max-w-md rounded-3xl border border-red-500/20 bg-slate-900 p-8 text-center shadow-2xl">
          <h2 className="text-2xl font-bold text-red-400 mb-3">Something went wrong</h2>
          <p className="text-slate-400 mb-6">{error || "Property not found"}</p>
          <button
            onClick={() => navigate(-1)}
            className="rounded-xl bg-violet-500 px-5 py-3 font-semibold text-white transition hover:bg-violet-400"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white px-4 py-10">
      <div className="max-w-5xl mx-auto">
        <div className="mb-6">
          <button
            onClick={() => navigate(-1)}
            className="rounded-xl border border-slate-700 bg-slate-900 px-4 py-2 text-sm font-medium text-slate-300 transition hover:bg-slate-800 hover:text-white"
          >
            ← Back
          </button>
        </div>

        <div className="overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/80 shadow-2xl backdrop-blur">
          <div className="grid lg:grid-cols-2">
            <div className="relative min-h-[320px] bg-slate-800">
              {property.image ? (
                <img
                  src={`http://localhost:5000/${property.image}`}
                  alt={property.address}
                 className="h-full w-full object-contain"
                />
              ) : property.image ? (
                <img
                  src={`http://127.0.0.1:5000${property.image}`}
                  alt={property.address}
                  className="h-full w-full object-contain"
                />
              ) : (
                <div className="flex h-full  items-center justify-center bg-gradient-to-br from-violet-900 via-indigo-900 to-slate-900">
                  <span className="text-slate-400 text-lg">No image available</span>
                </div>
              )}

              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-6">
                <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
                  {property.address}
                </h1>
               
              </div>
            </div>

            <div className="p-6 md:p-8">
              <div className="mb-6">
                <span
                  className={`inline-flex rounded-full px-3 py-1 text-sm font-semibold ${
                    property.status?.toUpperCase() === "APPROVED"
                      ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                      : property.status?.toUpperCase() === "PENDING"
                      ? "bg-yellow-500/15 text-yellow-400 border border-yellow-500/30"
                      : property.status?.toUpperCase() === "REJECTED"
                      ? "bg-red-500/15 text-red-400 border border-red-500/30"
                      : "bg-slate-500/15 text-slate-300 border border-slate-500/30"
                  }`}
                >
                  {property.status || "Unknown"}
                </span>
              </div>

              <div className="space-y-6">
                <div>
                  <p className="text-sm uppercase tracking-wide text-slate-500 mb-2">
                    Description
                  </p>
                  <p className="text-slate-300 leading-7">
                    {property.description || "No description available"}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
                    <p className="text-sm text-slate-500">Price</p>
                    <p className="mt-2 text-2xl font-bold text-emerald-400">
                      €{property.price}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
                    <p className="text-sm text-slate-500">Square Feet</p>
                    <p className="mt-2 text-2xl font-bold text-white">
                      {property.square_feet}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
                    <p className="text-sm text-slate-500">Year Built</p>
                    <p className="mt-2 text-2xl font-bold text-white">
                      {property.year_built}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
                    <p className="text-sm text-slate-500">Unit Number</p>
                    <p className="mt-2 text-2xl font-bold text-white">
                      {property.unit_number || "—"}
                    </p>
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-5">
                  <p className="text-sm uppercase tracking-wide text-slate-500 mb-3">
                    Owner Information
                  </p>
                  <div className="space-y-2 text-slate-300">
                    <p>
                      <span className="text-slate-500">Email:</span>{" "}
                      {property.owner?.email || "—"}
                    </p>
                    <p>
                      <span className="text-slate-500">Phone:</span>{" "}
                      {property.owner?.phone || "—"}
                    </p>
                    <p>
                      <span className="text-slate-500">Name:</span>{" "}
                      {property.owner?.first_name || "—"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-800 bg-slate-950/40 px-6 py-4">
           
          </div>
        </div>
      </div>
    </div>
  );
};