"use client";
import React, { useLayoutEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function BlogDetails() {
  const { id } = useParams();
  const router = useRouter();
  const sectionRef = useRef<HTMLDivElement | null>(null);

  const blogs = [
    {
      id: 1,
      title: "Smart Classroom Upgrade",
      date: "February 11, 2025",
      image: "/blog_01.png",
      content: `
        Lorem Ipsum is simply dummy text of the printing and typesetting industry. 
        Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.
        It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.
      `,
      content_2: `
        Lorem Ipsum is simply dummy text of the printing and typesetting industry. 
        Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.
        It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.
      `,
    },
    {
      id: 2,
      title: "Annual Sports Meet 2025",
      date: "February 11, 2025",
      image: "/blog_02.png",
      content: `
        Lorem Ipsum is simply dummy text of the printing and typesetting industry. 
        It has survived not only five centuries, but also the leap into electronic typesetting.
        It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.
      `,
      content_2: `
        Lorem Ipsum is simply dummy text of the printing and typesetting industry. 
        Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.
        It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.
      `,
    },
    {
      id: 3,
      title: "Guest Lecture on AI & Future Careers",
      date: "February 11, 2025",
      image: "/blog_03.png",
      content: `
        Lorem Ipsum is simply dummy text of the printing and typesetting industry. 
        It has survived not only five centuries, but also the leap into electronic typesetting.
        It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.
      `,
      content_2: `
        Lorem Ipsum is simply dummy text of the printing and typesetting industry. 
        Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.
        It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.
      `,
    },
    {
      id: 4,
      title: "Library Digitalization Drive",
      date: "February 11, 2025",
      image: "/blog_04.png",
      content: `
        Lorem Ipsum is simply dummy text of the printing and typesetting industry. 
        It has survived not only five centuries, but also the leap into electronic typesetting.
        It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.
      `,
      content_2: `
        Lorem Ipsum is simply dummy text of the printing and typesetting industry. 
        Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.
        It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.
      `,
    },
    {
      id: 5,
      title: "Alumni Meet 2025",
      date: "February 11, 2025",
      image: "/blog_05.png",
      content: `
        Lorem Ipsum is simply dummy text of the printing and typesetting industry. 
        It has survived not only five centuries, but also the leap into electronic typesetting.
        It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.
      `,
      content_2: `
        Lorem Ipsum is simply dummy text of the printing and typesetting industry. 
        Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.
        It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.
      `,
    },
    {
      id: 6,
      title: "Innovation Hackathon 2025",
      date: "February 11, 2025",
      image: "/blog_06.png",
      content: `
        Lorem Ipsum is simply dummy text of the printing and typesetting industry. 
        It has survived not only five centuries, but also the leap into electronic typesetting.
        It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.
      `,
      content_2: `
        Lorem Ipsum is simply dummy text of the printing and typesetting industry. 
        Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.
        It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.
      `,
    },
  ];

  const blog = blogs.find((b) => b.id === Number(id));
  const recentBlogs = blogs.filter((b) => b.id !== Number(id)).slice(0, 3);

  useLayoutEffect(() => {
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
  }, []);

  if (!blog) return <div className="text-center py-20">Blog not found.</div>;

  return (
    <div ref={sectionRef} className="max-w-7xl mx-auto px-6 md:px-12 md:py-14 py-8">
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
        <span className="text-gray-800">{blog.title}</span>
      </div>

      <div className="grid lg:grid-cols-[2fr_1fr] gap-10">
        <div className="blog-main">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            {blog.title}
          </h1>
          <p className="text-cyan-700 text-sm font-semibold mb-6">
            {blog.date}
          </p>
          <img
            src={blog.image}
            alt={blog.title}
            className="rounded-lg w-full h-auto mb-6 border border-gray-200"
          />
          <div className="blog-text text-gray-700 leading-relaxed whitespace-pre-line mb-4">
            {blog.content}
          </div>
          <div className="blog-text text-gray-700 leading-relaxed whitespace-pre-line">
            {blog.content_2}
          </div>
        </div>

        <div>
          <h3 className="font-semibold text-lg mb-4 text-gray-900">
            Recent Blogs
          </h3>
          <div className="flex flex-col gap-5">
            {recentBlogs.map((b) => (
              <div
                key={b.id}
                className="recent-blog-card flex items-center gap-3 cursor-pointer hover:bg-gray-50 rounded-lg p-2 transition"
                onClick={() => router.push(`/public/blog/${b.id}`)}
              >
                <img
                  src={b.image}
                  alt={b.title}
                  className="w-20 h-16 object-cover rounded-md"
                />
                <div>
                  <p className="text-cyan-700 text-xs font-semibold mb-1">
                    {b.date}
                  </p>
                  <h4 className="text-sm text-gray-800 font-medium leading-tight">
                    {b.title}
                  </h4>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
