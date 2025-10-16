"use client";

import { useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { gsap } from 'gsap';

export default function SocialService() {
  const programmes = [
    { title: "Career Guidance Programme", hasArrow: true },
    { title: "Effective parental training", hasArrow: true },
    { title: "Pre marital Counselling", hasArrow: true, highlighted: true },
    { title: "Anti Drugs Programme\nFinancial improvement Programme", hasArrow: true, large: true },
  ];

  const sectionRef = useRef(null);
  const rotatedLogoRef = useRef(null);
  const normalLogoRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

          // Animate rotated logo (applies to both mobile and desktop)
          tl.fromTo(
            rotatedLogoRef.current,
            { opacity: 0, scale: 0.7 },
            { opacity: 1, scale: 1, duration: 0.8 }
          );

          // Animate normal logo with slight stagger (applies to both mobile and desktop)
          tl.fromTo(
            normalLogoRef.current,
            { opacity: 0, scale: 0.7 },
            { opacity: 1, scale: 1, duration: 0.8 },
            '-=0.7' // 0.1s stagger
          );

          observer.disconnect();
        }
      },
      { threshold: 0.5 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  return (
    <section ref={sectionRef} className="md:py-16 py-10 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
        <div className="lg:grid lg:grid-cols-3 flex flex-col gap-6 items-start">
          {/* Content */}
          <div className="md:col-span-2">
            <div className="relative inline-block mb-10">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                Social Service Programme
              </h2>
              <img
                src="/line_01.png"
                alt="underline"
                className="absolute left-32 -bottom-3 w-20 hidden lg:block"
              />
            </div>

            {/* Programme Grid */}
            <div className="grid grid-cols-2 gap-4 lg:gap-6 auto-rows-[90px] lg:auto-rows-[100px] max-w-full">
              {programmes.map((programme, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className={`flex flex-col items-start justify-between text-left shadow-md rounded-3xl px-4 sm:px-6 py-4 sm:py-6 transition-all duration-300 h-full
                    ${
                      programme.highlighted
                        ? "bg-gradient-to-r from-blue-500 to-blue-700 text-white hover:from-blue-600 hover:to-blue-800"
                        : "bg-white text-gray-800 hover:text-blue-600"
                    }
                    ${programme.large ? "row-span-2" : ""}
                  `}
                >
                  <span className="text-sm sm:text-base lg:text-base font-medium leading-snug whitespace-pre-line">
                    {programme.title}
                  </span>
                  {programme.hasArrow && (
                    <ArrowRight
                      className={`w-4 sm:w-5 h-4 sm:h-5 mt-2 sm:mt-3 ml-auto ${
                        programme.highlighted ? "text-white" : "text-cyan-600"
                      }`}
                    />
                  )}
                </Button>
              ))}
            </div>
          </div>

          {/* Right-side logos */}
          <div className="relative h-full flex items-stretch justify-center lg:justify-end mt-6 lg:mt-0">
            {/* Desktop logos - absolute positioning */}
            <div className="hidden lg:block relative h-full w-full">
              <img
                ref={rotatedLogoRef}
                src="/logo_full.png"
                alt="rotated_logo"
                className="service-logo w-40 md:w-72 h-40 md:h-56 transform rotate-180 absolute left-0 top-16"
              />
              <img
                ref={normalLogoRef}
                src="/logo_full.png"
                alt="normal_logo"
                className="service-logo w-40 md:w-72 h-40 md:h-56 absolute right-0 bottom-0"
              />
            </div>

            {/* Mobile logos - flex row */}
            <div className="flex lg:hidden flex-row gap-4 justify-center w-full">
              <img
                ref={rotatedLogoRef}
                src="/logo_full.png"
                alt="rotated_logo"
                className="service-logo w-24 sm:w-32 h-auto"
              />
              <img
                ref={normalLogoRef}
                src="/logo_full.png"
                alt="normal_logo"
                className="service-logo w-24 sm:w-32 h-auto"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}