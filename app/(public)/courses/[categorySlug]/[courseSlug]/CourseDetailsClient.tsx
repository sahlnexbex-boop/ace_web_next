"use client";

import { useEffect, useState } from "react";
import { notFound, useRouter } from "next/navigation";
import { Download, FileText } from "lucide-react";
import { getCourseBySlug } from "@/lib/api/course";
import EnquiryModal from "@/components/enquiryModal";
import { CourseDetailsSkeleton } from "@/components/skeltons/skelton";

interface Course {
  course_id: number;
  course_name: string;
  course_description: string;
  course_rating?: number;
  course_duration?: number;
  course_fee?: number;
  course_overview?: string;
  course_syllabus?: string;
  course_study_material?: string;
  course_syllabus_file?: string | null;
  course_questions_file?: string | null;
  course_image?: string;
  course_type?: string;
  category?: {
    category_id: number;
    category_name: string;
  };
}

export default function CourseDetailsClient({
  params,
}: {
  params: { categorySlug: string; courseSlug: string };
}) {
  const router = useRouter();
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [showEnquiryModal, setShowEnquiryModal] = useState(false);
  const server_url = process.env.NEXT_PUBLIC_API_BASE_URL;

  useEffect(() => {
    (async () => {
      try {
        const res = await getCourseBySlug(params.courseSlug);
        setCourse(res?.data || null);
      } catch (error) {
        console.error("Error loading course:", error);
      } finally {
        setLoading(false);
      }
    })();
  }, [params.courseSlug]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  if (loading) {
    return <CourseDetailsSkeleton />;
  }

  if (!course) {
    notFound();
  }

  return (
    <div className="flex flex-col">
      <div
        className="relative text-white md:py-16 py-8 px-6 md:px-12 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: course.course_image
            ? `url(${server_url + course.course_image})`
            : "url('/course_details_background.png')",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-[#0197db]/85 via-[#087fc2]/75 to-[#0c8da6]/85"></div>

        <div className="relative max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-10">
          <div className="md:w-[60%]">
            <div className="text-sm text-white/90 mb-3 flex items-center flex-wrap gap-1">
              <span
                className="hover:underline cursor-pointer"
                onClick={() => router.push("/")}
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
              </span>

              <span>/</span>
              <span
                className="cursor-pointer hover:underline"
                onClick={() => router.push("/courses")}
              >
                Courses
              </span>

              <span>/</span>
              <span
                className="cursor-pointer hover:underline"
                onClick={() =>
                  router.push(`/courses/${params.categorySlug}`)
                }
              >
                {course.category?.category_name || "Category"}
              </span>

              <span>/</span>
              <span className="font-semibold">{course.course_name}</span>
            </div>

            <h1 className="text-2xl md:text-4xl font-bold md:mb-2 mb-4">
              {course.course_name}
            </h1>

            <p className="text-white/90 md:mb-6 ">
              {course.course_description}
            </p>

            <div className="flex items-center gap-2 mb-7">
              <span className="bg-blue-100 px-2 py-1 rounded-full text-sm text-sky-700">
                {(() => {
                  let types: number[] = [];

                  if (Array.isArray(course?.course_type)) {
                    types = course.course_type;
                  } else if (typeof course?.course_type === "string") {
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
            </div>

            <div className="md:w-[60%] w-full bg-white rounded-3xl px-10 py-5 flex flex-col gap-3 items-start">
              <div className="flex flex-wrap md:gap-10 gap-5 mb-3">
                <div>
                  <p className="text-sm text-gray-900">Course Type</p>
                  <p className="font-semibold text-[#087fc2]">
                    {course.category?.category_name || "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-900">Course Duration</p>
                  <p className="font-semibold text-[#087fc2]">
                    {course.course_duration
                      ? `${course.course_duration} Hours`
                      : "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-900">Fee</p>
                  <p className="font-semibold text-[#087fc2]">
                    ₹{course.course_fee ?? "N/A"}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowEnquiryModal(true)}
                className="bg-gradient-to-r from-[#1F67A5] to-[#087fc2] hover:from-[#087fc2] hover:to-[#1F67A5] text-white font-semibold px-6 py-2.5 rounded-lg transition cursor-pointer"
              >
                Enquire Now
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 py-12 grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2">
          <h2 className="text-2xl font-semibold text-[#1F67A5] mb-4">
            Overview
          </h2>
          <p className="text-gray-700 mb-6 leading-relaxed">
            {course.course_overview || "No overview available."}
          </p>

          <h2 className="text-2xl font-semibold text-[#1F67A5] mb-4">
            Syllabus
          </h2>
          <p className="text-gray-700 whitespace-pre-line">
            {course.course_syllabus || "No syllabus available."}
          </p>
        </div>

        <div className="bg-blue-50 rounded-2xl p-6 h-fit">
          <h3 className="text-xl font-bold text-gray-900 mb-4">
            Study Materials
          </h3>
          <p className="text-gray-700 mb-6 leading-relaxed">
            {course.course_study_material ||
              "No study materials information available."}
          </p>

          <h3 className="text-xl font-bold text-gray-900 mb-4">Downloads</h3>
          <div className="space-y-3">
            {course.course_syllabus_file && (
              <a
                href={server_url + course.course_syllabus_file}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between w-full bg-red-100 text-red-600 px-4 py-3 rounded-lg hover:bg-red-200 transition cursor-pointer"
              >
                <span className="flex items-center text-sm md:text-md gap-2">
                  <FileText className="w-5 h-5" /> Download Syllabus (PDF)
                </span>
              </a>
            )}

            {course.course_questions_file && (
              <a
                href={server_url + course.course_questions_file}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between w-full bg-blue-100 text-blue-600 px-4 py-3 rounded-lg hover:bg-blue-200 transition cursor-pointer"
              >
                <span className="flex items-center gap-2 text-sm md:text-md">
                  <Download className="w-5 h-5" /> Previous Year Question Papers
                </span>
              </a>
            )}

            {!course.course_syllabus_file && !course.course_questions_file && (
              <p className="text-gray-500 text-sm">
                No downloadable files available.
              </p>
            )}
          </div>
        </div>
      </div>
      <EnquiryModal
        isOpen={showEnquiryModal}
        onClose={() => setShowEnquiryModal(false)}
        enquiryType={2}
        courseId={course.course_id}
      />
    </div>
  );
}
