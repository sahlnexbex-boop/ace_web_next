"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";

export default function RankHolders() {
  const rankHolders = [
    { id: 1, rank: 1, name: "Hashir Shan K", position: "Ambulance Assistant", image: "/rank_std_01.png" },
    { id: 2, rank: 2, name: "Hashir Shan K", position: "Ambulance Assistant", image: "/rank_std_02.png" },
    { id: 3, rank: 3, name: "Hashir Shan K", position: "Ambulance Assistant", image: "/rank_std_03.png" },
    { id: 4, rank: 4, name: "Hashir Shan K", position: "Ambulance Assistant", image: "/rank_std_04.png" },
  ];

  const gridRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          const isMobile = window.matchMedia("(max-width: 767px)").matches;

          if (isMobile) {
            gsap.fromTo(
              ".rank-card",
              {
                opacity: 0,
                x: (i) => (i % 2 === 0 ? -30 : 30),
              },
              {
                opacity: 1,
                x: 0,
                duration: 0.7,
                stagger: 0.15,
                ease: "power3.out",
              }
            );
          } else {
            gsap.fromTo(
              ".rank-card",
              {
                opacity: 0,
                y: 50,
              },
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
      { threshold: 0.3 }
    );

    if (gridRef.current) observer.observe(gridRef.current);

    return () => {
      if (gridRef.current) observer.unobserve(gridRef.current);
    };
  }, []);

  return (
    <section className="md:py-16 py-10 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative mb-12 flex justify-center">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900">
            Rank Holders
          </h2>
          <img
            src="/line_03.png"
            alt="underline"
            className="absolute left-1/2 -translate-x-1/2 -bottom-3 w-28 md:w-36"
          />
        </div>

        <div
          ref={gridRef}
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 overflow-hidden" // 👈 prevents x-scroll
        >
          {rankHolders.map((holder) => (
            <div
              key={holder.id}
              className="rank-card text-center shadow-xl border-t-2 rounded-2xl py-4 relative cursor-pointer opacity-0 bg-white"
            >
              <img
                src="/logo_only.png"
                alt=""
                className="absolute -top-8 h-[290px] opacity-40 pointer-events-none"
              />

              <div className="relative mb-6">
                <div className="w-40 h-40 sm:w-48 sm:h-48 rounded-full mx-auto relative">
                  <div className="absolute inset-0 opacity-30">
                    <div className="absolute top-4 right-4 w-12 h-12 sm:w-16 sm:h-16 bg-white/20 transform rotate-45"></div>
                    <div className="absolute bottom-8 left-8 w-10 h-10 sm:w-12 sm:h-12 bg-white/20 rounded-full"></div>
                  </div>

                  <div className="absolute inset-0">
                    <img
                      src={holder.image || "/placeholder.svg"}
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

              <h3 className="text-base sm:text-lg font-bold text-gray-900">{holder.name}</h3>
              <p className="text-sm text-cyan-600">{holder.position}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
