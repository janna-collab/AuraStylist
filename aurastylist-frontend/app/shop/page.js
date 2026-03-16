"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { ArrowLeft, ExternalLink, Loader2, Info } from "lucide-react";
import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";
import { API_BASE_URL } from "@/lib/endpoints";

const CATEGORY_ICONS = {
  Top: "👔",
  Bottom: "👖",
  Shoes: "👞",
  Bag: "💼",
  Watch: "⌚",
  Accessories: "✨"
};

function ShopContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [image_url, setImageUrl] = useState("");
  const [description, setDescription] = useState("An elegant, curated fashion look.");
  const [loading, setLoading] = useState(true);
  const [shopData, setShopData] = useState(null);

  useEffect(() => {
    const storedImg = sessionStorage.getItem("aura_shop_image");
    const storedDesc = sessionStorage.getItem("aura_shop_description");
    const fromParam = searchParams.get("image_url");
    
    const resolvedImg = storedImg || (fromParam ? decodeURIComponent(fromParam) : "");
    setImageUrl(resolvedImg);
    if (storedDesc) setDescription(storedDesc);

    // Keep stored items for refresh but clear on unmount if needed
  }, [searchParams]);

  useEffect(() => {
    if (!image_url && image_url !== "") return;
    const fetchShoppingData = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/shop/search`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            image_url: image_url,
            outfit_description: description
          })
        });

        if (res.ok) {
          const data = await res.json();
          setShopData(data.results);
        }
      } catch (err) {
        console.error("Failed to fetch shopping data", err);
      } finally {
        setLoading(false);
      }
    };

    fetchShoppingData();
  }, [image_url]);

  return (
    <div className="flex min-h-screen flex-col bg-[#fafafa] dark:bg-[#080808] text-foreground transition-colors duration-700 font-sans selection:bg-black selection:text-white">
      <header className="flex h-20 items-center px-10 border-b border-zinc-200/50 dark:border-zinc-800/50 sticky top-0 z-30 bg-white/80 dark:bg-black/80 backdrop-blur-xl">
        <button 
          onClick={() => router.back()} 
          className="group flex items-center gap-2 text-zinc-500 hover:text-black dark:hover:text-white transition-all mr-8"
        >
          <ArrowLeft size={16} />
          <span className="text-[10px] uppercase tracking-widest font-bold">Back</span>
        </button>
        
        <div className="flex flex-col flex-1">
          <h2 className="text-xl font-serif italic text-black dark:text-white tracking-tight">
            Curated Boutiques
          </h2>
        </div>
        
        <div className="flex items-center gap-6">
          <ThemeToggle />
        </div>
      </header>

      <main className="flex-1 w-full max-w-[1400px] mx-auto p-4 md:p-8">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-40">
            <Loader2 className="h-5 w-5 animate-spin text-zinc-300 dark:text-zinc-700 mb-6" />
            <p className="text-[10px] uppercase tracking-[0.3em] text-zinc-400 font-bold">Assembling your Menu...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start animate-in fade-in duration-700">
            
            {/* Left Column: Reference Style (Selected Style) */}
            <div className="lg:col-span-4 lg:sticky lg:top-28">
              <div className="luxury-card border-none bg-white dark:bg-zinc-900/50 p-6 rounded-[2rem] overflow-hidden shadow-sm relative group">
                <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-zinc-400 mb-6">Selected Style</p>
                <div className="aspect-[3/4] rounded-2xl overflow-hidden mb-6 bg-zinc-100 dark:bg-zinc-800 relative">
                  {image_url && (
                    <img 
                      src={image_url} 
                      alt="Selected Look" 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                </div>
                <div>
                  <h3 className="font-serif italic text-2xl text-black dark:text-white mb-2 leading-tight">
                    The Vision
                  </h3>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400 font-light leading-relaxed">
                    {description || "A cohesive, elegant silhouette designed for you."}
                  </p>
                </div>
                <div className="mt-8 pt-6 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">System</span>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-primary bg-primary/5 px-2 py-0.5 rounded">Nova Omni</span>
                </div>
              </div>
            </div>

            {/* Right Column: Compact Category Links */}
            <div className="lg:col-span-8">
              <div className="luxury-card border-none bg-white dark:bg-zinc-950 p-8 md:p-12 rounded-[2rem] shadow-sm">
                <div className="flex items-center justify-between mb-12">
                  <h3 className="text-3xl font-serif italic text-black dark:text-white tracking-tight">Shopping Manifest</h3>
                  <div className="flex items-center gap-2 text-zinc-400">
                    <Info size={14} />
                    <span className="text-[10px] font-bold uppercase tracking-widest leading-none">Direct Boutique Links</span>
                  </div>
                </div>

                <div className="space-y-12">
                  {shopData && Object.entries(shopData)
                    .filter(([_, items]) => items && items.length > 0)
                    .map(([category, items]) => (
                    <div key={category} className="border-b border-zinc-50 dark:border-zinc-900 pb-10 last:border-0 last:pb-0">
                      <div className="flex items-center gap-3 mb-6">
                        <span className="text-xl bg-zinc-50 dark:bg-zinc-900 w-10 h-10 rounded-full flex items-center justify-center border border-zinc-100 dark:border-zinc-800">{CATEGORY_ICONS[category] || "✨"}</span>
                        <h4 className="text-lg font-serif italic text-zinc-800 dark:text-zinc-200">{category}</h4>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {items.slice(0, 4).map((item, idx) => (
                          <Link
                            key={idx}
                            href={item.product_url || item.url || "#"}
                            target="_blank"
                            className="flex items-center justify-between p-4 bg-[#fafafa] dark:bg-[#0c0c0c] hover:bg-black dark:hover:bg-white group transition-all duration-300 rounded-xl"
                          >
                            <div className="flex-1 pr-4">
                              <p className="text-[9px] uppercase tracking-[0.15em] font-bold text-zinc-400 group-hover:text-zinc-500 transition-colors mb-1">
                                {item.source || "Boutique"} • {item.price || "Contact for Price"}
                              </p>
                              <h5 className="text-xs font-light text-zinc-900 dark:text-zinc-100 group-hover:text-white dark:group-hover:text-black line-clamp-1">
                                {item.name || item.title}
                              </h5>
                            </div>
                            <ExternalLink size={12} className="text-zinc-300 dark:text-zinc-700 group-hover:text-white dark:group-hover:text-black transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                          </Link>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                {!shopData && !loading && (
                   <div className="flex flex-col items-center py-20 text-center">
                    <p className="text-zinc-400 mb-8 font-serif italic">Your personalized boutique selection has been archived.</p>
                    <button 
                      onClick={() => window.location.reload()}
                      className="px-10 py-3 border border-zinc-200 dark:border-zinc-800 text-[10px] uppercase tracking-[0.2em] font-bold hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all rounded-full"
                    >
                      Regenerate Manifest
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </main>

      <footer className="py-12 text-center">
        <p className="text-[8px] uppercase tracking-[0.5em] text-zinc-300 dark:text-zinc-800 font-bold">
          AuraStylist Precision Shopping
        </p>
      </footer>

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Bodoni+Moda:ital,opsz,wght@0,6..96,400..900;1,6..96,400..900&family=Inter:wght@100..900&display=swap');
        
        :root {
          --font-serif: 'Bodoni Moda', serif;
          --font-sans: 'Inter', sans-serif;
        }

        .font-serif {
          font-family: var(--font-serif);
        }

        .font-sans {
          font-family: var(--font-sans);
        }

        body {
          font-family: var(--font-sans);
          -webkit-font-smoothing: antialiased;
        }

        .luxury-card {
          border: 1px solid rgba(0,0,0,0.05);
          transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
        }

        dark .luxury-card {
           border: 1px solid rgba(255,255,255,0.05);
        }
      `}</style>
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-[#fafafa] dark:bg-[#080808]">
        <Loader2 className="animate-spin w-5 h-5 text-zinc-200 dark:text-zinc-800" />
      </div>
    }>
      <ShopContent />
    </Suspense>
  );
}
