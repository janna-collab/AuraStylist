"use client";

import { useState } from "react";
import { UploadCloud, CheckCircle2, Loader2 } from "lucide-react";
import { useUserProfileStore } from "@/store/userProfile";

export default function PhotoUpload({ onImageSelect, onNext }) {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  
  const setBodyAnalysis = useUserProfileStore(state => state.setBodyAnalysis);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file) => {
    setSelectedFile(file);
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    if (onImageSelect) {
      onImageSelect(file);
    }
  };

  return (
    <div className="w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
          Take Your Body Profile Photo
        </h2>
        <p className="mt-2 text-zinc-500 dark:text-zinc-400">
          Upload one clear, full-body picture. This helps Nova AI analyze your body proportions, skin undertone, and face shape.
        </p>
      </div>

      {!previewUrl ? (
        <label
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          htmlFor="dropzone-file"
          className={`group relative flex h-80 w-full cursor-pointer flex-col items-center justify-center rounded-3xl border-2 border-dashed transition-all ${
            dragActive
              ? "border-black bg-zinc-50 dark:border-white dark:bg-zinc-900"
              : "border-zinc-300 bg-white hover:border-black hover:bg-zinc-50 dark:border-zinc-800 dark:bg-black dark:hover:border-zinc-700 dark:hover:bg-zinc-900/50"
          }`}
        >
          <div className="flex flex-col items-center justify-center pb-6 pt-5">
            <div className="mb-4 rounded-full bg-zinc-100 p-4 text-zinc-500 group-hover:bg-zinc-200 group-hover:text-black dark:bg-zinc-900 dark:text-zinc-400 dark:group-hover:bg-zinc-800 dark:group-hover:text-white transition-colors">
              <UploadCloud size={32} />
            </div>
            <p className="mb-2 text-sm text-zinc-500 dark:text-zinc-400">
              <span className="font-semibold text-zinc-900 dark:text-zinc-50">Click to upload</span> or drag and drop
            </p>
            <p className="text-xs text-zinc-400 dark:text-zinc-500">
              PNG, JPG or WEBP (Max. 10MB)
            </p>
          </div>
          <input
            id="dropzone-file"
            type="file"
            className="hidden"
            accept="image/*"
            onChange={handleChange}
          />
        </label>
      ) : (
        <div className="flex flex-col items-center gap-6">
          <div className="relative h-80 w-full overflow-hidden rounded-3xl border border-zinc-200 bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={previewUrl}
              alt="Preview"
              className="h-full w-full object-contain"
            />
            <button
              onClick={() => {
                setPreviewUrl(null);
                setSelectedFile(null);
                if (onImageSelect) onImageSelect(null);
              }}
              className="absolute right-4 top-4 rounded-full bg-black/50 p-2 text-white backdrop-blur-md transition-colors hover:bg-black/70"
            >
              <CheckCircle2 className="h-5 w-5 fill-green-500 text-white" />
            </button>
          </div>
          <div className="flex w-full gap-4">
            <button
              onClick={() => {
                setPreviewUrl(null);
                setSelectedFile(null);
                if (onImageSelect) onImageSelect(null);
              }}
              className="flex-1 rounded-xl border border-zinc-200 bg-white px-4 py-3 font-medium text-zinc-900 transition-colors hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50 dark:hover:bg-zinc-900"
            >
              Choose different photo
            </button>
            <button
              onClick={async () => {
                if (!selectedFile) return;
                setIsAnalyzing(true);
                try {
                  const formData = new FormData();
                  formData.append("image", selectedFile);
                  
                  const res = await fetch("http://localhost:8000/api/analyze/body", {
                    method: "POST",
                    body: formData,
                  });
                  
                  if (res.ok) {
                    const data = await res.json();
                    setBodyAnalysis(data);
                  } else {
                    console.error("Analysis failed:", res.statusText);
                  }
                } catch (err) {
                  console.error("Analysis error:", err);
                } finally {
                  setIsAnalyzing(false);
                  onNext();
                }
              }}
              disabled={isAnalyzing}
              className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-black px-4 py-3 font-semibold text-white transition-all hover:bg-zinc-800 disabled:opacity-50 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Analyzing...
                </>
              ) : (
                "Continue"
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
