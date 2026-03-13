"use client";

import Link from "next/link";
import { useState } from "react";
import { Sparkles, ArrowRight, Camera, Wand2, ShoppingBag, User } from "lucide-react";

export default function Home() {
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  return (
    <div className="flex min-h-screen flex-col bg-zinc-950 font-sans relative overflow-hidden text-zinc-50">
      {/* Dynamic Background Gradients */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-[100%] bg-purple-600/30 blur-[120px] mix-blend-screen animate-pulse duration-10000 pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-[100%] bg-pink-600/20 blur-[120px] mix-blend-screen animate-pulse duration-7000 pointer-events-none" />
      <div className="absolute top-[20%] right-[10%] w-[40%] h-[40%] rounded-[100%] bg-blue-600/20 blur-[100px] mix-blend-screen animate-pulse duration-9000 pointer-events-none" />

      {/* Highly Visible Navbar */}
      <header className="flex h-20 items-center justify-between px-6 md:px-12 border-b border-white/20 bg-zinc-950/80 backdrop-blur-2xl sticky top-0 z-50 shadow-2xl shadow-purple-900/10">
        
        {/* Left Side: Logo & Links */}
        <div className="flex items-center gap-12">
          {/* Logo */}
          <div className="flex items-center gap-3 text-2xl font-black text-white tracking-tighter cursor-pointer">
            <div className="p-2.5 rounded-xl bg-gradient-to-tr from-purple-500 to-pink-500 shadow-lg shadow-purple-500/40 transform hover:rotate-12 transition-transform">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-zinc-400 hidden sm:block">AuraStylist</span>
          </div>
          
          {/* Middle Links (Left Aligned) */}
          <nav className="hidden md:flex items-center gap-8">
            <Link href="#about" className="text-sm font-semibold text-zinc-400 hover:text-white transition-colors uppercase tracking-widest">
              About
            </Link>
            <Link href="#features" className="text-sm font-semibold text-zinc-400 hover:text-white transition-colors uppercase tracking-widest">
              Features
            </Link>
          </nav>
        </div>

        {/* Right Auth Dropdown */}
        <div className="relative">
          <button 
            onClick={() => setIsAuthOpen(!isAuthOpen)}
            className="flex items-center gap-2 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 px-6 sm:px-8 py-2.5 text-sm font-bold text-white transition-all hover:scale-105 hover:shadow-[0_0_20px_rgba(236,72,153,0.4)]"
          >
            <User size={16} /> Sign Up
          </button>
          
          {isAuthOpen && (
            <div className="absolute right-0 mt-3 w-64 rounded-2xl bg-zinc-900 border border-white/10 shadow-2xl p-2 flex flex-col gap-1 animate-in slide-in-from-top-2 z-50">
              <Link href="/getting-started" className="p-3 bg-white/5 hover:bg-white/10 rounded-xl transition-colors flex flex-col group">
                 <span className="text-white font-bold text-sm">New here?</span>
                 <span className="text-pink-400 text-xs mt-1 font-medium group-hover:translate-x-1 transition-transform">Create an account &rarr;</span>
              </Link>
              <Link href="/getting-started" className="p-3 hover:bg-white/5 rounded-xl transition-colors flex flex-col group mt-1 border-t border-white/5 pt-3">
                 <span className="text-zinc-300 font-bold text-sm">Already have an account?</span>
                 <span className="text-zinc-500 text-xs mt-1 font-medium group-hover:text-white transition-colors">Log in here</span>
              </Link>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center p-6 relative z-10 w-full max-w-6xl mx-auto">
        
        {/* Hero Section */}
        <div id="about" className="text-center space-y-6 animate-in fade-in slide-in-from-bottom-12 duration-1000 ease-out flex flex-col items-center pt-2 pb-12">
          
          <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full border border-purple-500/30 bg-purple-500/10 backdrop-blur-md text-sm font-medium text-purple-200 shadow-[0_0_30px_rgba(168,85,247,0.15)]">
            <span className="flex h-2.5 w-2.5 rounded-full bg-pink-500 animate-ping absolute opacity-75"></span>
            <span className="flex h-2 w-2 rounded-full bg-pink-500 relative z-10"></span>
            Powered by Amazon Nova & Titan
          </div>
          
          <h1 className="text-6xl md:text-8xl lg:text-[7rem] font-black tracking-tighter leading-[1.05] drop-shadow-2xl max-w-4xl">
            Your Wardrobe, <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-orange-400 animate-gradient-x">
              Reimagined by AI.
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-zinc-300 max-w-2xl mx-auto leading-relaxed font-light">
            Upload a photo. Let our advanced AI analyze your features, curate your perfect style, and automatically source the garments online.
          </p>

          <div className="pt-10 flex flex-col sm:flex-row items-center justify-center gap-6 w-full max-w-md">
            <Link 
              href="/getting-started" 
              className="group relative flex items-center justify-center gap-3 h-16 px-10 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xl font-bold shadow-[0_10px_40px_rgba(236,72,153,0.3)] hover:shadow-[0_10px_50px_rgba(236,72,153,0.5)] hover:-translate-y-1 transition-all duration-300 w-full overflow-hidden"
            >
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out"></div>
              <span className="relative z-10 flex items-center gap-2">Get Started Now <ArrowRight className="group-hover:translate-x-1.5 transition-transform" /></span>
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div id="features" className="w-full pt-16 pb-20 animate-in fade-in slide-in-from-bottom-20 duration-1000 delay-300">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl md:text-5xl font-black text-white">Powerful AI Features</h2>
            <p className="text-zinc-400 text-lg max-w-2xl mx-auto">Discover how our multi-agent architecture works to build the ultimate personal styling experience.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Card 1 */}
            <div className="group rounded-3xl border border-white/10 bg-white/5 backdrop-blur-sm p-8 hover:bg-white/10 hover:border-purple-500/50 transition-all duration-300 shadow-xl overflow-hidden relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/20 rounded-full blur-[50px] group-hover:bg-purple-500/40 transition-colors"></div>
              <div className="h-14 w-14 rounded-2xl bg-purple-500/20 flex items-center justify-center mb-6 border border-purple-500/30 text-purple-400 group-hover:scale-110 transition-transform">
                <Camera size={28} />
              </div>
              <h3 className="text-2xl font-bold mb-3 text-white">Smart Analysis</h3>
              <p className="text-zinc-400 leading-relaxed">Nova 2 Lite instantly analyzes your body type, skin undertone, and face shape from a single photo.</p>
            </div>

            {/* Card 2 */}
            <div className="group rounded-3xl border border-white/10 bg-white/5 backdrop-blur-sm p-8 hover:bg-white/10 hover:border-pink-500/50 transition-all duration-300 shadow-xl overflow-hidden relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-pink-500/20 rounded-full blur-[50px] group-hover:bg-pink-500/40 transition-colors"></div>
              <div className="h-14 w-14 rounded-2xl bg-pink-500/20 flex items-center justify-center mb-6 border border-pink-500/30 text-pink-400 group-hover:scale-110 transition-transform">
                <Wand2 size={28} />
              </div>
              <h3 className="text-2xl font-bold mb-3 text-white">Virtual Try-On</h3>
              <p className="text-zinc-400 leading-relaxed">Amazon Titan seamlessly generates stunning, realistic outfits composited directly onto your profile image.</p>
            </div>

            {/* Card 3 */}
            <div className="group rounded-3xl border border-white/10 bg-white/5 backdrop-blur-sm p-8 hover:bg-white/10 hover:border-orange-500/50 transition-all duration-300 shadow-xl overflow-hidden relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/20 rounded-full blur-[50px] group-hover:bg-orange-500/40 transition-colors"></div>
              <div className="h-14 w-14 rounded-2xl bg-orange-500/20 flex items-center justify-center mb-6 border border-orange-500/30 text-orange-400 group-hover:scale-110 transition-transform">
                <ShoppingBag size={28} />
              </div>
              <h3 className="text-2xl font-bold mb-3 text-white">Auto-Shopping</h3>
              <p className="text-zinc-400 leading-relaxed">Click "Shop Look" and our AI agent instantly scours the web to find the exact pieces you're wearing.</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
