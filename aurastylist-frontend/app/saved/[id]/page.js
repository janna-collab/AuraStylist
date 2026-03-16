"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ShoppingBag, Share2, Heart } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import NavbarLogo from "@/components/NavbarLogo";
import { ENDPOINTS } from "@/lib/endpoints";

export default function SingleSavedLookPage({ params }) {
  const { id } = use(params);
  const router = useRouter();
  const [outfit, setOutfit] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOutfit = async () => {
      try {
        const res = await fetch(`${ENDPOINTS.GALLERY_SAVED_SINGLE}/${id}`);
        if (res.ok) {
          const data = await res.json();
          setOutfit(data.outfit);
        } else {
          setError("Look not found.");
        }
      } catch (err) {
        console.error("Fetch outfit error:", err);
        setError("Connection error.");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchOutfit();
  }, [id]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-black">
        <div className="animate-pulse text-[#D4AF37] h-12 w-12 rounded-full border-4 border-t-transparent border-[#D4AF37]" />
      </div>
    );
  }

  if (error || !outfit) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-50 dark:bg-black p-8">
        <p className="text-zinc-600 dark:text-zinc-400 mb-6 text-xl">{error || "Look not found."}</p>
        <button onClick={() => router.push("/saved")} className="px-8 py-3 bg-[#D4AF37] text-black rounded-full font-bold">
          Back to Collection
        </button>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#faf7f2] dark:bg-black transition-colors duration-500 font-sans">
      <header className="flex h-24 items-center justify-between px-8 border-b border-zinc-200 dark:border-zinc-800 glass sticky top-0 z-30">
        <div className="flex items-center gap-6">
          <button onClick={() => router.push("/saved")} className="rounded-full p-2.5 text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
            <ArrowLeft size={22} />
          </button>
          <NavbarLogo />
        </div>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <button 
            onClick={() => router.push("/saved")}
            className="hidden sm:flex items-center gap-2 rounded-full border border-zinc-200 dark:border-zinc-800 px-5 py-2.5 text-sm font-semibold hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-all"
          >
            My Collection
          </button>
        </div>
      </header>

      <main className="flex-1 flex flex-col lg:flex-row divide-y lg:divide-y-0 lg:divide-x divide-zinc-200 dark:divide-zinc-800">
        {/* Left: Premium Image View */}
        <div className="lg:flex-[1.2] p-6 sm:p-12 flex items-center justify-center bg-white dark:bg-zinc-950/50">
          <div className="relative group max-w-2xl w-full shadow-2xl rounded-[2.5rem] overflow-hidden border border-zinc-200 dark:border-zinc-800">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src={outfit.image_url} 
              alt="Curated Saved Look"
              className="w-full h-auto object-cover"
            />
            <div className="absolute top-6 right-6">
               <div className="h-12 w-12 rounded-full bg-white/90 dark:bg-black/80 backdrop-blur-md flex items-center justify-center text-[#D4AF37] shadow-lg">
                  <Heart className="fill-[#D4AF37]" size={24} />
               </div>
            </div>
          </div>
        </div>

        {/* Right: Details & Actions */}
        <div className="lg:flex-1 p-8 sm:p-16 flex flex-col justify-center">
            <div className="max-w-md mx-auto lg:mx-0 w-full">
                <div className="flex items-center gap-3 mb-6">
                    <span className="h-[1px] w-10 bg-[#D4AF37]"></span>
                    <span className="text-[#D4AF37] font-bold text-xs uppercase tracking-[0.2em]">Saved Ensemble</span>
                </div>
                
                <h1 className="text-4xl md:text-5xl font-light tracking-tight text-zinc-900 dark:text-white mb-8 leading-tight">
                    Timeless <span className="font-serif italic">Elegance</span>
                </h1>

                <div className="mb-12 p-8 rounded-[2rem] bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 shadow-sm relative">
                    <div className="absolute top-0 right-8 -translate-y-1/2 bg-white dark:bg-black px-4 py-1 rounded-full border border-zinc-200 dark:border-zinc-800 text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                      Expert Recommendation
                    </div>
                    <p className="text-lg text-zinc-700 dark:text-zinc-300 font-light leading-relaxed italic">
                        "{outfit.recommendation || "An ensemble curated for your personal aesthetic."}"
                    </p>
                </div>

                <div className="flex flex-col gap-4">
                    <button 
                        onClick={() => {
                           sessionStorage.setItem("aura_shop_image", outfit.image_url);
                           sessionStorage.setItem("aura_shop_description", outfit.recommendation);
                           router.push("/shop");
                        }}
                        className="flex items-center justify-center gap-3 h-16 rounded-2xl bg-black dark:bg-white text-white dark:text-black text-lg font-bold shadow-xl hover:scale-[1.02] transition-all"
                    >
                        <ShoppingBag size={20} /> Checkout This Look
                    </button>
                    
                    <button className="flex items-center justify-center gap-3 h-16 rounded-2xl border-2 border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-white text-lg font-semibold hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-all">
                        <Share2 size={20} /> Share Look
                    </button>
                    
                    <p className="text-center text-xs text-zinc-400 mt-6">
                        Saved on {new Date(outfit.timestamp).toLocaleDateString(undefined, { dateStyle: 'long' })}
                    </p>
                </div>
            </div>
        </div>
      </main>
    </div>
  );
}
