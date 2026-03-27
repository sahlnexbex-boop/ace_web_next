"use client";
import React from "react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  videoUrl: string;
}

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

  const origin = getWindowOrigin();
  if (origin) {
    embedUrl.searchParams.set("origin", origin);
  }

  return embedUrl.toString();
};

export default function DynamicVideoModal({ isOpen, onClose, videoUrl }: Props) {
  if (!isOpen) return null;

  const youtubeVideoId = extractYouTubeVideoId(videoUrl);
  const normalizedUrl = youtubeVideoId ? buildYouTubeEmbedUrl(youtubeVideoId) : videoUrl;
  const normalizedVideoUrl = normalizedUrl.trim();
  const extension =
    normalizedVideoUrl.split("?")[0].split("#")[0].split(".").pop()?.toLowerCase() || "";
  const isDirectVideo = DIRECT_VIDEO_EXTENSIONS.includes(extension);
  const isIframe = !isDirectVideo;

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
          className="absolute cursor-pointer top-2 right-2 text-white text-2xl z-50"
        >
          ✕
        </button>

        {videoUrl ? (
          isIframe ? (
            <iframe
              src={normalizedVideoUrl}
              title="Video"
              className="w-full aspect-video rounded-lg"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            />
          ) : (
            <video
              src={normalizedVideoUrl}
              controls
              autoPlay
              className="w-full aspect-video rounded-lg"
            />
          )
        ) : (
          <div className="p-10 text-white text-center">No video available</div>
        )}
      </div>
    </div>
  );
}
