"use client";
import React, { useLayoutEffect, useRef, useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { getBlogBySlug, getBlogs } from "@/lib/api/blogs";
import { slugify } from "@/lib/slugify";
import { BlogDetailsSkeleton } from "@/components/skeltons/skelton";

gsap.registerPlugin(ScrollTrigger);

export default function BlogDetails() {
  const params = useParams();
  const router = useRouter();
  const sectionRef = useRef<HTMLDivElement | null>(null);

  const [blog, setBlog] = useState<any>(null);
  const [recentBlogs, setRecentBlogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const server_url = process.env.NEXT_PUBLIC_API_BASE_URL;

  // Load Blog + Recent Blogs
  useEffect(() => {
    const fetchBlogData = async () => {
      try {
        const slug = params.slug as string;

        if (!slug) {
          setError("No slug found in URL");
          setLoading(false);
          return;
        }
        const blogRes = await getBlogBySlug(slug);

        if (blogRes?.data) {
          setBlog(blogRes.data);

          // Fetch recent blogs
          const recentRes = await getBlogs(1, 4, "", 1);
          if (recentRes?.data) {
            const filtered = recentRes.data.filter(
              (b: any) => b.blog_id !== blogRes.data.blog_id
            );
            setRecentBlogs(filtered.slice(0, 3));
          }
        } else {
          setError("Blog not found");
        }
      } catch (error: any) {
        console.error("Error fetching blog:", error);
        setError(error?.message || "Failed to load blog");
      } finally {
        setLoading(false);
      }
    };

    fetchBlogData();
  }, [params]);

  // GSAP Animations
  useLayoutEffect(() => {
    if (loading || !blog) return;

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
  }, [loading, blog]);

  if (loading) return <BlogDetailsSkeleton />;

  if (error || !blog)
    return (
      <div className="text-center py-20">
        <p className="text-gray-500 text-sm mb-4">
          {error || "Blog not found."}
        </p>
        <button
          onClick={() => router.push("/public/blog")}
          className="text-cyan-600 hover:underline text-sm"
        >
          ← Back to Blogs
        </button>
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
        {/* Main Blog */}
        <div className="blog-main">
          <div className="flex justify-between items-center flex-wrap">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                {blog.blog_title}
              </h1>

              <p className="text-cyan-700 text-sm font-semibold md:mb-6 mb-2">
                {new Date(blog.publishing_date).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}{" "}
                • {blog.blog_author}
              </p>
            </div>
            <div>
              {/*  Course Badge */}
              {blog.course && (
                <div
                  className="inline-block bg-sky-500 text-white text-xs px-3 py-1 rounded-md mb-3 cursor-pointer hover:bg-cyan-700 transition"
                  onClick={() =>
                    router.push(
                      `/public/courses/${blog.course.category_id}/${blog.course.course_id}`
                    )
                  }
                >
                  {blog.course.course_name}
                </div>
              )}
            </div>
          </div>

          <img
            src={server_url + blog.blog_image}
            alt={blog.blog_title}
            className="rounded-lg w-full h-auto mb-6 border border-gray-200"
          />

          <div className="blog-text text-gray-700 leading-relaxed whitespace-pre-line">
            {blog.blog_content}
          </div>
        </div>

        {/* Recent Blogs */}
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
                  onClick={() =>
                    router.push(`/public/blog/${slugify(b.blog_title)}`)
                  }
                >
                  <img
                    src={server_url + b.blog_image}
                    alt={b.blog_title}
                    className="w-20 h-16 object-cover rounded-md"
                  />

                  <div>
                    {/*  Date */}
                    <p className="text-cyan-700 text-xs font-semibold mb-1">
                      {new Date(b.publishing_date).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </p>

                    {/*  Course badge */}
                    {b.course && (
                      <p
                        className="text-[10px] bg-cyan-600 text-white inline-block px-2 py-1 rounded-md mb-1 cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation();
                          router.push(
                            `/public/courses/${b.course.category_id}/${b.course.course_id}`
                          );
                        }}
                      >
                        {b.course.course_name}
                      </p>
                    )}

                    {/* Blog Title */}
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
