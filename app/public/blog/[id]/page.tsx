"use client";
import React, { useLayoutEffect, useRef, useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { getBlogById, getBlogs } from "@/lib/api/blogs";

gsap.registerPlugin(ScrollTrigger);

export default function BlogDetails() {
  const { id } = useParams();
  const router = useRouter();
  const sectionRef = useRef<HTMLDivElement | null>(null);

  const [blog, setBlog] = useState<any>(null);
  const [recentBlogs, setRecentBlogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogData = async () => {
      try {
        const blogRes = await getBlogById(Number(id));
        if (blogRes?.data) {
          setBlog(blogRes.data);
        }
        const recentRes = await getBlogs(1, 4, "", 1);
        if (recentRes?.data) {
          const filtered = recentRes.data.filter(
            (b: any) => b.blog_id !== Number(id)
          );
          setRecentBlogs(filtered.slice(0, 3));
        }
      } catch (error) {
        console.error("Error fetching blog:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchBlogData();
  }, [id]);

  useLayoutEffect(() => {
    if (loading) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".blog-main",
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power2.out",
          scrollTrigger: {
            trigger: ".blog-main",
            start: "top 85%",
            once: true,
          },
        }
      );

      gsap.fromTo(
        ".blog-text",
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: "power2.out",
          stagger: 0.2,
          scrollTrigger: {
            trigger: ".blog-text",
            start: "top 90%",
            once: true,
          },
        }
      );

      gsap.fromTo(
        ".recent-blog-card",
        { opacity: 0, x: 40 },
        {
          opacity: 1,
          x: 0,
          duration: 0.8,
          ease: "power2.out",
          stagger: 0.15,
          scrollTrigger: {
            trigger: ".recent-blog-card",
            start: "top 95%",
            once: true,
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, [loading]);

  if (loading)
    return (
      <div className="text-center py-20 text-gray-500 text-sm">
        Loading blog details...
      </div>
    );

  if (!blog)
    return (
      <div className="text-center py-20 text-gray-500 text-sm">
        Blog not found.
      </div>
    );

  return (
    <div
      ref={sectionRef}
      className="max-w-7xl mx-auto px-6 md:px-12 md:py-14 py-8"
    >
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-gray-600 text-sm mb-6">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-4 h-4 cursor-pointer"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
          onClick={() => router.push("/public/home")}
        >
          <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0h6" />
        </svg>
        <span
          onClick={() => router.push("/public/blog")}
          className="hover:underline cursor-pointer"
        >
          Blog
        </span>
        <span>/</span>
        <span className="text-gray-800">{blog.blog_title}</span>
      </div>

      <div className="grid lg:grid-cols-[2fr_1fr] gap-10">
        <div className="blog-main">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            {blog.blog_title}
          </h1>
          <p className="text-cyan-700 text-sm font-semibold mb-6">
            {new Date(blog.publishing_date).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}{" "}
            • {blog.blog_author}
          </p>
          <img
            src={blog.blog_image}
            alt={blog.blog_title}
            className="rounded-lg w-full h-auto mb-6 border border-gray-200"
          />
          <div className="blog-text text-gray-700 leading-relaxed whitespace-pre-line">
            {blog.blog_content}
          </div>
        </div>

        <div>
          <h3 className="font-semibold text-lg mb-4 text-gray-900">
            Recent Blogs
          </h3>
          {recentBlogs.length === 0 ? (
            <p className="text-sm text-gray-500">No recent blogs found.</p>
          ) : (
            <div className="flex flex-col gap-5">
              {recentBlogs.map((b) => (
                <div
                  key={b.blog_id}
                  className="recent-blog-card flex items-center gap-3 cursor-pointer hover:bg-gray-50 rounded-lg p-2 transition"
                  onClick={() => router.push(`/public/blog/${b.blog_id}`)}
                >
                  <img
                    src={b.blog_image}
                    alt={b.blog_title}
                    className="w-20 h-16 object-cover rounded-md"
                  />
                  <div>
                    <p className="text-cyan-700 text-xs font-semibold mb-1">
                      {new Date(b.publishing_date).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </p>
                    <h4 className="text-sm text-gray-800 font-medium leading-tight">
                      {b.blog_title}
                    </h4>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
