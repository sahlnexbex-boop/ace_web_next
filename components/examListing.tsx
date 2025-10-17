"use client";

import React from "react";
import { useRouter } from "next/navigation";

export default function ExamListing() {
  const router = useRouter();

  const exams = [
    { id: 1, name: "ICDS SUPERVISOR" },
    { id: 2, name: "UPSA (MALAPPURAM) 2022" },
    { id: 3, name: "UPSA (PALAKKAD) 2022" },
    { id: 4, name: "UPSA (CALICUT) 2022" },
    { id: 5, name: "UPSA (KANNUR) 2022" },
    { id: 6, name: "UPSA (KASARAGOD) 2022" },
    { id: 7, name: "UPSA (MALAPPURAM) 2022" },
    { id: 8, name: "UPSA (WAYANAD) 2022" },
    { id: 9, name: "LDC (CALICUT) 2022" },
    { id: 10, name: "UPSA (MALAPPURAM) 2022" },
    { id: 11, name: "UPSA (PALAKKAD) 2022" },
    { id: 12, name: "UPSA (CALICUT) 2022" },
  ];

  const handleExamClick = (id: number) => {
    router.push(`/exams/${id}`); 
  };

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

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xxl:grid-cols-5 gap-5 sm:gap-6">
        {exams.map((exam) => (
          <div
            key={exam.id}
            onClick={() => handleExamClick(exam.id)}
            className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 flex flex-col items-center md:items-start justify-center px-5 py-7 border border-gray-100 cursor-pointer hover:-translate-y-1"
          >
            <img
              src="/cup_small.png"
              alt="Trophy"
              className="w-10 h-10 mb-3 object-contain"
            />
            <p className="text-sm text-gray-800 font-medium text-center leading-snug">
              {exam.name}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
