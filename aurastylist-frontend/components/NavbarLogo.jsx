"use client";

import Link from 'next/link';
import { Sparkles } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';

export default function NavbarLogo() {
  const pathname = usePathname();
  const router = useRouter();

  const handleClick = (e) => {
    if (pathname === '/') {
      e.preventDefault();
      // Reliable smooth scroll to top
      window.scrollTo({ top: 0, behavior: 'smooth' });
      
      // Clear hash from URL without reloading
      if (window.location.hash) {
        window.history.replaceState(null, '', '/');
      }
    }
  };

  return (
    <Link 
      href="/" 
      onClick={handleClick}
      className="flex items-center gap-3 text-2xl font-black text-zinc-900 dark:text-white tracking-tighter cursor-pointer group"
    >
      <div className="p-2.5 rounded-xl bg-gradient-to-tr from-white to-zinc-50 dark:from-zinc-800 dark:to-black border border-zinc-200 dark:border-[#D4AF37]/30 shadow-lg dark:shadow-[0_0_15px_rgba(212,175,55,0.15)] transform group-hover:rotate-6 transition-all duration-300">
        <Sparkles className="h-5 w-5 text-[#D4AF37]" />
      </div>
      <span className="hidden sm:block text-zinc-900 dark:text-white transition-colors duration-500">AuraStylist</span>
    </Link>
  );
}
