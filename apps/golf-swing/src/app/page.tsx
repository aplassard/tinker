"use client";

import { useState, useRef, useCallback } from "react";
import type { SwingAnalysis } from "@/lib/types";
import SwingFeedback from "@/components/SwingFeedback";

const ACCEPTED_TYPES = ["video/mp4", "video/quicktime", "video/webm"];
const MAX_DURATION_S = 30;
const MAX_SIZE_BYTES = 30 * 1024 * 1024; // 30 MB

function formatSize(bytes: number): string {
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function HomePage() {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isValid, setIsValid] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [analysis, setAnalysis] = useState<SwingAnalysis | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const resetState = useCallback(() => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setFile(null);
    setPreviewUrl(null);
    setError(null);
    setIsValid(false);
    setAnalysis(null);
  }, [previewUrl]);

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      resetState();
      const selected = e.target.files?.[0];
      if (!selected) return;

      if (!ACCEPTED_TYPES.includes(selected.type)) {
        setError(
          `Invalid format: ${selected.type || "unknown"}. Accepted: MP4, MOV, WebM.`
        );
        return;
      }

      if (selected.size > MAX_SIZE_BYTES) {
        setError(
          `File too large: ${formatSize(selected.size)}. Maximum is ${formatSize(MAX_SIZE_BYTES)}.`
        );
        return;
      }

      const url = URL.createObjectURL(selected);
      const video = document.createElement("video");
      video.preload = "metadata";
      video.onloadedmetadata = () => {
        URL.revokeObjectURL(video.src);
        if (video.duration > MAX_DURATION_S) {
          setError(
            `Video too long: ${Math.ceil(video.duration)}s. Maximum is ${MAX_DURATION_S}s.`
          );
          URL.revokeObjectURL(url);
          return;
        }
        setFile(selected);
        setPreviewUrl(url);
        setIsValid(true);
      };
      video.onerror = () => {
        URL.revokeObjectURL(url);
        setError("Could not read video metadata. Please try another file.");
      };
      video.src = URL.createObjectURL(selected);
    },
    [resetState]
  );

  const handleSubmit = async () => {
    if (!file || !isValid) return;
    setIsSubmitting(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("video", file);

      const res = await fetch("/api/analyze", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Analysis failed. Please try again.");
        return;
      }

      setAnalysis(data.analysis);
    } catch {
      setError("Network error. Please check your connection and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="mx-auto max-w-lg px-4 py-8">
      <h1 className="text-3xl font-bold">Golf Swing</h1>
      <p className="mt-2 text-gray-600">
        Upload a video of your swing for AI analysis.
      </p>

      <div className="mt-8 space-y-6">
        {/* File input */}
        <div>
          <label
            htmlFor="video-upload"
            className="block cursor-pointer rounded-lg border-2 border-dashed border-gray-300 p-8 text-center transition hover:border-gray-400"
          >
            <svg
              className="mx-auto h-10 w-10 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m15.75 10.5 4.72-4.72a.75.75 0 0 1 1.28.53v11.38a.75.75 0 0 1-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25h-9A2.25 2.25 0 0 0 2.25 7.5v9a2.25 2.25 0 0 0 2.25 2.25Z"
              />
            </svg>
            <p className="mt-2 text-sm font-medium text-gray-700">
              Tap to select a video or record from camera
            </p>
            <p className="mt-1 text-xs text-gray-500">
              MP4, MOV, or WebM &middot; Max 30s &middot; Max 30 MB
            </p>
          </label>
          <input
            ref={fileInputRef}
            id="video-upload"
            type="file"
            accept="video/mp4,video/quicktime,video/webm"
            capture="environment"
            onChange={handleFileChange}
            className="sr-only"
          />
        </div>

        {/* Error message */}
        {error && (
          <div className="rounded-md bg-red-50 p-4">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {/* Video preview */}
        {previewUrl && (
          <div className="overflow-hidden rounded-lg bg-black">
            <video
              ref={videoRef}
              src={previewUrl}
              controls
              playsInline
              className="mx-auto max-h-80 w-full object-contain"
            />
          </div>
        )}

        {/* File info + change */}
        {file && (
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span className="truncate">{file.name}</span>
            <button
              type="button"
              onClick={() => {
                resetState();
                if (fileInputRef.current) fileInputRef.current.value = "";
              }}
              className="ml-4 shrink-0 font-medium text-gray-700 underline hover:text-gray-900"
            >
              Change
            </button>
          </div>
        )}

        {/* Submit button */}
        {!analysis && (
          <button
            type="button"
            disabled={!isValid || isSubmitting}
            onClick={handleSubmit}
            className="w-full rounded-lg bg-green-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-gray-500"
          >
            {isSubmitting ? "Analyzing…" : "Analyze Swing"}
          </button>
        )}

        {/* Results */}
        {analysis && <SwingFeedback analysis={analysis} />}
      </div>
    </main>
  );
}
