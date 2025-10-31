"use client";

import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { getNews } from "@/lib/api/news";

export default function NewsUpdates() {
  const router = useRouter();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [itemsPerSlide, setItemsPerSlide] = useState(3);
  const [newsList, setNewsList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const res = await getNews(1, 20, "", 1);
        setNewsList(res?.data || []);
      } catch (error) {
        console.error("Error fetching news:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchNews();
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) setItemsPerSlide(1);
      else setItemsPerSlide(3);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const totalSlides = Math.ceil(newsList.length / itemsPerSlide);

  const startAutoSlide = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (totalSlides > 1) {
      timerRef.current = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % totalSlides);
      }, 8000); 
    }
  };

  useEffect(() => {
    startAutoSlide();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [totalSlides]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    startAutoSlide();
  };

  const getSlides = () => {
    const slides = [];
    for (let i = 0; i < newsList.length; i += itemsPerSlide) {
      slides.push(newsList.slice(i, i + itemsPerSlide));
    }
    return slides;
  };

  if (loading) {
    return (
      <section className="bg-white md:py-16 py-8 px-4 md:px-10">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-10 text-cyan-900">
            News & Updates
          </h2>
          <p className="text-gray-500 text-lg">Loading latest news...</p>
        </div>
      </section>
    );
  }

  if (!newsList.length) {
    return (
      <section className="bg-white md:py-16 py-8 px-4 md:px-10">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-10 text-cyan-900">
            News & Updates
          </h2>
          <p className="text-gray-500 text-lg">No news available right now.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-white md:py-16 py-8 px-4 md:px-10 overflow-hidden">
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
                    key={n.news_id}
                    onClick={() => router.push(`/public/highlights/news/${n.news_id}`)}
                    className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-500 cursor-pointer hover:-translate-y-1"
                  >
                    <img
                      src={n.news_image}
                      alt={n.news_title}
                      className="w-full h-52 object-cover"
                    />
                    <div className="p-4 text-left">
                      <p className="text-sm text-gray-500 mb-2">
                        {new Date(n.date_time).toLocaleDateString("en-IN", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                      <h3 className="font-semibold text-gray-800 line-clamp-2">
                        {n.news_title}
                      </h3>
                      <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                        {n.news_description}
                      </p>
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
                className={`w-3 h-3 cursor-pointer rounded-full transition-all ${
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
