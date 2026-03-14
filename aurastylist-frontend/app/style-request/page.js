"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import StyleMyselfForm from "@/components/dashboard/StyleMyselfForm";
import StyleSomeoneElseForm from "@/components/dashboard/StyleSomeoneElseForm";
import { Sparkles, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";

export default function StyleRequestPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("myself"); // 'myself' or 'someone'
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (data) => {
    setIsSubmitting(true);
    
    // Create FormData for the API call
    const formData = new FormData();
    formData.append("target_type", activeTab);
    
    if (activeTab === "myself") {
      formData.append("venue", data.venue);
      formData.append("aesthetic", data.aesthetic);
      formData.append("dress_type", data.dressType);
      formData.append("price_range", data.priceRange);
      if (data.referenceImage) {
        formData.append("reference_image", data.referenceImage);
      }
    } else {
      formData.append("gender", data.gender);
      formData.append("height", data.height);
      formData.append("venue", data.venue);
      formData.append("aesthetic", data.aesthetic);
      if (data.targetImage) {
        formData.append("target_image", data.targetImage);
      }
    }

    try {
      const res = await fetch("http://localhost:8000/api/style/request", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        const result = await res.json();
        console.log("Style Response:", result);
        // Navigate to the gallery polling view
        if (result.request_id) {
          router.push(`/gallery?request_id=${result.request_id}`);
        } else {
          alert("Styling request successful, but no request_id returned.");
        }
      } else {
        console.error("Failed to process styling request");
        alert("Mock: Styling successful. (Backend returned error)");
        router.push("/gallery?request_id=mock_123");
      }
    } catch (error) {
      console.error("API error", error);
      alert("Mock: Styling successful. (Backend not attached)");
      router.push("/gallery?request_id=mock_123");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#faf7f2] font-sans dark:bg-black transition-colors duration-500">
      {/* Header */}
      <header className="flex h-20 items-center justify-between px-8 border-b border-zinc-200/50 bg-white/50 backdrop-blur-md dark:border-zinc-800/50 dark:bg-black/50 sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <Link href="/" className="rounded-full p-2.5 text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-all border border-transparent hover:border-zinc-200 dark:hover:border-zinc-800">
            <ArrowLeft size={20} />
          </Link>
          <div className="flex items-center gap-3 font-bold tracking-tight text-xl text-zinc-900 dark:text-white">
            <div className="h-5 w-5 rounded-full bg-[#D4AF37] shadow-[0_0_10px_rgba(212,175,55,0.3)]"></div>
            Style Dashboard
          </div>
        </div>
        <ThemeToggle />
      </header>

      <main className="flex-1 flex w-full">
        {/* Left Column: Form Section */}
        <div className="flex-1 flex items-center justify-center p-6 sm:p-12 lg:p-20 overflow-y-auto">
          <div className="w-full max-w-xl">
            <div className="mb-12">
              <div className="flex items-center gap-3 mb-6">
                 <div className="h-[1px] w-8 bg-primary"></div>
                 <span className="text-primary font-semibold text-xs uppercase tracking-[0.2em]">Consultation</span>
              </div>
              <h1 className="text-4xl md:text-6xl font-light tracking-tight text-zinc-950 dark:text-white mb-6 transition-colors duration-500 leading-tight">
                Define Your <span className="font-serif italic text-[#D4AF37] drop-shadow-sm">Aesthetic</span>
              </h1>
              <p className="text-lg text-zinc-600 dark:text-zinc-400 font-light leading-relaxed max-w-lg">
                Provide our AI stylists with the parameters of your desired look. We will curate, refine, and source your unparalleled ensemble.
              </p>
            </div>

            <div className="rounded-[2.5rem] border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-2 shadow-2xl dark:shadow-[0_0_50px_rgba(0,0,0,0.5)] transition-all duration-500">
              {/* Toggle Switch */}
              <div className="flex rounded-[1.5rem] bg-zinc-50 dark:bg-zinc-900 p-1.5 border border-zinc-200 dark:border-zinc-800 transition-colors duration-500">
                <button
                  onClick={() => setActiveTab("myself")}
                  className={`flex-1 rounded-xl py-4 text-sm font-bold tracking-wide transition-all duration-500 ${
                    activeTab === "myself"
                      ? "bg-white dark:bg-[#D4AF37] text-zinc-900 dark:text-black shadow-lg border border-zinc-200 dark:border-[#D4AF37]/50"
                      : "text-zinc-500 hover:text-zinc-900 dark:hover:text-white"
                  }`}
                >
                  Personal Styling
                </button>
                <button
                  onClick={() => setActiveTab("someone")}
                  className={`flex-1 rounded-xl py-4 text-sm font-bold tracking-wide transition-all duration-500 ${
                    activeTab === "someone"
                      ? "bg-white dark:bg-[#D4AF37] text-zinc-900 dark:text-black shadow-lg border border-zinc-200 dark:border-[#D4AF37]/50"
                      : "text-zinc-500 hover:text-zinc-900 dark:hover:text-white"
                  }`}
                >
                  Style a Client
                </button>
              </div>

              <div className="p-6 sm:p-8 mt-4 relative">
                {activeTab === "myself" ? (
                  <StyleMyselfForm onSubmit={handleSubmit} isLoading={isSubmitting} />
                ) : (
                  <StyleSomeoneElseForm onSubmit={handleSubmit} isLoading={isSubmitting} />
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Inspiration Visuals */}
        <div className="hidden lg:block lg:flex-1 relative overflow-hidden">
           <div className="absolute inset-0 bg-gradient-to-r from-[#faf7f2] dark:from-black via-transparent to-transparent z-10 pointer-events-none" />
           <div className="absolute inset-0 bg-black/10 dark:bg-black/40 z-0" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img 
            src="https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=1500&auto=format&fit=crop" 
            alt="Editorial Fashion Moodboard" 
            className="w-full h-full object-cover transition-all duration-700"
          />
          <div className="absolute bottom-12 right-12 z-20 text-right">
             <p className="text-white text-6xl font-serif italic mb-2 drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)]">The</p>
             <p className="text-white text-6xl font-serif italic drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)]">Collection.</p>
          </div>
        </div>
      </main>
    </div>
  );
}
