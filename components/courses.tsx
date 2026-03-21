"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { gsap } from "gsap";
import { getCourseTypes } from "@/lib/api/courseType";
import { getCourseCategories } from "@/lib/api/courseCategory";
import { CourseSkeletonGrid } from "./skeltons/skelton";
import { slugify } from "@/lib/slugify";

export default function Courses() {
  const [activeType, setActiveType] = useState<number | "all">("all");
  const [courseMode, setCourseMode] = useState<"all" | "offline" | "online">(
    "all"
  );
  const [types, setTypes] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const gridRef = useRef<HTMLDivElement | null>(null);
  const sliderRef = useRef<HTMLDivElement | null>(null);

  const isDraggingRef = useRef(false);
  const dragStartXRef = useRef(0);
  const dragScrollLeftRef = useRef(0);

  const router = useRouter();
  const pathname = usePathname();
  const lastPathRef = useRef(pathname);

  const server_url = process.env.NEXT_PUBLIC_API_BASE_URL;
  const hasAnimatedRef = useRef(false);

  /* -------------------- FETCH DATA -------------------- */
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);

        const courseTypeFilter =
          courseMode === "offline"
            ? "1"
            : courseMode === "online"
              ? "2"
              : undefined;

        const [typeRes, categoryRes] = await Promise.all([
          getCourseTypes(1, "", 100, { status: 1 }),
          getCourseCategories(1, 100, "", {
            status: "1",
            course_type: courseTypeFilter,
          }),
        ]);

        const typeList = typeRes?.data || typeRes?.rows || [];
        const categoryList = categoryRes?.data || categoryRes?.rows || [];

        setTypes([{ type_id: "all", type_name: "All" }, ...typeList]);
        setCategories(categoryList);
      } catch (err) {
        console.error("Error loading course data:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, [courseMode]);

  /* -------------------- RESET SLIDER SCROLL -------------------- */
  useEffect(() => {
    if (sliderRef.current) {
      sliderRef.current.scrollLeft = 0;
    }
  }, [courseMode]);

  /* -------------------- FILTER -------------------- */
  const filteredCategories =
    activeType === "all"
      ? categories
      : categories.filter(
        (cat) => String(cat.course_type_id) === String(activeType)
      );

  /* -------------------- GSAP ANIMATION -------------------- */
  useEffect(() => {
    if (loading || !gridRef.current || hasAnimatedRef.current) return;

    const cards = gridRef.current.querySelectorAll(".course-card");

    hasAnimatedRef.current = true;

    gsap.set(cards, { opacity: 0, y: 60, scale: 0.95 });

    requestAnimationFrame(() => {
      gsap.to(cards, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.7,
        stagger: 0.12,
        ease: "power2.out",
        clearProps: "transform,opacity",
      });
    });
  }, [loading, activeType]);

  /* -------------------- UI -------------------- */
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {lastPathRef.current === "/" && (
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-6 text-gray-900">
            Courses
          </h2>
        )}

        {/* ---------------- MODE + SLIDER ---------------- */}
        <div className="flex flex-col items-center gap-4 md:gap-10 md:mb-12 mb-6">
          {/* MODE TABS */}
          <div className="flex bg-white  p-1 shadow-lg border border-gray-300 md:w-auto h-full px-3 py-1.5 rounded-md justify-between">
            {[
              { key: "all", label: "All" },
              { key: "offline", label: "Offline" },
              { key: "online", label: "Online" },
            ].map((mode) => (
              <button
                key={mode.key}
                onClick={() => {
                  hasAnimatedRef.current = false;
                  setCourseMode(mode.key as any);
                  setActiveType("all");
                }}
                className={`px-4 py-1.5 text-sm rounded-md transition-colors cursor-pointer w-full ${courseMode === mode.key
                  ? "bg-sky-800 text-white shadow"
                  : "text-gray-700"
                  }`}
              >
                {mode.label}
              </button>
            ))}
          </div>

          {/* ----------- FIXED SLIDER ----------- */}
          <div
            ref={sliderRef}
            className="
                w-full md:w-auto md:max-w-full flex
                overflow-x-auto scrollbar-hide
                justify-start gap-3 sm:gap-4
                pb-2 pl-1
                no-scrollbar cursor-grab active:cursor-grabbing
                select-none
              "
            onMouseDown={(e) => {
              if (!sliderRef.current) return;
              isDraggingRef.current = true;
              dragStartXRef.current = e.pageX - sliderRef.current.offsetLeft;
              dragScrollLeftRef.current = sliderRef.current.scrollLeft;
            }}
            onMouseLeave={() => {
              isDraggingRef.current = false;
            }}
            onMouseUp={() => {
              isDraggingRef.current = false;
            }}
            onMouseMove={(e) => {
              if (!isDraggingRef.current || !sliderRef.current) return;
              e.preventDefault();
              const x = e.pageX - sliderRef.current.offsetLeft;
              const walk = (x - dragStartXRef.current) * 1.2;
              sliderRef.current.scrollLeft = dragScrollLeftRef.current - walk;
            }}
          >
            {types.map((type) => (
              <button
                key={type.type_id}
                onClick={() => {
                  hasAnimatedRef.current = false;
                  setActiveType(type.type_id);
                }}
                className={`rounded-full px-4 sm:px-6 py-2 flex-shrink-0 transition-all whitespace-nowrap ${activeType === type.type_id
                  ? "bg-gradient-to-r from-[#1F67A5] to-[#00A0E3] text-white"
                  : "text-blue-600 bg-blue-100 hover:bg-blue-200"
                  }`}
              >
                {type.type_name}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <CourseSkeletonGrid />
        ) : (
          <div
            ref={gridRef}
            className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6"
          >
            {filteredCategories.map((cat) => (
              <Card
                key={cat.category_id}
                onClick={() =>
                  router.push(`/courses/${slugify(cat.category_name)}`)
                }
                className="group course-card bg-gray-50/80 border-0 rounded-2xl cursor-pointer z-10
          transition-all duration-700 ease-out
          hover:bg-gradient-to-r hover:from-[#1b6dac] hover:to-[#0595d7] hover:shadow-lg"
              >
                <CardContent className="p-4 sm:p-6 flex flex-col items-start justify-between gap-4 sm:gap-6">
                  <div className="w-full flex justify-between items-start">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 bg-blue-100 rounded-full flex items-center justify-center mb-2 sm:mb-4">
                      <img
                        src={
                          cat.category_image
                            ? server_url + cat.category_image
                            : "/placeholder.png"
                        }
                        alt={cat.category_name}
                        className="w-8 h-8 sm:w-10 sm:h-10 object-contain rounded-full"
                      />
                    </div>

                    <div className="md:block hidden bg-blue-50 px-4 py-1 rounded-full text-sm transition-colors duration-300 h-fit">
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
        )}

        {/* NO DATA */}
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
