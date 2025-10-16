"use client";

import React from "react";

export default function ExamListing() {
  const exams = [
    "ICDS SUPERVISOR",
    "UPSA (MALAPPURAM) 2022",
    "UPSA (PALAKKAD) 2022",
    "UPSA (CALICUT) 2022",
    "UPSA (KANNUR) 2022",
    "UPSA (KASARAGOD) 2022",
    "UPSA (MALAPPURAM) 2022",
    "UPSA (WAYANAD) 2022",
    "LDC (CALICUT) 2022",
    "UPSA (MALAPPURAM) 2022",
    "UPSA (PALAKKAD) 2022",
    "UPSA (CALICUT) 2022",
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 md:py-16 py-8">
      {/* Section Title */}
      <div className="text-center mb-10">
        <div className="relative mb-8 flex justify-center">
          <h2 className="text-2xl md:text-4xl font-bold text-center text-gray-900">
            E-Learning Excellence, Proven OutComes
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

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xxl:grid-cols-5 gap-5 sm:gap-6">
        {exams.map((exam, index) => (
          <div
            key={index}
            className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 flex flex-col items-center md:items-start justify-center px-5 py-7 border border-gray-100 cursor-pointer"
          >
            <img
              src="/cup_small.png"
              alt="Trophy"
              className="w-10 h-10 mb-3 object-contain"
            />
            <p className="text-sm text-gray-800 font-medium text-center leading-snug">
              {exam}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
