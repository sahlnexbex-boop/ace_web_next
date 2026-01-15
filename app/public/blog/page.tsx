"use client";

import React, { useLayoutEffect, useRef, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { getBlogs } from "@/lib/api/blogs";
import Loader from "@/components/loader";
import { slugify } from "@/lib/slugify";
import { BlogSkeletonGrid } from "@/components/skeltons/skelton";

gsap.registerPlugin(ScrollTrigger);

export default function BlogPage() {
  const router = useRouter();
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const [blogs, setBlogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const server_url = process.env.NEXT_PUBLIC_API_BASE_URL;

  const hasAnimatedRef = useRef(false);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await getBlogs(1, 10, "", 1);
        if (res?.data) {
          setBlogs(res.data);
        }
      } catch (error) {
        console.error("Error fetching blogs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  useLayoutEffect(() => {
    if (loading || blogs.length === 0 || hasAnimatedRef.current) return;

    hasAnimatedRef.current = true;

    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>(".blog-card").forEach((card, i) => {
        gsap.fromTo(
          card,
          { opacity: 0, y: 60, scale: 0.95 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.7,
            ease: "power2.out",
            delay: i * 0.08,
            scrollTrigger: {
              trigger: card,
              start: "top 85%",
              once: true,
            },
          }
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [blogs, loading]);

  return (
    <div
      ref={sectionRef}
      className="max-w-7xl mx-auto px-6 md:px-12 md:py-14 py-8"
    >
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-gray-600 text-sm mb-6">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-4 h-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0h6" />
        </svg>
        <span>/</span>
        <span>Blog</span>
      </div>

      <h1 className="text-2xl md:text-3xl font-bold text-center text-gray-900 md:mb-10 mb-8">
        Blog
      </h1>

      {loading ? (
        <BlogSkeletonGrid />
      ) : blogs.length === 0 ? (
        <div className="flex justify-center items-center min-h-[70vh] md:min-h-auto">
          <img src="../../no_data.png" alt="no data" className="opacity-30" />
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogs.map((blog) => (
            <div
              key={blog.blog_id}
              onClick={() =>
                router.push(`/public/blog/${slugify(blog.blog_title)}`)
              }
              className="blog-card bg-white rounded-xl shadow-md hover:shadow-xl transition-all cursor-pointer overflow-hidden group"
            >
              <div className="overflow-hidden">
                <img
                  src={server_url + blog.blog_image}
                  alt={blog.blog_title}
                  className="w-full h-56 object-cover transition-transform duration-500 ease-in-out group-hover:scale-110"
                />
                {/*  Course Name */}
                {/* {blog.course?.course_name && (
                  <p className="text-[10px] absolute top-2 left-2 text-white bg-sky-500 inline-block px-2 py-1 rounded-sm mb-2">
                    {blog.course.course_name}
                  </p>
                )} */}
              </div>

              <div className="p-5">
                {/* Date */}
                <p className="text-cyan-700 text-sm font-semibold mb-1">
                  {new Date(blog.publishing_date).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>

                {/* Title */}
                <h3 className="text-gray-900 text-xl font-semibold mb-2 line-clamp-1">
                  {blog.blog_title}
                </h3>

                {/* Description */}
                <div
                  className="prose max-w-none blog-text line-clamp-3 text-gray-700 text-sm"
                  dangerouslySetInnerHTML={{ __html: blog.blog_content }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
