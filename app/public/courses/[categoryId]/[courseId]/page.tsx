"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Download, FileText } from "lucide-react";
import { getCourseById } from "@/lib/api/course";
import Loader from "@/components/loader";
import EnquiryModal from "@/components/enquiryModal";

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
  category?: {
    category_id: number;
    category_name: string;
  };
}

export default function CourseDetailsPage({
  params,
}: {
  params: { categoryId: string; courseId: string };
}) {
  const router = useRouter();
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [showEnquiryModal, setShowEnquiryModal] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const res = await getCourseById(Number(params.courseId));
        setCourse(res?.data || null);
      } catch (error) {
        console.error("Error loading course:", error);
      } finally {
        setLoading(false);
      }
    })();
  }, [params.courseId]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const tickMark = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-blue-500"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M7 12l5 5l10 -10" />
      <path d="M2 12l5 5m5 -5l5 -5" />
    </svg>
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh] text-gray-600">
        <Loader />
      </div>
    );
  }

  if (!course) {
    return (
      <div className="flex justify-center items-center h-[60vh] text-gray-600">
        <img src="../../no_data.png" alt="" />
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <div
        className="relative text-white md:py-16 py-8 px-6 md:px-12 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: course.course_image
            ? `url(${course.course_image})`
            : "url('/course_details_background.png')",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-[#0197db]/85 via-[#087fc2]/75 to-[#0c8da6]/85"></div>

        <div className="relative max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-10">
          <div className="md:w-[60%]">
            <div className="text-sm text-white/90 mb-3 flex items-center flex-wrap gap-1">
              <span
                className="hover:underline cursor-pointer"
                onClick={() => router.push("/public/home")}
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
                onClick={() => router.push("/public/courses")}
              >
                Courses
              </span>

              <span>/</span>
              <span
                className="cursor-pointer hover:underline"
                onClick={() =>
                  router.push(`/public/courses/${params.categoryId}`)
                }
              >
                {course.category?.category_name || "Category"}
              </span>

              <span>/</span>
              <span className="font-semibold">{course.course_name}</span>
            </div>

            <div className="flex items-center gap-2 my-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-yellow-200"
              >
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <path d="M12 17.75l-6.172 3.245l1.179 -6.873l-5 -4.867l6.9 -1l3.086 -6.253l3.086 6.253l6.9 1l-5 4.867l1.179 6.873z" />
              </svg>
              <p className="text-yellow-200">{course.course_rating ?? "N/A"}</p>
            </div>

            <h1 className="text-2xl md:text-4xl font-bold md:mb-2 mb-4">
              {course.course_name}
            </h1>

            <p className="text-white/90 md:mb-6 mb-10 ">
              {course.course_description}
            </p>

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
                      ? `${course.course_duration} Days`
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

          {/* <div className="flex-1 hidden md:block">
            {course.course_image && (
              <Image
                src={course.course_image}
                alt={course.course_name}
                width={500}
                height={350}
                className="rounded-2xl shadow-lg object-cover"
              />
            )}
          </div> */}
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
                href={course.course_syllabus_file}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between w-full bg-red-100 text-red-600 px-4 py-3 rounded-lg hover:bg-red-200 transition cursor-pointer"
              >
                <span className="flex items-center gap-2">
                  <FileText className="w-5 h-5" /> Download Syllabus (PDF)
                </span>
              </a>
            )}

            {course.course_questions_file && (
              <a
                href={course.course_questions_file}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between w-full bg-blue-100 text-blue-600 px-4 py-3 rounded-lg hover:bg-blue-200 transition cursor-pointer"
              >
                <span className="flex items-center gap-2">
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
      />
    </div>
  );
}
