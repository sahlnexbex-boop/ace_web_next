"use client";
import React, { useState } from "react";
import { Download, ChevronRight } from "lucide-react";

export default function NotificationsPage() {
  const [activeTab, setActiveTab] = useState<"notifications" | "results">(
    "notifications"
  );

  const notifications = [
    {
      title: "Semester Exam Notification – March 2025",
      date: "Published: 20 Sep 2025",
      course: "UG - B.Sc",
    },
    {
      title: "Mid-Term Exam Schedule – Feb 2025",
      date: "Published: 10 Feb 2025",
      course: "PG - MBA",
    },
    {
      title: "Entrance Exam Notification – 2025 Batch",
      date: "Published: 13 Jan 2025",
      course: "UG/PG - All Courses",
    },
    {
      title: "Supplementary Exam Notification – April 2025",
      date: "Published: 28 Mar 2025",
      course: "UG - B.Com",
    },
    {
      title: "Practical Exam Timetable – June 2025",
      date: "Published: 15 Jun 2025",
      course: "UG/PG - All Science Streams",
    },
    {
      title: "Online Exam Guidelines – July 2025",
      date: "Published: 05 Jul 2025",
      course: "PG - MCA",
    },
    {
      title: "Revaluation Notification – Aug 2025",
      date: "Published: 08 Aug 2025",
      course: "UG - Arts & Science",
    },
  ];

  const results = [
    {
      title: "Final Year Results – B.Sc Computer Science 2025",
      date: "Published: 15 Sep 2025",
      course: "UG - B.Sc",
    },
    {
      title: "MBA Semester Results – June 2025",
      date: "Published: 09 Jul 2025",
      course: "PG - MBA",
    },
    {
      title: "Entrance Exam Results – 2025 Batch",
      date: "Published: 30 Apr 2025",
      course: "UG/PG - All Courses",
    },
    {
      title: "Supplementary Results – B.Com April 2025",
      date: "Published: 25 May 2025",
      course: "UG - B.Com",
    },
    {
      title: "MCA Final Year Results – July 2025",
      date: "Published: 20 Jul 2025",
      course: "PG - MCA",
    },
  ];

  return (
    <div className="max-w-6xl mx-auto px-5 md:px-10 md:py-14 py-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-gray-600 text-sm mb-6">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-4 h-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0h6" />
        </svg>
        <span>/</span>
        <span>Notifications</span>
      </div>

      <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
        Notifications
      </h1>

      <div className="flex gap-3 mb-8">
        <button
          onClick={() => setActiveTab("notifications")}
          className={`cursor-pointer px-5 py-2 rounded-full text-sm font-medium transition-all ${
            activeTab === "notifications"
              ? "bg-cyan-600 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-cyan-50"
          }`}
        >
          Exam Notifications
        </button>
        <button
          onClick={() => setActiveTab("results")}
          className={`cursor-pointer px-5 py-2 rounded-full text-sm font-medium transition-all ${
            activeTab === "results"
              ? "bg-cyan-600 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-cyan-50"
          }`}
        >
          Results
        </button>
      </div>

      <div className="space-y-4">
        {(activeTab === "notifications" ? notifications : results).map(
          (item, index) => (
            <div
              key={index}
              className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white shadow-sm hover:shadow-md border border-gray-100 rounded-lg p-4 transition-all"
            >
              <div className="text-left w-full sm:w-auto">
                <h3 className="text-cyan-800 font-semibold text-base md:text-lg">
                  {item.title}
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  {item.date} | {item.course}
                </p>
              </div>

              {activeTab === "notifications" ? (
                <button className="cursor-pointer flex items-center gap-1 mt-3 sm:mt-0 bg-cyan-50 text-cyan-700 hover:bg-cyan-100 font-medium text-sm px-4 py-1.5 rounded-full transition-all">
                  View Details <ChevronRight size={16} />
                </button>
              ) : (
                <button className="cursor-pointer flex items-center gap-2 mt-3 sm:mt-0 bg-red-50 text-red-600 hover:bg-red-100 font-medium text-sm px-4 py-1.5 rounded-full transition-all">
                  <Download size={16} /> Download
                </button>
              )}
            </div>
          )
        )}
      </div>
    </div>
  );
}
