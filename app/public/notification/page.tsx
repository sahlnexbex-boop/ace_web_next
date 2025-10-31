"use client";
import React, { useEffect, useRef, useState } from "react";
import { Download, ChevronRight } from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { getResults } from "@/lib/api/result";
import Loader from "@/components/loader";

gsap.registerPlugin(ScrollTrigger);

interface ResultItem {
  result_id: number;
  result_title: string;
  result_description: string;
  result_date: string;
  result_type: number | string;
  based_type: number;
  course_id: number;
  category_id: number | null;
  result_file: string | null;
  status: number;
  created_at: string;
  updated_at: string;
  course?: { course_id: number; course_name: string };
  category?: { category_id: number; category_name: string } | null;
}

export default function NotificationsPage() {
  const [activeTab, setActiveTab] = useState<"notifications" | "results">(
    "notifications"
  );
  const [notifications, setNotifications] = useState<ResultItem[]>([]);
  const [results, setResults] = useState<ResultItem[]>([]);
  const [loading, setLoading] = useState(true);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await getResults(1, 10, "", "1");

        const data: ResultItem[] = res?.data?.data || res?.data || [];

        const notifs = data.filter((item) => Number(item.result_type) === 1);
        const resItems = data.filter((item) => Number(item.result_type) === 2);

        setNotifications(notifs);
        setResults(resItems);
      } catch (error) {
        console.error("Error fetching results:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (listRef.current) {
      const cards = listRef.current.querySelectorAll(".notify-card");
      gsap.fromTo(
        cards,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.5, stagger: 0.1, ease: "power3.out" }
      );
    }
  }, [activeTab, notifications, results]);

  useEffect(() => {
    gsap.from(".page-header", {
      opacity: 0,
      y: -20,
      duration: 0.6,
      ease: "power3.out",
    });
  }, []);

  const activeData = activeTab === "notifications" ? notifications : results;

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
              ? "bg-cyan-600 text-white shadow-md"
              : "bg-gray-100 text-gray-700 hover:bg-cyan-50"
          }`}
        >
          Exam Notifications
        </button>
        <button
          onClick={() => setActiveTab("results")}
          className={`cursor-pointer px-5 py-2 rounded-full text-sm font-medium transition-all ${
            activeTab === "results"
              ? "bg-cyan-600 text-white shadow-md"
              : "bg-gray-100 text-gray-700 hover:bg-cyan-50"
          }`}
        >
          Results
        </button>
      </div>

      <div ref={listRef} className="space-y-4">
        {loading ? (
          <Loader />
        ) : activeData.length === 0 ? (
          <div className="flex justify-center items-center min-h-[70vh] md:min-h-auto">
            <img src="../../no_data.png" alt="no data" className="opacity-30" />
          </div>
        ) : (
          activeData.map((item) => (
            <div
              key={item.result_id}
              className="notify-card flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white shadow-sm hover:shadow-md border border-gray-100 rounded-lg p-4 transition-all hover:-translate-y-1"
            >
              <div className="text-left w-full sm:w-auto">
                <h3 className="text-cyan-800 font-semibold text-base md:text-lg">
                  {item.result_title}
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  Published:{" "}
                  {new Date(item.result_date).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}{" "}
                  | {item.course?.course_name || item.category?.category_name || "N/A"}
                </p>
              </div>

              {activeTab === "notifications" ? (
                <a
                  href={`${item.result_file}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="cursor-pointer flex items-center gap-1 mt-3 sm:mt-0 bg-cyan-50 text-cyan-700 hover:bg-cyan-100 font-medium text-sm px-4 py-1.5 rounded-full transition-all"
                >
                  View Details <ChevronRight size={16} />
                </a>
              ) : (
                <a
                  href={item.result_file || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="cursor-pointer flex items-center gap-2 mt-3 sm:mt-0 bg-red-50 text-red-600 hover:bg-red-100 font-medium text-sm px-4 py-1.5 rounded-full transition-all"
                >
                  <Download size={16} /> Download
                </a>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
