"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getCourses } from "@/lib/api/course";
import { getCourseCategoryBySlug } from "@/lib/api/courseCategory";
import { CourseCategorySkeleton } from "@/components/skeltons/skelton";
import { slugify } from "@/lib/slugify";

interface Course {
  course_id: number;
  course_name: string;
  course_description: string;
  course_image: string;
  course_rating?: number;
  course_type?: string;
}

interface Category {
  category_id: number;
  category_name: string;
  category_description: string;
  category_image: string;
  courseType?: {
    type_name: string;
  };
}

export default function CourseCategoryPage({
  params,
}: {
  params: { categorySlug: string };
}) {
  const router = useRouter();
  const [courses, setCourses] = useState<Course[]>([]);
  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);

  const server_url = process.env.NEXT_PUBLIC_API_BASE_URL;
  const slug = params.categorySlug;

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  // Fetch category by SLUG
  useEffect(() => {
    if (!slug) return;

    (async () => {
      try {
        const categoryRes = await getCourseCategoryBySlug(slug);
        const cat = categoryRes?.data || null;

        setCategory(cat);

        //  Fetch courses using category_id from slug result
        if (cat?.category_id) {
          const courseRes = await getCourses(1, 20, "", {
            status: "1",
            category_id: String(cat.category_id),
          });
          setCourses(courseRes?.data || courseRes?.rows || []);
        }
      } catch (error) {
        console.error("Error loading category/courses:", error);
      } finally {
        setLoading(false);
      }
    })();
  }, [slug]);

  const handleNavigate = (course_name: string) => {
    router.push(`/public/courses/${slug}/${slugify(course_name)}`);
  };

  if (loading) return <CourseCategorySkeleton />;

  if (!category) {
    return (
      <div className="flex justify-center items-center min-h-[70vh]">
        <p className="text-gray-500">Category not found</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 md:py-12 py-8 md:pb-32 pb-16">
      {/* Breadcrumb */}
      <div className="flex items-center gap-1 text-sm text-gray-500 mb-6">
        <button
          onClick={() => router.push("/public/home")}
          className="hover:text-[#1b6dac]"
        >
          Home
        </button>
        <span>/</span>
        <span
          className="cursor-pointer hover:text-[#1b6dac]"
          onClick={() => router.push("/public/courses")}
        >
          Courses
        </span>
        <span>/</span>
        <span className="text-gray-800 font-medium">
          {category.category_name}
        </span>
      </div>

      <h1 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-2">
        {category.category_name}
      </h1>

      <p className="text-center text-[#0595d7] font-medium md:mb-10 mb-5">
        {category.courseType?.type_name || "Courses"}
      </p>

      {courses.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {courses.map((course) => (
            <div
              key={course.course_id}
              onClick={() => handleNavigate(course.course_name)}
              className="bg-gray-100 rounded-2xl overflow-hidden shadow-md hover:shadow-2xl hover:scale-[1.02] transition-all duration-500 cursor-pointer group flex flex-col"
            >
              <div className="relative w-full h-44 overflow-hidden">
                <img
                  src={
                    course.course_image
                      ? server_url + course.course_image
                      : "/placeholder.png"
                  }
                  alt={course.course_name}
                  className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                />
                {/* badge  */}
                {/* <div className="absolute top-2 right-2 bg-white/80 text-sm text-gray-900 px-2 py-1 rounded-full">
                  {course?.course_type === "1" ? "Offline" : "Online"}
                </div> */}
              </div>

              <div className="flex flex-col justify-between flex-grow p-5">
                <h3 className="font-bold text-gray-900 text-lg line-clamp-2">
                  {course.course_name}
                </h3>
                <p className="text-sm text-gray-600 line-clamp-2">
                  {course.course_description || "—"}
                </p>

                <div className="flex justify-between items-center mt-auto pt-5 text-[#1b6dac]">
                  <span className="bg-blue-100 px-2 py-1 rounded-full text-sm">
                    {(() => {
                      let types: number[] = [];

                      if (Array.isArray(course?.course_type)) {
                        // Already array
                        types = course.course_type;
                      } else if (typeof course?.course_type === "string") {
                        // String like "[1,2]" or "[]"
                        try {
                          types = JSON.parse(course.course_type);
                        } catch {
                          types = [];
                        }
                      }

                      if (!types.length) return "N/A";

                      return types
                        .map((type) =>
                          type === 1 ? "Offline" : type === 2 ? "Online" : null
                        )
                        .filter(Boolean)
                        .join(" | ");
                    })()}
                  </span>

                  <span className="hover:underline">View Details</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex justify-center items-center min-h-[60vh]">
          <img src="../../no_data.png" alt="no-data" className="opacity-40" />
        </div>
      )}
    </div>
  );
}
