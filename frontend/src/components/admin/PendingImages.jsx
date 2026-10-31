import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { adminApi } from "../../api/admin";
import { errorMessage, imageUrl } from "../../utils/api";

export const PendingImages = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState(null);
  const [error, setError] = useState("");
  const [preview, setPreview] = useState(null);

  const load = useCallback(async () => {
    try {
      setImages(await adminApi.listPendingImages());
      setError("");
    } catch (err) {
      setError(errorMessage(err, "Failed to load photos"));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const review = async (img, status) => {
    if (status === "REJECTED" && !window.confirm("Reject and permanently delete this photo?")) return;
    setBusyId(img.id);
    try {
      await adminApi.reviewImage(img.id, status);
      setImages((prev) => prev.filter((i) => i.id !== img.id));
    } catch (err) {
      setError(errorMessage(err, "Failed to review photo"));
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white px-4 py-10">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight">Photos to review</h1>
          <p className="mt-2 text-slate-400">
            New photos are hidden from the public until you approve them. Rejecting deletes the photo.
          </p>
        </div>

        {error && (
          <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">{error}</div>
        )}

        {loading ? (
          <p className="text-slate-400">Loading...</p>
        ) : images.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-white/10 py-16 text-slate-400">
            Nothing to review. 🎉
          </div>
        ) : (
          <>
            <p className="text-sm text-slate-500 text-left">{images.length} photo(s) waiting</p>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {images.map((img) => (
                <div
                  key={img.id}
                  className={`overflow-hidden rounded-2xl border border-white/10 bg-slate-900/60 text-left transition ${
                    busyId === img.id ? "opacity-50 pointer-events-none" : ""
                  }`}
                >
                  <button type="button" onClick={() => setPreview(img)} className="block w-full">
                    <img src={imageUrl(img.path)} alt="" className="aspect-[4/3] w-full object-cover" />
                  </button>
                  <div className="space-y-2 p-4">
                    <Link to={`/property/${img.property_id}`} className="block font-semibold hover:text-violet-300 truncate">
                      {img.property_address}
                    </Link>
                    <p className="text-xs text-slate-400 truncate">
                      {img.owner_email} · property {img.property_status?.toLowerCase()}
                    </p>
                    <p className="text-xs text-slate-500">
                      Uploaded {img.created_at ? new Date(img.created_at).toLocaleString() : "—"}
                    </p>
                    <div className="flex gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => review(img, "APPROVED")}
                        className="flex-1 rounded-lg border border-emerald-500/30 bg-emerald-500/10 py-2 text-sm font-medium text-emerald-400 hover:bg-emerald-500/20"
                      >
                        Approve
                      </button>
                      <button
                        type="button"
                        onClick={() => review(img, "REJECTED")}
                        className="flex-1 rounded-lg border border-red-500/30 bg-red-500/10 py-2 text-sm font-medium text-red-400 hover:bg-red-500/20"
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {preview && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
          onClick={() => setPreview(null)}
        >
          <img src={imageUrl(preview.path)} alt="" className="max-h-[90vh] max-w-[90vw] rounded-xl object-contain" />
        </div>
      )}
    </div>
  );
};
