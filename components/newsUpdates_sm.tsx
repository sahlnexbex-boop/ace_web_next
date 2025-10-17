"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function NewsUpdates() {
  const router = useRouter();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [itemsPerSlide, setItemsPerSlide] = useState(3);

  const news = [
    { id: 1, title: "ACE announces new scholarship program 2025", date: "September 16, 2025", image: "/news_01.png" },
    { id: 2, title: "Results declared for Semester 1 Exams", date: "September 16, 2025", image: "/news_02.png" },
    { id: 3, title: "ACE announces new scholarship program 2025", date: "September 16, 2025", image: "/news_01.png" },
    { id: 4, title: "Declared for Semester 1 Exams", date: "September 16, 2025", image: "/news_02.png" },
    { id: 5, title: "ACE new scholarship program 2025", date: "September 16, 2025", image: "/news_01.png" },
    { id: 6, title: "New scholarship program 2025", date: "September 16, 2025", image: "/news_01.png" },
  ];
  
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) setItemsPerSlide(1);
      else setItemsPerSlide(3);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const totalSlides = Math.ceil(news.length / itemsPerSlide);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % totalSlides);
    }, 10000);
    return () => clearInterval(timer);
  }, [totalSlides]);

  const goToSlide = (index: number) => setCurrentSlide(index);

  const getSlides = () => {
    const slides = [];
    for (let i = 0; i < news.length; i += itemsPerSlide) {
      slides.push(news.slice(i, i + itemsPerSlide));
    }
    return slides;
  };

  return (
    <section className="bg-white py-16 px-4 md:px-10 overflow-hidden">
      <div className="max-w-7xl mx-auto text-center">
        <h2 className="text-2xl md:text-3xl font-bold mb-10 text-cyan-900">
          News & Updates
        </h2>

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
                {slide.map((n) => (
                  <div
                    key={n.id}
                    onClick={() => router.push(`/highlights/news/${n.id}`)}
                    className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer"
                  >
                    <img
                      src={n.image}
                      alt={n.title}
                      className="w-full h-44 object-cover"
                    />
                    <div className="p-4 text-left">
                      <p className="text-sm text-gray-500 mb-2">{n.date}</p>
                      <h3 className="font-semibold text-gray-800">{n.title}</h3>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>

          <div className="flex justify-center gap-2 mt-6">
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
