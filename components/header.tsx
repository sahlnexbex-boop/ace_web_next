"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Menu,
  X,
  ChevronDown,
  Home,
  BookOpen,
  GraduationCap,
  FileText,
  Star,
  Info,
  Phone,
  Lightbulb,
} from "lucide-react";
import { gsap } from "gsap";
import { getCourseCategories } from "@/lib/api/courseCategory";
import { slugify } from "@/lib/slugify";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openAccordion, setOpenAccordion] = useState<string | null>(null);
  const [hoveredMenu, setHoveredMenu] = useState<string | null>(null);
  const [courseList, setCourseList] = useState<{ name: string; href: string }[]>([]);

  const menuRef = useRef<HTMLDivElement | null>(null);
  const overlayRef = useRef<HTMLDivElement | null>(null);

  const router = useRouter();
  const pathname = usePathname();

  /*  FETCH COURSE CATEGORIES - first 5 */
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getCourseCategories(1, 5, "", { status: "1" });

        if (response?.data) {
          const formatted = response.data.map((cat: any) => ({
            name: cat.category_name,
            href: `/courses/${slugify(cat.category_name)}`,
          }));
          setCourseList(formatted);
        }
      } catch (err) {
        console.error("Failed to load categories:", err);
      }
    };

    fetchCategories();
  }, []);

  /*  INSIGHTS LIST - unchanged */
  const insightList = [
    { name: "Blogs", href: "/blog" },
    { name: "Notifications", href: "/notification" },
    { name: "Publications", href: "/publication" },
    { name: "Careers", href: "/careers" },
  ];

  /*  MENU STRUCTURE */
  const menuLinks = [
    // { label: "Home", href: "/", icon: Home },
    {
      label: "Courses",
      href: "/courses",
      icon: BookOpen,
      dropdown: courseList, //  dynamic categories here
    },
    { label: "Learners Portal", href: "/learners", icon: GraduationCap },
    { label: "Rank Holders", href: "/exams", icon: FileText },
    { label: "Highlights", href: "/highlights", icon: Star },
    { label: "Insights", href: "#", icon: Lightbulb, dropdown: insightList },
    { label: "About", href: "/about", icon: Info },
    { label: "Contact Us", href: "/contact", icon: Phone },
  ];

  /*  GSAP for mobile menu animation */
  useEffect(() => {
    if (isMenuOpen) {
      gsap.to(overlayRef.current, { opacity: 1, duration: 0.3, pointerEvents: "auto" });
      gsap.to(menuRef.current, { x: 0, duration: 0.4, ease: "power3.out" });
      gsap.fromTo(
        ".mobile-link",
        { x: 30, opacity: 0 },
        { x: 0, opacity: 1, stagger: 0.1, delay: 0.2, duration: 0.4, ease: "power3.out" }
      );
    } else {
      gsap.to(overlayRef.current, { opacity: 0, duration: 0.3, pointerEvents: "none" });
      gsap.to(menuRef.current, { x: "100%", duration: 0.4, ease: "power3.in" });
    }
  }, [isMenuOpen]);

  const handleNavigate = (path: string) => {
    setIsMenuOpen(false);
    router.push(path);
  };

  /*  ACTIVE LINK DETECTION */
  const isActive = (href: string, label?: string) => {
    const cleanPath = pathname.replace(/\/$/, "");
    const cleanHref = href.replace(/\/$/, "");

    if (
      label === "Insights" &&
      ["/blog", "/notification", "/publication"].some((path) =>
        cleanPath.startsWith(path)
      )
    ) {
      return true;
    }

    return cleanPath === cleanHref || cleanPath.startsWith(`${cleanHref}/`);
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/*  LOGO */}
          <div
            className="flex items-center space-x-2 cursor-pointer"
            onClick={() => router.push("/")}
          >
            <img src="/logo_blue.png" alt="logo" className="h-10 min-w-24 md:h-auto" />
          </div>

          {/*  DESKTOP MENU */}
          <nav className="hidden lg:flex items-center space-x-6 relative">
            {menuLinks.map(({ label, href, icon: Icon, dropdown }) => (
              <div
                key={label}
                className="relative"
                onMouseEnter={() => dropdown && setHoveredMenu(label)}
                onMouseLeave={() => dropdown && setHoveredMenu(null)}
              >
                <Link
                  href={href}
                  className={`flex items-center gap-1 transition-colors font-medium ${isActive(href, label)
                    ? "text-cyan-600 pb-1"
                    : "text-gray-700 hover:text-cyan-500"
                    }`}
                >
                  {label}
                  {dropdown && (
                    <ChevronDown
                      className={`w-4 h-4 ml-1 transition-transform ${hoveredMenu === label ? "rotate-180" : ""
                        }`}
                    />
                  )}
                </Link>

                {dropdown && hoveredMenu === label && (
                  <div className="absolute left-0 top-4 mt-2 bg-white border rounded-lg shadow-lg py-2 w-48 z-50">
                    {dropdown.map((item) => (
                      <button
                        key={item.name}
                        onClick={() => handleNavigate(item.href)}
                        className="block w-full cursor-pointer text-left px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-cyan-600"
                      >
                        {item.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}

            <Link href="/user-portal/login" className="cursor-pointer bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-6 py-1 rounded-full hover:from-cyan-600 hover:to-blue-600 transition-all duration-500 ease-in-out">
              Login
            </Link>
          </nav>

          {/*  MOBILE MENU BUTTON */}
          <div className="lg:hidden">
            <Button variant="ghost" size="sm" onClick={() => setIsMenuOpen(true)}>
              <Menu className="h-6 w-6" />
            </Button>
          </div>
        </div>
      </div>

      {/*  OVERLAY */}
      <div
        ref={overlayRef}
        onClick={() => setIsMenuOpen(false)}
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 opacity-0 pointer-events-none"
      ></div>

      {/*  MOBILE SIDEBAR */}
      <div
        ref={menuRef}
        className="fixed top-0 right-0 h-full w-72 bg-white/90 backdrop-blur-md shadow-xl z-50 p-6 flex flex-col translate-x-full overflow-y-auto"
      >
        <button
          onClick={() => setIsMenuOpen(false)}
          className="self-end mb-6 text-gray-700 hover:text-blue-600"
        >
          <X className="h-6 w-6" />
        </button>

        <nav className="flex flex-col gap-3 flex-1">
          {menuLinks.map(({ label, href, icon: Icon, dropdown }) => (
            <div key={label} className="mobile-link">
              <button
                onClick={() => {
                  // if (dropdown) {
                  //   setOpenAccordion((prev) => (prev === label ? null : label));
                  // } else {
                  handleNavigate(href);
                  // }
                }}
                className={`flex justify-between items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium shadow-sm w-full ${isActive(href, label)
                  ? "bg-cyan-600 text-white"
                  : "bg-blue-100/70 text-gray-800 hover:bg-blue-600 hover:text-white"
                  }`}
              >
                <span className="flex items-center gap-3">
                  <Icon className="h-4 w-4" />
                  {label}
                </span>
                {dropdown && (
                  <ChevronDown
                    onClick={(e) => {
                      e.stopPropagation();
                      setOpenAccordion((prev) => (prev === label ? null : label));
                    }}
                    className={`w-4 h-4 transition-transform ${openAccordion === label ? "rotate-180" : ""
                      }`}
                  />
                )}
              </button>

              {dropdown && openAccordion === label && (
                <div className="mt-2 ml-8 flex flex-col gap-1">
                  {dropdown.map((item) => (
                    <button
                      key={item.name}
                      onClick={() => handleNavigate(item.href)}
                      className="text-left text-gray-700 text-sm bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition"
                    >
                      {item.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>

        {/* MOBILE LOGIN BUTTON */}
        <Link
          href="/user-portal/login"
          className="mt-4 w-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-6 py-2 rounded-full hover:from-cyan-600 hover:to-blue-600 transition-all duration-500 ease-in-out text-center font-medium"
          onClick={() => setIsMenuOpen(false)}
        >
          Login
        </Link>
      </div>
    </header>
  );
}
