"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { getRankHolders } from "@/lib/api/rankHolders";

export default function RankHolders() {
  const gridRef = useRef<HTMLDivElement | null>(null);
  const sliderRef = useRef<HTMLDivElement | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [rankHolders, setRankHolders] = useState<any[]>([]);
  const router = useRouter();
  const visibleCards = 4;
  const maxIndex = Math.max(0, rankHolders.length - visibleCards);

  useEffect(() => {
    const fetchRankHolders = async () => {
      try {
        const res = await getRankHolders(
          1,
          10,
          "",
          1,
          undefined,
          undefined,
          undefined,
          undefined,
          2
        );
        const data = res?.data || [];
        setRankHolders(data);
      } catch (error) {
        console.error("Error fetching rank holders:", error);
      }
    };
    fetchRankHolders();
  }, []);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    if (!gridRef.current) return;
    const cards = gridRef.current.querySelectorAll(".rank-card");
    gsap.set(cards, { opacity: 0, y: 50 });
    gsap.to(cards, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      stagger: 0.15,
      ease: "power3.out",
    });
  }, [rankHolders]);

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
          <h2
            className="text-3xl md:text-4xl font-bold text-center text-gray-900 cursor-pointer"
            onClick={() => router.push("/public/exams")}
          >
            Rank Holders
          </h2>
          <img
            src="/line_03.png"
            alt="underline"
            className="absolute left-1/2 -translate-x-1/2 -bottom-3 w-28 md:w-36"
          />
        </div>

        {/* Navigation Arrows */}
        {!isMobile && rankHolders.length > 4 && (
          <>
            {/* LEFT ARROW (show only when not at start) */}
            {currentIndex > 0 && (
              <button
                onClick={prevSlide}
                className="absolute cursor-pointer left-0 top-1/2 -translate-y-1/2 bg-white shadow-md rounded-full p-3 hover:bg-cyan-50 transition z-10"
              >
                <ChevronLeft className="text-cyan-700 w-6 h-6" />
              </button>
            )}

            {/* RIGHT ARROW (show only when not at end) */}
            {currentIndex < maxIndex && (
              <button
                onClick={nextSlide}
                className="absolute cursor-pointer right-0 top-1/2 -translate-y-1/2 bg-white shadow-md rounded-full p-3 hover:bg-cyan-50 transition z-10"
              >
                <ChevronRight className="text-cyan-700 w-6 h-6" />
              </button>
            )}
          </>
        )}

        {/* Slider */}
        <div
          ref={(el) => {
            sliderRef.current = el;
            gridRef.current = el;
          }}
          className={`flex md:gap-8 gap-6 overflow-x-auto scroll-smooth snap-x snap-mandatory ${
            isMobile ? "pb-10" : "overflow-hidden pb-10"
          } pl-0 pr-6`}
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
        >
          {rankHolders.map((holder, idx) => (
            <div
              key={holder.rank_holder_id}
              className={`rank-card snap-start flex-shrink-0
                ${
                  isMobile
                    ? "w-[80%]" // ✅ Mobile: 1 card
                    : "sm:w-[calc(35%-1rem)] lg:w-[calc(24.5%-1rem)]" // ✅ sm/md 2 cards, lg 4 cards
                }
                text-center shadow-xl border-t-2 rounded-2xl overflow-hidden relative cursor-pointer opacity-0 bg-white ${
                  !isMobile && idx === 0 ? "ml-6" : ""
                }`}
            >
              <img
                src={holder.student_photo || "/placeholder_student.png"}
                alt={holder.student_name}
                className="w-full h-full object-cover"
              />
            </div>
          ))}

          {rankHolders.length === 0 && (
            <div className="w-full flex justify-center items-center py-10">
              <img
                src="/no_data.png"
                alt="No Data"
                className="w-52 opacity-50"
              />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
