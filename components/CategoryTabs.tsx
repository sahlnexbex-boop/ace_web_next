"use client";

import { useState, useEffect } from "react";
import { getCourseCategories } from "@/lib/api/courseCategory";

export default function CategoryTabs({
  activeCategory,
  onCategoryChange,
}: {
  activeCategory: number | null;
  onCategoryChange: (id: number | null) => void;
}) {
  const [categories, setCategories] = useState<any[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await getCourseCategories(1, 100, "", { status: "1" });
        setCategories(res?.data || []);
      } catch (err) {
        console.error("Error fetching categories:", err);
      }
    };
    fetchCategories();
  }, []);

  return (
    <div className="flex flex-wrap gap-3 mb-6 overflow-x-auto pb-2 md:pb-0">
      <button
        onClick={() => onCategoryChange(null)}
        className={`px-5 py-2 cursor-pointer rounded-full text-sm font-medium ${
          activeCategory === null
            ? "bg-[#087fc2] text-white"
            : "bg-white text-gray-700 border border-gray-200 hover:bg-blue-50"
        }`}
      >
        All
      </button>
      {categories.map((cat) => (
        <button
          key={cat.category_id}
          onClick={() => onCategoryChange(cat.category_id)}
          className={`px-5 py-2 cursor-pointer rounded-full text-sm font-medium ${
            activeCategory === cat.category_id
              ? "bg-[#087fc2] text-white"
              : "bg-white text-gray-700 border border-gray-200 hover:bg-blue-50"
          }`}
        >
          {cat.category_name}
        </button>
      ))}
    </div>
  );
}
