import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import PropertyContext from "../context/PropertyContext";
import { ImagePicker } from "./ImagePicker";
import { MAX_IMAGES, errorMessage } from "../utils/api";

const inputClass =
  "w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none transition-all duration-200 focus:border-violet-500/60 focus:ring-2 focus:ring-violet-500/20";

const Field = ({ label, children }) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">
      {label}
    </label>
    {children}
  </div>
);

export const PropertyForm = () => {
  const [form, setForm] = useState({
    address: "",
    price: "",
    description: "",
    unit_number: "",
    square_feet: "",
    year_built: "",
  });
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { addProperty } = useContext(PropertyContext);
  const token = sessionStorage.getItem("token");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const formData = new FormData();
      Object.entries(form).forEach(([key, val]) => formData.append(key, val));
      images.forEach((img) => formData.append("images", img));

      await addProperty(formData, token);
      navigate("/profile");
    } catch (err) {
      setError(errorMessage(err, "Failed to add property. Please try again."));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4 py-16">

      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-violet-600/10 blur-3xl" />
      </div>

      <div className="relative w-full max-w-lg">

        <div className="mb-8 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-violet-500/30 bg-violet-500/10 px-4 py-1.5 mb-6">
            <span className="h-1.5 w-1.5 rounded-full bg-violet-400 animate-pulse" />
            <span className="text-xs font-medium text-violet-300 tracking-wide">New listing</span>
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Add Property</h1>
          <p className="mt-2 text-sm text-slate-400">Fill in the details for your new listing</p>
        </div>

        <div className="rounded-2xl border border-white/8 bg-slate-900/60 backdrop-blur-sm p-8">

          {error && (
            <div className="mb-6 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">

            <Field label="Address">
              <input
                name="address"
                type="text"
                className={inputClass}
                placeholder="123 Main St, Athens"
                value={form.address}
                required
                onChange={handleChange}
              />
            </Field>

            <div className="grid grid-cols-2 gap-3">
              <Field label="Price / month">
                <input
                  name="price"
                  type="number"
                  className={inputClass}
                  placeholder="€ 800"
                  value={form.price}
                  required
                  onChange={handleChange}
                />
              </Field>
              <Field label="Unit number">
                <input
                  name="unit_number"
                  type="text"
                  className={inputClass}
                  placeholder="A1"
                  value={form.unit_number}
                  required
                  onChange={handleChange}
                />
              </Field>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Field label="Square feet (m²)">
                <input
                  name="square_feet"
                  type="number"
                  className={inputClass}
                  placeholder="75"
                  value={form.square_feet}
                  required
                  onChange={handleChange}
                />
              </Field>
              <Field label="Year built">
                <input
                  name="year_built"
                  type="number"
                  className={inputClass}
                  placeholder="2005"
                  value={form.year_built}
                  required
                  onChange={handleChange}
                />
              </Field>
            </div>

            <Field label="Description">
              <textarea
                name="description"
                className={`${inputClass} resize-none h-24`}
                placeholder="Describe the property..."
                value={form.description}
                required
                onChange={handleChange}
              />
            </Field>

            <Field label={`Photos (first one is the cover)`}>
              <ImagePicker files={images} onChange={setImages} max={MAX_IMAGES} />
            </Field>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 mt-2 rounded-xl bg-gradient-to-r from-red-600 to-green-600 text-sm font-semibold text-white hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Adding property..." : "Add property"}
            </button>

          </form>
        </div>
      </div>
    </div>
  );
};