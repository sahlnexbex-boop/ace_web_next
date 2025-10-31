"use client";
import React, { useState, useEffect, useRef } from "react";
import { getTestimonials } from "@/lib/api/testimonial";
import Loader from "./loader";

interface TestimonialItem {
  testimonial_id: number;
  name_of_candidate: string;
  position_of_candidate: string;
  content: string;
  image_of_candidate: string;
  status: number;
}

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState<TestimonialItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [itemsPerSlide, setItemsPerSlide] = useState(3);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        setLoading(true);
        const res = await getTestimonials(1, 10, "", { status: "1" });
        const data = Array.isArray(res?.data)
          ? res.data
          : res?.data?.data || [];
        setTestimonials(data);
      } catch (error) {
        console.error("Error fetching testimonials:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTestimonials();
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setItemsPerSlide(window.innerWidth < 768 ? 1 : 3);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const totalSlides = Math.ceil(testimonials.length / itemsPerSlide) || 1;

  const startAutoSlide = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % totalSlides);
    }, 10000);
  };

  useEffect(() => {
    if (testimonials.length === 0) return;
    startAutoSlide();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [totalSlides, testimonials.length]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    startAutoSlide(); 
  };

  const getSlides = () => {
    const slides = [];
    for (let i = 0; i < testimonials.length; i += itemsPerSlide) {
      slides.push(testimonials.slice(i, i + itemsPerSlide));
    }
    return slides;
  };

  return (
    <section className="bg-blue-50 md:py-16 py-8 px-4 sm:px-6 md:px-10 overflow-hidden">
      <div className="max-w-7xl mx-auto text-center">
        <div className="relative md:mb-12 mb-6 text-left">
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

        {loading ? (
          <Loader />
        ) : testimonials.length === 0 ? (
          <div className="flex justify-center items-center min-h-[70vh] md:min-h-auto">
            <img src="../../no_data.png" alt="no data" className="opacity-30" />
          </div>
        ) : (
          <div className="relative w-full overflow-hidden">
            <div
              className="flex transition-transform duration-700 ease-in-out"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {getSlides().map((slide, slideIndex) => (
                <div
                  key={slideIndex}
                  className={`flex-shrink-0 w-full grid gap-8 p-3 ${
                    itemsPerSlide === 3 ? "md:grid-cols-3" : "grid-cols-1"
                  }`}
                >
                  {slide.map((t) => (
                    <div
                      key={t.testimonial_id}
                      className="bg-white shadow-md rounded-xl p-6 text-left flex flex-col justify-between transition-transform duration-300 hover:scale-[1.02]"
                    >
                      <img
                        src="/quates_blue.png"
                        alt="quote"
                        className="h-16 w-20 mb-3"
                      />
                      <p className="text-gray-700 mb-6 mt-3 text-sm sm:text-base leading-relaxed line-clamp-3">
                        {t.content || "No testimonial content available."}
                      </p>
                      <div className="flex items-center gap-3">
                        <img
                          src={t.image_of_candidate || "/default-avatar.png"}
                          alt={t.name_of_candidate}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                        <div>
                          <p className="font-semibold text-gray-900">
                            {t.name_of_candidate}
                          </p>
                          <p className="text-sm text-cyan-600">
                            {t.position_of_candidate}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>

            <div className="flex justify-center gap-2 mt-8">
              {Array.from({ length: totalSlides }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`w-3 h-3 cursor-pointer rounded-full transition-all ${
                    currentSlide === index
                      ? "bg-cyan-600 w-6"
                      : "bg-gray-300 hover:bg-cyan-400"
                  }`}
                ></button>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
