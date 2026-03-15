"use client";

import Link from "next/link";
import { Github, Linkedin, Instagram, Sparkles } from "lucide-react";

const teamMembers = [
  {
    name: "Kanhaiya Jee",
    role: "Frontend & UI",
    github: "https://github.com/kanhaiya0802",
    linkedin: "https://www.linkedin.com/in/kanhaiya-jee-420b36281/",
    instagram: "https://www.instagram.com/kanhaiya_jee0802/"
  },
  {
    name: "Jannatun Khusbu",
    role: "Backend & API",
    github: "https://github.com/janna-collab",
    linkedin: "https://www.linkedin.com/in/jannatun-khusbu-32a8282a7/",
    instagram: "https://www.instagram.com/fragnance_of_paradise_01/"
  },
  {
    name: "Krishna Kumar",
    role: "AI & Engine",
    github: "https://github.com/krishnakumar08042",
    linkedin: "https://www.linkedin.com/in/krishna-kumar-79516b253/",
    instagram: "https://www.instagram.com/krishna_mishra08/"
  },
  {
    name: "Himanshu Kumar",
    role: "Backend & Systems",
    github: "https://github.com/himankumar08",
    linkedin: "https://www.linkedin.com/in/himankumar/",
    instagram: "https://www.instagram.com/hiiimmanshu/"
  }
];

const getInitials = (name) => {
  return name.split(" ").map(n => n[0]).join("").substring(0, 2).toUpperCase();
};

export default function Footer({ onAuthClick }) {
  return (
    <footer 
      id="footer"
      className="w-full bg-zinc-50 dark:bg-[#0a0a0a] border-t border-black/10 dark:border-[rgba(255,255,255,0.08)] transition-colors duration-500 mt-auto scroll-mt-28"
      style={{ fontFamily: '"Inter", "SF Pro Display", system-ui, sans-serif' }}
    >
      <div className="w-full max-w-[1400px] mx-auto px-6 md:px-12 py-16 pb-6">
        {/* Main Footer Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12 mb-16">
          
          {/* Brand & Concept */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-xl font-black text-zinc-900 dark:text-[#e5e5e5] tracking-tighter">
              <Sparkles className="h-5 w-5 text-[#D4AF37]" />
              <span>AuraStylist</span>
            </div>
            <p className="text-[13px] text-zinc-500 dark:text-[#9ca3af] leading-relaxed max-w-xs">
              Experience the convergence of technology and haute couture. Your ultimate aesthetic, engineered.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-5">
            <h4 className="text-[14px] font-semibold uppercase tracking-widest text-zinc-900 dark:text-[#e5e5e5]">Explore</h4>
            <ul className="space-y-3 flex flex-col">
              <li><Link href="/gallery" className="text-[13px] text-zinc-500 dark:text-[#9ca3af] hover:text-black dark:hover:text-white transition-colors">Curated Gallery</Link></li>
              <li><Link href="/style-request" className="text-[13px] text-zinc-500 dark:text-[#9ca3af] hover:text-black dark:hover:text-white transition-colors">Style Dashboard</Link></li>
              <li><Link href="/shop" className="text-[13px] text-zinc-500 dark:text-[#9ca3af] hover:text-black dark:hover:text-white transition-colors">Luxury Shop</Link></li>
              <li><Link href="#features" className="text-[13px] text-zinc-500 dark:text-[#9ca3af] hover:text-black dark:hover:text-white transition-colors">The Atelier</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div className="space-y-5">
            <h4 className="text-[14px] font-semibold uppercase tracking-widest text-zinc-900 dark:text-[#e5e5e5]">Platform</h4>
            <ul className="space-y-3 flex flex-col">
              <li>
                <button 
                  onClick={() => onAuthClick ? onAuthClick() : window.location.href='/login'} 
                  className="text-[13px] text-zinc-500 dark:text-[#9ca3af] hover:text-black dark:hover:text-white transition-colors text-left"
                >
                  Client Login
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onAuthClick ? onAuthClick() : window.location.href='/getting-started'} 
                  className="text-[13px] text-zinc-500 dark:text-[#9ca3af] hover:text-black dark:hover:text-white transition-colors text-left"
                >
                  Become a Client
                </button>
              </li>
              <li><span className="text-[13px] text-zinc-500 dark:text-[#9ca3af] cursor-not-allowed hover:text-black dark:hover:text-white transition-colors">Privacy Policy</span></li>
              <li><span className="text-[13px] text-zinc-500 dark:text-[#9ca3af] cursor-not-allowed hover:text-black dark:hover:text-white transition-colors">Terms of Service</span></li>
            </ul>
          </div>

          {/* "Built by" Subsection */}
          <div className="space-y-5">
            <h4 className="text-[14px] font-semibold uppercase tracking-widest text-zinc-900 dark:text-[#e5e5e5]">Built by the Team</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-y-6 gap-x-4">
              {teamMembers.map((member, index) => (
                <div key={index} className="flex flex-col gap-2">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 shrink-0 rounded-full border border-black/10 dark:border-[rgba(255,255,255,0.1)] flex items-center justify-center bg-white dark:bg-zinc-900 text-[13px] font-medium text-zinc-900 dark:text-[#e5e5e5]">
                      {getInitials(member.name)}
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="text-[13px] font-semibold text-zinc-900 dark:text-[#e5e5e5] truncate">{member.name.split(' ')[0]}</span>
                      <span className="text-[11px] text-zinc-500 dark:text-[#9ca3af] truncate">{member.role}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 pl-12">
                    <a href={member.github} target="_blank" rel="noopener noreferrer" className="text-zinc-400 dark:text-[#9ca3af] hover:text-[#D4AF37] dark:hover:text-white transition-colors">
                      <Github size={13} />
                    </a>
                    <a href={member.linkedin} target="_blank" rel="noopener noreferrer" className="text-zinc-400 dark:text-[#9ca3af] hover:text-[#D4AF37] dark:hover:text-white transition-colors">
                      <Linkedin size={13} />
                    </a>
                    <a href={member.instagram} target="_blank" rel="noopener noreferrer" className="text-zinc-400 dark:text-[#9ca3af] hover:text-[#D4AF37] dark:hover:text-white transition-colors">
                      <Instagram size={13} />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-black/10 dark:border-[rgba(255,255,255,0.08)] flex items-center justify-center">
          <p className="text-[12px] text-zinc-500 dark:text-[#9ca3af] tracking-wide">
            © 2026 AuraStylist — Built by the AuraStylist Team
          </p>
        </div>
      </div>
    </footer>
  );
}
