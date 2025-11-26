"use client";
import { useParams } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { getToppers } from "@/lib/api/topper";
import Loader from "@/components/loader";

export default function ExamDetails() {
  const { examId } = useParams<{ examId: string }>();
  const gridRef = useRef<HTMLDivElement | null>(null);

  const [toppers, setToppers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchToppers = async () => {
      try {
        const category_id = Number(examId);

        const response = await getToppers(1, 100, "", 1, category_id);

        setToppers(response?.data || []);
      } catch (err) {
        console.error("Error fetching toppers:", err);
      } finally {
        setLoading(false);
      }
    };

    if (examId) fetchToppers();
  }, [examId]);

  // Enter Animation
  useEffect(() => {
    if (!toppers.length) return;

    const cards = document.querySelectorAll(".rank-card");
    gsap.set(cards, { opacity: 1 });

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          gsap.fromTo(
            cards,
            { opacity: 0, y: 40 },
            {
              opacity: 1,
              y: 0,
              duration: 0.8,
              stagger: 0.12,
              ease: "power3.out",
            }
          );
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );

    if (gridRef.current) observer.observe(gridRef.current);

    return () => observer.disconnect();
  }, [toppers]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader />
      </div>
    );
  }

  const title = toppers[0]?.category?.category_name || "Category Details";

  return (
    <div className="md:px-20 px-8 md:py-14 py-8">
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
            <path stroke="none" d="M0 0h24v24H0z" />
            <path d="M5 12l-2 0l9 -9l9 9l-2 0" />
            <path d="M5 12v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-7" />
            <path d="M9 21v-6a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v6" />
          </svg>
        </span>
        <span className="cursor-pointer hover:underline">Categories</span>
        <span>/</span>
        <span className="cursor-pointer hover:underline">Category</span>
      </div>

      <h1 className="md:text-3xl text-2xl font-bold mb-5 mt-10">{title}</h1>

      {toppers.length > 0 ? (
        <div
          ref={gridRef}
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-x-12 gap-y-12 pb-12" // increased gap-y + padding bottom
        >
          {toppers.map((holder) => (
            <div
              key={holder.topper_id}
              className="
        rank-card 
        relative 
        cursor-pointer 
        bg-white 
        h-72 
        rounded-2xl 
        overflow-hidden
        transition-all 
        duration-500 
        ease-out
        hover:-translate-y-6
        hover:shadow-2xl 
        hover:shadow-cyan-300/70
        group
      "
              style={{ transitionDelay: `${Math.random() * 0.1}s` }} // optional stagger
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent z-10" />

              <img
                src={holder.topper_image || "/placeholder.svg"}
                alt={holder.topper_name}
                className="w-full h-full object-cover rounded-2xl 
                   transition-transform duration-500 
                   group-hover:scale-110"
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="flex justify-center items-center min-h-[70vh]">
          <img
            src="../../no_data.png"
            alt=""
            className="opacity-40 h-full w-full max-h-[500px] max-w-[500px]"
          />
        </div>
      )}
    </div>
  );
}
