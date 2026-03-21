"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { gsap } from "gsap";
import { getResults } from "@/lib/api/result";
import { link } from "fs";

export default function AboutUs() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const router = useRouter();

  const yearsRef = useRef<HTMLDivElement | null>(null);
  const studentsRef = useRef<HTMLDivElement | null>(null);
  const facultyRef = useRef<HTMLDivElement | null>(null);
  const statsRef = useRef<HTMLDivElement | null>(null);
  const server_url = process.env.NEXT_PUBLIC_API_BASE_URL;

  const tabs = [
    {
      text: "Exam & Results",
      textColor: "text-purple-600",
      bg: "bg-purple-300/10",
      hover: "hover:bg-purple-50",
      link: "/exams",
    },
    {
      text: "Exam & Ans Keys",
      textColor: "text-blue-600",
      bg: "bg-blue-300/10",
      hover: "hover:bg-blue-50",
      link: "/learners?type=answer",
    },
    {
      text: "Rank Holder List",
      textColor: "text-red-500",
      bg: "bg-red-300/10",
      hover: "hover:bg-red-50",
      link: "/exams",
    },
    {
      text: "Publications",
      textColor: "text-gray-600",
      bg: "bg-gray-300/10",
      hover: "hover:bg-gray-50",
      link: "/publication",
    },
    {
      text: "Blogs",
      textColor: "text-pink-600",
      bg: "bg-pink-300/10",
      hover: "hover:bg-pink-50",
      link: "/blog",
    },
  ];

  const handleTabClick = (link: string) => {
    router.push(link);
  };

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await getResults(1, 10, "", "1", undefined, "1");
        const data = res?.data || [];
        const total = data.length;

        const placeholders = Array.from(
          { length: Math.max(0, 6 - total) },
          (_, i) => ({
            result_id: `coming-soon-${i}`,
            result_title: "Coming Soon",
            result_date: "",
            result_file: "",
            placeholder: true,
          })
        );

        setNotifications([...data, ...placeholders]);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };
    fetchNotifications();
  }, []);

  useEffect(() => {
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    // === Entrance Animations ===
    tl.fromTo(
      ".about-heading",
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 0.8 }
    );
    tl.fromTo(
      ".about-subheading",
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.6 },
      "-=0.4"
    );
    tl.fromTo(
      ".about-text",
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.6 },
      "-=0.3"
    );
    tl.fromTo(
      ".about-stat",
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.5, stagger: 0.15 },
      "-=0.3"
    );
    tl.fromTo(
      ".about-button",
      { opacity: 0, scale: 0.9 },
      { opacity: 1, scale: 1, duration: 0.4 },
      "-=0.3"
    );
    tl.fromTo(
      ".about-tab",
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.5, stagger: 0.1 },
      "-=0.4"
    );

    //  Notifications - Start Earlier (less delay)
    tl.fromTo(
      ".notifications-panel",
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.6 },
      "-=0.4" // was -0.5, start earlier
    );
    tl.fromTo(
      ".notification-item",
      { opacity: 0, x: 25 },
      { opacity: 1, x: 0, duration: 0.4, stagger: 0.12 },
      "-=0.5"
    );

    // === Counter Animation (start & end simultaneously) ===
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          const duration = 2.5; // ⏱ same duration for all counters
          const targetValues = [
            { ref: yearsRef, end: 20, suffix: "+" },
            { ref: studentsRef, end: 25000, suffix: "+" },
            { ref: facultyRef, end: 250, suffix: "+" },
          ];

          // Animate all counters together
          targetValues.forEach(({ ref, end, suffix }) => {
            if (ref.current) {
              gsap.to(ref.current, {
                innerText: end,
                duration,
                ease: "power3.out",
                snap: { innerText: 1 },
                onUpdate() {
                  if (ref.current)
                    ref.current.innerText =
                      Math.ceil(this.targets()[0].innerText) + suffix;
                },
              });
            }
          });

          observer.disconnect();
        }
      },
      { threshold: 0.5 }
    );

    if (statsRef.current) observer.observe(statsRef.current);
    return () => {
      tl.kill();
      if (statsRef.current) observer.unobserve(statsRef.current);
    };
  }, []);

  return (
    <section className="md:py-16 py-10 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col-reverse lg:flex-row gap-12 items-start">
          <div className="relative w-full lg:w-1/2 z-0">
            <img
              src="/logo_full.png"
              alt="background_logo"
              className="absolute right-28 blur-[1px] -bottom-10 z-0 hidden sm:block"
            />
            <div className="notifications-panel bg-white/80 rounded-lg shadow-lg p-6 max-w-md relative mx-auto lg:mx-0">
              <div className="flex items-center justify-between mb-6">
                <h3
                  className="text-lg cursor-pointer font-bold text-gray-900"
                  onClick={() => router.push("/notification")}
                >
                  Notifications
                </h3>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="cursor-pointer"
                >
                  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                  <path d="M10 5a2 2 0 1 1 4 0a7 7 0 0 1 4 6v3a4 4 0 0 0 2 3h-16a4 4 0 0 0 2 -3v-3a7 7 0 0 1 4 -6" />
                  <path d="M9 17v1a3 3 0 0 0 6 0v-1" />
                </svg>
              </div>

              <div className="space-y-4 max-h-[22rem] relative z-10 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                {notifications.map((item) => (
                  <div
                    key={item.result_id}
                    className="notification-item flex items-center justify-between py-1 border-b border-gray-100 last:border-b-0"
                  >
                    <div>
                      <p
                        className={`font-semibold text-sm ${
                          item.placeholder
                            ? "text-gray-400 italic"
                            : "text-gray-900"
                        }`}
                      >
                        {item.result_title}
                      </p>
                      {!item.placeholder && (
                        <p className="text-xs text-gray-500">
                          {item.result_date
                            ? new Date(item.result_date).toLocaleString(
                                "en-IN",
                                {
                                  day: "2-digit",
                                  month: "short",
                                  year: "numeric",
                                }
                              )
                            : ""}
                        </p>
                      )}
                    </div>
                    {!item.placeholder ? (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => window.open(server_url + item.result_file, "_blank")}
                        className="text-xs px-3 py-1 text-cyan-600 bg-[#098B9F33] hover:text-cyan-800 cursor-pointer hover:bg-[#098B9F55]"
                      >
                        View
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        disabled
                        variant="outline"
                        className="text-xs px-3 py-1 text-gray-400 border-gray-200 bg-gray-100 cursor-not-allowed"
                      >
                        Coming Soon
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="w-full lg:w-1/2">
            <h2 className="about-heading text-md md:text-lg font-bold mb-1 text-gray-900">
              About Us
            </h2>
            <h3 className="about-subheading text-2xl md:text-3xl font-bold mb-4 text-cyan-600">
              Best PSC Coaching Centre in Kerala - Crafting careers since 2003
            </h3>
            <p className="about-text text-md text-gray-600 mb-8 leading-relaxed">
              As the best PSC coaching centre in Kerala, we’ve helped thousands
              of students crack PSC examinations with ease and enter the
              prestigious Kerala government workforce. For the past 22 years, we
              have dedicated ourselves to helping students across Kerala build
              their dream careers. Founded in 2003 at Manjeri, Malappuram
              district of Kerala, our excellence in delivering quality education
              has made us the frontrunner among competitive exam coaching
              centres in Kerala.
            </p>

            <div
              ref={statsRef}
              className="about-stats grid grid-cols-3 gap-2 mb-8"
            >
              <div className="about-stat text-center">
                <div
                  ref={yearsRef}
                  className="md:text-5xl text-2xl font-bold bg-gradient-to-r from-[#098B9F] to-[#63C2CD] bg-clip-text text-transparent mb-2"
                >
                  0
                </div>
                <div className="text-sm text-gray-600">Years of Excellence</div>
              </div>
              <div className="about-stat text-center">
                <div
                  ref={studentsRef}
                  className="md:text-5xl text-2xl font-bold bg-gradient-to-r from-[#00A0E3] to-[#1F67A5] bg-clip-text text-transparent mb-2"
                >
                  0
                </div>
                <div className="text-sm text-gray-600">Successful Students</div>
              </div>
              <div className="about-stat text-center">
                <div
                  ref={facultyRef}
                  className="md:text-5xl text-2xl font-bold bg-gradient-to-r from-[#63C2CD] to-[#098B9F] bg-clip-text text-transparent mb-2"
                >
                  0
                </div>
                <div className="text-sm text-gray-600">Expert Faculties</div>
              </div>
            </div>

            <Button
              size="lg"
              className="about-button cursor-pointer bg-gradient-to-r from-[#1F67A5] to-[#00A0E3] hover:from-[#176090] hover:to-[#0088c7] text-white px-8 py-3"
              onClick={() => router.push("/about")}
            >
              Explore More
            </Button>
          </div>
        </div>

        <div className="md:mt-16 mt-8">
          <div className="flex md:justify-center justify-start gap-4 overflow-x-auto no-scrollbar px-2 py-2 sm:px-0 snap-x">
            {tabs.map((tab) => (
              <button
                key={tab.text}
                onClick={() => handleTabClick(tab.link)}
                className={`about-tab flex-shrink-0 snap-start px-6 py-2 cursor-pointer rounded-lg shadow-md transition ${tab.textColor} ${tab.bg} ${tab.hover}`}
              >
                {tab.text}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
