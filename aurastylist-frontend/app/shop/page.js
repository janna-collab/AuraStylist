"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { ArrowLeft, ShoppingBag, ExternalLink, Loader2 } from "lucide-react";
import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";

const mockShopData = {
  top: [
    { title: "Silk Evening Blouse", price: "$120", url: "#", image: "https://images.unsplash.com/photo-1550639524-a6f58345a278?w=300&h=300&fit=crop" },
    { title: "Chiffon Trim Longsleeve", price: "$85", url: "#", image: "https://images.unsplash.com/photo-1564584217132-2271fea73ca4?w=300&h=300&fit=crop" }
  ],
  bottom: [
    { title: "Tailored Wide Leg Trousers", price: "$150", url: "#", image: "https://images.unsplash.com/photo-1584370848010-d7fe6bc767ec?w=300&h=300&fit=crop" }
  ]
};

function ShopContent() {
  const searchParams = useSearchParams();
  const image_url = searchParams.get("image_url") || "";
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [shopData, setShopData] = useState(null);

  useEffect(() => {
    // Call the backend search endpoint
    const fetchShoppingData = async () => {
      try {
        const res = await fetch("http://localhost:8000/api/shop/search", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            image_url: image_url,
            outfit_description: "An elegant look based on the selected virtual try-on image." // In a real app, pass the full context
          })
        });

        if (res.ok) {
          const data = await res.json();
          setShopData(data.results);
        } else {
          setShopData(mockShopData);
        }
      } catch (err) {
        console.error("Failed to fetch shopping data", err);
        setShopData(mockShopData); // Fallback to mock on disconnect
      } finally {
        setLoading(false);
      }
    };

    fetchShoppingData();
  }, [image_url]);

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground transition-colors duration-500 font-sans">
      <header className="flex h-20 items-center px-8 border-b border-zinc-200 dark:border-zinc-800 glass transition-all duration-500 sticky top-0 z-20">
        <button onClick={() => router.back()} className="rounded-full p-2 text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors mr-4">
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-xl font-bold flex flex-1 items-center gap-2 text-black dark:text-white">
          <ShoppingBag size={20} /> Complete the Look
        </h1>
        <ThemeToggle />
      </header>

      <main className="flex-1 p-6 md:p-12 max-w-7xl mx-auto w-full">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 animate-in fade-in duration-1000">
            <Loader2 className="h-10 w-10 animate-spin text-primary mb-8" />
            <h2 className="text-3xl font-light text-zinc-950 dark:text-white font-serif italic mb-4 transition-colors">
              Sourcing the Look...
            </h2>
            <p className="text-zinc-600 dark:text-zinc-400 max-w-lg text-center font-light leading-relaxed transition-colors">
              Our agents are scanning global luxury retailers and independent
              boutiques to pinpoint the exact garments from your curated style.
            </p>
          </div>
        ) : (
          <div className="space-y-16 animate-in fade-in slide-in-from-bottom-8 duration-1000">
            <div className="flex flex-col xl:flex-row gap-12 items-start">

              {/* Reference Image from query */}
              {image_url && (
                <div className="w-full xl:w-[400px] flex-shrink-0">
                  <div className="sticky top-32 rounded-[2rem] overflow-hidden luxury-card border-none shadow-2xl">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={image_url} alt="Reference Outfit" className="w-full h-auto object-cover opacity-90 hover:opacity-100 transition-opacity duration-500" />
                  </div>
                </div>
              )}

              {/* Shopping Results */}
              <div className="w-full flex-1 flex flex-col gap-16">
                {shopData && Object.entries(shopData).map(([category, items]) => (
                  <section key={category}>
                    <div className="flex items-end gap-4 mb-8 border-b border-zinc-200 dark:border-zinc-800 pb-4 transition-colors">
                      <h3 className="text-4xl font-serif italic capitalize text-zinc-950 dark:text-white tracking-tight">
                        {category}
                      </h3>
                      <span className="text-zinc-500 text-sm mb-1">{items.length} Items</span>
                    </div>

                    {items && items.length > 0 ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {items.map((item, idx) => (
                          <div key={idx} className="group relative bg-white dark:bg-zinc-950 rounded-[1.5rem] p-5 hover:border-primary/40 transition-all duration-500 border border-zinc-200 dark:border-zinc-800 flex flex-col luxury-card shadow-sm hover:shadow-xl dark:shadow-none">
                            <div className="aspect-[3/4] bg-zinc-50 dark:bg-zinc-900 rounded-xl mb-6 overflow-hidden relative transition-colors">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img src={item.image || "https://images.unsplash.com/photo-1445205170230-053b83016050?w=300&h=400&fit=crop"} alt={item.title} className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-700 ease-out saturate-50 group-hover:saturate-100" />
                            </div>

                            <div className="flex flex-col flex-1">
                              <span className="text-primary text-xs font-bold tracking-widest uppercase mb-2">Designer</span>
                              <h4 className="font-light text-xl line-clamp-2 leading-tight text-zinc-900 dark:text-white mb-4 transition-colors">{item.title}</h4>

                              <div className="mt-auto pt-4 flex items-center justify-between border-t border-zinc-100 dark:border-zinc-800 transition-colors">
                                <span className="font-serif text-2xl text-zinc-900 dark:text-white transition-colors">{item.price}</span>
                                <Link href={item.url} target="_blank" className="flex items-center gap-2 bg-transparent border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-white rounded-full px-4 py-2 hover:bg-zinc-900 hover:text-white dark:hover:bg-white dark:hover:text-black hover:border-zinc-900 dark:hover:border-white transition-all duration-300 text-sm font-semibold">
                                  View <ExternalLink size={14} />
                                </Link>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-zinc-500 font-light italic">No archival pieces found for this category.</p>
                    )}
                  </section>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-background"><Loader2 className="animate-spin w-8 h-8 text-primary" /></div>}>
      <ShopContent />
    </Suspense>
  );
}
