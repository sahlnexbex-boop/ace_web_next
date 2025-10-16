"use client";
import React, { useState, useEffect } from "react";

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
    {
      name: "Ashiq K",
      role: "Civil Excise Officer",
      quote:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
      image: "/boy_01.png",
    },
    {
      name: "Rahul ",
      role: "Police Officer",
      quote:
        "Contrary to popular belief, Lorem Ipsum is not simply random text.",
      image: "/rank_std_02.png",
    },
    {
      name: "Aisha Muhsina",
      role: "Nurse",
      quote: "Lorem Ipsum has roots in classical Latin literature.",
      image: "/girl_01.png",
    },
    {
      name: "Usman K",
      role: "Civil Excise Officer",
      quote:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
      image: "/boy_01.png",
    },
    {
      name: "Kumar Sajith",
      role: "Police Officer",
      quote:
        "Contrary to popular belief, Lorem Ipsum is not simply random text.",
      image: "/rank_std_02.png",
    },
    {
      name: "Aisha Rafna",
      role: "Nurse",
      quote: "Lorem Ipsum has roots in classical Latin literature.",
      image: "/girl_01.png",
    },
  ];

  const [currentSlide, setCurrentSlide] = useState(0);
  const [itemsPerSlide, setItemsPerSlide] = useState(3);

  // Adjust cards per slide based on screen width
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) setItemsPerSlide(1);
      else setItemsPerSlide(3);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const totalSlides = Math.ceil(testimonials.length / itemsPerSlide);

  // Auto-slide every 10 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % totalSlides);
    }, 10000);
    return () => clearInterval(timer);
  }, [totalSlides]);

  const goToSlide = (index: number) => setCurrentSlide(index);

  // Divide testimonials into slides
  const getSlides = () => {
    const slides = [];
    for (let i = 0; i < testimonials.length; i += itemsPerSlide) {
      slides.push(testimonials.slice(i, i + itemsPerSlide));
    }
    return slides;
  };

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

        {/* Carousel Container */}
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
                {slide.map((t, i) => (
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
            ))}
          </div>

          {/* Dots Navigation */}
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
