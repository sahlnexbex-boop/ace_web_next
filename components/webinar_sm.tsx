"use client";
import React, { useEffect, useState } from "react";

export default function Webinars() {
  const webinars = [
    {
      title: "AI in Education",
      date: "01 April 2025",
      time: "11:30am",
      duration: "2 Hours",
      image: "/webinar_01.png",
    },
    {
      title: "Career Guidance",
      date: "13 June 2025",
      time: "11:30am",
      duration: "2 Hours",
      image: "/webinar_02.png",
    },
    {
      title: "AI in Education",
      date: "01 April 2025",
      time: "11:30am",
      duration: "2 Hours",
      image: "/webinar_01.png",
    },
    {
      title: "Career Guidance",
      date: "13 June 2025",
      time: "11:30am",
      duration: "2 Hours",
      image: "/webinar_02.png",
    },
    {
      title: "AI in Education",
      date: "01 April 2025",
      time: "11:30am",
      duration: "2 Hours",
      image: "/webinar_01.png",
    },
    {
      title: "Career Guidance",
      date: "13 June 2025",
      time: "11:30am",
      duration: "2 Hours",
      image: "/webinar_02.png",
    },
  ];

  const [currentSlide, setCurrentSlide] = useState(0);
  const totalSlides = Math.ceil(webinars.length / 2);

  // Auto-slide every 10 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % totalSlides);
    }, 10000);
    return () => clearInterval(timer);
  }, [totalSlides]);

  // Go to specific slide
  const goToSlide = (index: number) => setCurrentSlide(index);

  // Each slide contains 2 webinars
  const getSlides = () => {
    const slides = [];
    for (let i = 0; i < webinars.length; i += 2) {
      slides.push(webinars.slice(i, i + 2));
    }
    return slides;
  };

  return (
    <section className="bg-white py-16 px-4 md:px-10 overflow-hidden">
      <div className="max-w-7xl mx-auto text-center">
        <h2 className="text-2xl md:text-3xl font-bold mb-10 text-cyan-900">
          Webinars
        </h2>

        {/* Carousel container */}
        <div className="relative w-full overflow-hidden">
          <div
            className="flex transition-transform duration-700 ease-in-out"
            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
          >
            {getSlides().map((pair, index) => (
              <div key={index} className="flex-shrink-0 w-full grid md:grid-cols-2 gap-8 px-2">
                {pair.map((web, i) => (
                  <div
                    key={i}
                    className="bg-white rounded-2xl shadow-md overflow-hidden border hover:shadow-md hover:shadow-blue-100 transition flex flex-col md:flex-row items-center p-4 md:p-6"
                  >
                    <div className="flex-shrink-0 w-full md:w-1/2">
                      <img
                        src={web.image}
                        alt={web.title}
                        className="rounded-xl object-cover w-full"
                      />
                    </div>
                    <div className="mt-4 md:mt-0 md:ml-6 text-left w-full md:w-1/2">
                      <h3 className="font-semibold text-lg md:text-xl mb-3">
                        {web.title}
                      </h3>
                      <div className="flex flex-wrap gap-3 text-sm text-gray-700 items-center">
                        <div className="flex items-center gap-1 bg-cyan-50 px-2 py-1 rounded-md">
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
                            className="text-cyan-600"
                          >
                            <rect
                              x="3"
                              y="4"
                              width="18"
                              height="18"
                              rx="2"
                              ry="2"
                            ></rect>
                            <line x1="16" y1="2" x2="16" y2="6"></line>
                            <line x1="8" y1="2" x2="8" y2="6"></line>
                            <line x1="3" y1="10" x2="21" y2="10"></line>
                          </svg>
                          <span>{web.date}</span>
                        </div>
                        <div className="flex items-center gap-1">
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
                            className="text-cyan-600"
                          >
                            <circle cx="12" cy="12" r="10"></circle>
                            <polyline points="12 6 12 12 16 14"></polyline>
                          </svg>
                          <span>{web.time}</span>
                        </div>
                        <div className="flex items-center gap-1">
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
                            className="text-cyan-600"
                          >
                            <circle cx="12" cy="12" r="10"></circle>
                            <path d="M12 6v6l4 2"></path>
                          </svg>
                          <span>{web.duration}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>

          {/* Dots */}
          <div className="flex justify-center gap-2 mt-6">
            {Array.from({ length: totalSlides }).map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-3 h-3 cursor-pointer rounded-full transition ${
                  currentSlide === index
                    ? "bg-cyan-600"
                    : "bg-gray-300 hover:bg-cyan-400"
                }`}
              ></button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
