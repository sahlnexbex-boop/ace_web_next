"use client";

import { useEffect, useState, useRef } from "react";
import { gsap } from "gsap";
import { getCarousels } from "@/lib/api/carousel";
import EnquiryModal from "@/components/enquiryModal";
import ApplyOnlineModal from "@/components/applyOnlineModal";

export default function Hero() {
  const [slides, setSlides] = useState<any[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [loading, setLoading] = useState(true);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const [openEnquiry, setOpenEnquiry] = useState(false);
  const [openAdmission, setOpenAdmission] = useState(false);
  const server_url = process.env.NEXT_PUBLIC_API_BASE_URL;


  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const fetchCarousels = async () => {
      try {
        setLoading(true);
        const res = await getCarousels(1, 10, "", 1);
        if (res?.data) setSlides(res.data);
      } catch (error) {
        console.error("Error fetching carousels:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCarousels();
  }, []);

  useEffect(() => {
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    gsap.set(
      [".hero-heading", ".hero-subheading", ".hero-text", ".hero-button"],
      {
        clearProps: "all",
      }
    );

    tl.fromTo(
      ".hero-heading",
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 1 }
    )
      .fromTo(
        ".hero-subheading",
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8 },
        "-=0.6"
      )
      .fromTo(
        ".hero-text",
        { opacity: 0, x: -30 },
        { opacity: 1, x: 0, duration: 0.55, stagger: 0.15 },
        "-=0.45"
      )
      .fromTo(
        ".hero-button",
        { opacity: 0, scale: 0.95 },
        { opacity: 1, scale: 1, duration: 0.45 },
        "-=0.3"
      );

    return () => {
      tl.kill();
    };
  }, [currentSlide]);

  const startAutoPlay = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 10000);
  };

  useEffect(() => {
    if (slides.length === 0) return;
    startAutoPlay();
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [slides]);

  useEffect(() => {
    const currentVideo = videoRefs.current[currentSlide];
    if (currentVideo) {
      currentVideo.play().catch(() => {
        currentVideo.muted = true;
        currentVideo
          .play()
          .catch((err) => console.warn("Autoplay prevented:", err));
      });
    }
  }, [currentSlide]);

  const handleDotClick = (index: number) => {
    setCurrentSlide(index);
    startAutoPlay();
  };

  if (loading) {
    return (
      <section className="relative md:min-h-[600px] min-h-[500px] bg-gray-100 flex items-center justify-center overflow-hidden">
        <div className="w-full h-full flex items-center justify-center">
          <div className="animate-pulse w-full h-full flex flex-col items-center justify-center space-y-4">
            <div className="bg-gray-300 h-full w-full" />
            <div className="absolute bottom-10 flex space-x-3">
              <div className="w-3 h-3 bg-gray-400 rounded-full" />
              <div className="w-3 h-3 bg-gray-400 rounded-full" />
              <div className="w-3 h-3 bg-gray-400 rounded-full" />
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (slides.length === 0) {
    return (
      <section className="md:min-h-[600px] flex items-center justify-center bg-gray-100">
        <p className="text-gray-500 text-lg">No carousel found</p>
      </section>
    );
  }

  return (
    <section className="relative flex items-center overflow-hidden z-10 md:min-h-[600px] min-h-[92vh]">
      {slides.map((slide, index) => {
        const displayFile = isMobile
          ? slide.carousel_mobile_file || slide.carousel_file
          : slide.carousel_file;

        const isVideo = displayFile?.toLowerCase().endsWith(".mp4");

        return (
          <div
            key={slide.carousel_id}
            aria-hidden={index !== currentSlide}
            className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
              index === currentSlide
                ? "opacity-100 z-10"
                : "opacity-0 z-0 pointer-events-none"
            }`}
          >
            <div className="absolute inset-0 flex justify-center items-center z-0">
              {isVideo ? (
                <video
                  ref={(el: HTMLVideoElement | null) => {
                    videoRefs.current[index] = el;
                  }}
                  src={server_url + displayFile}
                  autoPlay
                  loop
                  muted
                  playsInline
                  preload="auto"
                  className="w-full h-full object-cover"
                  onLoadedMetadata={(e) =>
                    e.currentTarget.play().catch(() => {})
                  }
                />
              ) : (
                <img
                  src={server_url +displayFile}
                  alt={slide.carousel_title}
                  className="w-full h-full object-cover"
                />
              )}
              <div className="absolute inset-0 bg-black/20" />
            </div>

            <div className="relative max-w-7xl h-full flex justify-start md:items-center items-start mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16 md:py-28 text-center md:text-left">
              <div className="text-white max-w-2xl">
                <h1 className="hero-heading text-start text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold mb-2 md:me-10">
                  {slide.carousel_title}
                </h1>
                <p className="hero-subheading text-start text-base sm:text-lg md:text-xl mb-4 text-cyan-100 font-light">
                  {slide.carousel_sec_title}
                </p>
                <p className="hero-text text-sm text-start sm:text-base md:text-lg leading-relaxed md:mb-6 mb-4 md:me-20">
                  {slide.carousel_description}
                </p>

                {slide.carousel_title && (
                  <div className="flex justify-start md:gap-8 gap-4">
                    {/* {slide.button_type === 1 ? ( */}
                      <button
                        onClick={() => setOpenEnquiry(true)}
                        className="hero-button inline-block bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-blue-500 hover:to-cyan-500 md:rounded-xl rounded-md text-white cursor-pointer hover:opacity-90 px-5 sm:px-7 py-1.5 sm:py-3 text-sm sm:text-base md:font-semibold font-light transition"
                      >
                        Enquiry
                      </button>
                    {/* ) : ( */}
                      <button
                        onClick={() => setOpenAdmission(true)}
                        className="hero-button inline-block bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-blue-500 hover:to-cyan-500 md:rounded-xl rounded-md text-white cursor-pointer hover:opacity-90 px-5 sm:px-7 py-1.5 sm:py-3 text-sm sm:text-base md:font-semibold font-light transition"
                      >
                        Admission
                      </button>
                    {/* )} */}
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}

      <div className="absolute bottom-6 sm:bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-3 z-20">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => handleDotClick(i)}
            aria-label={`Go to slide ${i + 1}`}
            className={`w-3 h-3 rounded-full transition-all duration-200 cursor-pointer ${
              i === currentSlide
                ? "bg-white scale-110 w-6"
                : "bg-white/50 hover:bg-white/70"
            }`}
          />
        ))}
      </div>

      <EnquiryModal 
        isOpen={openEnquiry} 
        onClose={() => setOpenEnquiry(false)} 
        enquiryType={1}
      />
      
      <ApplyOnlineModal 
        open={openAdmission} 
        onClose={() => setOpenAdmission(false)} 
      />
    </section>
  );
}
