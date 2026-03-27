"use client";

import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import VideoModal from "@/components/videoModal";

export default function SuccessStories() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const youtubeVideoId = "F2ZenrcTMsw";

  const yearsRef = useRef(null);
  const studentsRef = useRef(null);
  const facultyRef = useRef(null);
  const statsRef = useRef(null);

  const YEARS_TARGET = 20;
  const STUDENTS_TARGET = 25000;
  const FACULTY_TARGET = 250;

  const YEARS_STEP = 1;
  const STUDENTS_STEP = 1000;
  const FACULTY_STEP = 10;

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        if (!entries[0].isIntersecting) return;

        const yearsObj = { v: 0 };
        const studentsObj = { v: 0 };
        const facultyObj = { v: 0 };
        const duration = 2.2;

        gsap.to(yearsObj, {
          v: YEARS_TARGET,
          duration,
          ease: "power3.out",
          onUpdate: () => {
            if (yearsRef.current) {
              const stepped = Math.ceil(yearsObj.v / YEARS_STEP) * YEARS_STEP;
              yearsRef.current.innerText = `${Math.min(
                stepped,
                YEARS_TARGET
              )}+`;
            }
          },
        });

        gsap.to(studentsObj, {
          v: STUDENTS_TARGET,
          duration,
          ease: "power3.out",
          onUpdate: () => {
            if (studentsRef.current) {
              const stepped =
                Math.ceil(studentsObj.v / STUDENTS_STEP) * STUDENTS_STEP;
              studentsRef.current.innerText = `${Math.min(
                stepped,
                STUDENTS_TARGET
              )}+`;
            }
          },
        });

        gsap.to(facultyObj, {
          v: FACULTY_TARGET,
          duration,
          ease: "power3.out",
          onUpdate: () => {
            if (facultyRef.current) {
              const stepped =
                Math.ceil(facultyObj.v / FACULTY_STEP) * FACULTY_STEP;
              facultyRef.current.innerText = `${Math.min(
                stepped,
                FACULTY_TARGET
              )}+`;
            }
          },
        });

        obs.disconnect();
      },
      { threshold: 0.45 }
    );

    if (statsRef.current) obs.observe(statsRef.current);
    return () => obs.disconnect();
  }, []);

  return (
    <>
      <section className="relative bg-gradient-to-r from-[#1599ab] to-[#69c7d2] py-20 px-6 md:px-10 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="/highlight_abstract.png"
            alt="Abstract Background"
            className="w-full h-full object-cover opacity-50"
          />
        </div>

        <div className="relative max-w-7xl mx-auto grid md:grid-cols-2 gap-10 items-center z-10">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold mb-4 text-white">
              Success Stories Ace
            </h2>
            <p className="text-gray-100 mb-6">
              Every achievement at ACE is a story of relentless efforts in the
              right direction. With one-on-one PSC training, specially curated
              study materials and sample question papers for competitive exam
              preparation, we have developed a PSC training model that works
              wonders.Discover real stories of our dear students and the efforts
              that helped them achieve their goals.
            </p>

            <div
              ref={statsRef}
              className="flex flex-wrap gap-4 bg-white py-5 rounded-3xl shadow-md"
            >
              <div className="rounded-lg md:p-4 p-2 flex-1 text-center">
                <p className="md:text-3xl text-2xl font-bold text-cyan-700">
                  <span ref={yearsRef}>0+</span>
                </p>
                <p className="text-xs text-gray-600">Years of Excellence</p>
              </div>

              <div className="rounded-lg md:p-4 p-2 flex-1 text-center">
                <p className="md:text-3xl text-2xl font-bold text-cyan-700">
                  <span ref={studentsRef}>0+</span>
                </p>
                <p className="text-xs text-gray-600">Successful Students</p>
              </div>

              <div className="rounded-lg md:p-4 p-2 flex-1 text-center">
                <p className="md:text-3xl text-2xl font-bold text-cyan-700">
                  <span ref={facultyRef}>0+</span>
                </p>
                <p className="text-xs text-gray-600">Expert Faculties</p>
              </div>
            </div>
          </div>

          <div className="flex justify-center relative z-10">
            <div className="relative max-w-md">
              <img
                src="/success_image.jpeg"
                alt="Success Stories"
                className="rounded-xl shadow-lg w-full h-full"
              />
              <button
                onClick={() => setIsModalOpen(true)}
                className="absolute inset-0 flex justify-center items-center"
                aria-label="Play Video"
              >
                <div className="bg-white cursor-pointer rounded-full p-4 shadow-md hover:scale-105 transition-transform">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="30"
                    height="30"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#0ea5e9"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polygon points="5 3 19 12 5 21 5 3" />
                  </svg>
                </div>
              </button>
            </div>
          </div>
        </div>
      </section>

      <VideoModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        videoId={youtubeVideoId}
      />
    </>
  );
}
