"use client";

import { useState, useEffect } from "react";
import ProtectedRoute from "@/components/protectedRoute";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Star,
  BookOpen,
  PlayCircle,
  FileText,
  HelpCircle,
  Menu,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const menuItems = [
  { name: "Dashboard", icon: LayoutDashboard, path: "/admin/protected/dashboard" },
  { name: "Users", icon: Users, path: "/admin/protected/users" },
  {
    name: "Course Management",
    icon: Star,
    children: [
      { name: "Course Tyepes", icon: FileText, path: "/admin/protected/course-types" },
      { name: "Course Categories", icon: FileText, path: "/admin/protected/course-category" },
      { name: "courses", icon: HelpCircle, path: "/admin/protected/courses" },
    ],
  },
  {
    name: "Learning Managament",
    icon: BookOpen,
    children: [
      { name: "current Affairs", icon: FileText, path: "/admin/protected/affairs" },
      { name: "Video Class", icon: PlayCircle, path: "/admin/protected/video-class" },
      { name: "Study Service", icon: FileText, path: "/admin/protected/study-service" },
    ],
  },
  {
    name: "Insights",
    icon: Star,
    children: [
      { name: "Blogs", icon: FileText, path: "/admin/protected/blogs" },
      { name: "Publications", icon: HelpCircle, path: "/admin/protected/publication" },
      { name: "Social Services", icon: FileText, path: "/admin/protected/social-service" },
      { name: "Results", icon: FileText, path: "/admin/protected/results" },
    ],
  },
  {
    name: "Highlights",
    icon: Star,
    children: [
      { name: "Success Stories", icon: FileText, path: "/admin/protected/success-stories" },
      { name: "Testimonials", icon: FileText, path: "/admin/protected/testimonial" },
      { name: "Webinars", icon: HelpCircle, path: "/admin/protected/webinar" },
      { name: "Events", icon: FileText, path: "/admin/protected/events" },
      { name: "News & Updates", icon: FileText, path: "/admin/protected/news-updates" },
    ],
  },
  {
    name: "Rank Mangement",
    icon: Star,
    children: [
      { name: "Rank holders", icon: FileText, path: "/admin/protected/rank-holders" },
      { name: "Toppers", icon: FileText, path: "/admin/protected/topper" },
    ],
  },
  { name: "Enquiry's", icon: Users, path: "/admin/protected/enquiry" },
];

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  // Auto-open parent when a child is active
  useEffect(() => {
    const activeParent = menuItems.find((item) =>
      item.children?.some((child) => pathname.startsWith(child.path))
    );
    if (activeParent) setOpenDropdown(activeParent.name);
  }, [pathname]);

  const toggleSidebar = () => setIsCollapsed(!isCollapsed);
  const toggleDropdown = (name: string) =>
    setOpenDropdown(openDropdown === name ? null : name);

  return (
    <ProtectedRoute>
      <div className="flex min-h-screen bg-gray-50 text-gray-900">
        {/* Mobile Toggle Button */}
        <button
          onClick={() => setMobileOpen(true)}
          className="lg:hidden p-3 fixed top-4 left-4 z-50 bg-cyan-600 text-white rounded-md"
        >
          <Menu size={20} />
        </button>

        {/* Sidebar */}
        <aside
          className={`fixed lg:static min-h-screen top-0 left-0 h-full z-40 bg-cyan-800 text-white transition-all duration-300 
            ${isCollapsed ? "w-20" : "w-64"} 
            ${mobileOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}
        >
          <div className="flex items-center justify-between p-4 border-b border-cyan-700">
            <img
              src="../../ace_landscape.png"
              alt=""
              className={`h-12 ps-8 ${isCollapsed ? "hidden" : "block"}`}
            />
            <img
              src="../../logo_full.png"
              alt=""
              className={`h-8 w-10 ${isCollapsed ? "block" : "hidden"}`}
            />
            <button
              onClick={toggleSidebar}
              className="hidden cursor-pointer lg:block text-cyan-200 hover:text-white"
            >
              {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
            </button>
          </div>

          <nav className="mt-4 space-y-1">
            {menuItems.map((item) => {
              const isActiveParent =
                item.path === pathname ||
                item.children?.some((child) => pathname.startsWith(child.path));

              return item.children ? (
                <div key={item.name}>
                  <button
                    onClick={() => toggleDropdown(item.name)}
                    className={`flex items-center w-full px-4 py-3 text-sm font-medium transition 
                      ${isActiveParent ? "bg-cyan-700" : "hover:bg-cyan-700"}`}
                  >
                    <item.icon size={20} className="mr-3" />
                    {!isCollapsed && <span>{item.name}</span>}
                  </button>
                  {openDropdown === item.name && !isCollapsed && (
                    <div className="ml-8 mt-1 space-y-1">
                      {item.children.map((child) => (
                        <Link
                          href={child.path}
                          key={child.name}
                          className={`block px-3 py-2 rounded-s-lg text-sm transition ${
                            pathname === child.path
                              ? "bg-cyan-600 text-white"
                              : "hover:bg-cyan-700"
                          }`}
                        >
                          {child.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  key={item.name}
                  href={item.path}
                  className={`flex items-center px-4 py-3 text-sm font-medium transition 
                    ${pathname === item.path ? "bg-cyan-600" : "hover:bg-cyan-700"}`}
                >
                  <item.icon size={20} className="mr-3" />
                  {!isCollapsed && <span>{item.name}</span>}
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* Overlay for mobile */}
        {mobileOpen && (
          <div
            className="fixed inset-0 bg-black/40 z-30 lg:hidden"
            onClick={() => setMobileOpen(false)}
          />
        )}

        {/* Main Content */}
        <main className="flex-1 p-6 lg:ml-0 mt-16 lg:mt-0 transition-all">
          {children}
        </main>
      </div>
    </ProtectedRoute>
  );
}
