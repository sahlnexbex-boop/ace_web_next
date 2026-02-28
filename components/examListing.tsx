"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getCourseCategories } from "@/lib/api/courseCategory";

export default function ExamListing() {
  const router = useRouter();

  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const catRes = await getCourseCategories(1, 50, "", { status: "1" });
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
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xxl:grid-cols-5 gap-5 sm:gap-6">
          {categories.map((cat) => (
            <div
              key={`category-${cat.category_id}`}
              onClick={() => handleItemClick(cat.category_id)}
              className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 flex flex-col items-center md:items-start justify-center px-5 py-7 border border-gray-100 cursor-pointer hover:-translate-y-1"
            >
              <img
                src="https://images.vexels.com/media/users/3/276662/isolated/preview/45480a3100a9edc6bf3b0ce03b3830e4-blue-folder-rounded.png"
                alt="Trophy"
                className="w-12 h-12 mb-3 object-contain"
              />
              <div className="w-full flex justify-between items-center">
                <p className="text-sm text-gray-800 font-medium text-center leading-snug">
                  {cat.category_name}
                </p>
                <button
                  onClick={() => handleItemClick(cat.category_id)}
                  className="custom-btn bg-gradient-to-r from-cyan-400 to-blue-400">

                  <div className="sign"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-arrow-right"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M5 12l14 0" /><path d="M13 18l6 -6" /><path d="M13 6l6 6" /></svg></div>

                  <div className="btn-text">View</div>
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
