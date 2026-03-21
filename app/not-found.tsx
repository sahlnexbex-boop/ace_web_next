"use client";

import Link from "next/link";
import { MoveLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white px-6 font-outfit">
      <div className="relative flex flex-col items-center text-center max-w-lg">
        {/* Giant background text for depth */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[60%] select-none pointer-events-none">
          <h1 className="text-[180px] md:text-[280px] font-black text-gray-50/80 tracking-tighter leading-none opacity-40">
            404
          </h1>
        </div>

        {/* Status Code */}
        <h1 className="text-9xl md:text-[220px] font-bold text-[#f1f1f1] leading-none drop-shadow-sm select-none">
          404
        </h1>

        {/* Main Heading */}
        <h2 className="mt-2 text-2xl md:text-3xl font-extrabold text-[#0595d7] tracking-tight sm:text-4xl animate-in fade-in slide-in-from-bottom-4 duration-700">
          Page not found
        </h2>

        {/* Description Text */}
        <p className="mt-6 text-sm md:text-base leading-relaxed text-gray-500 max-w-xs md:max-w-md animate-in fade-in slide-in-from-bottom-6 duration-1000">
          Duis dolor sit amet, consectetur adipiscing elitvestibulum in pharetra.
        </p>

        {/* Navigation Button */}
        <div className="mt-12 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300">
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-xl bg-[#087FC2] px-10 py-3.5 text-sm font-semibold text-white shadow-xl hover:bg-[#1F67A5] hover:scale-105 active:scale-95 transition-all duration-300 ease-spring"
          >
            Got to home
          </Link>
        </div>
      </div>

      <style jsx>{`
        .ease-spring {
          transition-timing-function: cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
      `}</style>
    </div>
  );
}
