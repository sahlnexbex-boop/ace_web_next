"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getTopperCategories } from "@/lib/api/topper";

export default function ExamListing() {
  const router = useRouter();
  const server_url = process.env.NEXT_PUBLIC_API_BASE_URL;

  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const catRes = await getTopperCategories(1, 100);
        const catData = catRes?.data || [];
        setCategories(catData);
      } catch (err) {
        console.error("Error fetching categories:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleItemClick = (id: number) => {
    router.push(`/public/exams/${id}`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <p className="text-gray-500 text-lg">Loading categories...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 md:py-16 py-8">
      <div className="text-center mb-10">
        <div className="relative mb-8 flex justify-center">
          <h2 className="text-2xl md:text-4xl font-bold text-center text-gray-900">
            E-Learning Excellence, Proven Outcomes
          </h2>
          <img
            src="/line_03.png"
            alt="underline"
            className="absolute left-1/2 -translate-x-1/2 -bottom-3 w-28 md:w-36"
          />
        </div>
        <p className="text-gray-500 mt-3 max-w-2xl mx-auto">
          Through innovative app-based learning and expert mentorship,
          Competitive Cracker has guided over <strong>50,000 students</strong> to
          achieve remarkable results in competitive exams.
        </p>
      </div>

      {categories.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xxl:grid-cols-5 space-y-8 space-x-3">
          {categories.map((cat) => (
            <div
              key={`category-${cat.category_id}`}
              onClick={() => handleItemClick(cat.category_id)}
              className="group cursor-pointer relative"
            >
              {/* folder section */}
              <div className="flex justify-center items-center relative">
                <img src={server_url + cat.first_topper.topper_image} alt="folder" className="rounded-md md:h-40 md:w-40 h-28 w-28 blur-[1px]" />
                <img src={server_url + cat.first_topper.topper_image} alt="folder" className="absolute md:top-2 md:left-12 left-7 top-1 h-28 w-28 md:h-40 md:w-40 blur-[1px] rounded-md border border-white" />
                {/* <img src={server_url + cat.first_topper.topper_image} alt="folder" className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-md  h-28 w-28 blur-[1px]" /> */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-md z-40 h-fit w-fit">
                  <p className="text-blue-900 py-1 md:py-1.5 md:px-4 px-2 font-extrabold text-xs md:text-sm tracking-tight text-center">
                    {cat.category_name}
                  </p>
                </div>
              </div>

              <div className="absolute -top-3 md:-top-5 md:left-6">
                <img src="/File.png" alt="file_image" className="md:w-56 md:h-52 w-40 h-36" />
              </div>


              {/* Bottom Info Area */}
              <div className="md:mt-6 mt-2 flex flex-col items-center">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleItemClick(cat.category_id);
                  }}
                  className="py-2 bg-gray-50 group-hover:bg-cyan-50 text-gray-600 rounded-xl text-sm font-bold transition-all duration-300 flex items-center justify-center gap-2 border border-gray-100 cursor-pointer w-fit px-6 mt-4 text-xs md:text-sm"
                >
                  View Toppers
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" className="transform group-hover:translate-x-1 transition-transform">
                    <path d="M5 12l14 0" />
                    <path d="M13 18l6 -6" />
                    <path d="M13 6l6 6" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500 text-lg py-10">
          No categories available.
        </p>
      )}
    </div>
  );
}
