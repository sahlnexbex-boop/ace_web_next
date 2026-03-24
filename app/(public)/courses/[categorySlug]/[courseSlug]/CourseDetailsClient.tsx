"use client";

import { useEffect, useState } from "react";
import { notFound, useRouter } from "next/navigation";
import { Download, FileText, ChevronDown, Lock, Play, PlayCircle, Eye } from "lucide-react";
import { getCourseBySlug } from "@/lib/api/course";
import EnquiryModal from "@/components/enquiryModal";
import VideoModal from "@/components/videoModal";
import { CourseDetailsSkeleton } from "@/components/skeltons/skelton";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

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
  modules?: Array<{
    module_id: number;
    module_name: string;
    chapters?: Array<{
      chapter_id: number;
      chapter_name: string;
      is_preview: number;
      preview_url?: string;
    }>;
  }>;
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

  const [openVideo, setOpenVideo] = useState<{ id: string } | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await getCourseBySlug(params.courseSlug, true, true);
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
          <p className="text-gray-700 whitespace-pre-line mb-10 overflow-hidden text-ellipsis">
            {course.course_syllabus || "No syllabus available."}
          </p>

          <h2 className="text-2xl font-semibold text-[#1F67A5] mb-6">
            Curriculum
          </h2>
          <Accordion type="multiple" className="space-y-4" defaultValue={["item-0"]}>
            {course.modules?.map((mod, mIdx) => (
              <AccordionItem key={mIdx} value={`item-${mIdx}`} className="border border-gray-100 rounded-2xl overflow-hidden shadow-sm bg-white transition-all duration-300 hover:shadow-md border-b-0 space-y-0">
                <AccordionTrigger
                  className="w-full flex items-center justify-between p-3.5 md:p-5 text-left transition-all cursor-pointer hover:no-underline [&[data-state=open]]:bg-cyan-50/50 [&[data-state=open]_svg.acc-icon]:rotate-180"
                  hideChevron
                >
                  <div className="flex items-center gap-2 md:gap-3 flex-1 min-w-0 pr-2">
                    <h3 className="font-bold text-gray-700 transition-colors text-sm md:text-base leading-tight">
                      {mod.module_name || `Module ${mIdx + 1}`}
                    </h3>
                  </div>
                  <div className="flex items-center gap-2 md:gap-4 shrink-0">
                    <span className="text-[9px] md:text-xs font-bold text-gray-700 uppercase tracking-widest bg-gray-50 px-2 md:px-3 py-1 rounded-full border border-gray-100 flex items-center gap-1">
                      {mod.chapters?.length || 0} <span className="md:inline">Chapters</span>
                    </span>
                    <ChevronDown className="text-gray-400 size-4 md:size-5 shrink-0 transition-transform duration-300 acc-icon" />
                  </div>
                </AccordionTrigger>

                <AccordionContent className="px-3 md:px-5 pb-5 pt-1 space-y-2">
                  {mod.chapters?.map((chap, cIdx) => (
                    <div key={cIdx} className="flex items-center justify-between p-2.5 md:p-3.5 border-b border-gray-50 last:border-0 hover:bg-gray-50/80 rounded-xl group transition-all">
                      <div className="flex items-center gap-2.5 md:gap-3.5 flex-1 min-w-0 pr-2 md:pr-4">
                        {chap.is_preview === 1 ? (
                          <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-cyan-100 text-cyan-600 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition shadow-sm">
                            <PlayCircle size={14} fill="currentColor" className="text-cyan-600/20 md:text-lg" />
                          </div>
                        ) : (
                          <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-gray-100 text-gray-400 flex items-center justify-center flex-shrink-0">
                            <Lock size={12} className="md:text-lg" />
                          </div>
                        )}
                        <span className="text-xs md:text-[15px] font-medium text-gray-600 truncate group-hover:text-gray-900 leading-tight">
                          {chap.chapter_name}
                        </span>
                      </div>

                      {chap.is_preview === 1 && chap.preview_url ? (
                        <button
                          type="button"
                          onClick={() => setOpenVideo({ id: chap.preview_url! })}
                          className="flex items-center gap-1.5 px-3 md:px-4 py-1.5 md:py-2 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-lg text-xs font-bold hover:shadow-lg active:scale-95 transition shadow-sm whitespace-nowrap cursor-pointer"
                        >
                          <Eye size={12} className="md:text-lg" /> <span className="hidden md:inline">Preview</span> <Play size={10} fill="currentColor" className="md:block hidden" />
                          <Play size={10} fill="currentColor" className="md:hidden" />
                        </button>
                      ) : (
                        <span className="text-[10px] md:text-[10px] font-bold text-gray-700 grayscale select-none opacity-60">Locked <span className="hidden md:inline">content</span></span>
                      )}
                    </div>
                  ))}
                  {(!mod.chapters || mod.chapters.length === 0) && (
                    <div className="py-8 text-center bg-gray-50/50 rounded-xl border border-dashed text-sm text-gray-400 font-medium">
                      Content coming soon to this module.
                    </div>
                  )}
                </AccordionContent>
              </AccordionItem>
            ))}

            {(!course.modules || course.modules.length === 0) && (
              <div className="bg-gray-50/50 rounded-3xl p-16 text-center border-2 border-dashed border-gray-100 shadow-inner">
                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 border shadow-sm text-gray-400">
                  <FileText size={32} />
                </div>
                <p className="text-gray-500 font-medium">Curriculum is currently being finalized.</p>
                <p className="text-xs text-gray-400 mt-1 italic">Stay tuned for the full roadmap updates!</p>
              </div>
            )}
          </Accordion>
        </div>

        <div className="lg:sticky lg:top-24 h-fit">
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
      <VideoModal
        isOpen={!!openVideo}
        videoId={openVideo?.id || ""}
        onClose={() => setOpenVideo(null)}
      />
    </div>
  );
}
