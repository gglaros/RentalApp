import { useEffect, useState } from "react";
import { imageUrl } from "../utils/api";

export const ImageGallery = ({ images, alt = "" }) => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (index >= images.length) setIndex(0);
  }, [images, index]);

  useEffect(() => {
    const onKey = (e) => {
      if (images.length < 2) return;
      if (e.key === "ArrowRight") setIndex((i) => (i + 1) % images.length);
      if (e.key === "ArrowLeft") setIndex((i) => (i - 1 + images.length) % images.length);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [images.length]);

  if (!images.length) {
    return (
      <div className="flex h-full min-h-[320px] items-center justify-center bg-gradient-to-br from-violet-900 via-indigo-900 to-slate-900">
        <span className="text-slate-400 text-lg">No image available</span>
      </div>
    );
  }

  const prev = () => setIndex((i) => (i - 1 + images.length) % images.length);
  const next = () => setIndex((i) => (i + 1) % images.length);

  return (
    <div className="flex h-full flex-col">
      <div className="relative flex-1 min-h-[320px] bg-slate-950">
        <img
          src={imageUrl(images[index].path)}
          alt={alt}
          className="absolute inset-0 h-full w-full object-contain"
        />

        {images.length > 1 && (
          <>
            <button
              type="button"
              onClick={prev}
              className="absolute left-3 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-black/50 text-white text-xl hover:bg-black/80 transition"
              aria-label="Previous photo"
            >
              ‹
            </button>
            <button
              type="button"
              onClick={next}
              className="absolute right-3 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-black/50 text-white text-xl hover:bg-black/80 transition"
              aria-label="Next photo"
            >
              ›
            </button>
            <span className="absolute top-3 right-3 rounded-full bg-black/60 px-3 py-1 text-xs text-white">
              {index + 1} / {images.length}
            </span>
          </>
        )}
      </div>

      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto bg-slate-900 p-3">
          {images.map((img, i) => (
            <button
              type="button"
              key={img.id ?? img.path}
              onClick={() => setIndex(i)}
              className={`h-16 w-20 flex-shrink-0 overflow-hidden rounded-lg border-2 transition ${
                i === index ? "border-violet-500" : "border-transparent opacity-60 hover:opacity-100"
              }`}
            >
              <img src={imageUrl(img.path)} alt="" className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
