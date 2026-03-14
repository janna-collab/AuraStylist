"use client";

import Link from "next/link";
import { useState } from "react";
import { Sparkles, ArrowRight, Camera, Wand2, ShoppingBag, User } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";

export default function Home() {
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  return (
    <div className="flex min-h-screen flex-col relative overflow-hidden bg-gradient-to-b from-[#faf7f2] via-white to-[#faf7f2] dark:from-black dark:via-zinc-950 dark:to-black text-foreground transition-colors duration-500">
      {/* Dynamic Background Gradients */}
      <div className="absolute top-0 left-0 w-[150%] h-[150%] -translate-x-1/4 -translate-y-1/4 bg-[radial-gradient(circle_at_50%_30%,rgba(212,175,55,0.08),rgba(0,0,0,0)_60%)] pointer-events-none z-0" />

      {/* Floating Navbar */}
      <header className="fixed top-6 left-1/2 -translate-x-1/2 w-[95%] max-w-7xl h-16 rounded-full bg-white/80 dark:bg-black/80 backdrop-blur-xl border border-zinc-200 dark:border-zinc-800 flex items-center justify-between px-6 z-50 shadow-xl dark:shadow-2xl transition-colors duration-500">
        {/* Left Side: Logo & Links */}
        <div className="flex items-center gap-12">
          {/* Logo */}
          <div className="flex items-center gap-3 text-2xl font-black text-zinc-900 dark:text-white tracking-tighter cursor-pointer group">
            <div className="p-2.5 rounded-xl bg-gradient-to-tr from-white to-zinc-50 dark:from-zinc-800 dark:to-black border border-zinc-200 dark:border-[#D4AF37]/30 shadow-lg dark:shadow-[0_0_15px_rgba(212,175,55,0.15)] transform group-hover:rotate-6 transition-all duration-300">
              <Sparkles className="h-5 w-5 text-[#D4AF37]" />
            </div>
            <span className="hidden sm:block text-zinc-900 dark:text-white transition-colors duration-500">AuraStylist</span>
          </div>
          
          {/* Middle Links */}
          <nav className="hidden md:flex items-center gap-8">
            <Link href="#about" className="text-sm font-semibold text-[#E5D3B3]/70 hover:text-white transition-colors uppercase tracking-widest">
              Concept
            </Link>
            <Link href="#features" className="text-sm font-semibold text-[#E5D3B3]/70 hover:text-white transition-colors uppercase tracking-widest">
              Atelier
            </Link>
          </nav>
        </div>

        {/* Right Auth Dropdown */}
        <div className="relative flex items-center gap-4">
          <ThemeToggle />
          <button 
            onClick={() => setIsAuthOpen(!isAuthOpen)}
            className="flex items-center gap-2 rounded-full bg-black text-white dark:bg-white dark:text-black hover:bg-zinc-800 dark:hover:bg-zinc-200 px-6 py-2 text-sm font-bold transition-all hover:scale-105"
          >
            <User size={16} /> Client Login
          </button>
          
          {isAuthOpen && (
            <div className="absolute right-0 mt-3 w-64 rounded-2xl bg-white dark:bg-black/50 backdrop-blur-xl p-2 flex flex-col gap-1 animate-in slide-in-from-top-2 z-50 border border-zinc-200 dark:border-zinc-800 shadow-2xl">
              <Link href="/getting-started" className="p-3 bg-zinc-50 dark:bg-zinc-900/50 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl transition-colors flex flex-col group">
                 <span className="text-black dark:text-white font-bold text-sm">Become a Client</span>
                 <span className="text-[#D4AF37] text-xs mt-1 font-medium group-hover:translate-x-1 transition-transform">Create an account &rarr;</span>
              </Link>
              <Link href="/getting-started" className="p-3 hover:bg-zinc-50 dark:hover:bg-zinc-800 rounded-xl transition-colors flex flex-col group mt-1 border-t border-zinc-200 dark:border-zinc-800 pt-3">
                 <span className="text-zinc-600 dark:text-[#E5D3B3]/90 font-bold text-sm">Returning Client?</span>
                 <span className="text-zinc-400 dark:text-[#E5D3B3]/60 text-xs mt-1 font-medium group-hover:text-black dark:group-hover:text-white transition-colors">Sign in here</span>
              </Link>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center pt-32 p-6 relative z-10 w-full max-w-7xl mx-auto">
        
        {/* Luxury Hero Section */}
        <div id="about" className="w-full flex flex-col lg:flex-row items-center gap-12 py-16 animate-in fade-in slide-in-from-bottom-12 duration-1000 ease-out relative">
          {/* Subtle radial glow behind hero image */}
          <div className="absolute top-1/2 right-0 w-[800px] h-[800px] -translate-y-1/2 translate-x-1/4 bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.12),transparent_60%)] pointer-events-none -z-10" />
          
          {/* Hero Text Content */}
          <div className="flex-1 space-y-12 text-center lg:text-left z-20">
            <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full border border-[#D4AF37]/30 bg-white/60 dark:bg-black/60 backdrop-blur-md text-sm font-medium text-[#D4AF37] shadow-xl mb-4">
              <span className="flex h-2.5 w-2.5 rounded-full bg-[#D4AF37] animate-ping absolute opacity-75"></span>
              <span className="flex h-2 w-2 rounded-full bg-[#D4AF37] relative z-10 drop-shadow-[0_0_5px_#D4AF37]"></span>
              The Premier Fashion AI Platform
            </div>
            
            <h1 className="text-5xl md:text-8xl font-light tracking-tight leading-[1.1] text-zinc-950 dark:text-white relative transition-colors duration-500">
              Elegance, <br/>
              <span className="font-serif italic text-[#D4AF37] drop-shadow-[0_0_5px_rgba(212,175,55,0.1)] dark:drop-shadow-[0_0_20px_rgba(212,175,55,0.5)]">Engineered.</span>
            </h1>
            
            <p className="text-lg text-zinc-700 dark:text-[#E5D3B3]/80 max-w-xl leading-relaxed font-light mx-auto lg:mx-0 transition-colors duration-500">
              Experience the convergence of technology and haute couture. AuraStylist pairs you with an elite AI fashion assistant to curate, visualize, and source your ultimate aesthetic.
            </p>

            <div className="pt-8 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 w-full">
              <Link 
                href="/gallery" 
                className="group flex items-center justify-center gap-3 h-14 px-10 rounded-full bg-[#D4AF37] text-zinc-900 dark:text-black text-lg font-bold shadow-[0_0_20px_rgba(212,175,55,0.2)] dark:shadow-[0_0_20px_rgba(212,175,55,0.4)] hover:shadow-[0_0_40px_rgba(212,175,55,0.5)] dark:hover:shadow-[0_0_40px_rgba(212,175,55,0.7)] hover:-translate-y-1 transition-all duration-500 w-full sm:w-auto"
              >
                Explore Gallery
              </Link>
              <Link 
                href="/style-request" 
                className="group flex items-center justify-center gap-3 h-14 px-10 rounded-full bg-transparent border-2 border-[#D4AF37]/50 text-zinc-800 dark:text-[#E5D3B3] text-lg font-semibold hover:border-[#D4AF37] hover:bg-[#D4AF37]/10 hover:text-black dark:hover:text-white transition-all duration-500 w-full sm:w-auto"
              >
                Get Styled <ArrowRight className="group-hover:translate-x-1 transition-transform text-[#D4AF37]" />
              </Link>
            </div>
          </div>

          {/* Hero Imagery */}
          <div className="flex-1 w-full h-[600px] relative rounded-[2rem] overflow-hidden bg-white dark:luxury-card shadow-2xl border border-zinc-200 dark:border-zinc-800 transition-all duration-500">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_20%,rgba(250,247,242,0.4)_100%)] dark:bg-[radial-gradient(circle_at_center,transparent_20%,rgba(0,0,0,0.8)_100%)] z-20 pointer-events-none transition-all duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#faf7f2]/60 via-transparent dark:from-black dark:via-black/50 dark:to-transparent z-10 pointer-events-none transition-all duration-500" />
               {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src="https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=2070&auto=format&fit=crop" 
                alt="High Fashion Model" 
                className="absolute inset-0 w-full h-full object-cover transition-all duration-1000 scale-105 hover:scale-100"
              />
          </div>
        </div>

        {/* Features Grid */}
        <div id="features" className="w-full pt-28 pb-24">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl md:text-5xl font-serif italic text-zinc-900 dark:text-white tracking-tight transition-colors duration-500">The Atelier</h2>
            <p className="text-zinc-600 dark:text-[#E5D3B3]/80 text-lg max-w-2xl mx-auto font-light transition-colors duration-500">Precision tools designed to elevate your personal brand.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Card 1 */}
            <div className="group bg-white dark:bg-zinc-950 rounded-[1.5rem] p-8 border border-zinc-200 dark:border-zinc-800 hover:border-[#D4AF37]/40 hover:shadow-2xl hover:scale-105 transition-all duration-500 relative overflow-hidden">
              <div className="h-14 w-14 rounded-full bg-zinc-50 dark:bg-zinc-900 flex items-center justify-center mb-6 border border-zinc-200 dark:border-zinc-800 text-[#D4AF37] group-hover:bg-[#D4AF37] group-hover:text-white dark:group-hover:text-black transition-colors duration-500">
                <Camera size={24} />
              </div>
              <h3 className="text-xl font-medium mb-3 text-zinc-900 dark:text-white">Bespoke Analysis</h3>
              <p className="text-zinc-600 dark:text-[#E5D3B3]/80 leading-relaxed text-sm font-light">Our intelligence engine meticulously analyzes your proportions, undertones, and personal features to craft looks tailored exclusively for you.</p>
            </div>

            {/* Card 2 */}
            <div className="group bg-white dark:bg-zinc-950 rounded-[1.5rem] p-8 border border-zinc-200 dark:border-zinc-800 hover:border-[#D4AF37]/40 hover:shadow-2xl hover:scale-105 transition-all duration-500 relative overflow-hidden">
              <div className="h-14 w-14 rounded-full bg-zinc-50 dark:bg-zinc-900 flex items-center justify-center mb-6 border border-zinc-200 dark:border-zinc-800 text-[#D4AF37] group-hover:bg-[#D4AF37] group-hover:text-white dark:group-hover:text-black transition-colors duration-500">
                <Wand2 size={24} />
              </div>
              <h3 className="text-xl font-medium mb-3 text-zinc-900 dark:text-white">Visual Synthesis</h3>
              <p className="text-zinc-600 dark:text-[#E5D3B3]/80 leading-relaxed text-sm font-light">Preview your curated aesthetic in real-time. We composite high-fashion garments directly onto your profile for immediate visualization.</p>
            </div>

            {/* Card 3 */}
            <div className="group bg-white dark:bg-zinc-950 rounded-[1.5rem] p-8 border border-zinc-200 dark:border-zinc-800 hover:border-[#D4AF37]/40 hover:shadow-2xl hover:scale-105 transition-all duration-500 relative overflow-hidden">
              <div className="h-14 w-14 rounded-full bg-zinc-50 dark:bg-zinc-900 flex items-center justify-center mb-6 border border-zinc-200 dark:border-zinc-800 text-[#D4AF37] group-hover:bg-[#D4AF37] group-hover:text-white dark:group-hover:text-black transition-colors duration-500">
                <ShoppingBag size={24} />
              </div>
              <h3 className="text-xl font-medium mb-3 text-zinc-900 dark:text-white">Global Sourcing</h3>
              <p className="text-zinc-600 dark:text-[#E5D3B3]/80 leading-relaxed text-sm font-light">Once a look is perfected, our autonomous agents scour global boutiques and retailers to source the exact pieces for your collection.</p>
            </div>
          </div>
        </div>

        {/* Inspiration Grid Preview */}
        <div className="w-full pb-32 pt-12">
           <div className="flex items-end justify-between mb-10 border-b border-zinc-200 dark:border-zinc-800 pb-4 transition-colors duration-500">
              <h2 className="text-3xl font-serif italic text-zinc-900 dark:text-white tracking-tight transition-colors duration-500">Curated Inspiration</h2>
              <Link href="/gallery" className="text-sm font-medium text-[#D4AF37] hover:text-[#e2c158] transition-colors flex items-center gap-2">View Archive <ArrowRight size={16}/></Link>
           </div>
           
           <div className="grid grid-cols-2 md:grid-cols-4 gap-4 auto-rows-[250px]">
              {/* Photo 1 - Tall */}
              <div className="row-span-2 rounded-2xl overflow-hidden relative group luxury-card">
                 {/* eslint-disable-next-line @next/next/no-img-element */}
                 <img src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=800&auto=format&fit=crop" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" alt="Fashion 1" onError={(e) => { e.currentTarget.src = "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=800&auto=format&fit=crop" }} />
                  <div className="absolute inset-0 bg-black/40 group-hover:opacity-100 transition-opacity flex items-center justify-center opacity-0 group-hover:bg-black/60">
                     <span className="text-white font-serif italic text-xl">Avant Garde</span>
                  </div>
              </div>
              {/* Photo 2 - Square */}
              <div className="rounded-2xl overflow-hidden relative group bg-zinc-100 dark:bg-zinc-900 shadow-lg border border-zinc-200 dark:border-zinc-800">
                 {/* eslint-disable-next-line @next/next/no-img-element */}
                 <img 
                    src="https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=800&auto=format&fit=crop" 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                    alt="Fashion 2" 
                    onError={(e) => { 
                      e.currentTarget.src = "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=800&auto=format&fit=crop";
                      e.currentTarget.onerror = null; // Prevent infinite loop
                    }} 
                 />
                  <div className="absolute inset-0 bg-black/40 group-hover:opacity-100 transition-opacity flex items-center justify-center opacity-0 group-hover:bg-black/60">
                     <span className="text-white font-serif italic text-xl">Minimalist</span>
                  </div>
              </div>
              {/* Photo 3 - Square */}
              <div className="rounded-2xl overflow-hidden relative group luxury-card">
                 {/* eslint-disable-next-line @next/next/no-img-element */}
                 <img src="https://images.unsplash.com/photo-1543163521-1bf539c55dd2?q=80&w=800&auto=format&fit=crop" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" alt="Fashion 3" onError={(e) => { e.currentTarget.src = "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=800&auto=format&fit=crop" }} />
                  <div className="absolute inset-0 bg-black/40 group-hover:opacity-100 transition-opacity flex items-center justify-center opacity-0 group-hover:bg-black/60">
                     <span className="text-white font-serif italic text-xl">Evening</span>
                  </div>
              </div>
              {/* Photo 4 - Tall */}
              <div className="row-span-2 rounded-2xl overflow-hidden relative group luxury-card">
                 {/* eslint-disable-next-line @next/next/no-img-element */}
                 <img src="https://images.unsplash.com/photo-1496747611176-843222e1e57c?q=80&w=800&auto=format&fit=crop" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 grayscale hover:grayscale-0" alt="Fashion 4" onError={(e) => { e.currentTarget.src = "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=800&auto=format&fit=crop" }} />
                  <div className="absolute inset-0 bg-black/40 group-hover:opacity-100 transition-opacity flex items-center justify-center opacity-0 group-hover:bg-black/60">
                     <span className="text-white font-serif italic text-xl">Metropolitan</span>
                  </div>
              </div>
              {/* Photo 5 - Wide (Spans 2 cols) */}
              <div className="col-span-2 rounded-2xl overflow-hidden relative group bg-zinc-100 dark:bg-zinc-900 shadow-lg border border-zinc-200 dark:border-zinc-800">
                 {/* eslint-disable-next-line @next/next/no-img-element */}
                 <img 
                    src="https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=1600&auto=format&fit=crop" 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                    alt="Fashion 5" 
                    onError={(e) => { 
                      e.currentTarget.src = "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1600&auto=format&fit=crop";
                      e.currentTarget.onerror = null;
                    }} 
                 />
                  <div className="absolute inset-0 bg-black/40 group-hover:opacity-100 transition-opacity flex items-center justify-center opacity-0 group-hover:bg-black/60">
                     <span className="text-white font-serif italic text-xl">Editorial Archive</span>
                  </div>
              </div>
           </div>
        </div>

      </main>
    </div>
  );
}
