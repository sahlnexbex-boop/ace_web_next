"use client";
import React, { useState, useEffect } from "react";
import { X, Youtube, ExternalLink, Loader2 } from "lucide-react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  videoUrl: string;
}

// Convert any YouTube URL format to an embed URL + extract watch URL
function parseYouTubeUrl(url: string): { embedUrl: string; watchUrl: string } | null {
  if (!url) return null;

  // Already an embed URL
  if (url.includes("youtube.com/embed/")) {
    const id = url.split("embed/")[1]?.split("?")[0];
    return {
      embedUrl: `https://www.youtube.com/embed/${id}?autoplay=1&rel=0`,
      watchUrl: `https://www.youtube.com/watch?v=${id}`,
    };
  }

  // Plain 11-char video ID
  if (url.length === 11 && !url.includes("/") && !url.includes(".")) {
    return {
      embedUrl: `https://www.youtube.com/embed/${url}?autoplay=1&rel=0`,
      watchUrl: `https://www.youtube.com/watch?v=${url}`,
    };
  }

  // youtu.be short link or full watch URL
  const ytRegExp = /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(ytRegExp);
  if (match && match[2].length === 11) {
    return {
      embedUrl: `https://www.youtube.com/embed/${match[2]}?autoplay=1&rel=0`,
      watchUrl: `https://www.youtube.com/watch?v=${match[2]}`,
    };
  }

  return null;
}

export default function DynamicVideoModal({ isOpen, onClose, videoUrl }: Props) {
  const [loading, setLoading] = useState(true);
  const [embedError, setEmbedError] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      setEmbedError(false);
    }
  }, [isOpen, videoUrl]);

  // YouTube postMessage error listener
  useEffect(() => {
    if (!isOpen) return;

    const handleMessage = (event: MessageEvent) => {
      if (!event.origin.includes("youtube.com")) return;
      try {
        const data =
          typeof event.data === "string" ? JSON.parse(event.data) : event.data;
        // Error codes 101, 150, 153 = embed not allowed on this domain
        if (
          data?.event === "onError" &&
          (data?.info === 101 || data?.info === 150 || data?.info === 153)
        ) {
          setLoading(false);
          setEmbedError(true);
        }
      } catch {
        // ignore parse errors
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [isOpen]);

  if (!isOpen) return null;

  const isYouTube = videoUrl.includes("youtube.com") || videoUrl.includes("youtu.be");
  const isVimeo = videoUrl.includes("vimeo.com");

  let embedUrl = videoUrl;
  let watchUrl = videoUrl;

  if (isYouTube) {
    const parsed = parseYouTubeUrl(videoUrl);
    if (parsed) {
      embedUrl = parsed.embedUrl;
      watchUrl = parsed.watchUrl;
    }
  }

  const isIframe = isYouTube || isVimeo;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 bg-black/50 backdrop-blur-[1px] bg-opacity-70 flex items-center justify-center z-50"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-3xl bg-black rounded-xl overflow-hidden"
      >
        <button
          onClick={onClose}
          className="absolute cursor-pointer top-2 right-2 text-white text-2xl z-50 p-1 bg-black/40 hover:bg-black/80 rounded-full transition-all"
        >
          <X size={20} />
        </button>

        {/* Loading spinner */}
        {loading && !embedError && (
          <div className="absolute inset-0 flex items-center justify-center bg-black z-10 aspect-video">
            <Loader2 className="w-8 h-8 text-cyan-500 animate-spin" />
          </div>
        )}

        {/* Embed error fallback */}
        {embedError && (
          <div className="flex flex-col items-center justify-center bg-[#1a1a1a] px-6 py-14 text-center aspect-video">
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

        {!embedError && videoUrl ? (
          isIframe ? (
            <iframe
              src={embedUrl}
              title="Video"
              className={`w-full aspect-video rounded-lg transition-opacity duration-500 ${
                loading ? "opacity-0" : "opacity-100"
              }`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              onLoad={() => setLoading(false)}
            />
          ) : (
            <video
              src={videoUrl}
              controls
              autoPlay
              className="w-full aspect-video rounded-lg"
              onCanPlayThrough={() => setLoading(false)}
            />
          )
        ) : !embedError ? (
          <div className="p-10 text-white text-center aspect-video flex items-center justify-center">
            No video available
          </div>
        ) : null}
      </div>
    </div>
  );
}
