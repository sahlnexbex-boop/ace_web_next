"use client";

import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";

interface VideoModalProps {
  videoUrl: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function VideoModal({ videoUrl, isOpen, onClose }: VideoModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      gsap.set(overlayRef.current, { opacity: 0, pointerEvents: "none" });
      gsap.set(modalRef.current, { opacity: 0, scale: 0.9 });

      gsap.to(overlayRef.current, {
        opacity: 1,
        duration: 0.4,
        pointerEvents: "auto",
        ease: "power2.out",
      });
      gsap.to(modalRef.current, {
        opacity: 1,
        scale: 1,
        duration: 0.4,
        ease: "back.out(1.4)",
        delay: 0.1,
      });
    } else {
      gsap.to(modalRef.current, {
        opacity: 0,
        scale: 0.9,
        duration: 0.3,
        ease: "power2.in",
      });
      gsap.to(overlayRef.current, {
        opacity: 0,
        duration: 0.3,
        pointerEvents: "none",
        ease: "power2.inOut",
      });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[100] flex justify-center items-center"
      onClick={onClose}
    >
      <div
        ref={modalRef}
        className="relative w-full max-w-5xl bg-black rounded-2xl overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-10 bg-white hover:bg-red-500 hover:text-white cursor-pointer rounded-full px-2 py-1 shadow-md hover:scale-110 transition-transform"
          aria-label="Close video"
        >
          ✕
        </button>

        <div className="relative w-full" style={{ paddingTop: "56.25%" }}>
          <iframe
            className="absolute top-0 left-0 w-full h-full"
            src={`https://www.youtube.com/embed/${videoUrl}?autoplay=1`}
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          ></iframe>
        </div>
      </div>
    </div>
  );
}
