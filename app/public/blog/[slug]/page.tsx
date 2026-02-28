"use client";
import React, { useLayoutEffect, useRef, useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { getBlogBySlug, getBlogs } from "@/lib/api/blogs";
import { slugify } from "@/lib/slugify";
import { BlogDetailsSkeleton } from "@/components/skeltons/skelton";
import { getShorts } from "@/lib/api/shorts";
import VideoModal from "@/components/videoModal";
import { Play } from "lucide-react";
import EnquiryModal from "@/components/enquiryModal";
import { getRankHolders } from "@/lib/api/rankHolders";
import { getServiceCarousels } from "@/lib/api/serviceCarousel";

gsap.registerPlugin(ScrollTrigger);

interface ShortItem {
  shorts_id: number;
  shorts_title: string;
  shorts_file: string;
  shorts_link: string;
  status: number;
}

export default function BlogDetails() {
  const params = useParams();
  const router = useRouter();
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const [showEnquiryModal, setShowEnquiryModal] = useState(false);

  const [shorts, setShorts] = useState<ShortItem[]>([]);
  const [activeShortIndex, setActiveShortIndex] = useState(0);

  const [blog, setBlog] = useState<any>(null);
  const [recentBlogs, setRecentBlogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const shortWrapperRef = useRef<HTMLDivElement | null>(null);
  const shortImageRef = useRef<HTMLImageElement | null>(null);
  const [rankHolders, setRankHolders] = useState<any[]>([]);
  const [governanceItems, setGovernanceItems] = useState<any[]>([]);

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

  useLayoutEffect(() => {
    if (!shortImageRef.current) return;

    gsap.fromTo(
      shortImageRef.current,
      {
        xPercent: 100,
        opacity: 0,
      },
      {
        xPercent: 0,
        opacity: 1,
        duration: 0.7,
        ease: "power3.out",
        clearProps: "transform",
      }
    );
  }, [activeShortIndex]);

  // Load Shorts
  useEffect(() => {
    const fetchShorts = async () => {
      try {
        const response = await getShorts(1, 4, "", 1);
        setShorts(response?.data || []);
      } catch (err) {
        console.error("Error fetching shorts:", err);
      }
    };

    fetchShorts();
  }, []);

  // Load governance items (service carousel limit 4)
  useEffect(() => {
    const fetchGovernance = async () => {
      try {
        const res = await getServiceCarousels(1, 4, "", 1);
        setGovernanceItems(res?.data || []);
      } catch (err) {
        console.error("Error fetching governance items:", err);
      }
    };

    fetchGovernance();
  }, []);

  // Load Rank Holders (limit 4)
  useEffect(() => {
    const fetchRankHolders = async () => {
      try {
        const res = await getRankHolders(
          1,
          4,
          "",
          1,
          undefined,
          undefined,
          undefined,
          undefined
        );
        const data = res?.data || [];
        setRankHolders(data);
      } catch (error) {
        console.error("Error fetching rank holders:", error);
      }
    };
    fetchRankHolders();
  }, []);

  useEffect(() => {
    if (shorts.length === 0) return;

    const interval = setInterval(() => {
      setActiveShortIndex((prev) =>
        prev === shorts.length - 1 ? 0 : prev + 1
      );
    }, 10000);

    return () => clearInterval(interval);
  }, [shorts]);

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
      <div className="flex md:items-center items-start gap-2 text-gray-600 text-sm mb-6">
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
        <span
          onClick={() => {
            if (blog.course?.course_name) {
              router.push(`/public/courses/${slugify(blog.course?.category?.category_name)}/${slugify(blog.course.course_name)}`);
            } else {
              router.push("/public/courses");
            }
          }}
          className="text-gray-800 cursor-pointer">
          {blog.course?.course_name ?? "General Blog"}
        </span>
      </div>

      <div className="grid lg:grid-cols-[2fr_1fr] gap-10">
        {/* Main Blog */}
        <div className="blog-main overflow-auto relative">
          <div className="flex justify-between items-center flex-wrap">
            <div>
              <h1 className="text-xl md:text-3xl font-bold text-gray-900 mb-2">
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
            <div className="flex md:justify-end justify-between gap-3 w-full flex-wrap">
              {blog.course?.course_id ? (
                <button
                  onClick={() => {
                    const categorySlug = slugify(blog.course?.category?.category_name || "");
                    const courseSlug = slugify(blog.course.course_name);
                    router.push(`/public/courses/${categorySlug}/${courseSlug}`);
                  }}
                  className="inline-block bg-cyan-600 text-white text-xs px-5 py-2.5 rounded-md mb-3 cursor-pointer hover:bg-cyan-700 transition"
                >
                  {blog.course.course_name}
                </button>
              ) : (
                <button
                  onClick={() => router.push("/public/courses")}
                  className="inline-block bg-cyan-600 text-white text-xs px-5 py-2.5 rounded-md mb-3 cursor-pointer hover:bg-cyan-700 transition"
                >
                  All Courses
                </button>
              )}
              <button
                onClick={() => setShowEnquiryModal(true)}
                className="inline-block bg-sky-600 text-white text-xs px-5 py-2.5 rounded-md mb-3 cursor-pointer hover:bg-cyan-700 transition"
              >
                Connect Us
              </button>
            </div>
          </div>

          <img
            src={server_url + blog.blog_image}
            alt={blog.blog_title}
            className="rounded-lg w-full h-auto mb-6 border border-gray-200"
          />

          {/* {blog.course?.course_name && (
            <p className="text-[10px] w-fit absolute md:top-[7.5rem] top-20 md:left-5  bg-cyan-600 text-white inline-block md:px-5 px-3 py-1 rounded-md mb-4 cursor-pointer">
              {blog.course.course_name}
            </p>
          )} */}

          <div
            className="ck-content text-gray-700"
            dangerouslySetInnerHTML={{ __html: blog.blog_content }}
          />
        </div>

        {/* Right Side */}
        <div className="relative">
          <div className="sticky top-24">
            <h3 className="font-semibold text-lg mb-4 text-gray-900">
              Recent Blogs
            </h3>

            {/* recent blogs  */}
            {recentBlogs.length === 0 ? (
              <p className="text-sm text-gray-500">No recent blogs found.</p>
            ) : (
              <div className="flex flex-col gap-5 overflow-hidden">
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
                      <h4 className="text-sm text-gray-800 font-medium leading-tight line-clamp-1">
                        {b.blog_title}
                      </h4>
                      {/*  Date */}
                      <p className="text-cyan-700 text-xs font-semibold mb-1">
                        {new Date(b.publishing_date).toLocaleDateString(
                          "en-US",
                          {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          }
                        )}
                      </p>

                      {/* author  */}
                      <p className="text-gray-800 text-xs font-semibold mb-1">
                        {b.blog_author}
                      </p>

                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* ace shorts  */}
            <div className="mt-10">
              <h3 className="font-semibold text-lg mb-4 text-gray-900">
                Ace Shorts
              </h3>

              {shorts.length === 0 ? (
                <p className="text-sm text-gray-500">No shorts available.</p>
              ) : (
                <div className="relative  w-full lg:h-[600px] h-[500px] rounded-lg overflow-hidden group">
                  <img
                    key={shorts[activeShortIndex]?.shorts_id}
                    ref={shortImageRef}
                    src={
                      server_url + shorts[activeShortIndex]?.shorts_file ||
                      "/placeholder.svg"
                    }
                    alt={shorts[activeShortIndex]?.shorts_title}
                    className="w-full h-full object-cover absolute inset-0 group-hover:scale-105 transition-transform duration-500 ease-in-out"
                  />

                  {/* Play button overlay */}
                  <div
                    className="absolute inset-0 md:top-52 flex items-center justify-center cursor-pointer"
                    onClick={() => setIsVideoOpen(true)}
                  >
                    <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center shadow-lg">
                      <Play
                        className="w-6 h-6 text-cyan-600 ml-1"
                        fill="currentColor"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* rank holders */}
            <div className="mt-10">
              {/* Ace's in Governance */}
              <div className="mt-10">
                <h3 className="font-semibold text-lg mb-4 text-gray-900">
                  Ace's in Governance
                </h3>

                {governanceItems.length === 0 ? (
                  <p className="text-sm text-gray-500">No data available.</p>
                ) : (
                  <div className="grid grid-cols-2 gap-3">
                    {governanceItems.map((item) => (
                      <div
                        key={item.service_carousel_id}
                        className="governance-card flex items-center justify-center p-2"
                      >
                        <img
                          src={
                            server_url + item.image_url
                          }
                          alt="Governance"
                          className="object-cover cursor-pointer rounded-md hover:scale-105 transition-transform duration-500 ease-in-out"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* rank holders */}
              <div className="mt-10">
                <h3 className="font-semibold text-lg mb-4 text-gray-900">
                  Rank Holders
                </h3>

                {rankHolders.length === 0 ? (
                  <p className="text-sm text-gray-500">No rank holders found.</p>
                ) : (
                  <>
                    <div className="grid grid-cols-2 gap-3">
                      {rankHolders.map((r) => (
                        <div
                          key={r.rank_id}
                          className="rank-holder-card flex items-center gap-3 cursor-pointer hover:bg-gray-50 rounded-lg p-2 transition group"
                        >
                          <img
                            src={server_url + r.student_photo}
                            alt={r.student_name}
                            className=" object-cover rounded-md group-hover:scale-105 transition-transform duration-500 ease-in-out"
                          />
                        </div>
                      ))}
                    </div>
                    <div className="mt-4 text-center">
                      <button
                        onClick={() => router.push("/public/exams")}
                        className="text-cyan-600 hover:underline text-sm cursor-pointer"
                      >
                        View All Rank Holders →
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <VideoModal
        videoUrl={shorts[activeShortIndex]?.shorts_link}
        isOpen={isVideoOpen}
        onClose={() => setIsVideoOpen(false)}
      />

      <EnquiryModal
        isOpen={showEnquiryModal}
        onClose={() => setShowEnquiryModal(false)}
        enquiryType={blog.course?.course_id ? 2 : 1}
        courseId={blog.course?.course_id || undefined}
      />
    </div>
  );
}
