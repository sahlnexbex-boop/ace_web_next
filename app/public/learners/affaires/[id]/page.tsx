"use client";

import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";

export default function AffairDetail() {
  const { id } = useParams();
  const router = useRouter();

  const affairData = {
    title: "January 2025 Current Affairs",
    published: "Jan 15, 2025",
    content1:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
    content2:
      "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters.",
    recent: [{ title: "Latest Current Affairs", date: "September 20, 2025" }],
  };

  const breadcrumbRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const publishedRef = useRef<HTMLParagraphElement>(null);
  const contentRefs = useRef<HTMLParagraphElement[]>([]);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const recentRefs = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(breadcrumbRef.current, {
        opacity: 0,
        y: -10,
        duration: 0.6,
        ease: "power2.out",
      });

      gsap.from([titleRef.current, publishedRef.current], {
        opacity: 0,
        y: 20,
        duration: 0.8,
        stagger: 0.15,
        ease: "power2.out",
        delay: 0.2,
      });

      gsap.from(contentRefs.current, {
        opacity: 0,
        y: 30,
        duration: 0.8,
        stagger: 0.2,
        ease: "power3.out",
        delay: 0.4,
      });

      gsap.from(sidebarRef.current, {
        opacity: 0,
        x: 50,
        duration: 0.8,
        ease: "power2.out",
        delay: 0.6,
      });

      gsap.from(recentRefs.current, {
        opacity: 0,
        x: 20,
        duration: 0.6,
        stagger: 0.1,
        ease: "power2.out",
        delay: 0.8,
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <div className="bg-gray-50 px-6 md:px-24 md:py-18 py-8">
      {/* Breadcrumb */}
      <div ref={breadcrumbRef} className="text-sm text-gray-500 mb-4">
        <span
          onClick={() => router.push("/public/home")}
          className="hover:text-blue-600 cursor-pointer"
        >
          Home
        </span>{" "}
        /{" "}
        <span
          onClick={() => router.push("/public/learners")}
          className="hover:text-blue-600 cursor-pointer"
        >
          Current Affairs
        </span>{" "}
        /{" "}
        <span className="text-gray-800 font-medium">{affairData.title}</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 md:gap-20 gap-8">
        <div className="md:col-span-2">
          <h1
            ref={titleRef}
            className="text-2xl md:text-3xl font-bold text-gray-900 mb-2"
          >
            {affairData.title}
          </h1>
          <p ref={publishedRef} className="text-sm text-cyan-600 mb-6">
            Published: {affairData.published}
          </p>
          <p
            ref={(el) => {
              if (el) contentRefs.current[0] = el;
            }}
            className="text-gray-700 mb-4 leading-relaxed"
          >
            {affairData.content1}
          </p>
          <p
            ref={(el) => {
              if (el) contentRefs.current[1] = el;
            }}
            className="text-gray-700 leading-relaxed"
          >
            {affairData.content2}
          </p>
        </div>

        <div ref={sidebarRef} className="p-5 rounded-xl">
          <h3 className="font-semibold text-gray-800 mb-3">
            Recent Current Affairs
          </h3>
          {affairData.recent.map((r, i) => (
            <div
              key={i}
              ref={(el) => {
                if (el) recentRefs.current[i] = el;
              }}
              className="mb-2"
            >
              <p className="text-gray-700 text-sm">{r.title}</p>
              <p className="text-cyan-600 text-sm">{r.date}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
