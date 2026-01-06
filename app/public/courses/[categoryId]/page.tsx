"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getCourses } from "@/lib/api/course";
import { getCourseCategoryById } from "@/lib/api/courseCategory";

interface Course {
  course_id: number;
  course_name: string;
  course_description: string;
  course_image: string;
  course_rating?: number;
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
  params: { categoryId: string };
}) {
  const router = useRouter();
  const [courses, setCourses] = useState<Course[]>([]);
  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);
  const server_url = process.env.NEXT_PUBLIC_API_BASE_URL;


  const categoryId = params.categoryId;

    useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const categoryRes = await getCourseCategoryById(Number(categoryId));
        setCategory(categoryRes?.data || null);
      } catch (error) {
        console.error("Error loading category details:", error);
      }
    })();
  }, [categoryId]);

  useEffect(() => {
    (async () => {
      try {
        const courseRes = await getCourses(
          1, 
          20, 
          "", 
          {
            status: "1",
            category_id: String(categoryId),
          }
        );
        setCourses(courseRes?.data || courseRes?.rows || []);
      } catch (error) {
        console.error("Error loading courses:", error);
      } finally {
        setLoading(false);
      }
    })();
  }, [categoryId]);

  const handleNavigate = (courseId: number) => {
    router.push(`/public/courses/${categoryId}/${courseId}`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96 text-gray-600">
        Loading...
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 md:py-12 py-8 md:pb-32 pb-16">
      {/*  Breadcrumb */}
      <div className="flex items-center gap-1 text-sm text-gray-500 mb-6">
        <button
          onClick={() => router.push("/public/home")}
          className="text-gray-500 hover:text-[#1b6dac] flex items-center justify-center"
        >
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
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <path d="M5 12l-2 0l9 -9l9 9l-2 0" />
            <path d="M5 12v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-7" />
            <path d="M9 21v-6a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v6" />
          </svg>
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
          {category?.category_name || "Category"}
        </span>
      </div>

      <h1 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-2">
        {category?.category_name || "Category Name"}
      </h1>
      <p className="text-center text-[#0595d7] font-medium md:mb-10 mb-5">
        {category?.courseType?.type_name || "Courses"}
      </p>

      {courses.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {courses.map((course) => (
            <div
              key={course.course_id}
              onClick={() => handleNavigate(course.course_id)}
              className="bg-gray-100 rounded-2xl overflow-hidden shadow-md hover:shadow-2xl hover:scale-[1.02] transition-all duration-500 cursor-pointer group flex flex-col"
            >
              <div className="relative w-full h-44 flex-shrink-0 overflow-hidden">
                <img
                  src={server_url + course.course_image || "/placeholder.png"}
                  alt={course.course_name}
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              <div className="flex flex-col justify-between flex-grow p-5">
                <div className="flex flex-col">
                  <h3 className="font-bold text-gray-900 text-lg group-hover:text-[#1b6dac] transition-colors line-clamp-2">
                    {course.course_name}
                  </h3>
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {course.course_description || "—"}
                  </p>
                </div>

                <div className="flex justify-between items-center text-blue-600 font-medium mt-auto pt-5">
                  <span className="text-sm text-[#1b6dac] flex items-center gap-1">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="icon icon-tabler icon-tabler-star"
                    >
                      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                      <path d="M12 17.75l-6.172 3.245l1.179 -6.873l-5 -4.867l6.9 -1l3.086 -6.253l3.086 6.253l6.9 1l-5 4.867l1.179 6.873z" />
                    </svg>
                    {course.course_rating ?? 4.5}
                  </span>
                  <span className="text-[#1b6dac] hover:underline text-md">
                    View Details
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex justify-center items-center min-h-[70vh] md:min-h-auto">
          <img src="../../no_data.png" alt="no-data" className="w-92 opacity-40" />
        </div>
      )}
    </div>
  );
}
