"use client";
import React, { useState, useEffect, useRef } from "react";
import { X, Loader2, ExternalLink, Youtube } from "lucide-react";

interface Props {
  videoId?: string;
  videoUrl?: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function VideoModal({ videoId, videoUrl, isOpen, onClose }: Props) {
  const [loading, setLoading] = useState(true);
  const [embedError, setEmbedError] = useState(false);
  const server_url = process.env.NEXT_PUBLIC_API_BASE_URL;
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      setEmbedError(false);
    }
  }, [isOpen, videoId, videoUrl]);

  if (!isOpen) return null;

  // Helper to extract YouTube video ID from any YouTube URL format
  const extractYouTubeId = (url: string): string | null => {
    if (!url) return null;
    // Plain 11-char ID
    if (url.length === 11 && !url.includes("/") && !url.includes(".")) return url;
    const ytRegExp = /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(ytRegExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  const getMediaInfo = () => {
    if (videoId) {
      return {
        url: `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`,
        watchUrl: `https://www.youtube.com/watch?v=${videoId}`,
        type: "iframe",
      };
    }

    if (videoUrl) {
      // YouTube handling
      const ytId = extractYouTubeId(videoUrl);
      if (ytId) {
        return {
          url: `https://www.youtube.com/embed/${ytId}?autoplay=1&rel=0`,
          watchUrl: `https://www.youtube.com/watch?v=${ytId}`,
          type: "iframe",
        };
      }

      if (videoUrl.includes("youtube.com/embed/")) {
        const embedId = videoUrl.split("embed/")[1]?.split("?")[0];
        return {
          url: videoUrl,
          watchUrl: embedId ? `https://www.youtube.com/watch?v=${embedId}` : videoUrl,
          type: "iframe",
        };
      }

      // Vimeo handling
      if (videoUrl.includes("vimeo.com")) {
        return { url: videoUrl, watchUrl: videoUrl, type: "iframe" };
      }

      // Direct video file handling
      let finalUrl = videoUrl;
      if (videoUrl.startsWith("/") && !videoUrl.startsWith("//")) {
        finalUrl = `${server_url || ""}${videoUrl}`;
      }

      const extension = finalUrl.split(".").pop()?.toLowerCase() || "";
      const isDirectVideo = ["mp4", "webm", "ogg", "mov"].includes(extension);

      if (isDirectVideo) {
        return { url: finalUrl, watchUrl: finalUrl, type: "video" };
      }

      return { url: finalUrl, watchUrl: finalUrl, type: "iframe" };
    }

    return { url: "", watchUrl: "", type: "none" };
  };

  const { url, watchUrl, type } = getMediaInfo();
  const isYouTube = url.includes("youtube.com/embed/");

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/10 backdrop-blur-[2px] animate-in fade-in duration-200">
      <div className="relative w-full max-w-5xl aspect-video rounded-xl overflow-hidden shadow-2xl bg-black border border-white/5">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-[110] p-1.5 bg-black/40 hover:bg-black/80 text-white rounded-full transition-all hover:scale-105 cursor-pointer"
        >
          <X size={20} />
        </button>

        {/* Loading spinner */}
        {loading && !embedError && (
          <div className="absolute inset-0 flex items-center justify-center bg-black z-[105]">
            <Loader2 className="w-8 h-8 text-cyan-500 animate-spin" />
          </div>
        )}

        {/* Embed error fallback — shown when YouTube returns Error 153 or similar */}
        {embedError && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#1a1a1a] z-[106] px-6 text-center">
            <Youtube className="w-14 h-14 text-red-500 mb-4" />
            <h3 className="text-white text-lg font-semibold mb-2">
              Video cannot be embedded
            </h3>
            <p className="text-gray-400 text-sm mb-6 max-w-xs">
              This video is restricted from being embedded on external websites.
              You can still watch it directly on YouTube.
            </p>
            <a
              href={watchUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-semibold px-6 py-3 rounded-full transition-colors duration-200"
            >
              <Youtube size={18} />
              Watch on YouTube
              <ExternalLink size={15} />
            </a>
          </div>
        )}

        {url ? (
          type === "iframe" ? (
            <iframe
              ref={iframeRef}
              src={url}
              title="Video player"
              className={`w-full h-full transition-opacity duration-500 ${
                loading || embedError ? "opacity-0" : "opacity-100"
              }`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              onLoad={() => {
                setLoading(false);
                // YouTube Error 153 still triggers onLoad but renders an error inside.
                // We use a postMessage listener to catch it (see useEffect below).
              }}
            />
          ) : (
            <video
              src={url}
              controls
              autoPlay
              className={`w-full h-full transition-opacity duration-500 ${
                loading ? "opacity-0" : "opacity-100"
              }`}
              onCanPlayThrough={() => setLoading(false)}
            />
          )
        ) : (
          <div className="w-full h-full flex items-center justify-center text-white text-sm">
            No video content available
          </div>
        )}
      </div>

      {/* YouTube postMessage error listener */}
      <YouTubeErrorListener
        isActive={isOpen && isYouTube && !embedError}
        onError={() => {
          setLoading(false);
          setEmbedError(true);
        }}
      />
    </div>
  );
}

// Listens to YouTube's iframe API postMessage events for embed errors
function YouTubeErrorListener({
  isActive,
  onError,
}: {
  isActive: boolean;
  onError: () => void;
}) {
  useEffect(() => {
    if (!isActive) return;

    const handleMessage = (event: MessageEvent) => {
      if (!event.origin.includes("youtube.com")) return;
      try {
        const data =
          typeof event.data === "string" ? JSON.parse(event.data) : event.data;
        // YouTube postMessage error event for embed restriction errors (including 153)
        if (
          data?.event === "onError" &&
          (data?.info === 101 || data?.info === 150 || data?.info === 153)
        ) {
          onError();
        }
      } catch {
        // ignore parse errors
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [isActive, onError]);

  return null;
}
