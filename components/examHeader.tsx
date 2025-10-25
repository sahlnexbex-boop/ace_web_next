"use client";
import React from "react";
import { useRouter } from "next/navigation";

export default function ExamHeader() {
  const router = useRouter();

  return (
    <div className="bg-blue-100 w-full overflow-hidden px-6 sm:px-10 py-10 md:h-96 grid grid-cols-1 md:grid-cols-2 items-center">
        
      <div className="flex flex-col justify-center md:px-10 text-center md:text-left">
        {/* Breadcrumb */}
        <div className="text-sm text-gray-900 mb-6 md:mb-20 flex justify-start items-center flex-wrap gap-1">
          <span
            className="hover:text-blue-600 cursor-pointer"
            onClick={() => router.push("/public/home")}
          >
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
              className="inline-block align-middle mr-1"
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
            Exams & Results
          </span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-semibold mb-4">
          Focused Learning,
          <br className="hidden sm:block" />
          Proven <span className="text-[#087fc2]">Success</span>
        </h1>

        <p className="text-gray-700 text-sm sm:text-base leading-relaxed max-w-xl mx-auto md:mx-0">
          Our students have excelled in competitive exams through consistent
          effort and expert mentorship. Be inspired by their accomplishments and
          start shaping your own success story.
        </p>
      </div>

      <div className="flex justify-center items-center mt-8 md:mt-0">
        <img
          src="/cup.png"
          alt="Trophy"
          className="h-48 sm:h-64 md:h-86 object-contain"
        />
      </div>
    </div>
  );
}
