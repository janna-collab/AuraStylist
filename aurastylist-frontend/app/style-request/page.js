"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import StyleMyselfForm from "@/components/dashboard/StyleMyselfForm";
import StyleSomeoneElseForm from "@/components/dashboard/StyleSomeoneElseForm";
import { Sparkles, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";
import NavbarLogo from "@/components/NavbarLogo";
import { useUserProfileStore } from "@/store/userProfile";
import { generateStyleReportAPI, generateOutfitsAPI, createStyleRequestAPI } from "@/lib/api";
import { CheckCircle2, Info, Loader2, Image as ImageIcon } from "lucide-react";

export default function StyleRequestPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("myself"); // 'myself' or 'someone'
  const { height, shoeSize, preferredFit, gender, bodyAnalysis, setStyleReport, setStyleOutfits } = useUserProfileStore();
  const [showResults, setShowResults] = useState(false);
  const [report, setLocalReport] = useState(null);
  const [outfits, setLocalOutfits] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("aura_user");
    localStorage.removeItem("aura_profile");
    router.push("/");
  };

  const handleSubmit = async (data) => {
    setIsSubmitting(true);
    
    try {
      // Prepare the request object for our new API utility
      const requestParams = {
        target_type: activeTab,
        venue: data.venue,
        aesthetic: data.aesthetic,
        gender: activeTab === "someone" ? data.gender : gender,
        height: activeTab === "myself" ? height : data.height,
        dress_type: data.dressType,
        price_range: data.priceRange,
        reference_image: data.referenceImage, // for myself
        target_image: data.targetImage, // for someone
      };

      const result = await createStyleRequestAPI(requestParams);
      
      if (result?.request_id) {
        // Map the standardized result to our state
        const profile = {
            bestColors: result.palette || [],
            flatteringCuts: typeof result.cuts === 'string' ? result.cuts.split(', ') : (result.cuts || [])
        };
        
        setLocalReport(profile);
        setStyleReport(profile);
        
        const generatedOutfits = result.outfits || [];
        setLocalOutfits(generatedOutfits);
        setStyleOutfits(generatedOutfits);

        setShowResults(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        throw new Error("Invalid response from server: missing request_id");
      }

    } catch (error) {
      console.error("Styling error:", error);
      alert("Encountered an error while curating your style. Please ensure all fields are filled and a photo is uploaded if required.");
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
          <NavbarLogo />
        </div>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 rounded-full bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-white hover:bg-zinc-200 dark:hover:bg-zinc-700 px-6 py-2 text-sm font-bold transition-all hover:scale-105 border border-zinc-200 dark:border-zinc-800"
          >
            Logout
          </button>
        </div>
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
              {showResults ? (
                <div className="p-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                  <div className="flex items-center justify-between mb-8">
                    <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">Curated For You</h2>
                    <button 
                      onClick={() => setShowResults(false)}
                      className="text-sm text-[#D4AF37] font-semibold hover:underline"
                    >
                      Start New Request
                    </button>
                  </div>

                  {/* Style Report Card */}
                  <div className="mb-8 rounded-3xl bg-zinc-50 dark:bg-zinc-800/50 p-6 border border-zinc-100 dark:border-zinc-700/50">
                    <div className="flex items-center gap-2 mb-4 text-[#D4AF37]">
                      <Sparkles size={18} />
                      <h3 className="text-sm font-bold uppercase tracking-wider">Style Intelligence</h3>
                    </div>
                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <p className="text-[10px] text-zinc-400 uppercase tracking-widest mb-1">Recommended Palette</p>
                        <div className="flex flex-wrap gap-2">
                          {report?.bestColors?.map(color => (
                            <span key={color} className="text-xs px-2.5 py-1 rounded-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400">
                              {color}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div>
                        <p className="text-[10px] text-zinc-400 uppercase tracking-widest mb-1">Flattering Cuts</p>
                        <p className="text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed font-medium">
                          {report?.flatteringCuts?.slice(0, 3).join(", ")}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Outfit Recommendation */}
                  <div className="space-y-6">
                    <h3 className="text-lg font-bold text-zinc-900 dark:text-white px-2">Outfit Recommendations</h3>
                    {outfits.map((outfit, idx) => (
                      <div key={idx} className="group relative overflow-hidden rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-[#D4AF37]/50 transition-all duration-500 shadow-sm">
                        <div className="p-6">
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <p className="text-[10px] font-bold text-[#D4AF37] uppercase tracking-widest mb-1">Ensemble {idx + 1}</p>
                              <h4 className="text-lg font-bold text-zinc-900 dark:text-white leading-tight">
                                {outfit.title}
                              </h4>
                            </div>
                            <div className="h-10 w-10 flex items-center justify-center rounded-full bg-zinc-50 dark:bg-zinc-800 text-zinc-400 group-hover:bg-[#D4AF37]/10 group-hover:text-[#D4AF37] transition-colors">
                              <ImageIcon size={20} />
                            </div>
                          </div>
                          <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-6 leading-relaxed">
                            {outfit.description}
                          </p>
                          <button 
                            onClick={() => {
                              const rid = outfit.request_id;
                              if (rid) {
                                router.push(`/gallery?request_id=${rid}`);
                              } else {
                                console.error("Missing request_id for outfit:", outfit);
                                alert("Something went wrong. Please try generating the style again.");
                              }
                            }}
                            className="w-full flex items-center justify-center gap-2 rounded-xl bg-black dark:bg-white text-white dark:text-black py-3.5 text-sm font-bold shadow-lg hover:scale-[1.02] transition-all"
                          >
                            <Sparkles size={16} />
                            Virtual Try-On
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <>
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
                </>
              )}
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
