"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";

interface Course {
  id: number;
  title: string;
  subtitle: string;
  image: string;
}

const courses: Course[] = [
  {
    id: 101,
    title: "SSC CGL (Combined Graduate Level Exam)",
    subtitle:
      "For Group B & C posts in ministries, departments & organizations.",
    image: "/category_01.png",
  },
  {
    id: 102,
    title: "SSC CHSL (Combined Higher Secondary Level)",
    subtitle: "For posts like LDC, DEO, Junior Secretariat Assistant etc.",
    image: "/category_02.png",
  },
  {
    id: 103,
    title: "SSC MTS (Multi Tasking Staff)",
    subtitle: "For non-gazetted, non-ministerial posts.",
    image: "/category_03.png",
  },
  {
    id: 104,
    title: "SSC GD Constable",
    subtitle:
      "For constable recruitment in CAPFs, NIA, SSF & Rifleman in Assam Rifles.",
    image: "/category_04.png",
  },
  {
    id: 105,
    title: "SSC CGL (Combined Graduate Level Exam)",
    subtitle:
      "For Group B & C posts in ministries, departments & organizations.",
    image: "/category_05.png",
  },
  {
    id: 106,
    title: "SSC CHSL (Combined Higher Secondary Level)",
    subtitle: "For posts like LDC, DEO, Junior Secretariat Assistant etc.",
    image: "/category_06.png",
  },
  {
    id: 107,
    title: "SSC MTS (Multi Tasking Staff)",
    subtitle: "For non-gazetted, non-ministerial posts.",
    image: "/category_07.png",
  },
  {
    id: 108,
    title: "SSC GD Constable",
    subtitle:
      "For constable recruitment in CAPFs, NIA, SSF & Rifleman in Assam Rifles.",
    image: "/category_08.png",
  },
];

export default function CourseCategoryPage({
  params,
}: {
  params: { categoryId: string };
}) {
  const router = useRouter();
  const categoryName = "SSC";

  const handleNavigate = (courseId: number) => {
    router.push(`/courses/${params.categoryId}/${courseId}`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 md:py-12 py-8 md:pb-32 pb-16">
      <div className="flex items-center gap-1 text-sm text-gray-500 mb-6">
        <button
          onClick={() => router.push("/")}
          className="text-gray-500 hover:text-[#1b6dac] flex items-center justify-center"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <path d="M5 12l-2 0l9 -9l9 9l-2 0" />
            <path d="M5 12v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-7" />
            <path d="M9 21v-6a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v6" />
          </svg>
        </button>

        <span>/</span>

        <span
          className="cursor-pointer hover:text-[#1b6dac]"
          onClick={() => router.push("/courses")}
        >
          Courses
        </span>

        <span>/</span>

        <span className="text-gray-800 font-medium">{categoryName}</span>
      </div>

      <h1 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-2">
        {categoryName}
      </h1>
      <p className="text-center text-[#0595d7] font-medium md:mb-10 mb-5">
        Offline Courses
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {courses.map((course) => (
          <div
            key={course.id}
            onClick={() => handleNavigate(course.id)}
            className="bg-gray-100 rounded-2xl overflow-hidden shadow-md hover:shadow-2xl hover:scale-[1.02] transition-all duration-500 cursor-pointer group flex flex-col"
          >
            <div className="relative w-full h-44 flex-shrink-0">
              <Image
                src={course.image}
                alt={course.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>

            <div className="flex flex-col justify-between flex-grow p-5">
              <div className="flex flex-col">
                <h3 className="font-bold text-gray-900 text-lg group-hover:text-[#1b6dac] transition-colors line-clamp-2">
                  {course.title}
                </h3>
                <p className="text-sm text-gray-600 line-clamp-2">
                  {course.subtitle}
                </p>
              </div>

              <div className="flex justify-between items-center text-blue-600 font-medium mt-auto pt-5">
                <span className="text-sm text-[#1b6dac] flex items-center gap-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="icon icon-tabler icons-tabler-outline icon-tabler-star"
                  >
                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                    <path d="M12 17.75l-6.172 3.245l1.179 -6.873l-5 -4.867l6.9 -1l3.086 -6.253l3.086 6.253l6.9 1l-5 4.867l1.179 6.873z" />
                  </svg>
                  4.2
                </span>
                <span className="text-[#1b6dac] hover:underline text-md">
                  View Details
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
