"use client";

import { Droplet, Scissors, UserCircle2, ArrowRight } from "lucide-react";

export default function ReportResult({ profileInfo, onFinish }) {
  // Ultra-defensive normalization
  const raw = profileInfo || {};
  
  const getVal = (field) => {
    const val = raw[field] || "N/A";
    if (typeof val === "string") return val;
    if (typeof val === "object" && val !== null) {
        return val.value || val.label || JSON.stringify(val);
    }
    return String(val);
  };

  const getArr = (field) => {
    const val = raw[field] || [];
    if (Array.isArray(val)) return val.map(v => typeof v === "string" ? v : JSON.stringify(v));
    return [getVal(field)];
  };

  const skin = getVal("skinUndertone");
  const prop = getVal("bodyProportions");
  const face = getVal("faceShape");
  const colors = getArr("bestColors");
  const cuts = getArr("flatteringCuts");

  return (
    <div className="w-full">
      <div className="mb-10 text-center">
        <h2 className="text-4xl font-extrabold text-zinc-900 dark:text-white">Your Style Report</h2>
      </div>

      <div className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl bg-zinc-50 p-4 dark:bg-zinc-900">
            <span className="block text-sm text-zinc-500">Skin Undertone</span>
            <span className="font-semibold text-zinc-900 dark:text-zinc-50">{skin}</span>
          </div>
          <div className="rounded-2xl bg-zinc-50 p-4 dark:bg-zinc-900">
            <span className="block text-sm text-zinc-500">Proportions</span>
            <span className="font-semibold text-zinc-900 dark:text-zinc-50">{prop}</span>
          </div>
          <div className="rounded-2xl bg-zinc-50 p-4 dark:bg-zinc-900">
            <span className="block text-sm text-zinc-500">Face Shape</span>
            <span className="font-semibold text-zinc-900 dark:text-zinc-50">{face}</span>
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <div className="rounded-3xl border p-6 dark:bg-zinc-950">
            <h3 className="font-bold mb-4">Best Colors</h3>
            <div className="flex flex-wrap gap-2">
              {colors.map((c, i) => (
                <span key={i} className="rounded-full bg-zinc-100 px-3 py-1 text-sm dark:bg-zinc-900">{c}</span>
              ))}
            </div>
          </div>
          <div className="rounded-3xl border p-6 dark:bg-zinc-950">
            <h3 className="font-bold mb-4">Flattering Cuts</h3>
            <ul className="space-y-2">
              {cuts.map((c, i) => (
                <li key={i} className="text-sm text-zinc-600 dark:text-zinc-400">· {c}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="mt-10 flex justify-center">
        <button
          onClick={() => {
            localStorage.setItem("aura_profile", JSON.stringify(raw));
            onFinish();
          }}
          className="rounded-full bg-black px-8 py-4 font-semibold text-white dark:bg-white dark:text-black"
        >
          Go to My Dashboard
        </button>
      </div>
    </div>
  );
}
