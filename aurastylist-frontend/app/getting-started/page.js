"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import PhotoUpload from "@/components/onboarding/PhotoUpload";
import ManualInputsForm from "@/components/onboarding/ManualInputsForm";
import ReportResult from "@/components/onboarding/ReportResult";

export default function GettingStartedPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const [onboardingData, setOnboardingData] = useState({
    imageFile: null,
    manualInputs: null,
    reportData: null,
  });

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
      formData.append("height", inputs.height);
      formData.append("shoeSize", inputs.shoeSize);
      formData.append("preferredFit", inputs.preferredFit);

      // Call FastAPI backend (assuming it's running on port 8000)
      const res = await fetch("http://localhost:8000/api/profile/generate", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        setOnboardingData((prev) => ({ ...prev, reportData: data }));
      } else {
        console.error("Failed to generate profile");
        // For development/mock purposes, mock the response if backend fails
        mockSuccessfulResponse();
      }
    } catch (error) {
      console.error("API Error:", error);
      mockSuccessfulResponse();
    } finally {
      setIsGenerating(false);
    }
  };

  const mockSuccessfulResponse = () => {
    setTimeout(() => {
      setOnboardingData((prev) => ({
        ...prev,
        reportData: {
          skinUndertone: "Warm Olive",
          bodyProportions: "Inverted Triangle",
          faceShape: "Square",
          bestColors: ["Emerald Green", "Terracotta", "Navy Blue", "Mustard"],
          flatteringCuts: ["V-necklines", "A-line skirts", "Wide-leg trousers"],
          suitableHairstyles: ["Soft layers", "Side-swept bangs", "Textured bob"]
        }
      }));
      setIsGenerating(false);
    }, 2500); // Fake delay
  };

  return (
    <div className="flex min-h-screen flex-col bg-zinc-50 font-sans dark:bg-black">
      {/* Top Navbar Header */}
      <header className="flex h-20 items-center justify-between px-8 border-b border-zinc-200/50 bg-white/50 backdrop-blur-md dark:border-zinc-800/50 dark:bg-black/50 sticky top-0 z-10">
        <div className="flex items-center gap-2 font-bold tracking-tight text-xl text-black dark:text-white">
          <div className="h-4 w-4 rounded-sm bg-black dark:bg-white"></div>
          AuraStylist
        </div>
        <div className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
          Step {step} of 3
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
