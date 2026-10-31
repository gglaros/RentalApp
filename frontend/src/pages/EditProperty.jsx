import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import PropertyContext from "../context/PropertyContext";
import UserContext from "../context/UserContext";
import { ImagePicker } from "../components/ImagePicker";
import { MAX_IMAGES, errorMessage, getImages, imageUrl, isApproved } from "../utils/api";

const inputClass =
  "w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none transition-all duration-200 focus:border-violet-500/60 focus:ring-2 focus:ring-violet-500/20";

const Field = ({ label, children }) => (
  <div className="flex flex-col gap-1.5 text-left">
    <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">{label}</label>
    {children}
  </div>
);

const FIELDS = ["address", "price", "description", "unit_number", "square_feet", "year_built"];
const NUMERIC = ["price", "square_feet", "year_built"];

export const EditProperty = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = sessionStorage.getItem("token");
  const { userProfile, fetchProfile } = useContext(UserContext);
  const { getProperty, updateProperty, uploadImages, deleteImage, setCoverImage } = useContext(PropertyContext);

  const [property, setProperty] = useState(null);
  const [form, setForm] = useState(null);
  const [newImages, setNewImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [busyImage, setBusyImage] = useState(null);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const flash = (msg) => {
    setMessage(msg);
    setTimeout(() => setMessage(""), 3000);
  };

  const applyProperty = (p) => {
    setProperty(p);
    setForm(Object.fromEntries(FIELDS.map((f) => [f, p[f] ?? ""])));
  };

  useEffect(() => {
    const load = async () => {
      try {
        applyProperty(await getProperty(id, token));
      } catch (err) {
        setError(errorMessage(err, "Failed to load property"));
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const handleChange = (e) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSave = async (e) => {
    e.preventDefault();
    setError("");
    setSaving(true);
    try {
      const payload = Object.fromEntries(
        FIELDS.map((f) => [f, NUMERIC.includes(f) ? Number(form[f]) : form[f]])
      );
      applyProperty(await updateProperty(id, payload, token));
      flash("Property details saved");
    } catch (err) {
      setError(errorMessage(err, "Failed to save property"));
    } finally {
      setSaving(false);
    }
  };

  const handleUpload = async () => {
    if (!newImages.length) return;
    setError("");
    setBusyImage("upload");
    try {
      setProperty(await uploadImages(id, newImages, token));
      setNewImages([]);
      fetchProfile();
      flash("Photos uploaded");
    } catch (err) {
      setError(errorMessage(err, "Failed to upload photos"));
    } finally {
      setBusyImage(null);
    }
  };

  const handleDeleteImage = async (img) => {
    if (!window.confirm("Delete this photo?")) return;
    setError("");
    setBusyImage(img.id);
    try {
      setProperty(await deleteImage(id, img.id, token));
      fetchProfile();
    } catch (err) {
      setError(errorMessage(err, "Failed to delete photo"));
    } finally {
      setBusyImage(null);
    }
  };

  const handleSetCover = async (img) => {
    setError("");
    setBusyImage(img.id);
    try {
      setProperty(await setCoverImage(id, img.id, token));
      fetchProfile();
    } catch (err) {
      setError(errorMessage(err, "Failed to change cover photo"));
    } finally {
      setBusyImage(null);
    }
  };

  if (loading) {
    return <div className="min-h-screen bg-slate-950 text-slate-400 flex items-center justify-center">Loading...</div>;
  }

  if (!property || !form) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center gap-4">
        <p className="text-red-400">{error || "Property not found"}</p>
        <button onClick={() => navigate("/profile")} className="rounded-xl bg-violet-600 px-4 py-2">
          Back to profile
        </button>
      </div>
    );
  }

  if (userProfile && property.owner_id !== undefined && property.owner_id !== userProfile.id) {
    return (
      <div className="min-h-screen bg-slate-950 text-red-400 flex items-center justify-center">
        You can only edit your own properties.
      </div>
    );
  }

  const images = getImages(property, { includePending: true });

  const coverId = images.find(isApproved)?.id ?? null;
  const hasPending = images.some((img) => !isApproved(img));
  const remaining = MAX_IMAGES - images.length;

  return (
    <div className="min-h-screen bg-slate-950 text-white px-4 py-10">
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate("/profile")}
            className="rounded-xl border border-slate-700 bg-slate-900 px-4 py-2 text-sm text-slate-300 hover:bg-slate-800"
          >
            ← Back
          </button>
          <button
            onClick={() => navigate(`/property/${id}`)}
            className="rounded-xl border border-slate-700 bg-slate-900 px-4 py-2 text-sm text-slate-300 hover:bg-slate-800"
          >
            View listing
          </button>
        </div>

        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight">Edit Property</h1>
          <p className="mt-1 text-sm text-slate-400">
            {property.address} · status: {property.status}
          </p>
        </div>

        {message && (
          <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-400">
            {message}
          </div>
        )}
        {error && (
          <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
            {error}
          </div>
        )}

        <section className="rounded-2xl border border-white/8 bg-slate-900/60 p-6 space-y-4 text-left">
          <div className="flex items-baseline justify-between">
            <h2 className="text-lg font-semibold">Photos</h2>
            <span className="text-xs text-slate-500">
              {images.length} / {MAX_IMAGES}
            </span>
          </div>

          {hasPending && (
            <p className="rounded-lg border border-yellow-500/30 bg-yellow-500/10 px-3 py-2 text-xs text-yellow-300">
              Photos marked "Pending review" are visible only to you until an admin approves them.
            </p>
          )}

          {images.length ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {images.map((img) => (
                <div
                  key={img.id ?? img.path}
                  className={`relative rounded-xl overflow-hidden border bg-slate-800 ${
                    img.id === coverId ? "border-violet-500" : "border-white/10"
                  } ${busyImage === img.id ? "opacity-50" : ""}`}
                >
                  <img src={imageUrl(img.path)} alt="" className="aspect-[4/3] w-full object-cover" />
                  {img.id === coverId && (
                    <span className="absolute top-2 left-2 rounded-md bg-violet-600 px-2 py-0.5 text-xs font-semibold">
                      Cover
                    </span>
                  )}
                  {!isApproved(img) && (
                    <span className="absolute top-2 right-2 rounded-md bg-yellow-500/90 px-2 py-0.5 text-xs font-semibold text-black">
                      Pending review
                    </span>
                  )}
                  <div className="flex gap-1 p-2">
                    <button
                      type="button"
                      disabled={img.id === coverId || !isApproved(img) || busyImage !== null || !img.id}
                      title={!isApproved(img) ? "Only approved photos can be the cover" : undefined}
                      onClick={() => handleSetCover(img)}
                      className="flex-1 rounded-lg border border-violet-500/30 bg-violet-500/10 py-1 text-xs text-violet-300 hover:bg-violet-500/20 disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      Make cover
                    </button>
                    <button
                      type="button"
                      disabled={busyImage !== null || !img.id}
                      title={!img.id ? "Upload a new photo first to manage this older photo" : undefined}
                      onClick={() => handleDeleteImage(img)}
                      className="flex-1 rounded-lg border border-red-500/30 bg-red-500/10 py-1 text-xs text-red-400 hover:bg-red-500/20 disabled:opacity-40"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-500">No photos yet.</p>
          )}

          {remaining > 0 ? (
            <div className="space-y-3 border-t border-white/5 pt-4">
              <p className="text-sm text-slate-400">Add new photos</p>
              <ImagePicker files={newImages} onChange={setNewImages} max={remaining} />
              {newImages.length > 0 && (
                <button
                  type="button"
                  onClick={handleUpload}
                  disabled={busyImage !== null}
                  className="rounded-xl bg-violet-600 px-4 py-2 text-sm font-semibold hover:bg-violet-500 disabled:opacity-50"
                >
                  {busyImage === "upload" ? "Uploading..." : `Upload ${newImages.length} photo(s)`}
                </button>
              )}
            </div>
          ) : (
            <p className="text-xs text-slate-500">Maximum number of photos reached.</p>
          )}
        </section>

        <form onSubmit={handleSave} className="rounded-2xl border border-white/8 bg-slate-900/60 p-6 space-y-5">
          <h2 className="text-lg font-semibold text-left">Details</h2>

          <Field label="Address">
            <input name="address" className={inputClass} value={form.address} required minLength={3} onChange={handleChange} />
          </Field>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Price / month">
              <input name="price" type="number" min={1} className={inputClass} value={form.price} required onChange={handleChange} />
            </Field>
            <Field label="Unit number">
              <input name="unit_number" className={inputClass} value={form.unit_number} required maxLength={10} onChange={handleChange} />
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Square feet (m²)">
              <input name="square_feet" type="number" min={1} className={inputClass} value={form.square_feet} required onChange={handleChange} />
            </Field>
            <Field label="Year built">
              <input name="year_built" type="number" min={1} className={inputClass} value={form.year_built} required onChange={handleChange} />
            </Field>
          </div>

          <Field label="Description">
            <textarea
              name="description"
              className={`${inputClass} resize-none h-24`}
              value={form.description}
              required
              maxLength={200}
              onChange={handleChange}
            />
          </Field>

          <button
            type="submit"
            disabled={saving}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-sm font-semibold hover:opacity-90 disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save changes"}
          </button>
        </form>
      </div>
    </div>
  );
};
