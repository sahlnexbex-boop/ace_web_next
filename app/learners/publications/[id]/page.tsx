"use client";

import { useParams, useRouter } from "next/navigation";

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

  return (
    <div className="bg-gray-50 px-6 md:px-16 py-8 md:py-18">
      {/* Breadcrumb */}
      <div className="text-sm text-gray-500 mb-4">
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

      {/* Content */}
      <div className="">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
          {publication.title}
        </h1>
        <p className="text-blue-600 mb-6 font-medium">
          By {publication.author}
        </p>
        <p className="text-gray-700 mb-4 leading-relaxed">
          {publication.content1}
        </p>
        <p className="text-gray-700 leading-relaxed">{publication.content2}</p>
      </div>
    </div>
  );
}
