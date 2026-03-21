"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { useRouter, usePathname } from "next/navigation";
import { getRankHolders } from "@/lib/api/rankHolders";
import Marquee from "react-fast-marquee";

export default function RankHolders() {
  const gridRef = useRef<HTMLDivElement | null>(null);
  const [rankHolders, setRankHolders] = useState<any[]>([]);
  const router = useRouter();
  const pathname = usePathname();
  const server_url = process.env.NEXT_PUBLIC_API_BASE_URL;
  const isExamsPage = pathname === "/exams";

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
    if (!gridRef.current || rankHolders.length === 0) return;
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

  return (
    <section className="md:py-16 py-10 bg-white overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Title */}
        <div className="relative mb-12 flex justify-between items-end">
          <div className="relative flex-1 flex justify-center">
            <h2
              className="text-3xl md:text-4xl font-bold text-center text-gray-900 cursor-pointer"
              onClick={() => router.push("/exams")}
            >
              Rank Holders
            </h2>
            <img
              src="/line_03.png"
              alt="underline"
              className="absolute left-1/2 -translate-x-1/2 -bottom-3 w-28 md:w-36"
            />
          </div>
          {!isExamsPage && (
            <button
              onClick={() => router.push("/exams")}
              className="flex items-center gap-1.5 text-sm font-semibold text-cyan-600 hover:text-cyan-800 cursor-pointer transition-colors whitespace-nowrap ml-4 shrink-0"
            >
              View All
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="transform hover:translate-x-1 transition-transform">
                <path d="M5 12l14 0" />
                <path d="M13 18l6 -6" />
                <path d="M13 6l6 6" />
              </svg>
            </button>
          )}
        </div>

        {/* Marquee Slider */}
        {rankHolders.length > 0 ? (
          <div ref={gridRef}>
            <Marquee
              speed={80}
              gradient={true}
              gradientColor="white"
              gradientWidth={40}
              pauseOnHover={true}
              className="pb-10"
            >
              {rankHolders.map((holder) => (
                <div
                  key={holder.rank_holder_id}
                  className="rank-card mx-4 w-[170px] sm:w-[300px] text-center shadow-xl border-t-2 rounded-2xl overflow-hidden relative cursor-pointer bg-white"
                >
                  <img
                    src={
                      server_url + holder.student_photo ||
                      "/placeholder_student.png"
                    }
                    alt={holder.student_name}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </Marquee>
          </div>
        ) : (
          <div className="w-full flex justify-center items-center py-10">
            <img
              src="/no_data.png"
              alt="No Data"
              className="w-52 opacity-50"
            />
          </div>
        )}
      </div>
    </section>
  );
}
