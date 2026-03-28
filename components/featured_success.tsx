"use client";
import React, { useState, useEffect } from "react";
import { getSuccessStories } from "@/lib/api/successStories";
// import DynamicVideoModal from "@/components/dynamicVideoModal";
// import { Video } from "lucide-react";
import VideoModal from "./videoModal";

export default function FeaturedSuccess() {
  const [stories, setStories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setModalOpen] = useState(false);
  const [videoUrl, setVideoUrl] = useState("");
  const [currentSlide, setCurrentSlide] = useState(0);
  const [itemsPerSlide, setItemsPerSlide] = useState(3);
  const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null);
  const server_url = process.env.NEXT_PUBLIC_API_BASE_URL;

  useEffect(() => {
    const fetchStories = async () => {
      try {
        const response = await getSuccessStories(1, 100, "", "", 1);
        const storyList = response?.data || [];
        setStories(storyList);
      } catch (err) {
        console.error("Error fetching success stories:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStories();
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setItemsPerSlide(window.innerWidth < 768 ? 1 : 3);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (stories.length === 0) return;
    if (intervalId) clearInterval(intervalId);
    const newInterval = setInterval(() => {
      setCurrentSlide(
        (prev) => (prev + 1) % Math.ceil(stories.length / itemsPerSlide)
      );
    }, 8000);
    setIntervalId(newInterval);
    return () => clearInterval(newInterval);
  }, [stories, itemsPerSlide]);

  const totalSlides = Math.ceil(stories.length / itemsPerSlide);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    if (intervalId) {
      clearInterval(intervalId);
      const newInterval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % totalSlides);
      }, 8000);
      setIntervalId(newInterval);
    }
  };

  const openVideo = (url?: string) => {
    const normalizedUrl = url?.trim();
    if (!normalizedUrl) return;

    setVideoUrl(normalizedUrl);
    setModalOpen(true);
  };
  const closeVideo = () => {
    setModalOpen(false);
    setVideoUrl("");
  };

  const getSlides = () => {
    const slides = [];
    for (let i = 0; i < stories.length; i += itemsPerSlide) {
      slides.push(stories.slice(i, i + itemsPerSlide));
    }
    return slides;
  };

  if (loading) {
    return (
      <section className="bg-white py-16 text-center">
        <p className="text-gray-500">Loading success stories...</p>
      </section>
    );
  }

  if (stories.length === 0) {
    return (
      <section className="bg-white py-16 text-center">
        <p className="text-gray-500">No success stories available.</p>
      </section>
    );
  }

  return (
    <section className="bg-white py-16 px-6 md:px-10 overflow-hidden">
      <div className="max-w-7xl mx-auto text-center">
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

        <div className="relative w-full overflow-hidden">
          <div
            className="flex transition-transform duration-700 ease-in-out"
            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
          >
            {getSlides().map((slide, slideIndex) => (
              <div
                key={slideIndex}
                className={`flex-shrink-0 w-full grid gap-8 lg:gap-12 md:py-3 md:px-3 ${itemsPerSlide === 3 ? "md:grid-cols-3" : "grid-cols-1"
                  }`}
              >
                {slide.map((s: any, i: number) => (
                  <div
                    key={i}
                    onClick={() => openVideo(s.youtube_video_link)}
                    className="bg-white rounded-xl shadow-md overflow-hidden cursor-pointer transition-transform duration-300 hover:scale-[1.02]"
                  >
                    <img
                      src={server_url + s.thumbnail_image}
                      alt={s.stories_title}
                      className="w-full lg:h-60 object-cover"
                    />
                    <div className="p-4 text-left">
                      <h3 className="font-semibold text-gray-800 mb-2 text-sm sm:text-base line-clamp-2">
                        {s.stories_title}
                      </h3>
                      <p className="text-gray-600 text-xs mb-2 line-clamp-2">
                        {s.description}
                      </p>
                      <span className="inline-block bg-cyan-100 text-cyan-700 text-xs font-semibold px-3 py-1 rounded-full">
                        {s.year}
                      </span>
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
                className={`w-3 h-3 cursor-pointer rounded-full transition-all ${currentSlide === index
                  ? "bg-cyan-600 w-6"
                  : "bg-gray-300 hover:bg-cyan-400"
                  }`}
              ></button>
            ))}
          </div>
        </div>
      </div>

      <VideoModal
        isOpen={isModalOpen}
        onClose={closeVideo}
        videoUrl={videoUrl}
      />
    </section>
  );
}
