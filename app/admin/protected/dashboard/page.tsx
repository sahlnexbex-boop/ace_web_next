"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  BookOpen,
  Users,
  MessageSquare,
  Briefcase,
  ChevronRight,
  Activity,
  Star,
  Clock,
  LayoutDashboard,
  TrendingUp,
  FileText,
  LogOut
} from "lucide-react";
import { removeToken } from "@/lib/auth";
import { getCourses } from "@/lib/api/course";
import { getEnquiries } from "@/lib/api/enquiry";
import { getReviews } from "@/lib/api/review";
import { getJobApplications } from "@/lib/api/job";

export default function DashboardPage() {
  const router = useRouter();
  const [stats, setStats] = useState({
    courses: 0,
    enquiries: 0,
    reviews: 0,
    applications: 0,
  });

  const [recentCourses, setRecentCourses] = useState<any[]>([]);
  const [recentEnquiries, setRecentEnquiries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const handleLogout = () => {
    try {
      removeToken();
      router.push("/admin/auth/login");
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [courseRes, enquiryRes, reviewRes, appRes] = await Promise.all([
          getCourses(1, 5),
          getEnquiries(1, 5),
          getReviews(1, 1),
          getJobApplications(1, 1),
        ]);

        setStats({
          courses: courseRes?.total || 0,
          enquiries: enquiryRes?.total || 0,
          reviews: reviewRes?.total || 0,
          applications: appRes?.total || 0,
        });

        setRecentCourses(courseRes?.data || []);
        setRecentEnquiries(enquiryRes?.data || []);
      } catch (error) {
        console.error("Failed to load dashboard data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const statCards = [
    {
      title: "Total Courses",
      value: stats.courses,
      icon: BookOpen,
      color: "text-blue-600",
      bg: "bg-blue-100",
      link: "/admin/protected/courses"
    },
    {
      title: "New Enquiries",
      value: stats.enquiries,
      icon: MessageSquare,
      color: "text-cyan-600",
      bg: "bg-cyan-100",
      link: "/admin/protected/enquiry"
    },
    {
      title: "Course Reviews",
      value: stats.reviews,
      icon: Star,
      color: "text-amber-500",
      bg: "bg-amber-100",
      link: "/admin/protected/reviews"
    },
    {
      title: "Job Applications",
      value: stats.applications,
      icon: Briefcase,
      color: "text-purple-600",
      bg: "bg-purple-100",
      link: "/admin/protected/job-applications"
    },
  ];

  if (loading) {
    return (
      <div className="flex h-full min-h-screen items-center justify-center bg-gray-50/50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-700"></div>
      </div>
    );
  }

  return (
    <div className=" w-full space-y-6 animate-in fade-in duration-500">
      <style>{`
        @keyframes wave {
          0% { transform: rotate(0.0deg) }
          10% { transform: rotate(14.0deg) }
          20% { transform: rotate(-8.0deg) }
          30% { transform: rotate(14.0deg) }
          40% { transform: rotate(-4.0deg) }
          50% { transform: rotate(10.0deg) }
          60% { transform: rotate(0.0deg) }
          100% { transform: rotate(0.0deg) }
        }
        .animate-wave {
          animation: wave 2.5s infinite;
          transform-origin: 70% 70%;
          display: inline-block;
        }
      `}</style>

      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 bg-gradient-to-r from-cyan-800 to-cyan-600 p-6 sm:p-8 rounded-3xl text-white shadow-xl shadow-cyan-900/10 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-2 text-cyan-100">
            <LayoutDashboard size={20} />
            <h2 className="font-medium tracking-wide text-sm uppercase">Admin Portal</h2>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold mb-2">
            Welcome Back! <span className="animate-wave">👋</span>
          </h1>
          <p className="text-cyan-50 max-w-xl text-sm sm:text-base leading-relaxed opacity-90">
            Here's what's happening with your institution today. Review your latest courses, manage incoming student enquiries, and track job applications all in one place.
          </p>
        </div>
        <div className="shrink-0 flex items-center md:pt-1">
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold px-5 py-2.5 rounded-xl border border-white/20 transition-all cursor-pointer backdrop-blur-sm shadow-sm"
          >
            <LogOut size={18} /> Logout
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div
              key={idx}
              onClick={() => router.push(card.link)}
              className="bg-white p-6 rounded-2xl shadow-[0px_4px_20px_-4px_rgba(0,0,0,0.05)] border border-gray-100/50 hover:shadow-lg hover:border-cyan-100 hover:-translate-y-1 transition-all duration-300 cursor-pointer group"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`${card.bg} ${card.color} w-12 h-12 rounded-xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-300`}>
                  <Icon size={24} strokeWidth={2.5} />
                </div>
                <div className="bg-gray-50 p-2 rounded-lg group-hover:bg-cyan-50 transition-colors">
                  <TrendingUp size={16} className="text-gray-400 group-hover:text-cyan-600" />
                </div>
              </div>
              <h3 className="text-gray-500 font-medium text-sm mb-1">{card.title}</h3>
              <div className="flex items-end justify-between">
                <p className="text-3xl font-extrabold text-gray-800">{card.value.toLocaleString()}</p>
                <ChevronRight size={18} className="text-gray-300 group-hover:text-cyan-600 translate-x-0 group-hover:translate-x-1 transition-all" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Content Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

        {/* Recent Courses List */}
        <div className="bg-white rounded-3xl shadow-[0px_4px_20px_-4px_rgba(0,0,0,0.05)] border border-gray-100 overflow-hidden flex flex-col">
          <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-white/50 backdrop-blur-sm">
            <div className="flex items-center gap-2">
              <BookOpen className="text-cyan-600" size={20} />
              <h3 className="text-lg font-bold text-gray-800">Recently Added Courses</h3>
            </div>
            <button
              onClick={() => router.push('/admin/protected/courses')}
              className="text-sm cursor-pointer font-semibold text-cyan-600 hover:text-cyan-800 hover:bg-cyan-50 px-3 py-1.5 rounded-lg transition-colors"
            >
              View All
            </button>
          </div>
          <div className="p-4 flex-1">
            {recentCourses.length > 0 ? (
              <div className="space-y-2.5">
                {recentCourses.map((course, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-2.5 hover:bg-gray-50 rounded-xl transition-colors border border-transparent hover:border-gray-100 group">
                    <div className="w-12 h-12 rounded-lg bg-gray-100 overflow-hidden shrink-0 shadow-sm border border-gray-200">
                      {course.course_image ? (
                        <img
                          src={`${process.env.NEXT_PUBLIC_API_BASE_URL}${course.course_image}`}
                          alt={course.course_name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-cyan-50">
                          <BookOpen className="text-cyan-300" size={20} />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0 py-0.5 flex flex-col justify-center">
                      <h4 className="font-bold text-gray-800 text-[13px] truncate pr-2">{course.course_name}</h4>
                      <div className="flex items-center gap-2 mt-1 flex-wrap">
                        <p className="text-[11px] font-medium text-gray-500 shrink-0">{course.category?.category_name || "Uncategorized"}</p>
                        <span className="inline-flex shrink-0 items-center gap-1 text-[10px] font-semibold uppercase tracking-wider bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded">
                          ₹{course.course_fee || '0'}
                        </span>
                        {course.status == 1 ? (
                          <span className="inline-flex shrink-0 items-center gap-1 text-[10px] font-semibold uppercase tracking-wider bg-green-50 text-green-600 border border-green-100 px-1.5 py-0.5 rounded">
                            <span className="w-1 h-1 bg-green-500 rounded-full"></span> Active
                          </span>
                        ) : (
                          <span className="inline-flex shrink-0 items-center gap-1 text-[10px] font-semibold uppercase tracking-wider bg-red-50 text-red-600 border border-red-100 px-1.5 py-0.5 rounded">
                            <span className="w-1 h-1 bg-red-500 rounded-full"></span> Inactive
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="h-full min-h-[250px] flex flex-col items-center justify-center text-gray-400">
                <BookOpen size={48} className="mb-4 opacity-20" />
                <p>No recent courses found.</p>
              </div>
            )}
          </div>
        </div>

        {/* Recent Enquiries */}
        <div className="bg-white rounded-3xl shadow-[0px_4px_20px_-4px_rgba(0,0,0,0.05)] border border-gray-100 overflow-hidden flex flex-col">
          <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-white/50 backdrop-blur-sm">
            <div className="flex items-center gap-2">
              <MessageSquare className="text-pink-600" size={20} />
              <h3 className="text-lg font-bold text-gray-800">Latest Enquiries</h3>
            </div>
            <button
              onClick={() => router.push('/admin/protected/enquiry')}
              className="text-sm cursor-pointer font-semibold text-pink-600 hover:text-pink-800 hover:bg-pink-50 px-3 py-1.5 rounded-lg transition-colors"
            >
              View All
            </button>
          </div>
          <div className="p-4 flex-1">
            {recentEnquiries.length > 0 ? (
              <div className="space-y-2.5">
                {recentEnquiries.map((enq, idx) => {
                  const avatarColors = [
                    "bg-blue-100 text-blue-700 border-blue-200",
                    "bg-purple-100 text-purple-700 border-purple-200",
                    "bg-green-100 text-green-700 border-green-200",
                    "bg-amber-100 text-amber-700 border-amber-200",
                    "bg-pink-100 text-pink-700 border-pink-200",
                    "bg-cyan-100 text-cyan-700 border-cyan-200",
                    "bg-rose-100 text-rose-700 border-rose-200",
                    "bg-indigo-100 text-indigo-700 border-indigo-200",
                  ];
                  const colorClass = avatarColors[idx % avatarColors.length];

                  return (
                    <div key={idx} className="flex flex-col p-3 hover:bg-gray-50 rounded-xl transition-colors border border-gray-100 group">
                      <div className="flex items-start justify-between mb-1.5">
                        <div className="flex items-center gap-2">
                          <div className={`w-7 h-7 rounded-full flex items-center justify-center border shrink-0 ${colorClass}`}>
                            <span className="font-bold text-[10px]">
                              {enq.cstmr_name?.charAt(0)?.toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <h4 className="font-bold text-gray-800 text-[13px] flex items-center gap-2">
                              {enq.cstmr_name || "Unknown"}
                              {enq.status == 0 && (
                                <span className="bg-blue-100 text-blue-700 text-[9px] px-1.5 py-0.5 rounded font-bold uppercase">New</span>
                              )}
                            </h4>
                            <p className="text-xs text-gray-500 flex items-center gap-1">
                              {enq.phone}
                            </p>
                          </div>
                        </div>
                        <div className="text-[10px] text-gray-400 flex items-center gap-1 font-medium bg-gray-50 px-2 py-0.5 rounded-md">
                          <Clock size={10} />
                          {new Date(enq.created_at).toLocaleDateString()}
                        </div>
                      </div>

                      {enq.course?.course_name && (
                        <div className="mt-1 ml-9 flex items-center gap-1.5 bg-cyan-50/50 w-fit px-2 py-0.5 rounded text-[11px] text-cyan-800 border border-cyan-100">
                          <BookOpen size={10} className="text-cyan-600" />
                          <span className="font-medium line-clamp-1">{enq.course.course_name}</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="h-full min-h-[250px] flex flex-col items-center justify-center text-gray-400">
                <MessageSquare size={48} className="mb-4 opacity-20" />
                <p>No recent enquiries found.</p>
              </div>
            )}
          </div>
        </div>

      </div>

    </div>
  );
}
