"use client";

import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { getCurrentAffairById } from "@/lib/api/current-affair";

interface AffairData {
  affair_id: number;
  affair_title: string;
  affair_description: string;
  publishing_date: string;
  affair_file: string;
  category?: {
    category_id: number;
    category_name: string;
  };
}

export default function AffairDetail() {
  const { id } = useParams();
  const router = useRouter();

  const [affairData, setAffairData] = useState<AffairData | null>(null);
  const [loading, setLoading] = useState(true);

  const breadcrumbRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const publishedRef = useRef<HTMLParagraphElement>(null);
  const contentRef = useRef<HTMLParagraphElement>(null);
  const sidebarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchAffair = async () => {
      try {
        if (!id) return;
        setLoading(true);
        const res = await getCurrentAffairById(Number(id));
        if (res?.data) {
          setAffairData(res.data);
        }
      } catch (err) {
        console.error("Error fetching affair:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAffair();
  }, [id]);

  useEffect(() => {
    if (!affairData) return;
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

      gsap.from(contentRef.current, {
        opacity: 0,
        y: 30,
        duration: 0.8,
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
    });
    return () => ctx.revert();
  }, [affairData]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <p className="text-gray-600">Loading Current Affair...</p>
      </div>
    );
  }

  if (!affairData) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <p className="text-gray-500">No Current Affair found.</p>
      </div>
    );
  }

  const formattedDate = new Date(affairData.publishing_date).toLocaleDateString(
    "en-IN",
    { year: "numeric", month: "short", day: "numeric" }
  );

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
          onClick={() => router.push("/public/learners?type=current")}
          className="hover:text-blue-600 cursor-pointer"
        >
          Current Affairs
        </span>{" "}
        /{" "}
        <span className="text-gray-800 font-medium">
          {affairData.affair_title}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 md:gap-20 gap-8">
        {/* Main Content */}
        <div className="md:col-span-2">
          <h1
            ref={titleRef}
            className="text-2xl md:text-3xl font-bold text-gray-900 mb-2"
          >
            {affairData.affair_title}
          </h1>
          <p ref={publishedRef} className="text-sm text-cyan-600 mb-6">
            Published: {formattedDate}
          </p>

          <p
            ref={contentRef}
            className="text-gray-700 leading-relaxed whitespace-pre-line"
          >
            {affairData.affair_description}
          </p>

          
        </div>

        {/* Sidebar */}
        <div
          ref={sidebarRef}
          className="p-5 rounded-xl bg-white shadow-sm border border-gray-100 h-fit"
        >
          <h3 className="font-semibold text-gray-800 mb-3">
            Files Information
          </h3>
          {affairData.affair_file && (
            <div className="mt-6">
              <a
                href={affairData.affair_file}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-cyan-600 hover:bg-cyan-700 text-white text-sm font-medium py-2 px-4 rounded-md transition"
              >
                 View Attached File
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
