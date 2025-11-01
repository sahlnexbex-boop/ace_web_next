"use client";

import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import VideoModal from "@/components/videoModal";
import EnquiryModal from "./enquiryModal";

export default function AboutHeader() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showEnquiryModal, setShowEnquiryModal] = useState(false);

  const yearsRef = useRef<HTMLSpanElement | null>(null);
  const studentsRef = useRef<HTMLSpanElement | null>(null);
  const facultyRef = useRef<HTMLSpanElement | null>(null);
  const statsRef = useRef<HTMLDivElement | null>(null);

  const YEARS_TARGET = 20;
  const STUDENTS_TARGET = 5000;
  const FACULTY_TARGET = 100;

  const STUDENTS_STEP = 100;
  const YEARS_STEP = 1;
  const FACULTY_STEP = 1;

  useEffect(() => {
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    tl.fromTo(
      ".about-heading",
      { opacity: 0, y: 40 },
      { opacity: 1, y: 0, duration: 0.9 }
    );
    tl.fromTo(
      ".about-text",
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.8 },
      "-=0.6"
    );
    tl.fromTo(
      ".about-stats > *",
      { opacity: 0, y: 16 },
      { opacity: 1, y: 0, duration: 0.7, stagger: 0.12 },
      "-=0.5"
    );
    tl.fromTo(
      ".about-button",
      { opacity: 0, scale: 0.95 },
      { opacity: 1, scale: 1, duration: 0.5 },
      "-=0.45"
    );

    const obs = new IntersectionObserver(
      (entries) => {
        if (!entries[0].isIntersecting) return;

        const yearObj = { v: 0 };
        const studentsObj = { v: 0 };
        const facultyObj = { v: 0 };
        const duration = 2.2;

        gsap.to(yearObj, {
          v: YEARS_TARGET,
          duration,
          ease: "power3.out",
          onUpdate: () => {
            if (yearsRef.current) {
              const stepped = Math.ceil(yearObj.v / YEARS_STEP) * YEARS_STEP;
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
    return () => {
      tl.kill();
      obs.disconnect();
    };
  }, []);

  return (
    <>
      <section className="relative bg-white md:py-20 py-8 px-6 md:px-10 overflow-hidden">
        <div className="relative max-w-7xl mx-auto grid gap-10 items-center grid-cols-1 md:grid-cols-2">
          <div className="order-1 md:order-2 flex justify-center relative z-10">
            <div className="relative w-full max-w-md">
              <img
                src="/about_thumbnail.png"
                alt="Success Stories"
                className="rounded-xl shadow-lg w-full object-cover"
              />
              <button
                onClick={() => setIsModalOpen(true)}
                className="absolute inset-0 flex justify-center items-center"
                aria-label="Play video"
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

          <div className="order-2 md:order-1">
            <h2 className="about-heading text-2xl md:text-3xl font-bold mb-4 text-gray-900">
              Success Stories Ace
            </h2>

            <p className="about-text text-gray-700 mb-6">
              Lorem Ipsum is simply dummy text of the printing and typesetting
              industry. Lorem Ipsum has been the industry's standard dummy text.
            </p>

            <div
              ref={statsRef}
              className="about-stats flex flex-wrap gap-4 bg-white py-5 rounded-3xl"
            >
              <div className="about-stat rounded-lg md:p-4 flex-1 text-center">
                <div className="md:text-5xl text-2xl font-bold text-cyan-700">
                  <span ref={yearsRef}>0+</span>
                </div>
                <div className="text-xs md:text-sm text-gray-600">
                  Years of Excellence
                </div>
              </div>

              <div className="about-stat rounded-lg md:p-4 flex-1 text-center">
                <div className="md:text-5xl text-2xl font-bold text-cyan-700">
                  <span ref={studentsRef}>0+</span>
                </div>
                <div className="text-xs md:text-sm text-gray-600">
                  Successful Students
                </div>
              </div>

              <div className="about-stat rounded-lg md:p-4 flex-1 text-center">
                <div className="md:text-5xl text-2xl font-bold text-cyan-700">
                  <span ref={facultyRef}>0+</span>
                </div>
                <div className="text-xs md:text-sm text-gray-600">
                  Expert Faculty
                </div>
              </div>
            </div>

           <button
                onClick={() => setShowEnquiryModal(true)}
                className="bg-gradient-to-r from-[#1F67A5] to-[#087fc2] hover:from-[#087fc2] hover:to-[#1F67A5] text-white font-semibold px-6 py-2.5 rounded-lg transition cursor-pointer"
              >
                Enquire Now
              </button>
          </div>
        </div>
      </section>

      <VideoModal
        videoUrl="https://www.youtube.com/embed/sYNjG9tdhTo"
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />

      <EnquiryModal
              isOpen={showEnquiryModal}
              onClose={() => setShowEnquiryModal(false)}
              enquiryType={1}
            />
    </>
  );
}
