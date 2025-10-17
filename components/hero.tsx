"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { gsap } from "gsap";

export default function Hero() {
  const slides = [
    {
      id: 1,
      heading: "Prepare Yourself for IT Era",
      subheading: "Get Yourself Renovated",
      texts: [
        "Software Development, Web Designing & Development",
        "Multimedia & Animation, Graphic Designing, Accounting Packages",
        "PSC Approved Packages",
      ],
      image: "/hero_lady.png",
      logo: "/logo_only.png",
    },
    {
      id: 2,
      heading: "Empower Your Future",
      subheading: "Learn with Experts",
      texts: [
        "Industry-oriented courses crafted for the future",
        "Hands-on mentorship from experienced professionals",
        "Career assistance and placement support",
      ],
      image: "/hero_lady.png",
      logo: "/logo_only.png",
    },
    {
      id: 3,
      heading: "Transform Your Skills",
      subheading: "Join the Digital Revolution",
      texts: [
        "AI, Data Science, Cloud & Full Stack Programs",
        "Collaborate with top mentors and peers",
        "Shape your professional journey with ACE",
      ],
      image: "/hero_lady.png",
      logo: "/logo_only.png",
    },
  ];

  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    gsap.set([".hero-heading", ".hero-subheading", ".hero-text", ".hero-button"], {
      clearProps: "all",
    });

    tl.fromTo(
      ".hero-heading",
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 1 }
    );
    tl.fromTo(
      ".hero-subheading",
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.8 },
      "-=0.6"
    );
    tl.fromTo(
      ".hero-text",
      { opacity: 0, x: -30 },
      { opacity: 1, x: 0, duration: 0.55, stagger: 0.15 },
      "-=0.45"
    );
    tl.fromTo(
      ".hero-button",
      { opacity: 0, scale: 0.95 },
      { opacity: 1, scale: 1, duration: 0.45 },
      "-=0.3"
    );

    return () => {
      tl.kill();
    };
  }, [currentSlide]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 10000);
    return () => clearInterval(interval);
  }, [slides.length]);

  return (
    <section className="relative bg-gradient-to-r from-blue-500 via-cyan-500 to-cyan-200 md:min-h-[600px] min-h-[675px] flex items-center overflow-hidden z-10">
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          aria-hidden={index !== currentSlide}
          className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
            index === currentSlide ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
          }`}
        >
          {/* Background Layer */}
          <div className="absolute bg-black/80 sm:bg-transparent inset-0 flex flex-col md:flex-row justify-center md:justify-between items-center md:px-0 z-0">
            <img
              src={slide.image}
              alt="Hero Mobile"
              className="block md:hidden w-full h-full object-cover object-[right_center] opacity-50"
            />

            {/* Desktop Logo */}
            <img
              src={slide.logo}
              alt="Logo"
              className="hidden md:block w-[300px] lg:w-[450px] h-auto opacity-80"
            />

            <div className="hidden md:block relative w-3/5 h-full z-0">
              <img
                src={slide.image}
                alt="Hero"
                className="w-full h-full object-cover z-0"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#00ace5] to-transparent pointer-events-none" />
              <div className="absolute inset-0 bg-gradient-to-l from-white/75 via-transparent to-transparent pointer-events-none" />
            </div>
          </div>

          <div className="relative max-w-7xl h-full flex justify-center items-center mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 md:py-28">
            <div className="text-white text-center md:text-left">
              <h1 className="hero-heading text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold mb-2">
                {slide.heading}
              </h1>
              <p className="hero-subheading text-base sm:text-lg md:text-xl mb-6 text-cyan-100 font-light">
                {slide.subheading}
              </p>

              <div className="space-y-2 mb-8 text-sm sm:text-base md:text-lg">
                {slide.texts.map((text, i) => (
                  <p key={i} className="hero-text">
                    {text}
                  </p>
                ))}
              </div>

              <Button
                size="lg"
                className="hero-button bg-white text-gray-700 cursor-pointer hover:bg-gray-100 px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold"
              >
                Explore Now
              </Button>
            </div>
          </div>
        </div>
      ))}

      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-3 z-20">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentSlide(i)}
            aria-label={`Go to slide ${i + 1}`}
            className={`w-3 h-3 rounded-full transition-all duration-200 ${
              i === currentSlide
                ? "bg-white scale-110 w-6"
                : "bg-white/50 hover:bg-white/70"
            }`}
            style={{ opacity: 1 }}
          />
        ))}
      </div>
    </section>
  );
}
