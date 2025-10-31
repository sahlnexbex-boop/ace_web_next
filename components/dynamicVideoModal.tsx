"use client";
import React from "react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  videoUrl: string;
}

export default function DynamicVideoModal({ isOpen, onClose, videoUrl }: Props) {
  if (!isOpen) return null;

  const isIframe = videoUrl.includes("youtube.com") || videoUrl.includes("vimeo.com");

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
              src={videoUrl}
              title="Video"
              className="w-full aspect-video rounded-lg"
              allowFullScreen
            />
          ) : (
            <video
              src={videoUrl}
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
