"use client";
import Events from "@/components/events_sm";
import NewsUpdates from "@/components/newsUpdates_sm";
import SuccessStories from "@/components/success_stories_sm";
import Testimonials from "@/components/testimonials_sm";
import Webinars from "@/components/webinar_sm";
import FeaturedSuccess from "@/components/featured_success";
import React, { useRef, useEffect, useState } from "react";

export default function Highlights() {
  const successRef = useRef<HTMLDivElement | null>(null);
  const testimonialsRef = useRef<HTMLDivElement | null>(null);
  const webinarsRef = useRef<HTMLDivElement | null>(null);
  const eventsRef = useRef<HTMLDivElement | null>(null);
  const newsRef = useRef<HTMLDivElement | null>(null);
  const featuredRef = useRef<HTMLDivElement | null>(null);

  const [activeTab, setActiveTab] = useState("success");

  const scrollToSection = (
    ref: React.RefObject<HTMLDivElement>,
    tab: string
  ) => {
    setActiveTab(tab);
    const topOffset = 120; 
    const elementPosition = ref.current?.getBoundingClientRect().top ?? 0;
    const offsetPosition = window.scrollY + elementPosition - topOffset;

    window.scrollTo({
      top: offsetPosition,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    const sections = [
      { ref: successRef, id: "success" },
      { ref: featuredRef, id: "featured" },
      { ref: testimonialsRef, id: "testimonials" },
      { ref: webinarsRef, id: "webinars" },
      { ref: eventsRef, id: "events" },
      { ref: newsRef, id: "news" },
    ];

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.find((entry) => entry.isIntersecting);
        if (visible) {
          const id = sections.find((s) => s.ref.current === visible.target)?.id;
          if (id) setActiveTab(id);
        }
      },
      { threshold: 0.5 }
    );

    sections.forEach((section) => {
      if (section.ref.current) observer.observe(section.ref.current);
    });

    return () => observer.disconnect();
  }, []);

  const tabClass = (id: string) =>
    `pb-2 transition-all border-b-2 cursor-pointer whitespace-nowrap flex-shrink-0 ${
      activeTab === id
        ? "border-cyan-600 text-cyan-600 font-semibold"
        : "border-transparent text-gray-700 hover:text-cyan-600 hover:border-cyan-600"
    }`;

  return (
    <div className="w-full scroll-smooth">
      {/* Header Section */}
      <section className="max-w-7xl mx-auto px-4 pt-10 pb-4">
        {/* Breadcrumb */}
        <div className="text-sm text-gray-600 flex items-center gap-1 mb-3">
          <span className="text-gray-500">
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
              className="icon icon-tabler icons-tabler-outline icon-tabler-home"
            >
              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
              <path d="M5 12l-2 0l9 -9l9 9l-2 0" />
              <path d="M5 12v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-7" />
              <path d="M9 21v-6a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v6" />
            </svg>
          </span>
          / <span>Highlights</span>
        </div>

        <h1 className="text-3xl md:text-4xl font-bold">Highlights</h1>
      </section>

      {/* Sticky Tabs */}
      <div className="sticky top-16 z-40 bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-nowrap md:flex-wrap gap-6 py-3 text-sm font-medium overflow-x-auto scrollbar-hide no-scrollbar">
            <button
              onClick={() => scrollToSection(successRef, "success")}
              className={tabClass("success")}
            >
              Success Stories
            </button>
            <button
              onClick={() => scrollToSection(featuredRef, "featured")}
              className={tabClass("featured")}
            >
              Featured Success Stories
            </button>
            <button
              onClick={() => scrollToSection(testimonialsRef, "testimonials")}
              className={tabClass("testimonials")}
            >
              Student Testimonials
            </button>
            <button
              onClick={() => scrollToSection(webinarsRef, "webinars")}
              className={tabClass("webinars")}
            >
              Webinars
            </button>
            <button
              onClick={() => scrollToSection(eventsRef, "events")}
              className={tabClass("events")}
            >
              Ace Events
            </button>
            <button
              onClick={() => scrollToSection(newsRef, "news")}
              className={tabClass("news")}
            >
              News & Updates
            </button>
          </div>
        </div>
      </div>

      {/* Content Sections */}
      <div ref={successRef} id="success" className="scroll-mt-24">
        <SuccessStories />
      </div>
      <div ref={featuredRef} id="featured" className="scroll-mt-24">
        <FeaturedSuccess />
      </div>
      <div ref={testimonialsRef} id="testimonials" className="scroll-mt-24">
        <Testimonials />
      </div>
      <div ref={webinarsRef} id="webinars" className="scroll-mt-24">
        <Webinars />
      </div>
      <div ref={eventsRef} id="events" className="scroll-mt-24">
        <Events />
      </div>
      <div ref={newsRef} id="news" className="scroll-mt-24">
        <NewsUpdates />
      </div>
    </div>
  );
}
