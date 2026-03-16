"use client";

import { useState } from "react";
import { UploadCloud, CheckCircle2 } from "lucide-react";

export default function StyleMyselfForm({ onSubmit, isLoading }) {
  const [formData, setFormData] = useState({
    venue: "",
    aesthetic: "",
    gender: "Female",
    dressType: "Casual",
    priceRange: "Mid Range"
  });
  const [referenceImage, setReferenceImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [dragActive, setDragActive] = useState(false);

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setReferenceImage(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      setReferenceImage(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const submitForm = (e) => {
    e.preventDefault();
    onSubmit({ ...formData, referenceImage });
  };

  return (
    <form onSubmit={submitForm} className="space-y-6 animate-in fade-in zoom-in-95 duration-500">
      <div className="space-y-5">
        
        {/* Venue / Event */}
        <div>
          <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Venue or Event <span className="text-zinc-400 font-normal">(e.g., Summer Wedding, Office Party)</span>
          </label>
          <input
            type="text"
            required
            className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-zinc-900 focus:border-[#D4AF37] focus:ring-4 focus:ring-[#D4AF37]/10 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white dark:focus:border-[#D4AF37] transition-all outline-none shadow-sm"
            placeholder="Where are you going?"
            value={formData.venue}
            onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
          />
        </div>

        {/* Aesthetic */}
        <div>
          <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Desired Aesthetic <span className="text-zinc-400 font-normal">(e.g., Old Money, Cyberpunk, Minimalist)</span>
          </label>
          <input
            type="text"
            required
            className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-zinc-900 focus:border-[#D4AF37] focus:ring-4 focus:ring-[#D4AF37]/10 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white dark:focus:border-[#D4AF37] transition-all outline-none shadow-sm"
            placeholder="What vibe do you want?"
            value={formData.aesthetic}
            onChange={(e) => setFormData({ ...formData, aesthetic: e.target.value })}
          />
        </div>

        {/* Gender Selection — important for generating the right outfit */}
        <div>
          <label className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Gender <span className="text-zinc-400 font-normal">(used to generate the right outfit style)</span>
          </label>
          <div className="flex gap-3" id="gender-selector">
            {["Female", "Male", "Non-binary"].map((g) => (
              <button
                key={g}
                type="button"
                id={`gender-${g.toLowerCase()}`}
                onClick={() => setFormData({ ...formData, gender: g })}
                className={`flex-1 rounded-xl py-2.5 text-sm font-semibold border transition-all duration-300 ${
                  formData.gender === g
                    ? "bg-[#D4AF37] border-[#D4AF37] text-black shadow-md"
                    : "bg-transparent border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 hover:border-[#D4AF37]/50"
                }`}
              >
                {g === "Female" ? "♀ Female" : g === "Male" ? "♂ Male" : "⚧ Non-binary"}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          {/* Dress Type */}
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">Type</label>
            <select
              className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-zinc-900 focus:border-[#D4AF37] focus:ring-4 focus:ring-[#D4AF37]/10 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white dark:focus:border-[#D4AF37] transition-all outline-none shadow-sm appearance-none"
              value={formData.dressType}
              onChange={(e) => setFormData({ ...formData, dressType: e.target.value })}
            >
              <option value="Casual">Casual</option>
              <option value="Smart Casual">Smart Casual</option>
              <option value="Formal">Formal</option>
              <option value="Streetwear">Streetwear</option>
            </select>
          </div>

          {/* Size Selection */}
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">Size</label>
            <select
              className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-zinc-900 focus:border-[#D4AF37] focus:ring-4 focus:ring-[#D4AF37]/10 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white dark:focus:border-[#D4AF37] transition-all outline-none shadow-sm appearance-none"
              value={formData.size || "M"}
              onChange={(e) => setFormData({ ...formData, size: e.target.value })}
            >
              <option value="XS">XS</option>
              <option value="S">S</option>
              <option value="M">M</option>
              <option value="L">L</option>
              <option value="XL">XL</option>
            </select>
          </div>

          {/* Price Range */}
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">Budget</label>
            <select
              className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-zinc-900 focus:border-[#D4AF37] focus:ring-4 focus:ring-[#D4AF37]/10 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white dark:focus:border-[#D4AF37] transition-all outline-none shadow-sm appearance-none"
              value={formData.priceRange}
              onChange={(e) => setFormData({ ...formData, priceRange: e.target.value })}
            >
              <option value="Low Range">Low Range</option>
              <option value="Mid Range">Mid Range</option>
              <option value="High Range">High Range</option>
              <option value="All Range">All Range</option>
            </select>
          </div>
        </div>

        {/* Reference Image (Optional) */}
        <div>
          <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Reference Image <span className="text-zinc-400 font-normal">(Optional inspiration)</span>
          </label>
          
          {!previewUrl ? (
            <label
              onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
              onDragLeave={() => setDragActive(false)}
              onDrop={handleDrop}
              className={`flex h-32 w-full cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed transition-all ${
                dragActive ? "border-[#D4AF37] bg-[#D4AF37]/5 dark:bg-[#D4AF37]/10" : "border-zinc-200 hover:border-[#D4AF37]/40 dark:border-zinc-700 dark:hover:border-zinc-600 bg-zinc-50/50 dark:bg-zinc-800/50"
              }`}
            >
              <UploadCloud className="mb-2 text-zinc-400" size={24} />
              <span className="text-sm text-zinc-500 dark:text-zinc-400">Click or drag an image here</span>
              <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
            </label>
          ) : (
            <div className="relative h-32 w-full overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-800">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={previewUrl} alt="Reference" className="h-full w-full object-cover" />
              <button
                type="button"
                onClick={() => { setPreviewUrl(null); setReferenceImage(null); }}
                className="absolute right-2 top-2 rounded-full bg-black/50 p-1 text-white backdrop-blur-md"
              >
                <CheckCircle2 size={18} className="fill-green-500" />
              </button>
            </div>
          )}
        </div>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="mt-6 flex w-full items-center justify-center rounded-xl bg-black px-4 py-4.5 font-bold text-white shadow-xl hover:shadow-2xl hover:scale-[1.01] transition-all active:scale-[0.98] disabled:opacity-70 dark:bg-[#D4AF37] dark:text-black dark:shadow-[0_0_20px_rgba(212,175,55,0.2)]"
      >
        {isLoading ? "Generating Style..." : "Style Me Now"}
      </button>
    </form>
  );
}
