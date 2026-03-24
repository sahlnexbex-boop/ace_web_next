"use client";
import React, { useState, useEffect } from "react";
import { X, Loader2 } from "lucide-react";

interface Props {
  videoId?: string;
  videoUrl?: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function VideoModal({ videoId, videoUrl, isOpen, onClose }: Props) {
  const [loading, setLoading] = useState(true);
  const server_url = process.env.NEXT_PUBLIC_API_BASE_URL;

  useEffect(() => {
    if (isOpen) {
      setLoading(true);
    }
  }, [isOpen, videoId, videoUrl]);

  if (!isOpen) return null;

  // Helper to determine if it's an embeddable link
  const getMediaInfo = () => {
    if (videoId) {
      return { 
        url: `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`, 
        type: "iframe" 
      };
    }
    
    if (videoUrl) {
      // 1. YouTube handling
      // Check if it's just an ID (11 characters)
      if (videoUrl.length === 11 && !videoUrl.includes("/") && !videoUrl.includes(".")) {
        return { 
          url: `https://www.youtube.com/embed/${videoUrl}?autoplay=1&rel=0`, 
          type: "iframe" 
        };
      }

      const ytRegExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
      const ytMatch = videoUrl.match(ytRegExp);
      const ytId = (ytMatch && ytMatch[2].length === 11) ? ytMatch[2] : null;
      
      if (ytId) {
        return { 
          url: `https://www.youtube.com/embed/${ytId}?autoplay=1&rel=0`, 
          type: "iframe" 
        };
      }
      
      if (videoUrl.includes("youtube.com/embed/")) {
        return { url: videoUrl, type: "iframe" };
      }

      // 2. Vimeo handling
      if (videoUrl.includes("vimeo.com")) {
        // Handle vimeo IDs or full links if possible, for now just treat as iframe
        return { url: videoUrl, type: "iframe" };
      }

      // 3. Direct video file handling
      let finalUrl = videoUrl;
      if (videoUrl.startsWith("/") && !videoUrl.startsWith("//")) {
        finalUrl = `${server_url || ""}${videoUrl}`;
      }

      const extension = finalUrl.split('.').pop()?.toLowerCase() || "";
      const isDirectVideo = ['mp4', 'webm', 'ogg', 'mov'].includes(extension);

      if (isDirectVideo) {
        return { url: finalUrl, type: "video" };
      }

      // 4. Fallback: treat as iframe
      return { url: finalUrl, type: "iframe" };
    }
    
    return { url: "", type: "none" };
  };

  const { url, type } = getMediaInfo();

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/10 backdrop-blur-[2px] animate-in fade-in duration-200">
      <div className="relative w-full max-w-5xl aspect-video rounded-xl overflow-hidden shadow-2xl bg-black border border-white/5">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-[110] p-1.5 bg-black/40 hover:bg-black/80 text-white rounded-full transition-all hover:scale-105 cursor-pointer"
        >
          <X size={20} />
        </button>

        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black z-[105]">
            <Loader2 className="w-8 h-8 text-cyan-500 animate-spin" />
          </div>
        )}

        {url ? (
          type === "iframe" ? (
            <iframe
              src={url}
              title="Video player"
              className={`w-full h-full transition-opacity duration-500 ${loading ? 'opacity-0' : 'opacity-100'}`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              onLoad={() => setLoading(false)}
            ></iframe>
          ) : (
            <video
              src={url}
              controls
              autoPlay
              className={`w-full h-full transition-opacity duration-500 ${loading ? 'opacity-0' : 'opacity-100'}`}
              onCanPlayThrough={() => setLoading(false)}
            />
          )
        ) : (
          <div className="w-full h-full flex items-center justify-center text-white text-sm">
            No video content available
          </div>
        )}
      </div>
    </div>
  );
}
