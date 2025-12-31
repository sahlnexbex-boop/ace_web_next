"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { gsap } from "gsap";
import { getCourseTypes } from "@/lib/api/courseType";
import { getCourseCategories } from "@/lib/api/courseCategory";
import { usePathname } from "next/navigation";

export default function Courses() {
  const [activeType, setActiveType] = useState<number | "all">("all");
  const [types, setTypes] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const gridRef = useRef<HTMLDivElement | null>(null);
  const router = useRouter();
  const pathname = usePathname();
  const lastPathRef = useRef(pathname);
  const server_url = process.env.NEXT_PUBLIC_API_BASE_URL;


  useEffect(() => {
    (async () => {
      try {
        const [typeRes, categoryRes] = await Promise.all([
          getCourseTypes(1, "", 100, { status: 1 }),
          getCourseCategories(1, 100, "", { status: "1" }),
        ]);

        const typeList = typeRes?.data || typeRes?.rows || [];
        const categoryList = categoryRes?.data || categoryRes?.rows || [];

        setTypes([{ type_id: "all", type_name: "All" }, ...typeList]);
        setCategories(categoryList);
      } catch (err) {
        console.error("Error loading course data:", err);
      }
    })();
  }, []);

  const filteredCategories =
    activeType === "all"
      ? categories
      : categories.filter(
          (cat) => String(cat.course_type_id) === String(activeType)
        );

  useEffect(() => {
    if (!gridRef.current) return;

    const cards = gridRef.current.querySelectorAll(".course-card");

    // Reset visibility
    gsap.set(cards, { opacity: 0, y: 60, scale: 0.95 });

    // Run animation after DOM paint
    requestAnimationFrame(() => {
      gsap.to(cards, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.8, // slower smooth motion
        stagger: 0.12, // visible sequence
        ease: "power2.out",
        clearProps: "transform,opacity",
      });
    });
  }, [activeType, filteredCategories]);

  return (
    <section
      className="md:py-16 py-10 relative"
      style={{
        backgroundImage: "url('/transperent_full.png')",
        backgroundSize: "contain",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Decorations */}
      <div className="absolute top-32 left-0 hidden md:block">
        <img
          src="/transperent_top.png"
          alt="Top Decoration"
          className="w-auto h-72"
        />
      </div>
      <div className="absolute bottom-0 right-0 hidden md:block">
        <img
          src="/transperent_bottom.png"
          alt="Bottom Decoration"
          className="w-auto h-72"
        />
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        { lastPathRef.current === "/public/home" && <h2 className="text-3xl md:text-4xl font-bold text-center md:mb-12 mb-6 text-gray-900 cursor-pointer">Courses</h2>}

        {/* Tabs */}
        <div className="flex overflow-x-auto scrollbar-hide justify-start sm:justify-center gap-3 sm:gap-4 md:mb-12 mb-6 pb-2 no-scrollbar">
          {types.map((type) => (
            <button
              key={type.type_id}
              onClick={() => setActiveType(type.type_id)}
              className={`rounded-full cursor-pointer px-4 sm:px-6 py-2 flex-shrink-0 transition-all whitespace-nowrap ${
                activeType === type.type_id
                  ? "bg-gradient-to-r from-[#1F67A5] to-[#00A0E3] text-white"
                  : "text-blue-600 bg-blue-100 hover:bg-blue-200"
              }`}
            >
              {type.type_name}
            </button>
          ))}
        </div>

        {/* Cards */}
        <div
          ref={gridRef}
          className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6"
        >
          {filteredCategories.map((cat) => (
            <Card
              key={cat.category_id}
              onClick={() => router.push(`/public/courses/${cat.category_id}`)}
              className="group course-card bg-gray-50/80 border-0 rounded-2xl cursor-pointer z-10
                 transition-all duration-700 ease-in-out
                 hover:bg-gradient-to-r hover:from-[#1b6dac] hover:to-[#0595d7] hover:shadow-lg"
            >
              <CardContent className="p-4 sm:p-6 flex flex-col items-start justify-between gap-4 sm:gap-6">
                <div className="w-full flex justify-between items-start">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-blue-100 rounded-full flex items-center justify-center mb-2 sm:mb-4">
                    <img
                      src={server_url + cat.category_image || "/placeholder.png"}
                      alt={cat.category_name}
                      className="w-8 h-8 sm:w-10 sm:h-10 object-contain rounded-full"
                    />
                  </div>
                  <div className="md:block hidden bg-blue-50 px-4 py-1 rounded-full text-sm transition-colors duration-300">
                    {cat.total_courses || 0} Courses
                  </div>
                </div>

                <div className="text-start transition-colors duration-300">
                  <h3 className="text-lg sm:text-xl font-bold mb-1 sm:mb-2 text-gray-900 group-hover:text-white">
                    {cat.category_name}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed group-hover:text-gray-100 line-clamp-2">
                    {cat.category_description || "—"}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* No Data */}
        {filteredCategories.length === 0 && (
          <div className="flex justify-center items-center">
            <img
              src="../../no_data.png"
              alt="No data"
              className="w-52 opacity-50"
            />
          </div>
        )}
      </div>
    </section>
  );
}
