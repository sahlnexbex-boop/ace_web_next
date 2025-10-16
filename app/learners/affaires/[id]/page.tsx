"use client";

import { useParams, useRouter } from "next/navigation";

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
    recent: [
      { title: "Latest Current Affairs", date: "September 20, 2025" },
    ],
  };

  return (
    <div className="bg-gray-50  px-6 md:px-24 md:py-18 py-8">
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
          Current Affairs
        </span>{" "}
        /{" "}
        <span className="text-gray-800 font-medium">{affairData.title}</span>
      </div>

      {/* Main Layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 md:gap-20 gap-8">
        {/* Main Content */}
        <div className="md:col-span-2">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            {affairData.title}
          </h1>
          <p className="text-sm text-blue-600 mb-6">
            Published: {affairData.published}
          </p>
          <p className="text-gray-700 mb-4 leading-relaxed">{affairData.content1}</p>
          <p className="text-gray-700 leading-relaxed">{affairData.content2}</p>
        </div>

        {/* Sidebar */}
        <div className=" p-5 rounded-xl">
          <h3 className="font-semibold text-gray-800 mb-3">
            Recent Current Affairs
          </h3>
          {affairData.recent.map((r, i) => (
            <div key={i} className="mb-2">
              <p className="text-gray-700 text-sm">{r.title}</p>
              <p className="text-blue-600 text-sm">{r.date}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
