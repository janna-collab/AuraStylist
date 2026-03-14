"use client";

import { CheckCircle2, Maximize2, RefreshCw, ShoppingBag } from "lucide-react";
import { useState } from "react";
import Link from "next/link";

export default function OutfitCard({ imageUrl, altText, isSelected, onSelect, onRegenerate }) {
  const [isHovered, setIsHovered] = useState(false);
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  return (
    <div
      className={`group relative overflow-hidden rounded-3xl transition-all duration-300 ${
        isSelected
          ? "ring-4 ring-black ring-offset-2 dark:ring-white dark:ring-offset-black scale-[0.98]"
          : "hover:shadow-2xl hover:-translate-y-1"
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Fallback skeleton while image loads natively */}
      {!isImageLoaded && (
        <div className="absolute inset-0 max-h-[500px] min-h-[400px] animate-pulse bg-zinc-200 dark:bg-zinc-800" />
      )}

      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={imageUrl}
        alt={altText}
        onLoad={() => setIsImageLoaded(true)}
        className={`w-full object-cover max-h-[600px] min-h-[300px] transition-opacity duration-500 ${isImageLoaded ? "opacity-100" : "opacity-0"}`}
      />

      {/* Hover Overlay */}
      <div
        className={`absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/80 via-black/20 to-transparent p-6 transition-opacity duration-300 ${
          isHovered || isSelected ? "opacity-100" : "opacity-0"
        }`}
      >
        <div className="mt-auto flex items-center justify-between gap-2">
          <button
            onClick={onSelect}
            className={`flex flex-1 items-center justify-center gap-2 rounded-xl py-3 font-semibold transition-all backdrop-blur-md ${
              isSelected
                ? "bg-green-600 dark:bg-green-500 text-white shadow-lg"
                : "bg-white/95 text-zinc-900 hover:bg-white dark:bg-black/95 dark:text-white dark:hover:bg-black border border-zinc-200 dark:border-zinc-800"
            }`}
          >
            {isSelected ? (
              <>
                <CheckCircle2 size={18} /> Selected
              </>
            ) : (
              "Select Look"
            )}
          </button>
          
          <button
            onClick={onRegenerate}
            title="Try another variation"
            className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/20 text-white backdrop-blur-md hover:bg-white/30 transition-colors"
          >
            <RefreshCw size={18} />
          </button>
          
          <button
            title="Expand image"
            className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/20 text-white backdrop-blur-md hover:bg-white/30 transition-colors hidden sm:flex"
          >
            <Maximize2 size={18} />
          </button>
          
          {isSelected && (
            <Link
              href={`/shop?image_url=${encodeURIComponent(imageUrl)}`}
              className="flex items-center gap-2 rounded-xl bg-white text-black px-4 py-3 font-bold hover:scale-105 transition-transform ml-2 shadow-lg"
            >
              <ShoppingBag size={18} /> Shop Look
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
