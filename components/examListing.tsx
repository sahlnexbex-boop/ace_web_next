"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getCourses } from "@/lib/api/course";
import { getCourseCategories } from "@/lib/api/courseCategory";

export default function ExamListing() {
  const router = useRouter();

  const [categories, setCategories] = useState<any[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catRes, courseRes] = await Promise.all([
          getCourseCategories(1, 10, "", { status: "1" }),
          getCourses(1, 10, "", { status: "1" }),
        ]);

        const catData = catRes?.data || [];
        const courseData = courseRes?.data || [];

        setCategories(catData);
        setCourses(courseData);
      } catch (err) {
        console.error("Error fetching exam data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleItemClick = (id: number, type: "category" | "course") => {
    router.push(`/public/exams/${id}?type=${type}`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <p className="text-gray-500 text-lg">Loading exams...</p>
      </div>
    );
  }

  const hasData = categories.length > 0 || courses.length > 0;

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
          Competitive Cracker has guided over <strong>50,000 students</strong>{" "}
          to achieve remarkable results in competitive exams.
        </p>
      </div>

      {hasData ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xxl:grid-cols-5 gap-5 sm:gap-6">
          {categories.map((cat) => (
            <div
              key={`category-${cat.category_id}`}
              onClick={() => handleItemClick(cat.category_id, "category")}
              className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 flex flex-col items-center md:items-start justify-center px-5 py-7 border border-gray-100 cursor-pointer hover:-translate-y-1"
            >
              <img
                src="/cup_small.png"
                alt="Trophy"
                className="w-10 h-10 mb-3 object-contain"
              />
              <p className="text-sm text-gray-800 font-medium text-center leading-snug">
                {cat.category_name}
              </p>
            </div>
          ))}

          {courses.map((course) => (
            <div
              key={`course-${course.course_id}`}
              onClick={() => handleItemClick(course.course_id, "course")}
              className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 flex flex-col items-center md:items-start justify-center px-5 py-7 border border-gray-100 cursor-pointer hover:-translate-y-1"
            >
              <img
                src="/cup_small.png"
                alt="Trophy"
                className="w-10 h-10 mb-3 object-contain"
              />
              <p className="text-sm text-gray-800 font-medium text-center leading-snug">
                {course.course_name}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500 text-lg py-10">
          No exams or categories available.
        </p>
      )}
    </div>
  );
}
