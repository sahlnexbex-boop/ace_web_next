"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { Download, FileText } from "lucide-react";

export default function CourseDetailsPage({
  params,
}: {
  params: { categoryId: string; courseId: string };
}) {
  const router = useRouter();
  const courseName = "SSC CGL (Combined Graduate Level Exam)";

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

  return (
    <div className="flex flex-col">
      <div
        className="relative text-white md:py-16 py-8 px-6 md:px-12 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('/course_details_background.png')",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-[#0197db]/85 via-[#087fc2]/75 to-[#0c8da6]/85"></div>

        <div className="relative max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-10">

          <div className="flex-1">
            {/* Breadcrumb */}
            <div className="text-sm text-white/90 mb-10 md:mb-3 flex items-center flex-wrap gap-1">
              <span className="hover:underline cursor-pointer">
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
                  // className="mr-1"
                >
                  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                  <path d="M5 12l-2 0l9 -9l9 9l-2 0" />
                  <path d="M5 12v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-7" />
                  <path d="M9 21v-6a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v6" />
                </svg>
              </span>
              <span
                className="cursor-pointer hover:underline flex items-center"
                onClick={() => router.push("/courses")}
              >
                Courses
              </span>
              <span>/</span>
              <span
                className="cursor-pointer hover:underline"
                onClick={() => router.push(`/courses/${params.categoryId}`)}
              >
                SSC
              </span>
              <span>/</span>
              <span className="font-semibold">{courseName}</span>
            </div>

            <div className="flex gap-2 mt-5">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-star"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M12 17.75l-6.172 3.245l1.179 -6.873l-5 -4.867l6.9 -1l3.086 -6.253l3.086 6.253l6.9 1l-5 4.867l1.179 6.873z" /></svg>
                <p>4.2</p>
            </div>
            <h1 className="text-2xl md:text-4xl font-bold md:mb-2 mb-4">
              {courseName}
            </h1>
            <p className="text-white/90 md:mb-6 mb-10">
              For Group B & C posts in ministries, departments & organizations.
            </p>

            <div className="md:w-[90%] w-full bg-white rounded-3xl px-10 py-5 flex flex-col gap-3 items-start">
            <div className="flex flex-wrap md:gap-10 gap-5">
              <div className="bg-white/20 backdrop-blur-md  rounded-lg">
                <p className="text-sm text-gray-900">Course Type</p>
                <p className="font-semibold text-[#087fc2]">Offline</p>
              </div>
              <div className="bg-white/20 backdrop-blur-md  rounded-lg">
                <p className="text-sm text-gray-900">Course Duration</p>
                <p className="font-semibold text-[#087fc2]">12 months</p>
              </div>
              <div className="bg-white/20 backdrop-blur-md  rounded-lg">
                <p className="text-sm text-gray-900">Fee</p>
                <p className="font-semibold  text-[#087fc2]">₹20,000</p>
              </div>
            </div>

            <button className="bg-gradient-to-r from-[#1F67A5] to-[#087fc2] hover:from-[#087fc2] hover:to-[#1F67A5] text-white font-semibold px-6 py-3 rounded-lg hover:bg-blue-50 transition cursor-pointer">
              Enquire Now
            </button>
            </div>
          </div>

          <div className="flex-1 hidden md:block">
            {/* <Image
              src="/course_detail_banner.jpg"
              alt="Course Banner"
              width={500}
              height={350}
              className="rounded-2xl shadow-lg object-cover"
            /> */}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 py-12 grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2">
          <h2 className="text-2xl font-semibold text-[#1F67A5] mb-4">
            Overview
          </h2>
          <p className="text-gray-700 mb-6 leading-relaxed">
            The SSC CGL course is designed to provide comprehensive guidance for
            candidates preparing for the Combined Graduate Level Examination
            conducted by the Staff Selection Commission. It covers the entire
            syllabus with structured classes, practice tests, and doubt-solving
            sessions.
          </p>

          <h2 className="text-2xl font-semibold text-[#1F67A5] mb-4">
            Syllabus
          </h2>
          <ul className="list-disc list-inside text-gray-700 space-y-2">
            <li>
              Tier I: General Intelligence & Reasoning, General Awareness,
              Quantitative Aptitude, English Comprehension
            </li>
            <li>
              Tier II: Quantitative Abilities, English Language & Comprehension,
              Statistics, General Studies (Finance & Economics)
            </li>
          </ul>
        </div>

        <div className="bg-blue-50 rounded-2xl p-6 h-fit">
          <h3 className="text-xl font-bold text-gray-900 mb-4">
            Study Materials
          </h3>
          <ul className="text-gray-700 space-y-2 mb-6">
            <li className="flex gap-2 items-start">
              {tickMark} Complete SSC CGL Study Modules
            </li>
            <li className="flex gap-2 items-start">
              {tickMark} Topic-wise Practice Questions
            </li>
            <li className="flex gap-2 items-start">
              {tickMark} Mock Tests & Previous Year Papers
            </li>
            <li className="flex gap-2 items-start">
              {tickMark} Doubt Clearing Sessions
            </li>
          </ul>

          <h3 className="text-xl font-bold text-gray-900 mb-4">Download</h3>
          <div className="space-y-3">
            <button className="flex items-center justify-between w-full bg-red-100 text-red-600 px-4 py-3 rounded-lg hover:bg-red-200 transition cursor-pointer">
              <span className="flex items-center gap-2">
                <FileText className="w-5 h-5" /> Download Syllabus (PDF)
              </span>
            </button>

            <button className="flex items-center justify-between w-full bg-blue-100 text-blue-600 px-4 py-3 rounded-lg hover:bg-blue-200 transition cursor-pointer">
              <span className="flex items-center gap-2">
                <Download className="w-5 h-5" /> Previous Year Question Papers
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
