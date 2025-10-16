"use client";
import React, { useState, useEffect } from "react";

export default function FeaturedSuccess() {
  const stories = [
    {
      title: "ACE SUCCESS STORY | HSST RANK HOLDER",
      year: "2025",
      image: "/youtube_01.png",
    },
    {
      title: "HSA SOCIAL SCIENCE 1st Rank Holder",
      year: "2025",
      image: "/youtube_02.png",
    },
    {
      title: "Achievers' Meet 2023 | Calicut ACE | Prajin Prathap",
      year: "2025",
      image: "/youtube_03.png",
    },
    {
      title: "ACE SUCCESS STORY | HSST RANK HOLDER",
      year: "2025",
      image: "/youtube_01.png",
    },
    {
      title: "HSA SOCIAL SCIENCE 1st Rank Holder",
      year: "2025",
      image: "/youtube_02.png",
    },
    {
      title: "Achievers' Meet 2023 | Calicut ACE | Prajin Prathap",
      year: "2025",
      image: "/youtube_03.png",
    },
    {
      title: "ACE SUCCESS STORY | HSST RANK HOLDER",
      year: "2025",
      image: "/youtube_01.png",
    },
    {
      title: "HSA SOCIAL SCIENCE 1st Rank Holder",
      year: "2025",
      image: "/youtube_02.png",
    },
    {
      title: "Achievers' Meet 2023 | Calicut ACE | Prajin Prathap",
      year: "2025",
      image: "/youtube_03.png",
    },
  ];

  const [currentSlide, setCurrentSlide] = useState(0);
  const [itemsPerSlide, setItemsPerSlide] = useState(3);

  // Responsive slide count
  useEffect(() => {
    const handleResize = () => {
      setItemsPerSlide(window.innerWidth < 768 ? 1 : 3);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const totalSlides = Math.ceil(stories.length / itemsPerSlide);

  // Auto-slide every 10s
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % totalSlides);
    }, 10000);
    return () => clearInterval(timer);
  }, [totalSlides]);

  const goToSlide = (index: number) => setCurrentSlide(index);

  // Divide into slides
  const getSlides = () => {
    const slides = [];
    for (let i = 0; i < stories.length; i += itemsPerSlide) {
      slides.push(stories.slice(i, i + itemsPerSlide));
    }
    return slides;
  };

  return (
    <section className="bg-white py-16 px-6 md:px-10 overflow-hidden">
      <div className="max-w-7xl mx-auto text-center">
        {/* Heading */}
        <div className="relative mb-12 text-left">
          <h2 className="text-2xl md:text-4xl font-bold text-cyan-900 inline-block">
            Featured Success Stories
          </h2>
          <div className="relative w-32 md:w-40 h-3 mt-1">
            <img
              src="/line_03.png"
              alt="underline"
              className="absolute left-0 bottom-0 w-full"
            />
          </div>
        </div>

        {/* Carousel */}
        <div className="relative w-full overflow-hidden">
          <div
            className="flex transition-transform duration-700 ease-in-out"
            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
          >
            {getSlides().map((slide, slideIndex) => (
              <div
                key={slideIndex}
                className={`flex-shrink-0 w-full grid gap-8 ${
                  itemsPerSlide === 3 ? "md:grid-cols-3" : "grid-cols-1"
                }`}
              >
                {slide.map((s, i) => (
                  <div
                    key={i}
                    className="bg-white rounded-xl shadow-md overflow-hidden transition-transform duration-300 hover:scale-[1.02]"
                  >
                    <img
                      src={s.image}
                      alt={s.title}
                      className="w-full h-48 object-cover"
                    />
                    <div className="p-4 text-left">
                      <h3 className="font-semibold text-gray-800 mb-2 text-sm sm:text-base">
                        {s.title}
                      </h3>
                      <span className="inline-block bg-cyan-100 text-cyan-700 text-xs font-semibold px-3 py-1 rounded-full">
                        {s.year}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>

          {/* Dots */}
          <div className="flex justify-center gap-2 mt-8">
            {Array.from({ length: totalSlides }).map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-3 h-3 rounded-full transition-all ${
                  currentSlide === index
                    ? "bg-cyan-600 w-6"
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
