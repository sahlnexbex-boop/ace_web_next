"use client";

import { useState, useEffect, useRef, memo } from "react";
import ProtectedRoute from "@/components/protectedRoute";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  BookOpen,
  Video,
  Newspaper,
  Award,
  FolderOpen,
  MessageSquare,
  Star,
  Calendar,
  Globe,
  BarChart3,
  FileText,
  HelpCircle,
  PlayCircle,
  Trophy,
  ClipboardList,
  Menu,
  ChevronRight,
  ChevronLeft,
  ChevronUp,
  ChevronDown,
  Fan,
  Home,
} from "lucide-react";

const menuItems = [
  {
    name: "Dashboard",
    icon: LayoutDashboard,
    path: "/admin/protected/dashboard",
  },
  {
    name: "Home",
    icon: Home,
    children: [
      { name: "Users", icon: Users, path: "/admin/protected/users" },
      { name: "Carousel", icon: Fan, path: "/admin/protected/carousel" },
      { name: "Shorts", icon: Fan, path: "/admin/protected/shorts" },
      { name: "Service Carousel", icon: Fan, path: "/admin/protected/service-carousel" },
    ],
  },
  {
    name: "Students",
    icon: Users,
    path: "/admin/protected/students",
  },
  {
    name: "Course Management",
    icon: GraduationCap,
    children: [
      {
        name: "Course Types",
        icon: ClipboardList,
        path: "/admin/protected/course-types",
      },
      {
        name: "Course Categories",
        icon: FolderOpen,
        path: "/admin/protected/course-category",
      },
      { name: "Courses", icon: BookOpen, path: "/admin/protected/courses" },
    ],
  },
  {
    name: "Events & Exams",
    icon: ClipboardList,
    children: [
      {
        name: "Scholarship Exams",
        icon: ClipboardList,
        path: "/admin/protected/scholarship-exam",
      },
      {
        name: "Tuitions",
        icon: BookOpen,
        path: "/admin/protected/tutions",
      },
      {
        name: "Dynamic Events",
        icon: BookOpen,
        path: "/admin/protected/dynamic-events",
      },
    ],
  },
  {
    name: "Learning Management",
    icon: BookOpen,
    children: [
      {
        name: "Current Affairs",
        icon: Newspaper,
        path: "/admin/protected/affairs",
      },
      {
        name: "Video Class",
        icon: PlayCircle,
        path: "/admin/protected/video-class",
      },
      {
        name: "Study Service",
        icon: FileText,
        path: "/admin/protected/study-service",
      },
    ],
  },
  {
    name: "Insights",
    icon: BarChart3,
    children: [
      { name: "Blogs", icon: Globe, path: "/admin/protected/blogs" },
      {
        name: "Publications",
        icon: BookOpen,
        path: "/admin/protected/publication",
      },
      {
        name: "Social Services",
        icon: MessageSquare,
        path: "/admin/protected/social-service",
      },
      { name: "Results", icon: Award, path: "/admin/protected/results" },
    ],
  },
  {
    name: "Highlights",
    icon: Star,
    children: [
      {
        name: "Success Stories",
        icon: Trophy,
        path: "/admin/protected/success-stories",
      },
      {
        name: "Testimonials",
        icon: MessageSquare,
        path: "/admin/protected/testimonial",
      },
      { name: "Webinars", icon: Video, path: "/admin/protected/webinar" },
      { name: "Events", icon: Calendar, path: "/admin/protected/events" },
      {
        name: "News & Updates",
        icon: Newspaper,
        path: "/admin/protected/news-updates",
      },
    ],
  },
  {
    name: "Rank Management",
    icon: Award,
    children: [
      {
        name: "Rank Holders",
        icon: Trophy,
        path: "/admin/protected/rank-holders",
      },
      {
        name: "Rank Holders Forum",
        icon: Trophy,
        path: "/admin/protected/rank-forum",
      },
      { name: "Toppers", icon: GraduationCap, path: "/admin/protected/topper" },
    ],
  },
  {
    name: "Enquiry's",
    icon: HelpCircle,
    children: [
      {
        name: "Direct Enquiry's",
        icon: Trophy,
        path: "/admin/protected/enquiry",
      },
      {
        name: "Events Enquiry's",
        icon: Trophy,
        path: "/admin/protected/event-enquiry",
      },
      {
        name: "Online Registartions",
        icon: GraduationCap,
        path: "/admin/protected/online-registration",
      },
      {
        name: "Exam Registartions",
        icon: GraduationCap,
        path: "/admin/protected/exam-enquiry",
      },
      {
        name: "Tuitions Enquiry's",
        icon: Trophy,
        path: "/admin/protected/tution-registration",
      },

    ],
  },
];

