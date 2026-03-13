"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Wand2, Download, Share2 } from "lucide-react";
import OutfitCard from "@/components/gallery/OutfitCard";

function GalleryContent() {
  const searchParams = useSearchParams();
  const request_id = searchParams.get("request_id") || "demo_request_123";
  const router = useRouter();

  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);
  const [pollCount, setPollCount] = useState(0);

  // Poll exactly as planned
  useEffect(() => {
    let interval;
    
    const fetchImages = async () => {
      try {
        const res = await fetch(`http://localhost:8000/api/gallery/generate/${request_id}`);
        if (res.ok) {
          const data = await res.json();
          if (data.status === "completed") {
            setImages(data.images);
            setLoading(false);
            clearInterval(interval);
          } else if (data.status === "processing") {
            // Keep polling
            setPollCount((prev) => prev + 1);
          }
        } else {
          mockLoad();
          clearInterval(interval);
        }
      } catch (error) {
        console.error("API error", error);
        mockLoad();
        clearInterval(interval);
      }
    };

    // Initial fetch
    fetchImages();

    // Set polling interval
    if (loading) {
      interval = setInterval(() => {
        fetchImages();
      }, 3000); // Poll every 3 seconds
    }

    return () => clearInterval(interval);
  }, [request_id, loading]);

  // Mock loader fallback if backend is offline
  const mockLoad = () => {
    setTimeout(() => {
      setImages([
        "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1000&auto=format&fit=crop", // Fashion 1
        "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=1000&auto=format&fit=crop", // Fashion 2
        "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?q=80&w=1000&auto=format&fit=crop", // Fashion 3
        "https://images.unsplash.com/photo-1496747611176-843222e1e57c?q=80&w=1000&auto=format&fit=crop"  // Fashion 4
      ]);
      setLoading(false);
    }, 4000);
  };

  const regenerateImage = async (index) => {
    // In a real app we would call /regenerate
    const newImages = [...images];
    newImages[index] = "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=1000&auto=format&fit=crop"; // Different dummy
    setImages(newImages);
  };

  return (
    <div className="flex min-h-screen flex-col bg-zinc-50 font-sans dark:bg-black">
      {/* Header */}
      <header className="flex h-20 items-center justify-between px-8 border-b border-zinc-200/50 bg-white/50 backdrop-blur-md dark:border-zinc-800/50 dark:bg-black/50 sticky top-0 z-20">
        <div className="flex items-center gap-4">
          <button onClick={() => router.back()} className="rounded-full p-2 text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors">
            <ArrowLeft size={20} />
          </button>
          <div className="flex items-center gap-2 font-bold tracking-tight text-xl text-black dark:text-white">
            <div className="h-4 w-4 rounded-sm bg-black dark:bg-white"></div>
            Style Gallery
          </div>
        </div>
        {selectedImage && (
          <div className="flex gap-2">
            <button className="flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-4 py-2 text-sm font-semibold shadow-sm transition-colors hover:bg-zinc-100 dark:border-zinc-800 dark:bg-black dark:text-white dark:hover:bg-zinc-900">
              <Share2 size={16} /> Share
            </button>
            <button className="flex items-center gap-2 rounded-full bg-black px-4 py-2 text-sm font-semibold text-white shadow-xl transition-colors hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200">
              <Download size={16} /> Save Look
            </button>
          </div>
        )}
      </header>

      <main className="flex-1 p-6 sm:p-12 lg:px-24">
        <div className="mb-12">
          <h1 className="text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50 flex items-center gap-3">
            Your Virtual Try-On
            {loading && <div className="h-4 w-4 rounded-full bg-blue-500 animate-pulse" />}
          </h1>
          <p className="mt-2 text-lg text-zinc-500 dark:text-zinc-400">
            {loading ? "Amazon Titan is generating your bespoke outfits..." : "Select your favorite look to save it to your wardrobe."}
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-in fade-in duration-700">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex flex-col gap-4">
                <div className={`w-full rounded-3xl bg-zinc-200 dark:bg-zinc-900 animate-pulse ${i % 2 === 0 ? "h-screen max-h-[500px]" : "h-screen max-h-[600px]"}`} />
                <div className="h-6 w-1/3 rounded-full bg-zinc-200 dark:bg-zinc-900 animate-pulse" />
              </div>
            ))}
          </div>
        ) : (
          <div className="columns-1 sm:columns-2 lg:columns-4 gap-6 space-y-6">
            {images.map((img, idx) => (
              <OutfitCard
                key={idx}
                imageUrl={img}
                altText={`Generated Look ${idx + 1}`}
                isSelected={selectedImage === idx}
                onSelect={() => setSelectedImage(idx)}
                onRegenerate={() => regenerateImage(idx)}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default function GalleryPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-black">
        <div className="animate-spin text-black dark:text-white"><Wand2 size={48} /></div>
      </div>
    }>
      <GalleryContent />
    </Suspense>
  );
}
