"use client";

import { useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { gsap } from 'gsap';

export default function RankHoldersForum() {
  const sectionRef = useRef(null);
  const polygon1Ref = useRef(null);
  const polygon2Ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

          tl.fromTo(
            polygon1Ref.current,
            { opacity: 0, x: -50 },
            { opacity: 1, x: 0, duration: 0.8 }
          );

          tl.fromTo(
            polygon2Ref.current,
            { opacity: 0, x: 50 },
            { opacity: 1, x: 0, duration: 0.8 },
            '-=0.7' 
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
    <section ref={sectionRef} className="py-8 bg-[#098B9F1A]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-3 gap-12 items-center">
          {/* Content */}
          <div className="lg:col-span-2">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900">
              Rank Holders Forum
            </h2>
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              A special platform to recognize and celebrate the achievements of
              our outstanding rank holders. This forum provides an opportunity
              to connect, share experiences, and inspire upcoming students
              towards excellence.
            </p>
            <Button
              size="lg"
              className="cursor-pointer bg-gradient-to-r from-[#1F67A5] to-[#00A0E3] hover:bg-blue-700 text-white px-8 py-3"
            >
              Apply Now
            </Button>
          </div>

          {/* Illustration */}
          <div className="relative flex justify-end">
            {/* shapes */}
            <img
              ref={polygon1Ref}
              src="/polygon_01.png"
              alt="shapes"
              className="polygon-shape absolute top-5 left-0"
            />
            <img
              ref={polygon2Ref}
              src="/polygon_02.png"
              alt="shapes"
              className="polygon-shape absolute top-0 right-52"
            />

            <img src="/logo_rotated.png" alt="" className="absolute top-0" />

            {/* Main illustration */}
            <div className="relative z-10">
              <img
                src="/form_globe.png"
                alt="Educational success illustration"
                className="md:max-w-[450px] md:max-h-[450px] max-w-[320px] max-h-[320px]"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}