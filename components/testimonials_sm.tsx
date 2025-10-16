"use client";
import React from "react";

export default function Testimonials() {
  const testimonials = [
    {
      name: "Ashiq Usman K",
      role: "Civil Excise Officer",
      quote:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
      image: "/boy_01.png",
    },
    {
      name: "Rahul Kumar",
      role: "Police Officer",
      quote:
        "Contrary to popular belief, Lorem Ipsum is not simply random text.",
      image: "/rank_std_02.png",
    },
    {
      name: "Aisha M",
      role: "Nurse",
      quote: "Lorem Ipsum has roots in classical Latin literature.",
      image: "/girl_01.png",
    },
  ];

  return (
    <section className="bg-blue-50 py-16 px-4 sm:px-6 md:px-10 overflow-hidden">
      <div className="max-w-7xl mx-auto text-center">
        {/* Heading */}
        <div className="relative mb-12 text-left">
          <h2 className="text-2xl md:text-4xl font-bold text-gray-900 inline-block">
            Student Testimonials
          </h2>
          <div className="relative w-28 md:w-36 h-3 mt-1">
            <img
              src="/line_03.png"
              alt="underline"
              className="absolute left-0 bottom-0 w-full"
            />
          </div>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 sm:gap-10 md:gap-14">
          {testimonials.map((t, i) => (
            <div
              key={i}
              className="bg-white shadow-md rounded-xl p-6 text-left flex flex-col justify-between transition-transform duration-300 hover:scale-[1.02]"
            >
              <img
                src="/quates_blue.png"
                alt="quote"
                className="h-10 w-14 mb-3"
              />
              <p className="text-gray-700 mb-6 text-sm sm:text-base leading-relaxed">
                {t.quote}
              </p>
              <div className="flex items-center gap-3">
                <img
                  src={t.image}
                  alt={t.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <p className="font-semibold text-gray-900">{t.name}</p>
                  <p className="text-sm text-cyan-600">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
