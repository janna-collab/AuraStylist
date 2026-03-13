"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { ArrowLeft, ShoppingBag, ExternalLink, Loader2 } from "lucide-react";
import Link from "next/link";

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

  const mockShopData = {
    top: [
      { title: "Silk Evening Blouse", price: "$120", url: "#", image: "https://images.unsplash.com/photo-1550639524-a6f58345a278?w=300&h=300&fit=crop" },
      { title: "Chiffon Trim Longsleeve", price: "$85", url: "#", image: "https://images.unsplash.com/photo-1564584217132-2271fea73ca4?w=300&h=300&fit=crop" }
    ],
    bottom: [
      { title: "Tailored Wide Leg Trousers", price: "$150", url: "#", image: "https://images.unsplash.com/photo-1584370848010-d7fe6bc767ec?w=300&h=300&fit=crop" }
    ]
  };

  return (
    <div className="flex min-h-screen flex-col bg-zinc-50 dark:bg-black font-sans">
      <header className="flex h-20 items-center px-8 border-b border-zinc-200/50 bg-white/50 backdrop-blur-md dark:border-zinc-800/50 dark:bg-black/50 sticky top-0 z-20">
        <button onClick={() => router.back()} className="rounded-full p-2 text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors mr-4">
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-xl font-bold flex items-center gap-2 text-black dark:text-white">
          <ShoppingBag size={20} /> Complete the Look
        </h1>
      </header>

      <main className="flex-1 p-6 md:p-12 max-w-7xl mx-auto w-full">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="h-12 w-12 animate-spin text-zinc-400 mb-6" />
            <h2 className="text-2xl font-semibold text-black dark:text-white">Activating Stylist Agent...</h2>
            <p className="text-zinc-500 max-w-md text-center mt-2">
              Our AI is currently breaking down your outfit and scouring the web for the exact pieces via automated browser search. This takes a few moments.
            </p>
          </div>
        ) : (
          <div className="space-y-16">
            <div className="flex flex-col md:flex-row gap-8 items-start">
              {/* Reference Image from query */}
              {image_url && (
                <div className="w-full md:w-1/3 flex-shrink-0">
                  <div className="sticky top-28 rounded-3xl overflow-hidden shadow-2xl">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={image_url} alt="Reference Outfit" className="w-full h-auto object-cover" />
                  </div>
                </div>
              )}

              {/* Shopping Results */}
              <div className="w-full md:w-2/3 flex flex-col gap-12">
                {shopData && Object.entries(shopData).map(([category, items]) => (
                  <section key={category}>
                    <h3 className="text-3xl font-extrabold capitalize text-black dark:text-white mb-6 tracking-tight border-b border-zinc-200 dark:border-zinc-800 pb-2">
                      {category}
                    </h3>
                    {items && items.length > 0 ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {items.map((item, idx) => (
                          <div key={idx} className="group relative bg-white dark:bg-zinc-900 rounded-2xl p-4 shadow-sm hover:shadow-xl transition-all border border-zinc-100 dark:border-zinc-800 flex flex-col">
                            <div className="aspect-square bg-zinc-100 dark:bg-zinc-800 rounded-xl mb-4 overflow-hidden relative">
                               {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img src={item.image || "https://images.unsplash.com/photo-1445205170230-053b83016050?w=300&h=300"} alt={item.title} className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500" />
                            </div>
                            <h4 className="font-semibold text-lg line-clamp-2 leading-tight text-black dark:text-white">{item.title}</h4>
                            <div className="mt-auto pt-4 flex items-center justify-between">
                              <span className="font-bold text-xl text-green-600 dark:text-green-400">{item.price}</span>
                              <Link href={item.url} target="_blank" className="bg-black text-white dark:bg-white dark:text-black rounded-full p-2 hover:scale-105 transition-transform">
                                <ExternalLink size={18} />
                              </Link>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-zinc-500">No pieces found matching this category.</p>
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
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-black"><Loader2 className="animate-spin w-8 h-8" /></div>}>
      <ShopContent />
    </Suspense>
  );
}
