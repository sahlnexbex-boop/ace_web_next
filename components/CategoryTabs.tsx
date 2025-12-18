"use client";

import { useState, useEffect, useRef } from "react";
import { getCourseCategories } from "@/lib/api/courseCategory";

export default function CategoryTabs({
  activeCategory,
  onCategoryChange,
}: {
  activeCategory: number | null;
  onCategoryChange: (id: number | null) => void;
}) {
  const [categories, setCategories] = useState<any[]>([]);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  // ----- FETCH CATEGORIES -----
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

  // ----- DRAG SCROLL LOGIC -----
  useEffect(() => {
    const slider = scrollRef.current;
    if (!slider) return;

    let isDown = false;
    let startX = 0;
    let scrollLeft = 0;

    const handleDown = (e: any) => {
      isDown = true;
      slider.classList.add("cursor-grabbing");
      slider.classList.remove("cursor-grab");
      startX = e.pageX - slider.offsetLeft;
      scrollLeft = slider.scrollLeft;
    };

    const handleLeaveUp = () => {
      isDown = false;
      slider.classList.remove("cursor-grabbing");
      slider.classList.add("cursor-grab");
    };

    const handleMove = (e: any) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - slider.offsetLeft;
      const walk = (x - startX) * 2; 
      slider.scrollLeft = scrollLeft - walk;
    };

    slider.addEventListener("mousedown", handleDown);
    slider.addEventListener("mouseleave", handleLeaveUp);
    slider.addEventListener("mouseup", handleLeaveUp);
    slider.addEventListener("mousemove", handleMove);

    return () => {
      slider.removeEventListener("mousedown", handleDown);
      slider.removeEventListener("mouseleave", handleLeaveUp);
      slider.removeEventListener("mouseup", handleLeaveUp);
      slider.removeEventListener("mousemove", handleMove);
    };
  }, []);

  return (
    <div
      ref={scrollRef}
      className="
        flex gap-3 mb-6 overflow-x-auto pb-2 
        flex-nowrap scroll-smooth 
        no-scrollbar cursor-grab select-none 
      "
    >
      <button
        onClick={() => onCategoryChange(null)}
        className={`px-5 py-2 cursor-pointer whitespace-nowrap rounded-full text-sm font-medium ${
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
          className={`md:px-5 px-3 md:py-2 py-1 cursor-pointer whitespace-nowrap rounded-full text-sm font-medium ${
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
