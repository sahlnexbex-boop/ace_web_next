"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function RankHolders() {
  const gridRef = useRef<HTMLDivElement | null>(null);
  const sliderRef = useRef<HTMLDivElement | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const router = useRouter();

  const rankHolders = Array.from({ length: 12 }, (_, i) => ({
    id: i + 1,
    rank: i + 1,
    name: "Hashir Shan K",
    position: "Ambulance Assistant",
    image: `/rank_std_0${(i % 4) + 1}.png`,
  }));

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    if (!gridRef.current) return;
    const cards = gridRef.current.querySelectorAll(".rank-card");

    gsap.set(cards, { opacity: 0, y: 40 });
    gsap.to(cards, {
      opacity: 1,
      y: 0,
      duration: 0.6,
      stagger: 0.1,
      ease: "power3.out",
    });
  }, []);

  const nextSlide = () => {
    if (!sliderRef.current) return;
    const visibleCards = 4;
    const step = 2;
    const maxIndex = Math.max(0, rankHolders.length - visibleCards);
    const newIndex = Math.min(currentIndex + step, maxIndex);
    setCurrentIndex(newIndex);
    sliderRef.current.scrollTo({
      left: newIndex * (sliderRef.current.clientWidth / visibleCards),
      behavior: "smooth",
    });
  };

  const prevSlide = () => {
    if (!sliderRef.current) return;
    const step = 2;
    const newIndex = Math.max(currentIndex - step, 0);
    setCurrentIndex(newIndex);
    sliderRef.current.scrollTo({
      left: newIndex * (sliderRef.current.clientWidth / 4),
      behavior: "smooth",
    });
  };

  return (
    <section className="md:py-16 py-10 bg-white overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Title */}
        <div className="relative mb-12 flex justify-center">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 cursor-pointer" onClick={()=>router.push("/exams")}>
            Rank Holders
          </h2>
          <img
            src="/line_03.png"
            alt="underline"
            className="absolute left-1/2 -translate-x-1/2 -bottom-3 w-28 md:w-36"
          />
        </div>

        {/* Arrows (desktop only) */}
        {!isMobile && (
          <>
            <button
              onClick={prevSlide}
              className="absolute cursor-pointer left-0 top-1/2 -translate-y-1/2 bg-white shadow-md rounded-full p-3 hover:bg-cyan-50 transition z-10"
            >
              <ChevronLeft className="text-cyan-700 w-6 h-6" />
            </button>
            <button
              onClick={nextSlide}
              className="absolute cursor-pointer right-0 top-1/2 -translate-y-1/2 bg-white shadow-md rounded-full p-3 hover:bg-cyan-50 transition z-10"
            >
              <ChevronRight className="text-cyan-700 w-6 h-6" />
            </button>
          </>
        )}

        {/* Slider Container */}
        <div
          ref={(el) => {
            sliderRef.current = el;
            gridRef.current = el;
          }}
          className={`flex gap-6 overflow-x-auto scroll-smooth snap-x snap-mandatory ${
            isMobile ? "pb-10" : "overflow-hidden pb-10"
          } pl-0 pr-6`} // 👈 we’ll handle left space via first card margin
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
        >
          {rankHolders.map((holder, idx) => (
            <div
              key={holder.id}
              className={`rank-card snap-start flex-shrink-0 ${
                isMobile ? "w-[80%]" : "w-[calc(25%-1rem)]"
              } text-center shadow-xl border-t-2 rounded-2xl py-4 relative cursor-pointer opacity-0 bg-white ${
                !isMobile && idx === 0 ? "ml-6" : "" // 👈 fixed left margin only for first card
              }`}
            >
              <img
                src="/logo_only.png"
                alt=""
                className="absolute -top-8 h-[290px] opacity-40 pointer-events-none"
              />

              {/* Image + Rank */}
              <div className="relative mb-6">
                <div className="w-40 h-40 sm:w-48 sm:h-48 rounded-full mx-auto relative">
                  <div className="absolute inset-0 opacity-30">
                    <div className="absolute top-4 right-4 w-12 h-12 sm:w-16 sm:h-16 bg-white/20 transform rotate-45"></div>
                    <div className="absolute bottom-8 left-8 w-10 h-10 sm:w-12 sm:h-12 bg-white/20 rounded-full"></div>
                  </div>

                  <div className="absolute inset-0">
                    <img
                      src={holder.image}
                      alt={holder.name}
                      className="w-full h-full object-cover rounded-full"
                    />
                  </div>

                  <div className="absolute bottom-6 left-4 w-10 h-10 sm:w-12 sm:h-12 bg-white rounded-full shadow-lg flex flex-col justify-center items-center">
                    <span className="text-lg sm:text-xl text-gray-900 font-bold">
                      {holder.rank}
                    </span>
                    <span className="text-[8px] sm:text-[9px] text-gray-900">
                      Rank
                    </span>
                  </div>
                </div>
              </div>

              <h3 className="text-base sm:text-lg font-bold text-gray-900">
                {holder.name}
              </h3>
              <p className="text-sm text-cyan-600">{holder.position}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
