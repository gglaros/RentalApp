// import { useState, useEffect, useCallback, useContext } from "react";
// import { useNavigate } from "react-router-dom";
// import PropertyContext from "../context/PropertyContext";
// import { useForm } from "react-hook-form";
// import axios from "axios";

// export const PropertyForm = () => {
//   const [address, setAddress] = useState("");
//   const [price, setPrice] = useState("");
//   const [description, setDescription] = useState("");
//   const [unit_number, setUnitNumber] = useState("");
//   const [square_feet, setsQuareFeet] = useState("");
//   const [year_built, setYearBuilt] = useState("");
//   const [image, setImage] = useState(null);
//   const { addProperty } = useContext(PropertyContext);

//   const token = sessionStorage.getItem("token");
//   const navigate = useNavigate();

//   const handleSubmit =  (e) => {
//     e.preventDefault();

//     const formData = new FormData();
//     formData.append("address", address);
//     formData.append("price", price);
//     formData.append("description", description);
//     formData.append("unit_number", unit_number);
//     formData.append("square_feet", square_feet);
//     formData.append("year_built", year_built);
    
//     if (image) {
//       formData.append("image", image);
//     }
    
//     for (let pair of formData.entries()) {
//       console.log(pair[0], pair[1]);
//     }
    
//      addProperty(formData, token);
//     navigate("/profile");
//   };

//   return (
//     <div className="container  flex items-center justify-center bg-background text-foreground ">
//       <form
//         onSubmit={handleSubmit}
//         className="bg-card border p-8 rounded-2xl shadow-lg w-full max-w-sm space-y-6"
//       >
//         <h1 className="text-3xl text-center">Property form</h1>

//         <div className="flex flex-col text-left">
//           <label>address</label>
//           <input
//             type="text"
//             className="px-3 py-2 rounded-md border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
//             placeholder="address"
//             value={address}
//             onChange={(e) => setAddress(e.target.value)}
//             required
//           />
//         </div>

//         <div className="flex flex-col text-left">
//           <label>price</label>
//           <input
//             type="text"
//             className="px-3 py-2 rounded-md border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
//             placeholder="price"
//             value={price}
//             onChange={(e) => setPrice(e.target.value)}
//             required
//           />
//         </div>

//         <div className="flex flex-col text-left">
//           <label>description</label>
//           <input
//             type="text"
//             className="px-3 py-2 rounded-md border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
//             placeholder="description"
//             value={description}
//             onChange={(e) => setDescription(e.target.value)}
//             required
//           />
//         </div>

//         <div className="flex flex-col text-left">
//           <label>unit_number</label>
//           <input
//             type="text"
//             className="px-3 py-2 rounded-md border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
//             placeholder="unit_number"
//             value={unit_number}
//             onChange={(e) => setUnitNumber(e.target.value)}
//             required
//           />
//         </div>

//         <div className="flex flex-col text-left">
//           <label className="mb-1">square_feet</label>
//           <input
//             type="text"
//             className="px-3 py-2 rounded-md border bg-background"
//             placeholder="square_feet"
//             value={square_feet}
//             onChange={(e) => setsQuareFeet(e.target.value)}
//             required
//           />
//         </div>

//         <div className="flex flex-col text-left">
//           <label className="mb-1">year_built</label>
//           <input
//             type="text"
//             className="px-3 py-2 rounded-md border bg-background"
//             placeholder="year_built"
//             value={year_built}
//             onChange={(e) => setYearBuilt(e.target.value)}
//             required
//           />
//         </div>
        
//         <div className="flex items-center gap-3">
//   <label className="px-4 py-2 bg-primary text-white rounded-md cursor-pointer hover:bg-primary/80">
//     Choose Image
//     <input
//       type="file"
//       accept="image/*"
//       onChange={(e) => setImage(e.target.files[0])}
//       className="hidden"
//     />
//   </label>

//   <span className="text-sm text-gray-400">
//     {image ? image.name : "No file selected"}
//   </span>
// </div>

//         <button
//           type="submit"
//           className="w-full  py-2 text-xl text-black  rounded-md bg-primary hover:bg-red-200 transition"
//         >
//           Submit{" "}
//         </button>
//       </form>
//     </div>
//   );
// };


import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import PropertyContext from "../context/PropertyContext";

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
  const [image, setImage] = useState(null);
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
      if (image) formData.append("image", image);

      await addProperty(formData, token);
      navigate("/profile");
    } catch (err) {
      setError("Failed to add property. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4 py-16">

      {/* Ambient glow */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-violet-600/10 blur-3xl" />
      </div>

      <div className="relative w-full max-w-lg">

        {/* Header */}
        <div className="mb-8 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-violet-500/30 bg-violet-500/10 px-4 py-1.5 mb-6">
            <span className="h-1.5 w-1.5 rounded-full bg-violet-400 animate-pulse" />
            <span className="text-xs font-medium text-violet-300 tracking-wide">New listing</span>
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Add Property</h1>
          <p className="mt-2 text-sm text-slate-400">Fill in the details for your new listing</p>
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-white/8 bg-slate-900/60 backdrop-blur-sm p-8">

          {error && (
            <div className="mb-6 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Address */}
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

            {/* Price + Unit row */}
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

            {/* Sq ft + Year row */}
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

            {/* Description */}
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

            {/* Image upload */}
            <Field label="Photo">
              <label className="flex items-center gap-3 cursor-pointer group">
                <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-white/10 bg-slate-900 hover:border-violet-500/40 hover:bg-violet-500/10 transition-all duration-200">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-slate-400 group-hover:text-violet-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5V19a1 1 0 001 1h16a1 1 0 001-1v-2.5M16 8l-4-4-4 4M12 4v12" />
                  </svg>
                  <span className="text-sm text-slate-400 group-hover:text-violet-300 transition-colors">
                    Choose image
                  </span>
                </div>
                <span className="text-sm text-slate-500 truncate max-w-[180px]">
                  {image ? image.name : "No file selected"}
                </span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => setImage(e.target.files[0])}
                />
              </label>
            </Field>

            {/* Submit */}
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