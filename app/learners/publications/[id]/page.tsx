"use client";

import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";

export default function PublicationDetail() {
  const { id } = useParams();
  const router = useRouter();

  const publication = {
    title: "General Knowledge Guide 2025",
    author: "ABC Publishers",
    content1:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.",
    content2:
      "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.",
  };

  const breadcrumbRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const authorRef = useRef<HTMLParagraphElement>(null);
  const contentRefs = useRef<HTMLParagraphElement[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(breadcrumbRef.current, {
        opacity: 0,
        y: -10,
        duration: 0.5,
        ease: "power2.out",
      });

      gsap.from([titleRef.current, authorRef.current], {
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
        stagger: 0.25,
        ease: "power3.out",
        delay: 0.4,
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <div className="bg-gray-50 px-6 md:px-16 py-8 md:py-18">
      {/* Breadcrumb */}
      <div ref={breadcrumbRef} className="text-sm text-gray-500 mb-4">
        <span
          onClick={() => router.push("/")}
          className="hover:text-blue-600 cursor-pointer"
        >
          Home
        </span>{" "}
        /{" "}
        <span
          onClick={() => router.push("/learners")}
          className="hover:text-blue-600 cursor-pointer"
        >
          Publications
        </span>{" "}
        /{" "}
        <span className="text-gray-800 font-medium">{publication.title}</span>
      </div>

      <div>
        <h1
          ref={titleRef}
          className="text-2xl md:text-3xl font-bold text-gray-900 mb-2"
        >
          {publication.title}
        </h1>
        <p ref={authorRef} className="text-cyan-600 mb-6 font-medium">
          By {publication.author}
        </p>
        <p
          ref={(el) => {
            if (el) contentRefs.current[0] = el;
          }}
          className="text-gray-700 mb-4 leading-relaxed"
        >
          {publication.content1}
        </p>
        <p
          ref={(el) => {
            if (el) contentRefs.current[1] = el;
          }}
          className="text-gray-700 leading-relaxed"
        >
          {publication.content2}
        </p>
      </div>
    </div>
  );
}
