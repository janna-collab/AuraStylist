"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Wand2, Download, Share2, Filter } from "lucide-react";
import OutfitCard from "@/components/gallery/OutfitCard";
import { ThemeToggle } from "@/components/theme-toggle";
import NavbarLogo from "@/components/NavbarLogo";

import { ENDPOINTS } from "@/lib/endpoints";

const CATEGORIES = ["All", "Casual", "Formal", "Streetwear", "Party"];

function GalleryContent() {
  const searchParams = useSearchParams();
  const request_id = searchParams.get("request_id");
  const router = useRouter();

  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("All");
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [pollCount, setPollCount] = useState(0);

  // Poll exactly as planned
  useEffect(() => {
    if (!request_id || request_id === "demo_request_123" || request_id === "new_req") {
       setLoading(false);
       setError("No valid request ID found. Please submit a style request first.");
       return;
    }

    let interval;
    
    const fetchImages = async () => {
      try {
        const res = await fetch(`${ENDPOINTS.GALLERY}?request_id=${request_id}`);
        if (res.ok) {
          const data = await res.json();
          if (data.status === "completed") {
            setImages(data.images);
            setLoading(false);
            clearInterval(interval);
          } else if (data.status === "processing") {
            // Keep polling
            setPollCount((prev) => prev + 1);
          } else if (data.status === "failed") {
            setError("Generation failed. Please try again.");
            setLoading(false);
            clearInterval(interval);
          }
        } else {
          setError("Server error (Request ID may be invalid).");
          setLoading(false);
          clearInterval(interval);
        }
      } catch (error) {
        console.error("API error", error);
        setError("Connection error. Is the backend running?");
        setLoading(false);
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


  const regenerateImage = async (index) => {
    // Trigger a fresh generation for the entire set
    setLoading(true);
    setImages([]);
    setPollCount(0);
  };

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground transition-colors duration-500 font-sans">
      {/* Editorial Header */}
      <header className="flex h-24 items-center justify-between px-8 border-b border-zinc-200 dark:border-zinc-800 glass transition-all duration-500 sticky top-0 z-30">
        <div className="flex items-center gap-6">
          <button onClick={() => router.back()} className="rounded-full p-2.5 text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
            <ArrowLeft size={22} />
          </button>
          <NavbarLogo />
        </div>
        
        <div className="flex items-center gap-4">
           {selectedImage !== null && (
            <div className="flex gap-3 animate-in fade-in slide-in-from-right-4">
              <button className="flex items-center gap-2 rounded-full border border-zinc-200 dark:border-zinc-700 bg-transparent px-5 py-2.5 text-sm font-semibold text-zinc-900 dark:text-white hover:border-zinc-400 dark:hover:border-white transition-colors">
                <Share2 size={16} /> Share
              </button>
              <button className="flex items-center gap-2 rounded-full bg-zinc-900 dark:bg-white px-5 py-2.5 text-sm font-semibold text-white dark:text-black hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors">
                <Download size={16} /> Save Look
              </button>
            </div>
          )}
          <ThemeToggle />
        </div>
      </header>

      <main className="flex-1 p-6 sm:p-12 lg:px-24">
        
        {/* Gallery Intro & Categories */}
        <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div>
            <h1 className="text-4xl md:text-5xl font-light tracking-tight text-zinc-950 dark:text-white flex items-center gap-4">
              Your Curation
              {loading && <div className="h-3 w-3 rounded-full bg-primary animate-pulse" />}
            </h1>
            <p className="mt-4 text-lg text-zinc-700 dark:text-zinc-400 max-w-xl font-light">
              {loading ? "Our agents are compiling high-fashion aesthetics based on your request..." : "Discover the finest tailored looks, entirely curated by Amazon Titan."}
            </p>
          </div>

          {/* Category Filters */}
          {!loading && (
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
              <div className="flex items-center gap-2 px-4 py-2 mr-2 rounded-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400">
                <Filter size={16}/> Filter:
              </div>
              {CATEGORIES.map(cat => (
                <button 
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-5 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-300 ${activeCategory === cat ? 'bg-primary text-black shadow-md' : 'bg-transparent border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:border-zinc-500 dark:hover:border-zinc-400 hover:bg-white/50 dark:hover:bg-zinc-800'}`}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}
        </div>

        {loading ? (
          <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className={`w-full rounded-[2rem] bg-zinc-100 dark:bg-zinc-900 animate-pulse luxury-card ${i % 2 === 0 ? "h-[400px]" : "h-[600px]"}`} />
            ))}
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-20 bg-zinc-50 dark:bg-zinc-900 rounded-[3rem] border border-zinc-200 dark:border-zinc-800">
            <p className="text-zinc-600 dark:text-zinc-400 mb-6">{error}</p>
            <button 
              onClick={() => router.push("/style-request")}
              className="px-8 py-3 bg-black dark:bg-white text-white dark:text-black rounded-full font-bold"
            >
              Back to Dashboard
            </button>
          </div>
        ) : images.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 bg-zinc-50 dark:bg-zinc-900 rounded-[3rem] border border-zinc-200 dark:border-zinc-800">
             <p className="text-zinc-600 dark:text-zinc-400 mb-6">No generated images yet. Please submit a style request.</p>
             <button 
              onClick={() => router.push("/style-request")}
              className="px-8 py-3 border border-[#D4AF37] text-[#D4AF37] rounded-full font-bold"
            >
              Start New Request
            </button>
          </div>
        ) : (
          <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6">
            {images.map((img, idx) => (
               <div key={idx} className="break-inside-avoid">
                 <OutfitCard
                   imageUrl={img}
                   altText={`Curated Look ${idx + 1}`}
                   isSelected={selectedImage === idx}
                   onSelect={() => setSelectedImage(idx)}
                   onRegenerate={() => regenerateImage(idx)}
                 />
               </div>
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
