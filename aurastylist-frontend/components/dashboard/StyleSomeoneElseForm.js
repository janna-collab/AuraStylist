"use client";

import { useState } from "react";
import { UploadCloud, CheckCircle2, UserPlus } from "lucide-react";

export default function StyleSomeoneElseForm({ onSubmit, isLoading }) {
  const [formData, setFormData] = useState({
    gender: "Female",
    height: "",
    venue: "",
    aesthetic: "",
  });
  const [targetImage, setTargetImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [dragActive, setDragActive] = useState(false);

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setTargetImage(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      setTargetImage(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const submitForm = (e) => {
    e.preventDefault();
    if (!targetImage) {
      alert("Please upload a photo of the person.");
      return;
    }
    onSubmit({ ...formData, targetImage });
  };

  return (
    <form onSubmit={submitForm} className="space-y-6 animate-in fade-in zoom-in-95 duration-500">
      
      {/* Target Person Image */}
      <div>
        <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-zinc-900 dark:text-zinc-100">
          <UserPlus size={18} className="text-blue-500" />
          Upload Their Photo <span className="text-red-500">*</span>
        </label>
        
        {!previewUrl ? (
          <label
            onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
            onDragLeave={() => setDragActive(false)}
            onDrop={handleDrop}
            className={`flex h-40 w-full cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed transition-all ${
              dragActive ? "border-blue-500 bg-blue-50 dark:border-blue-400 dark:bg-blue-900/20" : "border-zinc-300 hover:border-zinc-400 dark:border-zinc-800 dark:hover:border-zinc-700"
            }`}
          >
            <div className="rounded-full bg-zinc-100 p-3 dark:bg-zinc-900 mb-2 text-zinc-400">
              <UploadCloud size={24} />
            </div>
            <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Upload a clear photo</span>
            <span className="text-xs text-zinc-400 mt-1">PNG, JPG up to 5MB</span>
            <input type="file" required className="hidden" accept="image/*" onChange={handleImageChange} />
          </label>
        ) : (
          <div className="relative h-40 w-full overflow-hidden rounded-2xl border border-zinc-200 dark:border-zinc-800">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={previewUrl} alt="Target Person" className="h-full w-full object-cover" />
            <button
              type="button"
              onClick={() => { setPreviewUrl(null); setTargetImage(null); }}
              className="absolute right-3 top-3 rounded-full bg-black/60 p-2 text-white backdrop-blur-md hover:bg-black/80 transition-colors"
            >
              <CheckCircle2 size={20} className="fill-green-500" />
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Gender */}
        <div>
          <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">Gender</label>
          <select
            className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-zinc-900 focus:border-black focus:ring-black dark:border-zinc-800 dark:bg-zinc-950 dark:text-white dark:focus:border-white transition-colors outline-none appearance-none"
            value={formData.gender}
            onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
          >
            <option value="Female">Female</option>
            <option value="Male">Male</option>
            <option value="Non-binary">Non-binary</option>
            <option value="Other">Other</option>
          </select>
        </div>

        {/* Height */}
        <div>
          <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">Height</label>
          <input
            type="text"
            required
            className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-zinc-900 focus:border-black focus:ring-black dark:border-zinc-800 dark:bg-zinc-950 dark:text-white dark:focus:border-white transition-colors outline-none"
            placeholder="e.g., 5'6&quot; or 168cm"
            value={formData.height}
            onChange={(e) => setFormData({ ...formData, height: e.target.value })}
          />
        </div>
      </div>

      {/* Venue / Event */}
      <div>
        <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
          Venue or Event <span className="text-zinc-400 font-normal">(Requirements)</span>
        </label>
        <input
          type="text"
          required
          className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-zinc-900 focus:border-black focus:ring-black dark:border-zinc-800 dark:bg-zinc-950 dark:text-white dark:focus:border-white transition-colors outline-none"
          placeholder="Where are they going?"
          value={formData.venue}
          onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
        />
      </div>

      {/* Aesthetic */}
      <div>
        <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
          Desired Aesthetic
        </label>
        <input
          type="text"
          required
          className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-zinc-900 focus:border-black focus:ring-black dark:border-zinc-800 dark:bg-zinc-950 dark:text-white dark:focus:border-white transition-colors outline-none"
          placeholder="What's the vibe?"
          value={formData.aesthetic}
          onChange={(e) => setFormData({ ...formData, aesthetic: e.target.value })}
        />
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="mt-4 flex w-full items-center justify-center rounded-xl bg-blue-600 px-4 py-4 font-bold text-white shadow-lg shadow-blue-500/20 transition-transform active:scale-[0.98] hover:bg-blue-700 disabled:opacity-70 dark:bg-blue-500 dark:hover:bg-blue-600"
      >
        {isLoading ? "Analyzing Profile & Vibe..." : "Style Them Now"}
      </button>
    </form>
  );
}
