"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Wand2, Heart, Filter, Trash2 } from "lucide-react";
import OutfitCard from "@/components/gallery/OutfitCard";
import { ThemeToggle } from "@/components/theme-toggle";
import NavbarLogo from "@/components/NavbarLogo";
import { ENDPOINTS } from "@/lib/endpoints";

export default function SavedGalleryPage() {
  const router = useRouter();
  const [savedOutfits, setSavedOutfits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSaved = async () => {
      const userStr = localStorage.getItem("aura_user");
      if (!userStr) {
        router.push("/signup");
        return;
      }
      
      const user = JSON.parse(userStr);
      try {
        const res = await fetch(`${ENDPOINTS.GALLERY_SAVED}/${user.email}`);
        if (res.ok) {
          const data = await res.json();
          setSavedOutfits(data.outfits || []);
        } else {
          setError("Failed to load your collection.");
        }
      } catch (err) {
        console.error("Fetch saved error:", err);
        setError("Connection error.");
      } finally {
        setLoading(false);
      }
    };

    fetchSaved();
  }, [router]);

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground transition-colors duration-500 font-sans">
      <header className="flex h-24 items-center justify-between px-8 border-b border-zinc-200 dark:border-zinc-800 glass transition-all duration-500 sticky top-0 z-30">
        <div className="flex items-center gap-6">
          <button onClick={() => router.back()} className="rounded-full p-2.5 text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
            <ArrowLeft size={22} />
          </button>
          <NavbarLogo />
        </div>
        
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <button 
            onClick={() => router.push("/gallery")}
            className="flex items-center gap-2 rounded-full border border-primary px-5 py-2.5 text-sm font-semibold text-primary hover:bg-primary hover:text-black transition-all duration-300"
          >
            Explore Trends
          </button>
        </div>
      </header>

      <main className="flex-1 p-6 sm:p-12 lg:px-24">
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-light tracking-tight text-zinc-950 dark:text-white flex items-center gap-4">
            Your Collection
            <Heart className="text-[#D4AF37] fill-[#D4AF37]" size={28} />
          </h1>
          <p className="mt-4 text-lg text-zinc-700 dark:text-zinc-400 max-w-xl font-light">
            Your curated high-fashion ensembles, saved for your ultimate style legacy.
          </p>
        </div>

        {loading ? (
          <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className={`w-full rounded-[2rem] bg-zinc-100 dark:bg-zinc-900 animate-pulse luxury-card ${i % 2 === 0 ? "h-[400px]" : "h-[600px]"}`} />
            ))}
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-20 bg-zinc-50 dark:bg-zinc-900 rounded-[3rem] border border-zinc-200 dark:border-zinc-800">
            <p className="text-zinc-600 dark:text-zinc-400 mb-6">{error}</p>
            <button 
              onClick={() => router.push("/")}
              className="px-8 py-3 bg-black dark:bg-white text-white dark:text-black rounded-full font-bold"
            >
              Back to Home
            </button>
          </div>
        ) : savedOutfits.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 bg-zinc-50 dark:bg-zinc-900 rounded-[3rem] border border-zinc-200 dark:border-zinc-800">
             <div className="h-20 w-20 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center mb-6 text-zinc-300">
                <Heart size={40} />
             </div>
             <p className="text-zinc-600 dark:text-zinc-400 mb-6 text-xl font-light">Your archive is currently empty.</p>
             <button 
              onClick={() => router.push("/gallery")}
              className="px-10 py-4 bg-[#D4AF37] text-black rounded-full font-bold shadow-xl hover:scale-105 transition-transform"
            >
              Explore and Save Looks
            </button>
          </div>
        ) : (
          <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6">
            {savedOutfits.map((outfit, idx) => (
               <div key={outfit._id || idx} className="break-inside-avoid">
                 <OutfitCard
                   imageUrl={outfit.image_url}
                   altText={`Saved Look ${idx + 1}`}
                   recommendation={outfit.recommendation}
                   hideRegenerate={true}
                   onSelect={() => router.push(`/saved/${outfit._id}`)}
                 />
               </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
