"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import StyleMyselfForm from "@/components/dashboard/StyleMyselfForm";
import StyleSomeoneElseForm from "@/components/dashboard/StyleSomeoneElseForm";
import { Sparkles, ArrowLeft } from "lucide-react";
import Link from "next/link";

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
    <div className="flex min-h-screen flex-col bg-zinc-50 font-sans dark:bg-black">
      {/* Header */}
      <header className="flex h-20 items-center justify-between px-8 border-b border-zinc-200/50 bg-white/50 backdrop-blur-md dark:border-zinc-800/50 dark:bg-black/50 sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <Link href="/" className="rounded-full p-2 text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors">
            <ArrowLeft size={20} />
          </Link>
          <div className="flex items-center gap-2 font-bold tracking-tight text-xl text-black dark:text-white">
            <div className="h-4 w-4 rounded-sm bg-black dark:bg-white"></div>
            Style Dashboard
          </div>
        </div>
      </header>

      <main className="flex flex-1 items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-xl">
          <div className="mb-10 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-tr from-zinc-200 to-white shadow-xl dark:from-zinc-800 dark:to-zinc-900 border border-zinc-100 dark:border-zinc-800">
              <Sparkles size={28} className="text-black dark:text-white" />
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">
              Request a Look
            </h1>
            <p className="mt-2 text-lg text-zinc-500 dark:text-zinc-400">
              Tell Nova exactly what you need.
            </p>
          </div>

          <div className="rounded-3xl border border-zinc-200 bg-white p-2 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
            {/* Toggle Switch */}
            <div className="flex rounded-2xl bg-zinc-50 p-1 dark:bg-zinc-900">
              <button
                onClick={() => setActiveTab("myself")}
                className={`flex-1 rounded-xl py-3 text-sm font-semibold transition-all ${
                  activeTab === "myself"
                    ? "bg-white text-black shadow-sm dark:bg-black dark:text-white"
                    : "text-zinc-500 hover:text-black dark:text-zinc-400 dark:hover:text-white"
                }`}
              >
                Style Myself
              </button>
              <button
                onClick={() => setActiveTab("someone")}
                className={`flex-1 rounded-xl py-3 text-sm font-semibold transition-all ${
                  activeTab === "someone"
                    ? "bg-white text-black shadow-sm dark:bg-black dark:text-white"
                    : "text-zinc-500 hover:text-black dark:text-zinc-400 dark:hover:text-white"
                }`}
              >
                Style Someone Else
              </button>
            </div>

            <div className="p-6 sm:p-8 overflow-hidden relative">
              {activeTab === "myself" ? (
                <StyleMyselfForm onSubmit={handleSubmit} isLoading={isSubmitting} />
              ) : (
                <StyleSomeoneElseForm onSubmit={handleSubmit} isLoading={isSubmitting} />
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
