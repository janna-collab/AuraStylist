"use client";

import { useState } from "react";
import { Ruler, Sparkles, Shirt, Info, CheckCircle2 } from "lucide-react";
import { useUserProfileStore } from "@/store/userProfile";

export default function ManualInputsForm({ onComplete, onBack }) {
  const bodyAnalysis = useUserProfileStore(state => state.bodyAnalysis);
  const [formData, setFormData] = useState({
    gender: "Female",
    height: "",
    shoeSize: "",
    preferredFit: "Tailored",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onComplete) {
      onComplete(formData);
    }
  };

  const fits = ["Tailored", "Relaxed", "Oversized", "Athletic"];

  // Safely extract a display string from bodyAnalysis
  const analysisText = (() => {
    if (!bodyAnalysis) return "";
    if (typeof bodyAnalysis === "string") return bodyAnalysis;
    if (bodyAnalysis.analysis) return String(bodyAnalysis.analysis);
    if (bodyAnalysis.message) return String(bodyAnalysis.message);
    // If it's the object {skinUndertone, bodyProportions, faceShape}
    if (bodyAnalysis.skinUndertone || bodyAnalysis.skin_undertone) {
        return "AI analysis complete. We've detected your undertone and body type.";
    }
    return "Analysis complete";
  })();

  return (
    <div className="w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
          A Few More Details
        </h2>
        <p className="mt-2 text-zinc-500 dark:text-zinc-400">
          Tell us about your preferences to refine your personal style report.
        </p>
      </div>

      {/* AI Analysis Preview */}
      {bodyAnalysis && (
        <div className="mb-8 overflow-hidden rounded-3xl border border-[#D4AF37]/30 bg-[#D4AF37]/5 p-6 shadow-sm animate-in zoom-in-95 duration-700">
          <div className="flex items-center gap-2 mb-3 text-[#D4AF37]">
            <Sparkles size={18} />
            <h3 className="text-sm font-bold uppercase tracking-wider">AI Analysis Result</h3>
          </div>
          <div className="flex gap-4">
            <div className="flex-1">
              <p className="text-zinc-700 dark:text-zinc-300 text-sm leading-relaxed italic">
                "{analysisText}"
              </p>
            </div>
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#D4AF37]/20 text-[#D4AF37]">
              <CheckCircle2 size={20} />
            </div>
          </div>
          <p className="mt-4 text-[10px] text-zinc-400 dark:text-zinc-500 flex items-center gap-1">
            <Info size={10} />
            You can refine these details below if needed.
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Gender Selection */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
            <Sparkles size={16} className="text-zinc-400" />
            Gender
          </label>
          <div className="flex gap-2">
            {["Female", "Male", "Other"].map((g) => (
              <button
                key={g}
                type="button"
                onClick={() => setFormData({ ...formData, gender: g })}
                className={`flex-1 rounded-xl py-3 text-sm font-medium transition-all ${
                  formData.gender === g
                    ? "bg-black text-white dark:bg-white dark:text-black"
                    : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800"
                }`}
              >
                {g}
              </button>
            ))}
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          {/* Height Input */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
              <Ruler size={16} className="text-zinc-400" />
              Height
            </label>
            <div className="relative">
              <input
                type="text"
                required
                placeholder="e.g., 5'9&quot; or 175cm"
                className="w-full rounded-2xl border border-zinc-200 bg-white px-4 py-4 text-zinc-900 shadow-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black dark:border-zinc-800 dark:bg-zinc-950 dark:text-white dark:focus:border-white dark:focus:ring-white transition-all"
                value={formData.height}
                onChange={(e) => setFormData({ ...formData, height: e.target.value })}
              />
            </div>
          </div>

          {/* Shoe Size Input */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
              <Sparkles size={16} className="text-zinc-400" />
              Shoe Size
            </label>
            <div className="relative">
              <input
                type="text"
                required
                placeholder="e.g., US 10 / EU 43"
                className="w-full rounded-2xl border border-zinc-200 bg-white px-4 py-4 text-zinc-900 shadow-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black dark:border-zinc-800 dark:bg-zinc-950 dark:text-white dark:focus:border-white dark:focus:ring-white transition-all"
                value={formData.shoeSize}
                onChange={(e) => setFormData({ ...formData, shoeSize: e.target.value })}
              />
            </div>
          </div>
        </div>

        {/* Preferred Fit Selection (Cards) */}
        <div className="space-y-3 pt-4 border-t border-zinc-100 dark:border-zinc-800/50">
          <label className="text-sm font-medium text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
            <Shirt size={16} className="text-zinc-400" />
            Preferred Fit
          </label>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {fits.map((fit) => (
              <button
                key={fit}
                type="button"
                onClick={() => setFormData({ ...formData, preferredFit: fit })}
                className={`flex flex-col items-center justify-center rounded-2xl border-2 p-4 text-sm font-medium transition-all ${
                  formData.preferredFit === fit
                    ? "border-black bg-zinc-50 text-black dark:border-white dark:bg-zinc-900 dark:text-white"
                    : "border-zinc-200 bg-white text-zinc-600 hover:border-zinc-300 dark:border-zinc-800 dark:bg-black dark:text-zinc-400 dark:hover:border-zinc-700"
                }`}
              >
                {fit}
              </button>
            ))}
          </div>
        </div>

        <div className="flex gap-4 pt-6">
          <button
            type="button"
            onClick={onBack}
            className="rounded-xl px-6 py-4 font-medium text-zinc-500 hover:text-black hover:bg-zinc-100 dark:hover:bg-zinc-900 dark:hover:text-white transition-colors"
          >
            Back
          </button>
          <button
            type="submit"
            className="flex-1 rounded-xl bg-black px-4 py-4 font-semibold text-white shadow-lg shadow-black/20 hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 dark:bg-white dark:text-black dark:shadow-white/10 dark:hover:bg-zinc-200 dark:focus:ring-white dark:focus:ring-offset-zinc-950 transition-all active:scale-[0.98]"
          >
            Generate My Style Profile
          </button>
        </div>
      </form>
    </div>
  );
}
