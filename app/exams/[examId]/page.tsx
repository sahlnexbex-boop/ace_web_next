"use client";
import { useParams } from "next/navigation";
import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";

export default function ExamDetails() {
  const { examId } = useParams<{ examId: string }>();
  const gridRef = useRef<HTMLDivElement | null>(null);

  const rankHolders = [
    {
      id: 1,
      rank: 1,
      name: "Hashir Shan K",
      position: "Ambulance Assistant",
      image: "/rank_std_01.png",
    },
    {
      id: 2,
      rank: 2,
      name: "Hashir Shan K",
      position: "Ambulance Assistant",
      image: "/rank_std_02.png",
    },
    {
      id: 3,
      rank: 3,
      name: "Hashir Shan K",
      position: "Ambulance Assistant",
      image: "/rank_std_03.png",
    },
    {
      id: 4,
      rank: 4,
      name: "Hashir Shan K",
      position: "Ambulance Assistant",
      image: "/rank_std_04.png",
    },
    {
      id: 5,
      rank: 5,
      name: "Hashir Shan K",
      position: "Ambulance Assistant",
      image: "/rank_std_01.png",
    },
    {
      id: 6,
      rank: 6,
      name: "Hashir Shan K",
      position: "Ambulance Assistant",
      image: "/rank_std_02.png",
    },
    {
      id: 7,
      rank: 7,
      name: "Hashir Shan K",
      position: "Ambulance Assistant",
      image: "/rank_std_03.png",
    },
    {
      id: 8,
      rank: 8,
      name: "Hashir Shan K",
      position: "Ambulance Assistant",
      image: "/rank_std_04.png",
    },
  ];

  useEffect(() => {
    const cards = document.querySelectorAll(".rank-card");

    gsap.set(cards, { opacity: 1 });

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          const isMobile = window.matchMedia("(max-width: 767px)").matches;

          if (isMobile) {
            gsap.fromTo(
              cards,
              { opacity: 0, y: 30 },
              {
                opacity: 1,
                y: 0,
                duration: 0.6,
                stagger: 0.15,
                ease: "power3.out",
              }
            );
          } else {
            gsap.fromTo(
              cards,
              { opacity: 0, y: 50 },
              {
                opacity: 1,
                y: 0,
                duration: 0.8,
                stagger: 0.15,
                ease: "power3.out",
              }
            );
          }

          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );

    if (gridRef.current) observer.observe(gridRef.current);

    // ✅ Fallback: run animation manually if IntersectionObserver fails (common on mobile)
    setTimeout(() => {
      if (cards[0] && getComputedStyle(cards[0]).opacity === "0") {
        gsap.to(cards, {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.1,
          ease: "power3.out",
        });
      }
    }, 1500);

    return () => observer.disconnect();
  }, []);

  return (
    <div className="md:px-20 px-8 md:py-14 py-8">
      {/* Breadcrumb */}
      <div className="text-sm text-gray-900 mb-10 md:mb-3 flex items-center flex-wrap gap-1">
        <span className="hover:underline cursor-pointer">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <path d="M5 12l-2 0l9 -9l9 9l-2 0" />
            <path d="M5 12v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-7" />
            <path d="M9 21v-6a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v6" />
          </svg>
        </span>
        <span className="cursor-pointer hover:underline flex items-center">
          Courses
        </span>
        <span>/</span>
        <span className="cursor-pointer hover:underline">SSC</span>
      </div>

      <h1 className="md:text-3xl text-2xl font-bold mb-5 mt-10">
        UPSA (Malappuram) 2022
      </h1>

      <div
        ref={gridRef}
        className="grid md:grid-cols-2 lg:grid-cols-4 gap-x-12 gap-y-8 overflow-hidden py-5"
      >
        {rankHolders.map((holder) => (
          <div
            key={holder.id}
            className="rank-card text-center shadow-xl border-t-2 rounded-2xl py-4 relative cursor-pointer bg-white"
          >
            <div className="relative mb-6">
              <div className="w-40 h-40 sm:w-48 sm:h-48 rounded-full mx-auto relative">
                <div className="absolute inset-0 opacity-30">
                  <div className="absolute top-4 right-4 w-12 h-12 sm:w-16 sm:h-16 bg-white/20 transform rotate-45"></div>
                  <div className="absolute bottom-8 left-8 w-10 h-10 sm:w-12 sm:h-12 bg-white/20 rounded-full"></div>
                </div>

                <img
                  src={holder.image || "/placeholder.svg"}
                  alt={holder.name}
                  className="absolute inset-0 w-full h-full object-cover rounded-full"
                />

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
  );
}
