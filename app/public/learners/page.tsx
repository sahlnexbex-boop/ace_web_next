"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Home, FileText, Video, File, Key } from "lucide-react";
import CategoryTabs from "@/components/CategoryTabs";
import CurrentAffairs from "@/components/CurrentAffairs";
import VideoClasses from "@/components/VideoClasses";
import StudyServiceList from "@/components/StudyServiceList";

export default function LearnersPortal() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryType = searchParams.get("type");

  const menuItems = [
    { id: "current", label: "Current Affairs", icon: Home },
    { id: "syllabus", label: "Syllabus", icon: FileText },
    { id: "study", label: "Study Material", icon: File },
    { id: "videos", label: "Video Classes", icon: Video },
    { id: "previous", label: "Previous Papers", icon: File },
    { id: "model", label: "Model Papers", icon: File },
    { id: "answer", label: "Answer Keys", icon: Key },
  ];

  const [activeTab, setActiveTab] = useState<string>(queryType || "current");
  const [activeCategory, setActiveCategory] = useState<number | null>(null);

  useEffect(() => {
    if (queryType && queryType !== activeTab) {
      setActiveTab(queryType);
    }
    if (!queryType) {
      setActiveTab("current");
    }
  }, [queryType]);

  //  Update URL when menu changes
  const handleMenuClick = (id: string) => {
    setActiveTab(id);
    router.push(`/public/learners?type=${id}`, { scroll: false });
  };

  //  Map service_type based on tab
  const serviceTypeMap: Record<string, number> = {
    syllabus: 1,
    study: 2,
    previous: 3,
    model: 4,
    answer: 5,
  };

  const renderContent = () => {
    switch (activeTab) {
      case "current":
        return <CurrentAffairs activeCategory={activeCategory} />;
      case "videos":
        return <VideoClasses activeCategory={activeCategory} />;
      default:
        return (
          <StudyServiceList
            activeCategory={activeCategory}
            serviceType={serviceTypeMap[activeTab]}
          />
        );
    }
  };

  return (
    <div className="bg-blue-50 min-h-screen py-10 px-6 md:px-12">
      {/* Breadcrumb */}
      <div className="text-sm text-gray-600 mb-3">
        <span
          className="hover:text-blue-600 cursor-pointer"
          onClick={() => router.push("/public/home")}
        >
          Home
        </span>{" "}
        / Learners Portal /{" "}
        <span className="font-medium capitalize">
          {menuItems.find((m) => m.id === activeTab)?.label}
        </span>
      </div>

      <h1 className="md:text-3xl text-2xl font-bold text-gray-900 mb-8">
        Learners Portal
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Menu */}
        <div className="md:bg-white md:p-4 p-0 md:rounded-xl md:shadow h-fit overflow-x-auto lg:overflow-visible">
          <ul className="flex lg:flex-col gap-3 lg:gap-2 w-max lg:w-full">
            {menuItems.map(({ id, label, icon: Icon }) => (
              <li key={id}>
                <button
                  onClick={() => handleMenuClick(id)}
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

        {/* Content Area */}
        <div className="lg:col-span-3 transition-all duration-300">
          <CategoryTabs
            activeCategory={activeCategory}
            onCategoryChange={setActiveCategory}
          />
          {renderContent()}
        </div>
      </div>
    </div>
  );
}