//  Sidebar Component
const Sidebar = memo(
  ({
    pathname,
    isCollapsed,
    toggleSidebar,
    mobileOpen,
    setMobileOpen,
  }: {
    pathname: string;
    isCollapsed: boolean;
    toggleSidebar: () => void;
    mobileOpen: boolean;
    setMobileOpen: (v: boolean) => void;
  }) => {
    const [openDropdown, setOpenDropdown] = useState<string | null>(null);
    const lastPathRef = useRef(pathname);

    useEffect(() => {
      if (lastPathRef.current === pathname) return;
      lastPathRef.current = pathname;
      const activeParent = menuItems.find((item) =>
        item.children?.some((child) => pathname.startsWith(child.path))
      );
      if (activeParent) setOpenDropdown(activeParent.name);
    }, [pathname]);

    const toggleDropdown = (name: string) => {
      setOpenDropdown((prev) => (prev === name ? null : name));
    };

    return (
      <>
        <aside
          className={`fixed lg:static top-0 left-0 z-40 bg-cyan-800 text-white transition-all duration-300 flex flex-col 
            ${isCollapsed ? "w-20" : "w-64"} 
            ${mobileOpen ? "translate-x-0" : "-translate-x-full"
            } lg:translate-x-0`}
          style={{ height: "100vh" }}
        >
          {/* Logo */}
          <div className="flex items-center justify-between p-4 border-b border-cyan-700 flex-shrink-0">
            <img
              src="/ace_landscape.png"
              alt=""
              className={`h-12 ps-8 ${isCollapsed ? "hidden" : "block"}`}
            />
            <img
              src="/logo_full.png"
              alt=""
              className={`h-8 w-10 ${isCollapsed ? "block" : "hidden"}`}
            />
            <button
              onClick={toggleSidebar}
              className="hidden cursor-pointer lg:block text-cyan-200 hover:text-white"
            >
              {isCollapsed ? (
                <ChevronRight size={20} />
              ) : (
                <ChevronLeft size={20} />
              )}
            </button>
          </div>

          {/* Scrollable Menu */}
          <nav className="mt-4 space-y-1 overflow-y-auto flex-1 no-scrollbar">
            {menuItems.map((item) => {
              const isActiveParent =
                item.path === pathname ||
                item.children?.some((child) => pathname.startsWith(child.path));

              return item.children ? (
                <div key={item.name}>
                  <button
                    onClick={() => toggleDropdown(item.name)}
                    className={`flex items-center justify-between w-full px-4 py-3 text-sm font-medium transition 
                      ${isActiveParent ? "bg-cyan-700" : "hover:bg-cyan-700"}`}
                  >
                    <div className="flex items-center">
                      <item.icon size={20} className="mr-3" />
                      {!isCollapsed && <span>{item.name}</span>}
                    </div>
                    {!isCollapsed && (
                      <span className="cursor-pointer">
                        {openDropdown === item.name ? (
                          <ChevronUp size={18} />
                        ) : (
                          <ChevronDown size={18} />
                        )}
                      </span>
                    )}
                  </button>

                  <div
                    className={`ml-8 mt-1 space-y-1 overflow-hidden transition-[max-height,opacity] duration-300 ease-in-out ${openDropdown === item.name && !isCollapsed
                      ? "max-h-60 opacity-100"
                      : "max-h-0 opacity-0"
                      }`}
                  >
                    {item.children.map((child) => (
                      <Link
                        href={child.path}
                        key={child.name}
                        className={`block px-3 py-2 rounded-s-lg text-sm transition ${pathname === child.path
                          ? "bg-cyan-600 text-white"
                          : "hover:bg-cyan-700"
                          }`}
                      >
                        {child.name}
                      </Link>
                    ))}
                  </div>
                </div>
              ) : (
                <Link
                  key={item.name}
                  href={item.path}
                  className={`flex items-center px-4 py-3 text-sm font-medium transition 
                    ${pathname === item.path
                      ? "bg-cyan-600"
                      : "hover:bg-cyan-700"
                    }`}
                >
                  <item.icon size={20} className="mr-3" />
                  {!isCollapsed && <span>{item.name}</span>}
                </Link>
              );
            })}
          </nav>
        </aside>

        {mobileOpen && (
          <div
            className="fixed inset-0 bg-black/40 z-30 lg:hidden"
            onClick={() => setMobileOpen(false)}
          />
        )}
      </>
    );
  }
);

Sidebar.displayName = "Sidebar";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const toggleSidebar = () => setIsCollapsed((prev) => !prev);

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 text-gray-900">
      {/* Mobile Toggle */}
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden p-3 fixed top-4 left-4 z-50 bg-cyan-600 text-white rounded-md"
      >
        <Menu size={20} />
      </button>

      {/* Sidebar */}
      <Sidebar
        pathname={pathname}
        isCollapsed={isCollapsed}
        toggleSidebar={toggleSidebar}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      {/* Main Content Scrollable */}
      <main className="flex-1 overflow-y-auto p-6 mt-16 lg:mt-0 lg:ml-0">
        <ProtectedRoute>{children}</ProtectedRoute>
      </main>
    </div>
  );
}
