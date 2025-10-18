"use client";
import React from "react";
import { useRouter } from "next/navigation";

export default function BlogPage() {
  const router = useRouter();

  const blogs = [
    {
      id: 1,
      title: "Smart Classroom Upgrade",
      date: "February 11, 2025",
      description:
        "Our institute proudly opened a state-of-the-art computer lab equipped with 50 latest PCs...",
      image: "/blog_01.png",
    },
    {
      id: 2,
      title: "Annual Sports Meet 2025",
      date: "February 11, 2025",
      description:
        "The annual cultural fest will be held in March 2025 featuring music, dance, art exhibitions...",
      image: "/blog_02.png",
    },
    {
      id: 3,
      title: "Guest Lecture on AI & Future Careers",
      date: "February 11, 2025",
      description:
        "Over 150 students got placed in top companies during the placement drive organized...",
      image: "/blog_03.png",
    },
    {
      id: 4,
      title: "Library Digitalization Drive",
      date: "February 11, 2025",
      description:
        "Our institute proudly opened a state-of-the-art computer lab equipped with 50 latest PCs...",
      image: "/blog_04.png",
    },
    {
      id: 5,
      title: "Alumni Meet 2025",
      date: "February 11, 2025",
      description:
        "The annual cultural fest will be held in March 2025 featuring music, dance, art exhibitions...",
      image: "/blog_05.png",
    },
    {
      id: 6,
      title: "Innovation Hackathon 2025",
      date: "February 11, 2025",
      description:
        "Over 150 students got placed in top companies during the placement drive organized...",
      image: "/blog_06.png",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-6 md:px-12 md:py-14 py-8">
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

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {blogs.map((blog) => (
          <div
            key={blog.id}
            onClick={() => router.push(`/blog/${blog.id}`)}
            className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all cursor-pointer overflow-hidden group"
          >
            <div className="overflow-hidden">
              <img
                src={blog.image}
                alt={blog.title}
                className="w-full h-48 object-cover transition-transform duration-500 ease-in-out group-hover:scale-110"
              />
            </div>

            <div className="p-5">
              <p className="text-cyan-700 text-sm font-semibold mb-1">
                {blog.date}
              </p>
              <h3 className="text-gray-900 text-lg font-semibold mb-2">
                {blog.title}
              </h3>
              <p className="text-gray-600 text-sm leading-snug line-clamp-2">
                {blog.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
