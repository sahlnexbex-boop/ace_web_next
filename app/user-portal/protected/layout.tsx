"use client";

import { useState, useEffect, useRef, memo } from "react";
import StudentProtectedRoute from "@/components/studentProtectedRoute";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  BookOpen,
  Video,
  Award,
  Calendar,
  FileText,
  Menu,
  ChevronRight,
  ChevronLeft,
  ChevronUp,
  ChevronDown,
  GraduationCap,
} from "lucide-react";

/* ================= STUDENT MENU ================= */

const studentMenuItems = [
  {
    name: "Dashboard",
    icon: LayoutDashboard,
    path: "/user-portal/protected/dashboard",
  },
  {
    name: "My Exams",
    icon: GraduationCap,
    children: [
      { name: "Registered Exams", icon: BookOpen, path: "/user-portal/protected/my-exams" },
      // { name: "My Courses", icon: BookOpen, path: "/user-portal/protected/courses" },
      // { name: "Video Classes", icon: Video, path: "/user-portal/protected/video-classes" },
      // { name: "Study Materials", icon: FileText, path: "/user-portal/protected/materials" },
    ],
  },
  // {
  //   name: "Achievements",
  //   icon: Award,
  //   path: "/user-portal/protected/achievements",
  // },
  // {
  //   name: "Events",
  //   icon: Calendar,
  //   path: "/user-portal/protected/events",
  // },
];

/* ================= SIDEBAR ================= */

const StudentSidebar = memo(
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

      const activeParent = studentMenuItems.find((item) =>
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
          className={`fixed lg:static top-0 left-0 z-40 bg-gradient-to-b from-cyan-800 to-blue-900 text-white transition-all duration-300 flex flex-col 
          ${isCollapsed ? "w-20" : "w-64"} 
          ${mobileOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}
          style={{ height: "100vh" }}
        >
          {/* Logo */}
          <div className="flex items-center justify-between p-4 border-b border-cyan-700 flex-shrink-0">
            <img
              src="/ace_landscape.png"
              alt="ACE"
              className={`h-12 ps-6 ${isCollapsed ? "hidden" : "block"}`}
            />
            <img
              src="/logo_full.png"
              alt="ACE"
              className={`h-8 w-10 ${isCollapsed ? "block" : "hidden"}`}
            />
            <button
              onClick={toggleSidebar}
              className="hidden lg:block cursor-pointer text-cyan-200 hover:text-white"
            >
              {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
            </button>
          </div>

          {/* Menu */}
          <nav className="mt-4 space-y-1 overflow-y-auto flex-1 custom-scrollbar">
            {studentMenuItems.map((item) => {
              const isActiveParent =
                item.path === pathname ||
                item.children?.some((child) => pathname.startsWith(child.path));

              return item.children ? (
                <div key={item.name}>
                  <button
                    onClick={() => toggleDropdown(item.name)}
                    className={`flex items-center cursor-pointer justify-between w-full px-4 py-3 text-sm font-medium transition 
                    ${isActiveParent ? "bg-cyan-700" : "hover:bg-cyan-700"}`}
                  >
                    <div className="flex items-center">
                      <item.icon size={20} className="mr-3" />
                      {!isCollapsed && <span>{item.name}</span>}
                    </div>
                    {!isCollapsed && (
                      openDropdown === item.name ? (
                        <ChevronUp size={18} />
                      ) : (
                        <ChevronDown size={18} />
                      )
                    )}
                  </button>

                  <div
                    className={`ml-8 mt-1 space-y-1 overflow-hidden transition-all duration-300
                    ${
                      openDropdown === item.name && !isCollapsed
                        ? "max-h-60 opacity-100"
                        : "max-h-0 opacity-0"
                    }`}
                  >
                    {item.children.map((child) => (
                      <Link
                        key={child.name}
                        href={child.path}
                        className={`block px-3 py-2 rounded-s-lg text-sm transition 
                        ${
                          pathname === child.path
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
                  ${pathname === item.path ? "bg-cyan-600" : "hover:bg-cyan-700"}`}
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

StudentSidebar.displayName = "StudentSidebar";

/* ================= LAYOUT ================= */

export default function StudentProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

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
      <StudentSidebar
        pathname={pathname}
        isCollapsed={isCollapsed}
        toggleSidebar={() => setIsCollapsed((p) => !p)}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-6 mt-16 lg:mt-0">
        <StudentProtectedRoute>{children}</StudentProtectedRoute>
      </main>
    </div>
  );
}
