"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUserProfileStore } from "@/store/userProfile";
import Link from "next/link";
import { Camera, ArrowRight } from "lucide-react";
import { API_BASE_URL } from "@/lib/endpoints";

export default function LoginPage() {
  const router = useRouter();
  const setDetails = useUserProfileStore(state => state.setDetails);
  const setStyleReport = useUserProfileStore(state => state.setStyleReport);
  
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Mock authentication: simulate delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const mockUser = { name: "Returning User", email: formData.email };
    localStorage.setItem("aura_user", JSON.stringify(mockUser));
    
    try {
      // Fetch existing profile from backend using the unique email
      const res = await fetch(`${API_BASE_URL}/api/profile/${formData.email}`);
      if (res.ok) {
        const profileData = await res.json();
        
        // Hydrate store from profile results
        if (profileData.inputs) {
            setDetails({
                gender: profileData.inputs.gender,
                height: profileData.inputs.height,
                shoeSize: profileData.inputs.shoeSize,
                preferredFit: profileData.inputs.preferredFit
            });
        }
        
        const report = profileData.report || profileData;
        setStyleReport(report);
        
        localStorage.setItem("aura_profile", JSON.stringify(report));
        
        // Update aura_user with the actual name from the profile
        const actualName = profileData.inputs?.name || "User";
        localStorage.setItem("aura_user", JSON.stringify({ name: actualName, email: formData.email }));
        
        router.push("/style-request");
      } else {
        router.push("/getting-started");
      }
    } catch (error) {
      console.error("Failed to fetch profile:", error);
      router.push("/getting-started");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-black p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800">
        <div className="mb-8 flex flex-col items-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-black text-white dark:bg-white dark:text-black">
            <Camera size={28} />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            Welcome Back
          </h1>
          <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
            Log in to continue exploring your style.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
              Email Address
            </label>
            <input
              type="email"
              required
              className="block w-full rounded-xl border-zinc-200 bg-zinc-50 px-4 py-3 text-zinc-900 focus:border-black focus:ring-black dark:border-zinc-800 dark:bg-zinc-950 dark:text-white dark:focus:border-white dark:focus:ring-white border outline-none transition-colors"
              placeholder="you@example.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Password
              </label>
              <a href="#" className="text-sm font-medium text-zinc-500 hover:text-black dark:hover:text-white">
                Forgot password?
              </a>
            </div>
            <input
              type="password"
              required
              className="block w-full rounded-xl border-zinc-200 bg-zinc-50 px-4 py-3 text-zinc-900 focus:border-black focus:ring-black dark:border-zinc-800 dark:bg-zinc-950 dark:text-white dark:focus:border-white dark:focus:ring-white border outline-none transition-colors"
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-black px-4 py-3 text-sm font-semibold text-white transition-all hover:bg-zinc-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black disabled:opacity-70 dark:bg-white dark:text-black dark:hover:bg-zinc-200 dark:focus-visible:outline-white"
          >
            {isLoading ? (
              <div className="h-5 w-5 animate-spin rounded-full border-b-2 border-white dark:border-black"></div>
            ) : (
              <>
                Log In <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-zinc-500 dark:text-zinc-400">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="font-semibold text-black hover:underline dark:text-white">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
