"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import PhotoUpload from "@/components/onboarding/PhotoUpload";
import ManualInputsForm from "@/components/onboarding/ManualInputsForm";
import ReportResult from "@/components/onboarding/ReportResult";
import NavbarLogo from "@/components/NavbarLogo";
import { API_BASE_URL } from "@/lib/endpoints";
import { useUserProfileStore } from "@/store/userProfile";

export default function GettingStartedPage() {
  const router = useRouter();
  const setDetails = useUserProfileStore(state => state.setDetails);
  const setStyleReport = useUserProfileStore(state => state.setStyleReport);
  
  const [step, setStep] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const [user, setUser] = useState(null);
  const [onboardingData, setOnboardingData] = useState({
    imageFile: null,
    manualInputs: null,
    reportData: null,
  });

  useEffect(() => {
    const savedUser = localStorage.getItem("aura_user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    } else {
      router.push("/login");
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("aura_user");
    localStorage.removeItem("aura_profile");
    router.push("/");
  };

  const handleImageSelect = (file) => {
    setOnboardingData((prev) => ({ ...prev, imageFile: file }));
  };

  const handleFormSubmit = async (inputs) => {
    setOnboardingData((prev) => ({ ...prev, manualInputs: inputs }));
    
    // Move to generation state
    setIsGenerating(true);
    setStep(3); // Result step (shows loading initially)
    
    try {
      // Create FormData to send image and form data
      const formData = new FormData();
      if (onboardingData.imageFile) {
        formData.append("image", onboardingData.imageFile);
      }
      formData.append("gender", inputs.gender);
      formData.append("height", inputs.height);
      formData.append("shoeSize", inputs.shoeSize);
      formData.append("preferredFit", inputs.preferredFit);
      formData.append("userId", user?.email || "user_123");
      formData.append("name", user?.name || "User");

      // Call FastAPI backend
      const res = await fetch(`${API_BASE_URL}/api/profile/generate`, {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        setOnboardingData((prev) => ({ ...prev, reportData: data }));
        
        // Hydrate global store
        setDetails({
            gender: inputs.gender,
            height: inputs.height,
            shoeSize: inputs.shoeSize,
            preferredFit: inputs.preferredFit
        });
        
        if (data.report || data) {
            setStyleReport(data.report || data);
        }
        
        // Persist the profile to localStorage so login flow can find it later
        localStorage.setItem("aura_profile", JSON.stringify(data));
        setIsGenerating(false);
      } else {
        const errorData = await res.json().catch(() => ({}));
        console.error("Failed to generate profile:", errorData.detail || res.statusText);
        alert(`Failed to save your profile: ${errorData.detail || "Server error"}. Please check if the backend is running.`);
        setIsGenerating(false);
        setStep(2); // Go back to inputs if it fails
      }
    } catch (error) {
      console.error("API Error:", error);
      alert("Could not connect to the backend styling service. Please ensure the backend is running on http://localhost:8000.");
      setIsGenerating(false);
      setStep(2); // Go back to inputs if it fails
    } finally {
      // We don't want to always set isGenerating to false here 
      // because we only want to stop it if there was an error 
      // or if the process is finished.
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-zinc-50 font-sans dark:bg-black">
      {/* Top Navbar Header */}
      <header className="flex h-20 items-center justify-between px-8 border-b border-zinc-200/50 bg-white/50 backdrop-blur-md dark:border-zinc-800/50 dark:bg-black/50 sticky top-0 z-10">
        <NavbarLogo />
        <div className="flex items-center gap-6">
          <div className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
            Step {step} of 3
          </div>
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 rounded-full bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-white hover:bg-zinc-200 dark:hover:bg-zinc-700 px-6 py-2 text-sm font-bold transition-all hover:scale-105 border border-zinc-200 dark:border-zinc-800"
          >
            Logout
          </button>
        </div>
      </header>

      <main className="flex flex-1 items-center justify-center p-6">
        <div className="w-full max-w-2xl pt-10 pb-20">
          
          {/* Progress Indicator */}
          <div className="mb-12 flex items-center justify-center space-x-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center">
                <div 
                  className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold transition-colors duration-500 ${
                    step >= i 
                      ? "bg-black text-white dark:bg-white dark:text-black scale-110 shadow-lg" 
                      : "bg-zinc-200 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400"
                  }`}
                >
                  {i}
                </div>
                {i < 3 && (
                  <div 
                    className={`h-0.5 w-12 mx-2 rounded transition-colors duration-500 ${
                      step > i ? "bg-black dark:bg-white" : "bg-zinc-200 dark:bg-zinc-800"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>

          {/* Form Area */}
          <div className="relative">
            {step === 1 && (
              <PhotoUpload 
                onImageSelect={handleImageSelect}
                onNext={() => setStep(2)} 
              />
            )}
            
            {step === 2 && (
              <ManualInputsForm 
                onComplete={handleFormSubmit}
                onBack={() => setStep(1)}
              />
            )}
            
            {step === 3 && isGenerating && (
              <div className="flex flex-col items-center justify-center py-20 animate-in fade-in duration-500">
                <div className="relative mb-8 h-24 w-24">
                  <div className="absolute inset-0 animate-ping rounded-full bg-black/20 dark:bg-white/20"></div>
                  <div className="absolute inset-2 animate-spin rounded-full border-4 border-zinc-200 border-t-black dark:border-zinc-800 dark:border-t-white"></div>
                </div>
                <h3 className="text-2xl font-bold bg-gradient-to-r from-black to-zinc-400 bg-clip-text text-transparent dark:from-white dark:to-zinc-600 animate-pulse">
                  Analyzing with Nova AI...
                </h3>
                <p className="mt-4 text-center text-zinc-500 dark:text-zinc-400">
                  Mapping body proportions and identifying<br />your personal color palette.
                </p>
              </div>
            )}
            
            {step === 3 && !isGenerating && (
              <ReportResult 
                profileInfo={onboardingData.reportData} 
                onFinish={() => router.push("/style-request")}
              />
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
