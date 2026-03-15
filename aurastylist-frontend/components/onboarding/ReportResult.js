"use client";

import { Droplet, Scissors, UserCircle2, ArrowRight } from "lucide-react";

export default function ReportResult({ profileInfo, onFinish }) {
  // If profileInfo is not provided (e.g. while generating), we can show a skeleton or loading state elsewhere.
  // Assuming this component only renders when data is ready.
  
  // Mock data as fallback
  const report = profileInfo || {
    skinUndertone: "Warm Olive",
    bodyProportions: "Inverted Triangle",
    faceShape: "Square",
    bestColors: ["Emerald Green", "Terracotta", "Navy Blue", "Mustard"],
    flatteringCuts: ["V-necklines", "A-line skirts", "Wide-leg trousers"],
    suitableHairstyles: ["Soft layers", "Side-swept bangs", "Textured bob"]
  };

  return (
    <div className="w-full animate-in fade-in zoom-in-95 duration-700">
      <div className="mb-10 text-center">
        <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-tr from-zinc-200 to-white shadow-xl dark:from-zinc-800 dark:to-zinc-900 border border-zinc-100 dark:border-zinc-800">
          <UserCircle2 size={36} className="text-black dark:text-white" />
        </div>
        <h2 className="bg-gradient-to-br from-black to-zinc-500 bg-clip-text text-4xl font-extrabold tracking-tight text-transparent dark:from-white dark:to-zinc-400">
          Your Style Report
        </h2>
        <p className="mt-3 text-lg text-zinc-500 dark:text-zinc-400">
          Curated by Nova AI specifically for your body and preferences.
        </p>
      </div>

      <div className="space-y-6">
        {/* Core Analysis Card */}
        <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
          <h3 className="mb-4 text-xs font-bold uppercase tracking-widest text-zinc-400">Core Analysis</h3>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl bg-zinc-50 p-4 dark:bg-zinc-900">
              <span className="block text-sm text-zinc-500 dark:text-zinc-400">Skin Undertone</span>
              <span className="mt-1 block font-semibold text-zinc-900 dark:text-zinc-50">{report.skinUndertone}</span>
            </div>
            <div className="rounded-2xl bg-zinc-50 p-4 dark:bg-zinc-900">
              <span className="block text-sm text-zinc-500 dark:text-zinc-400">Proportions</span>
              <span className="mt-1 block font-semibold text-zinc-900 dark:text-zinc-50">{report.bodyProportions}</span>
            </div>
            <div className="rounded-2xl bg-zinc-50 p-4 dark:bg-zinc-900">
              <span className="block text-sm text-zinc-500 dark:text-zinc-400">Face Shape</span>
              <span className="mt-1 block font-semibold text-zinc-900 dark:text-zinc-50">{report.faceShape}</span>
            </div>
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          {/* Colors Card */}
          <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
            <div className="mb-4 flex items-center gap-2">
              <Droplet size={20} className="text-blue-500" />
              <h3 className="font-bold text-zinc-900 dark:text-zinc-50">Best Colors</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {report.bestColors.map((color) => (
                <span key={color} className="rounded-full bg-zinc-100 px-3 py-1 text-sm font-medium text-zinc-800 dark:bg-zinc-900 dark:text-zinc-300">
                  {color}
                </span>
              ))}
            </div>
          </div>

          {/* Cuts Card */}
          <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
            <div className="mb-4 flex items-center gap-2">
              <Scissors size={20} className="text-zinc-800 dark:text-zinc-200" />
              <h3 className="font-bold text-zinc-900 dark:text-zinc-50">Flattering Cuts</h3>
            </div>
            <ul className="space-y-2">
              {report.flatteringCuts.map((cut) => (
                <li key={cut} className="flex items-center text-sm text-zinc-600 dark:text-zinc-400">
                  <span className="mr-2 h-1.5 w-1.5 rounded-full bg-black dark:bg-white"></span>
                  {cut}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="mt-10 flex justify-center">
        <button
          onClick={() => {
            localStorage.setItem("aura_profile", JSON.stringify(report));
            onFinish();
          }}
          className="group flex items-center gap-2 rounded-full bg-black px-8 py-4 font-semibold text-white shadow-xl shadow-black/20 transition-all hover:-translate-y-1 hover:bg-zinc-800 hover:shadow-2xl dark:bg-white dark:text-black dark:shadow-white/10 dark:hover:bg-zinc-200"
        >
          Go to My Dashboard
          <ArrowRight size={20} className="transition-transform group-hover:translate-x-1" />
        </button>
      </div>
    </div>
  );
}
