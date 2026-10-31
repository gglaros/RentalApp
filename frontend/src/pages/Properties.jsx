import { useContext, useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import PropertyContext from "../context/PropertyContext";
import { getImages, imageUrl } from "../utils/api";

const inputClass =
  "w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-sm text-white placeholder-slate-500 outline-none focus:border-violet-500/60 focus:ring-2 focus:ring-violet-500/20";

const EMPTY = { q: "", min_price: "", max_price: "", min_sqft: "", max_sqft: "", sort: "newest" };

export const Properties = () => {
  const { fetchApprovedProperties, approvedProperties } = useContext(PropertyContext);
  const [searchParams, setSearchParams] = useSearchParams();

  const initial = { ...EMPTY, ...Object.fromEntries(searchParams.entries()) };
  const [filters, setFilters] = useState(initial);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);

  const runSearch = async (f) => {
    setLoading(true);
    const result = await fetchApprovedProperties(f);
    setFailed(result === null);
    setLoading(false);
  };

  useEffect(() => {
    runSearch(initial);
  }, []);

  const handleChange = (e) => setFilters((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    const active = Object.fromEntries(Object.entries(filters).filter(([, v]) => v !== ""));
    setSearchParams(active);
    runSearch(filters);
  };

  const handleReset = () => {
    setFilters(EMPTY);
    setSearchParams({});
    runSearch(EMPTY);
  };

  const handleSort = (e) => {
    const next = { ...filters, sort: e.target.value };
    setFilters(next);
    setSearchParams(Object.fromEntries(Object.entries(next).filter(([, v]) => v !== "")));
    runSearch(next);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white px-4 py-10">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight">Find a property</h1>
          <p className="mt-2 text-slate-400">Browse all approved rental listings</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-white/8 bg-slate-900/60 p-5 grid gap-3 md:grid-cols-6 items-end text-left"
        >
          <div className="md:col-span-2">
            <label className="text-xs text-slate-400 uppercase tracking-wider">Search</label>
            <input name="q" value={filters.q} onChange={handleChange} placeholder="Address or description" className={inputClass} />
          </div>
          <div>
            <label className="text-xs text-slate-400 uppercase tracking-wider">Min €</label>
            <input name="min_price" type="number" min={0} value={filters.min_price} onChange={handleChange} className={inputClass} />
          </div>
          <div>
            <label className="text-xs text-slate-400 uppercase tracking-wider">Max €</label>
            <input name="max_price" type="number" min={0} value={filters.max_price} onChange={handleChange} className={inputClass} />
          </div>
          <div>
            <label className="text-xs text-slate-400 uppercase tracking-wider">Min m²</label>
            <input name="min_sqft" type="number" min={0} value={filters.min_sqft} onChange={handleChange} className={inputClass} />
          </div>
          <div>
            <label className="text-xs text-slate-400 uppercase tracking-wider">Max m²</label>
            <input name="max_sqft" type="number" min={0} value={filters.max_sqft} onChange={handleChange} className={inputClass} />
          </div>

          <div className="md:col-span-6 flex flex-wrap items-center justify-between gap-3 pt-1">
            <div className="flex items-center gap-2 text-sm text-slate-400">
              Sort by
              <select name="sort" value={filters.sort} onChange={handleSort} className="bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-sm text-white">
                <option value="newest">Newest</option>
                <option value="price_asc">Price: low to high</option>
                <option value="price_desc">Price: high to low</option>
                <option value="sqft_desc">Largest first</option>
              </select>
            </div>
            <div className="flex gap-2">
              <button type="button" onClick={handleReset} className="rounded-xl border border-slate-700 px-4 py-2 text-sm text-slate-300 hover:bg-slate-800">
                Reset
              </button>
              <button type="submit" className="rounded-xl bg-violet-600 px-5 py-2 text-sm font-semibold hover:bg-violet-500">
                Search
              </button>
            </div>
          </div>
        </form>

        {loading ? (
          <p className="text-slate-400">Loading...</p>
        ) : failed ? (
          <p className="text-red-400">Could not load properties. Is the backend running?</p>
        ) : approvedProperties.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-white/10 py-16 text-slate-400">
            No properties match your search.
          </div>
        ) : (
          <>
            <p className="text-sm text-slate-500 text-left">{approvedProperties.length} result(s)</p>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {approvedProperties.map((p) => {
                const images = getImages(p);
                return (
                  <Link
                    key={p.id}
                    to={`/property/${p.id}`}
                    className="group text-left rounded-2xl overflow-hidden border border-white/8 bg-slate-900/60 hover:border-violet-500/40 transition"
                  >
                    <div className="relative h-48 bg-slate-800 overflow-hidden">
                      {images.length ? (
                        <img
                          src={imageUrl(images[0].path)}
                          alt={p.address}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-violet-800 via-indigo-800 to-slate-800" />
                      )}
                      {images.length > 1 && (
                        <span className="absolute bottom-2 right-2 rounded-full bg-black/60 px-2.5 py-1 text-xs">
                          📷 {images.length}
                        </span>
                      )}
                    </div>
                    <div className="p-4 space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <p className="font-semibold truncate">{p.address}</p>
                        <p className="text-violet-400 font-bold whitespace-nowrap">€{p.price}<span className="text-xs text-slate-500">/mo</span></p>
                      </div>
                      <p className="text-sm text-slate-400 line-clamp-2">{p.description}</p>
                      <div className="flex gap-3 text-xs text-slate-500">
                        <span>{p.square_feet} m²</span>
                        <span>Built {p.year_built}</span>
                        {p.unit_number && <span>Unit {p.unit_number}</span>}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
};
