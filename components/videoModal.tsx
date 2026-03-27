"use client";
import React, { useState, useEffect } from "react";
import { X, Loader2 } from "lucide-react";

interface Props {
  videoId?: string;
  videoUrl?: string;
  isOpen: boolean;
  onClose: () => void;
}

type MediaType = "iframe" | "video" | "none";

const DIRECT_VIDEO_EXTENSIONS = ["mp4", "webm", "ogg", "mov"];

const hasProtocol = (value: string) => /^[a-zA-Z][a-zA-Z\d+\-.]*:/.test(value);

const getWindowOrigin = () =>
  typeof window !== "undefined" ? window.location.origin : "";

const getParsableUrl = (value: string) => {
  const trimmedValue = value.trim();
  const candidates = [trimmedValue];

  if (
    trimmedValue &&
    !hasProtocol(trimmedValue) &&
    !trimmedValue.startsWith("/") &&
    (trimmedValue.startsWith("www.") ||
      trimmedValue.startsWith("youtu.be") ||
      trimmedValue.includes("youtube.com") ||
      trimmedValue.includes("youtube-nocookie.com") ||
      trimmedValue.includes("vimeo.com"))
  ) {
    candidates.push(`https://${trimmedValue}`);
  }

  for (const candidate of candidates) {
    try {
      return new URL(candidate);
    } catch {
      continue;
    }
  }

  return null;
};

const isValidYouTubeId = (value: string | null | undefined) =>
  Boolean(value && /^[A-Za-z0-9_-]{11}$/.test(value));

const extractYouTubeVideoId = (value: string) => {
  const trimmedValue = value.trim();
  if (!trimmedValue) return null;

  if (isValidYouTubeId(trimmedValue)) {
    return trimmedValue;
  }

  const parsedUrl = getParsableUrl(trimmedValue);

  if (parsedUrl) {
    const hostname = parsedUrl.hostname.replace(/^www\./, "");
    const pathSegments = parsedUrl.pathname.split("/").filter(Boolean);

    if (hostname === "youtu.be") {
      const shortId = pathSegments[0];
      if (isValidYouTubeId(shortId)) {
        return shortId;
      }
    }

    if (
      hostname.endsWith("youtube.com") ||
      hostname.endsWith("youtube-nocookie.com")
    ) {
      const watchId = parsedUrl.searchParams.get("v");
      if (isValidYouTubeId(watchId)) {
        return watchId;
      }

      if (["embed", "shorts", "live", "v"].includes(pathSegments[0])) {
        const pathId = pathSegments[1];
        if (isValidYouTubeId(pathId)) {
          return pathId;
        }
      }
    }
  }

  const fallbackMatch = trimmedValue.match(
    /(?:youtu\.be\/|youtube(?:-nocookie)?\.com\/(?:embed\/|shorts\/|watch\?.*v=|live\/|v\/))([A-Za-z0-9_-]{11})/
  );

  return fallbackMatch?.[1] || null;
};

const buildYouTubeEmbedUrl = (videoId: string) => {
  const embedUrl = new URL(`https://www.youtube.com/embed/${videoId}`);
  embedUrl.searchParams.set("autoplay", "1");
  embedUrl.searchParams.set("rel", "0");
  embedUrl.searchParams.set("playsinline", "1");
  embedUrl.searchParams.set("modestbranding", "1");

  return embedUrl.toString();
};

export default function VideoModal({ videoId, videoUrl, isOpen, onClose }: Props) {
  const [loading, setLoading] = useState(true);
  const server_url = process.env.NEXT_PUBLIC_API_BASE_URL;

  useEffect(() => {
    if (isOpen) {
      setLoading(true);
    }
  }, [isOpen, videoId, videoUrl]);

  if (!isOpen) return null;

  const getMediaInfo = () => {
    if (videoId) {
      return {
        url: buildYouTubeEmbedUrl(videoId),
        type: "iframe" as MediaType,
      };
    }

    if (videoUrl) {
      const ytId = extractYouTubeVideoId(videoUrl);
      if (ytId) {
        return {
          url: buildYouTubeEmbedUrl(ytId),
          type: "iframe" as MediaType,
        };
      }

      if (videoUrl.includes("vimeo.com")) {
        return { url: videoUrl, type: "iframe" as MediaType };
      }

      let finalUrl = videoUrl.trim();
      if (finalUrl.startsWith("/") && !finalUrl.startsWith("//")) {
        finalUrl = `${server_url || ""}${finalUrl}`;
      }

      const extension =
        finalUrl.split("?")[0].split("#")[0].split(".").pop()?.toLowerCase() || "";
      const isDirectVideo = DIRECT_VIDEO_EXTENSIONS.includes(extension);

      if (isDirectVideo) {
        return { url: finalUrl, type: "video" as MediaType };
      }

      return { url: finalUrl, type: "iframe" as MediaType };
    }

    return { url: "", type: "none" as MediaType };
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
              referrerPolicy="strict-origin-when-cross-origin"
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
