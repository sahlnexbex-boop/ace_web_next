"use client";
import React, { useEffect, useState, useRef } from "react";
import { getWebinars } from "@/lib/api/webinar";
import DynamicVideoModal from "@/components/dynamicVideoModal";
import Loader from "./loader";

interface WebinarItem {
  webinar_id: number;
  webinar_title: string;
  date_time: string;
  webinar_duration: string;
  webinar_image: string;
  webinar_description: string;
  webinar_link: string;
  speaker_name: string;
  speaker_position: string;
  status: number;
  category?: {
    category_id: number;
    category_name: string;
  };
}

export default function Webinars() {
  const [webinars, setWebinars] = useState<WebinarItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [itemsPerSlide, setItemsPerSlide] = useState(2);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const [videoUrl, setVideoUrl] = useState("");
  const [isModalOpen, setModalOpen] = useState(false);
  const server_url = process.env.NEXT_PUBLIC_API_BASE_URL;

  useEffect(() => {
    const fetchWebinars = async () => {
      try {
        setLoading(true);
        const res = await getWebinars(1, 10, "", 1);
        const data = Array.isArray(res?.data)
          ? res.data
          : res?.data?.data || [];
        setWebinars(data);
      } catch (error) {
        console.error("Error fetching webinars:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchWebinars();
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setItemsPerSlide(window.innerWidth < 768 ? 1 : 2);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const totalSlides = Math.ceil(webinars.length / itemsPerSlide) || 1;

  const startAutoSlide = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % totalSlides);
    }, 10000);
  };

  useEffect(() => {
    if (webinars.length === 0) return;
    startAutoSlide();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [totalSlides, webinars.length]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    startAutoSlide();
  };

  const getSlides = () => {
    const slides = [];
    for (let i = 0; i < webinars.length; i += itemsPerSlide) {
      slides.push(webinars.slice(i, i + itemsPerSlide));
    }
    return slides;
  };

  const formatDate = (isoDate: string) => {
    const date = new Date(isoDate);
    const options: Intl.DateTimeFormatOptions = {
      day: "2-digit",
      month: "short",
      year: "numeric",
    };
    return date.toLocaleDateString("en-US", options);
  };

  const openVideo = (url: string) => {
    setVideoUrl(url);
    setModalOpen(true);
  };
  const closeVideo = () => setModalOpen(false);

  const formatTime = (isoDate: string) => {
    const date = new Date(isoDate);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <section className="bg-white md:py-16 py-8 px-4 md:px-10 overflow-hidden">
      <div className="max-w-7xl mx-auto text-center">
        <h2 className="text-2xl md:text-3xl font-bold mb-10 text-cyan-900">
          Webinars
        </h2>

        {loading ? (
          <Loader />
        ) : webinars.length === 0 ? (
          <div className="flex justify-center items-center min-h-[60vh]">
            <img src="/no_data.png" alt="no data" className="opacity-30" />
          </div>
        ) : (
          <div className="relative w-full overflow-hidden">
            {/* Slides */}
            <div
              className="flex transition-transform duration-700 ease-in-out"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {getSlides().map((slide, slideIndex) => (
                <div
                  key={slideIndex}
                  className={`flex-shrink-0 w-full grid gap-8 ${
                    itemsPerSlide === 2 ? "md:grid-cols-2" : "grid-cols-1"
                  }`}
                >
                  {slide.map((web) => (
                    <div
                      key={web.webinar_id}
                      onClick={() => openVideo(web.webinar_link)}
                      className="bg-white rounded-2xl shadow-md overflow-hidden border hover:shadow-md hover:shadow-blue-100 transition flex flex-col md:flex-row items-center p-4 md:p-6"
                    >
                      <div className="flex-shrink-0 w-full md:w-1/2">
                        <img
                          src={server_url + web.webinar_image || "/default-image.png"}
                          alt={web.webinar_title}
                          className="rounded-xl object-cover w-full h-full"
                        />
                      </div>
                      <div className="mt-4 md:mt-0 md:ml-6 text-left w-full md:w-1/2">
                        <h3 className="font-semibold text-lg md:text-xl mb-3 text-gray-900">
                          {web.webinar_title}
                        </h3>
                        <div className="flex flex-wrap gap-3 text-sm text-gray-700 items-center">
                          {/* Date */}
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
                              />
                              <line x1="16" y1="2" x2="16" y2="6" />
                              <line x1="8" y1="2" x2="8" y2="6" />
                              <line x1="3" y1="10" x2="21" y2="10" />
                            </svg>
                            <span>{formatDate(web.date_time)}</span>
                          </div>
                          {/* Time */}
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
                            <span>{formatTime(web.date_time)}</span>
                          </div>
                          {/* Duration */}
                          <div className="flex items-center gap-1 ps-2">
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
                            <span>{web.webinar_duration}</span>
                          </div>
                        </div>
                        {/* Speaker */}
                        <div className="mt-4">
                          <p className="text-sm text-gray-600">
                            <strong>{web.speaker_name}</strong> —{" "}
                            {web.speaker_position}
                          </p>
                        </div>
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
        )}
      </div>

      <DynamicVideoModal
        isOpen={isModalOpen}
        onClose={closeVideo}
        videoUrl={videoUrl}
      />
    </section>
  );
}
