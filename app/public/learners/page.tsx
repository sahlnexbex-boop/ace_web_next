"use client";

import { useState } from "react";
import { Home, Book, FileText, Video, File, Key } from "lucide-react";
import { useRouter } from "next/navigation";
import VideoModal from "@/components/videoModal";

export default function LearnersPortal() {
  const router = useRouter();

  const menuItems = [
    { id: "current", label: "Current Affairs", icon: Home },
    { id: "publications", label: "Publications", icon: Book },
    { id: "syllabus", label: "Syllabus", icon: FileText },
    { id: "study", label: "Study Material", icon: File },
    { id: "videos", label: "Video Classes", icon: Video },
    { id: "previous", label: "Previous Papers", icon: File },
    { id: "model", label: "Model Papers", icon: File },
    { id: "answer", label: "Answer Keys", icon: Key },
  ];

  const [activeTab, setActiveTab] = useState("current");

  type Category = "All" | "Kerala PSC" | "HSA" | "HSST" | "KTET" | "LPUP";

  const categories: Category[] = [
    "All",
    "Kerala PSC",
    "HSA",
    "HSST",
    "KTET",
    "LPUP",
  ];

  const [activeCategory, setActiveCategory] = useState<Category>("All");

  // 🎬 Video Modal State
  const [videoUrl, setVideoUrl] = useState<string>("");
  const [isVideoOpen, setIsVideoOpen] = useState(false);

  const renderCategoryTabs = () => (
    <div className="flex flex-wrap gap-3 mb-6 overflow-x-auto pb-2 md:pb-0">
      {categories.map((cat) => (
        <button
          key={cat}
          onClick={() => setActiveCategory(cat)}
          className={`px-5 py-2 rounded-full text-sm font-medium whitespace-nowrap transition ${
            activeCategory === cat
              ? "bg-[#087fc2] text-white"
              : "bg-white text-gray-700 border border-gray-200 hover:bg-blue-50"
          }`}
        >
          {cat}
        </button>
      ))}
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case "current": {
        const currentAffairs = [
          { id: 1, title: "January 2025 Current Affairs", published: "Jan 15, 2025" },
          { id: 2, title: "February 2025 Current Affairs", published: "Feb 18, 2025" },
          { id: 3, title: "March 2025 Current Affairs", published: "Mar 12, 2025" },
          { id: 4, title: "April 2025 Current Affairs", published: "Apr 10, 2025" },
          { id: 5, title: "May 2025 Current Affairs", published: "May 20, 2025" },
        ];

        return (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {currentAffairs.map((item) => (
              <div
                key={item.id}
                className="bg-white p-5 rounded-2xl shadow hover:shadow-lg transition"
              >
                <h3 className="font-semibold text-gray-800">{item.title}</h3>
                <p className="text-sm text-[#087fc2]">
                  Published: {item.published}
                </p>
                <div className="w-full flex justify-end px-3">
                  <button
                    onClick={() => router.push(`/public/learners/affaires/${item.id}`)}
                    className="border mt-5 rounded-full border-black p-1 hover:bg-gray-100 transition cursor-pointer"
                    aria-label="View Current Affair"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                      <path d="M5 12l14 0" />
                      <path d="M13 18l6 -6" />
                      <path d="M13 6l6 6" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        );
      }

      case "publications": {
        const publications = [
          { id: 1, title: "General Knowledge Guide 2025", author: "ABC Publishers" },
          { id: 2, title: "History of India", author: "XYZ Publishers" },
          { id: 3, title: "Quantitative Aptitude Made Easy", author: "R.S. Sharma" },
          { id: 4, title: "English Grammar Essentials", author: "Bright Academy" },
          { id: 5, title: "Current Affairs Yearly 2025", author: "EduWorld" },
          { id: 6, title: "Indian Polity Handbook", author: "M. Krishnan" },
        ];

        return (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {publications.map((p) => (
              <div
                key={p.id}
                className="bg-white p-5 rounded-xl shadow hover:shadow-lg transition flex flex-col justify-between"
              >
                <div>
                  <h3 className="font-semibold text-gray-800">{p.title}</h3>
                  <p className="text-sm text-[#0c8da6] mt-1 mb-2">By {p.author}</p>
                </div>
                <button
                  onClick={() => router.push(`/public/learners/publications/${p.id}`)}
                  className="mt-4 bg-gradient-to-r from-[#087fc2] to-[#1F67A5] text-white cursor-pointer px-4 py-2 rounded-lg hover:opacity-90 transition"
                >
                  View
                </button>
              </div>
            ))}
          </div>
        );
      }

      case "syllabus": {
        const syllabusData = {
          All: [
            { title: "KPSC Syllabus", info: "Updated 2025" },
            { title: "SSC CGL Syllabus", info: "2025 Exam Cycle" },
            { title: "Banking Syllabus", info: "IBPS & SBI Exams" },
          ],
          "Kerala PSC": [{ title: "KPSC Syllabus", info: "Updated 2025" }],
          HSA: [{ title: "HSA Syllabus", info: "2025 Revision" }],
          HSST: [{ title: "HSST Syllabus", info: "Latest 2025" }],
          KTET: [{ title: "KTET Syllabus", info: "Updated 2025" }],
          LPUP: [{ title: "LPUP Syllabus", info: "New Pattern 2025" }],
        };

        const list =
          activeCategory === "All"
            ? Object.values(syllabusData).flat()
            : syllabusData[activeCategory];

        return (
          <>
            {renderCategoryTabs()}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {list.map((item, i) => (
                <div
                  key={i}
                  className="bg-[#fde8e8] p-6 rounded-2xl shadow-sm hover:shadow-md transition"
                >
                  <div className="flex flex-col items-start">
                    <img src="/pdf.png" alt="" className="mb-2" />
                    <h3 className="font-semibold text-gray-800 text-lg">
                      {item.title}
                    </h3>
                    <p className="text-sm text-gray-500 mb-3">{item.info}</p>
                    <button className="bg-white text-gray-900 font-medium px-5 py-2 rounded-2xl cursor-pointer border border-gray-300 hover:bg-gray-100 transition w-full">
                      Download
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        );
      }

      case "study": {
        const studyData = {
          All: [
            { title: "Quantitative Aptitude Notes" },
            { title: "Reasoning Ability Guide" },
          ],
          "Kerala PSC": [{ title: "PSC Maths Notes" }],
          HSA: [{ title: "HSA Subject Notes" }],
          HSST: [{ title: "HSST Reference Notes" }],
          KTET: [{ title: "KTET Preparation Notes" }],
          LPUP: [{ title: "LPUP Notes" }],
        };

        const list =
          activeCategory === "All"
            ? Object.values(studyData).flat()
            : studyData[activeCategory];

        return (
          <>
            {renderCategoryTabs()}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
              {list.map((m, i) => (
                <div
                  key={i}
                  className="bg-red-50 p-5 rounded-xl shadow hover:shadow-lg transition"
                >
                  <img src="/pdf.png" alt="" className="mb-2" />
                  <h4 className="font-medium text-gray-800 mb-3">{m.title}</h4>
                  <button className="bg-white text-gray-900 font-medium px-5 py-2 rounded-2xl cursor-pointer border border-gray-300 hover:bg-gray-100 transition w-full">
                    Download
                  </button>
                </div>
              ))}
            </div>
          </>
        );
      }

      case "videos": {
        const videoData = {
          All: [
            {
              title: "KTET Marathon | Full Session",
              url: "https://www.youtube.com/watch?v=8EN71MtvFNk",
            },
            {
              title: "HSA Final Touch",
              url: "https://www.youtube.com/watch?v=8EN71MtvFNk",
            },
          ],
          "Kerala PSC": [
            { title: "KPSC Orientation Class", url: "https://www.youtube.com/watch?v=8EN71MtvFNk" },
          ],
          HSA: [
            { title: "HSA Crash Course", url: "https://www.youtube.com/watch?v=8EN71MtvFNk" },
          ],
          HSST: [
            { title: "HSST Model Class", url: "https://www.youtube.com/watch?v=8EN71MtvFNk" },
          ],
          KTET: [
            { title: "KTET 2025 Full Session", url: "https://www.youtube.com/watch?v=8EN71MtvFNk" },
          ],
          LPUP: [
            { title: "LPUP Quick Review", url: "https://www.youtube.com/watch?v=8EN71MtvFNk0" },
          ],
        };

        const list =
          activeCategory === "All"
            ? Object.values(videoData).flat()
            : videoData[activeCategory];

        return (
          <>
            {renderCategoryTabs()}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-7 gap-x-10">
              {list.map((v, i) => (
                <div
                  key={i}
                  className="bg-white rounded-xl shadow hover:shadow-lg overflow-hidden transition cursor-pointer"
                  onClick={() => {
                    setVideoUrl(v.url);
                    setIsVideoOpen(true);
                  }}
                >
                  <img
                    src={`/video_thumb_${i + 1}.png`}
                    alt={v.title}
                    className="w-full h-40 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-800">{v.title}</h3>
                    <p className="text-sm text-gray-500 mt-2">August 2025</p>
                  </div>
                </div>
              ))}
            </div>
          </>
        );
      }

      default: {
        const commonData = {
          previous: {
            All: [
              "KPSC 2023 Question Paper",
              "SSC CGL 2022 Paper",
              "Bank Clerk 2024 Paper",
            ],
            "Kerala PSC": ["KPSC 2023 Question Paper"],
            HSA: ["HSA 2024 Paper"],
            HSST: ["HSST 2024 Paper"],
            KTET: ["KTET 2024 Paper"],
            LPUP: ["LPUP 2024 Paper"],
          },
          model: {
            All: ["General Studies Model Paper", "Quantitative Aptitude Model Paper"],
            "Kerala PSC": ["KPSC Model Paper"],
            HSA: ["HSA Model Paper"],
            HSST: ["HSST Model Paper"],
            KTET: ["KTET Model Paper"],
            LPUP: ["LPUP Model Paper"],
          },
          answer: {
            All: [
              "KPSC 2023 Answer Key",
              "SSC 2022 Answer Key",
              "Banking 2023 Answer Key",
            ],
            "Kerala PSC": ["KPSC Answer Key"],
            HSA: ["HSA Answer Key"],
            HSST: ["HSST Answer Key"],
            KTET: ["KTET Answer Key"],
            LPUP: ["LPUP Answer Key"],
          },
        };

        const data = commonData[activeTab as keyof typeof commonData];
        const list =
          activeCategory === "All"
            ? Object.values(data).flat()
            : data[activeCategory];

        return (
          <>
            {renderCategoryTabs()}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-7">
              {list.map((item, i) => (
                <div
                  key={i}
                  className="bg-red-50 p-5 rounded-xl shadow hover:shadow-lg transition"
                >
                  <img src="/pdf.png" alt="" className="mb-2" />
                  <h4 className="font-medium text-gray-800 mb-3">{item}</h4>
                  <button className="bg-white text-gray-900 font-medium px-5 py-2 rounded-2xl cursor-pointer border border-gray-300 hover:bg-gray-100 transition w-full">
                    Download
                  </button>
                </div>
              ))}
            </div>
          </>
        );
      }
    }
  };

  return (
    <div className="bg-blue-50 min-h-screen py-10 px-6 md:px-12">
      {/* Breadcrumb */}
      <div className="text-sm text-gray-600 md:mb-3 mb-2">
        <span
          className="hover:text-blue-600 cursor-pointer"
          onClick={() => router.push("/public/home")}
        >
          Home
        </span>{" "}
        / Learners Portal /{" "}
        <span className="text-gray-800 font-medium capitalize">
          {menuItems.find((m) => m.id === activeTab)?.label}
        </span>
      </div>

      <h1 className="md:text-3xl text-2xl font-bold text-gray-900 md:mb-8 mb-5">
        Learners Portal
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="md:bg-white md:p-4 p-0 md:rounded-xl md:shadow h-fit overflow-x-auto lg:overflow-visible">
          <ul className="flex lg:flex-col gap-3 lg:gap-2 w-max lg:w-full">
            {menuItems.map(({ id, label, icon: Icon }) => (
              <li key={id}>
                <button
                  onClick={() => {
                    setActiveTab(id);
                    setActiveCategory("All");
                  }}
                  className={`flex w-full items-center gap-3 px-4 py-2 rounded-lg text-left transition cursor-pointer whitespace-nowrap ${
                    activeTab === id
                      ? "bg-gradient-to-r from-[#1F67A5] to-[#087fc2] text-white"
                      : "text-gray-700 hover:bg-blue-200"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="lg:col-span-3">{renderContent()}</div>
      </div>

      <VideoModal
        videoUrl={videoUrl}
        isOpen={isVideoOpen}
        onClose={() => setIsVideoOpen(false)}
      />
    </div>
  );
}
