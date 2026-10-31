import { useEffect, useMemo, useRef } from "react";

export const ImagePicker = ({ files, onChange, max = 10 }) => {
  const inputRef = useRef(null);

  const previews = useMemo(
    () => files.map((f) => ({ file: f, url: URL.createObjectURL(f) })),
    [files]
  );

  useEffect(() => {
    return () => previews.forEach((p) => URL.revokeObjectURL(p.url));
  }, [previews]);

  const handleSelect = (e) => {
    const selected = Array.from(e.target.files || []).filter((f) =>
      f.type.startsWith("image/")
    );
    const merged = [...files, ...selected].slice(0, max);
    onChange(merged);
    e.target.value = "";
  };

  const removeAt = (index) => onChange(files.filter((_, i) => i !== index));

  const remaining = max - files.length;

  return (
    <div className="space-y-3">
      {previews.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
          {previews.map((p, i) => (
            <div
              key={p.url}
              className="relative aspect-square rounded-xl overflow-hidden border border-white/10 bg-slate-800 group"
            >
              <img src={p.url} alt={p.file.name} className="w-full h-full object-cover" />
              {i === 0 && (
                <span className="absolute bottom-1 left-1 rounded-md bg-violet-600/90 px-1.5 py-0.5 text-[10px] font-semibold text-white">
                  Cover
                </span>
              )}
              <button
                type="button"
                onClick={() => removeAt(i)}
                className="absolute top-1 right-1 h-6 w-6 rounded-full bg-black/70 text-white text-xs leading-none opacity-80 hover:opacity-100 hover:bg-red-600 transition"
                aria-label={`Remove ${p.file.name}`}
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="flex items-center gap-3">
        <button
          type="button"
          disabled={remaining <= 0}
          onClick={() => inputRef.current?.click()}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-white/10 bg-slate-900 text-sm text-slate-300 hover:border-violet-500/40 hover:bg-violet-500/10 hover:text-violet-300 transition disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5V19a1 1 0 001 1h16a1 1 0 001-1v-2.5M16 8l-4-4-4 4M12 4v12" />
          </svg>
          {files.length ? "Add more photos" : "Choose photos"}
        </button>
        <span className="text-xs text-slate-500">
          {files.length} selected · up to {max}
        </span>
        <input
          ref={inputRef}
          type="file"
          accept="image/png,image/jpeg,image/webp"
          multiple
          className="hidden"
          onChange={handleSelect}
        />
      </div>
    </div>
  );
};
