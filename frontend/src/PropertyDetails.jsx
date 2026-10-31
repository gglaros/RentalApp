import { useParams, useNavigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { propertiesApi } from "./api/properties";
import { ImageGallery } from "./components/ImageGallery";
import UserContext from "./context/UserContext";
import TenantContext from "./context/TenantContext";
import { getImages } from "./utils/api";

export const PropertyDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const { userProfile, fetchProfile, isAuthenticated } = useContext(UserContext);
  const { makeApp, message } = useContext(TenantContext);

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        setLoading(true);
        setError("");

        let data = null;
        if (isAuthenticated) {
          try {
            data = await propertiesApi.get(id);
          } catch {
            data = null;
          }
        }
        if (!data) {
          data = await propertiesApi.getPublic(id);
        }

        setProperty(data);
      } catch (err) {
        setError("Failed to load property details");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
  }, [id, isAuthenticated]);

  const renderAction = () => {
    if (!property || property.status !== "APPROVED") return null;

    if (!userProfile) {
      return (
        <button
          onClick={() => navigate("/login")}
          className="rounded-xl bg-violet-600 px-5 py-2.5 text-sm font-semibold hover:bg-violet-500"
        >
          Log in to apply
        </button>
      );
    }

    if (userProfile.role === "OWNER" && userProfile.id === property.owner?.id) {
      return (
        <button
          onClick={() => navigate(`/property/${property.id}/edit`)}
          className="rounded-xl border border-violet-500/40 bg-violet-500/15 px-5 py-2.5 text-sm font-semibold text-violet-300 hover:bg-violet-500/25"
        >
          Edit property
        </button>
      );
    }

    if (userProfile.role !== "TENANT") return null;

    const existing = userProfile.tenant_applications?.find(
      (app) => app.property?.id === property.id
    );
    if (existing) {
      return (
        <span className="rounded-xl border border-slate-700 px-5 py-2.5 text-sm text-slate-300">
          Your application: <b>{existing.status}</b>
        </span>
      );
    }
    return (
      <button
        onClick={async () => {
          await makeApp(property.id);
          fetchProfile();
        }}
        className="rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold hover:bg-emerald-500"
      >
        Apply for this property
      </button>
    );
  };

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
            <div className="relative min-h-[320px] bg-slate-800 flex flex-col">
              <ImageGallery images={getImages(property)} alt={property.address} />
            </div>

            <div className="p-6 md:p-8">
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-left mb-4">
                {property.address}
              </h1>

              <div className="mb-6 text-left">
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

          <div className="border-t border-slate-800 bg-slate-950/40 px-6 py-4 flex flex-wrap items-center justify-between gap-3">
            <span className="text-sm text-slate-400">
              {message}
            </span>
            {renderAction()}
          </div>
        </div>
      </div>
    </div>
  );
};