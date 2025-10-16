"use client";

import { useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { gsap } from 'gsap';

export default function AboutUs() {
  const tabs = [
    {
      text: "PAC Corner",
      textColor: "text-green-600",
      bg: "bg-green-300/10",
      hover: "hover:bg-green-50",
    },
    {
      text: "Exam & Results",
      textColor: "text-purple-600",
      bg: "bg-purple-300/10",
      hover: "hover:bg-purple-50",
    },
    {
      text: "Exam & Ans Keys",
      textColor: "text-blue-600",
      bg: "bg-blue-300/10",
      hover: "hover:bg-blue-50",
    },
    {
      text: "Rank Holder List",
      textColor: "text-red-500",
      bg: "bg-red-300/10",
      hover: "hover:bg-red-50",
    },
    {
      text: "Online Admission",
      textColor: "text-teal-600",
      bg: "bg-teal-300/10",
      hover: "hover:bg-teal-50",
    },
    {
      text: "Publications",
      textColor: "text-gray-600",
      bg: "bg-gray-300/10",
      hover: "hover:bg-gray-50",
    },
    {
      text: "Event Gallery",
      textColor: "text-pink-600",
      bg: "bg-pink-300/10",
      hover: "hover:bg-pink-50",
    },
  ];

  const yearsRef = useRef(null);
  const studentsRef = useRef(null);
  const facultyRef = useRef(null);
  const statsRef = useRef(null);

  useEffect(() => {
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    tl.fromTo(
      '.about-heading',
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 1 }
    );

    tl.fromTo(
      '.about-subheading',
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.8 },
      '-=0.5'
    );

    tl.fromTo(
      '.about-text',
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.7 },
      '-=0.4'
    );

    tl.fromTo(
      '.about-stat',
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.6, stagger: 0.2 },
      '-=0.5'
    );

    tl.fromTo(
      '.about-button',
      { opacity: 0, scale: 0.8 },
      { opacity: 1, scale: 1, duration: 0.5 },
      '-=0.3'
    );

    tl.fromTo(
      '.about-tab',
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.6, stagger: 0.1 },
      '-=0.4'
    );

    tl.fromTo(
      '.notifications-panel',
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 0.8 },
      '-=0.5'
    );

    tl.fromTo(
      '.notification-item',
      { opacity: 0, x: 30 },
      { opacity: 1, x: 0, duration: 0.6, stagger: 0.15 },
      '-=0.4'
    );

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          const counterTl = gsap.timeline({ defaults: { ease: 'power3.out' } });
          const counterDuration = 3;
          counterTl.to(
            yearsRef.current,
            {
              innerText: 20,
              duration: counterDuration,
              snap: { innerText: 1 },
              delay: 0.5,
              onUpdate: function () {
                yearsRef.current.innerText = Math.ceil(this.targets()[0].innerText) + '+';
              },
            },
            'start'
          );
          counterTl.to(
            studentsRef.current,
            {
              innerText: 5000,
              duration: counterDuration,
              snap: { innerText: 500 },
              delay: 0.5,
              onUpdate: function () {
                studentsRef.current.innerText = Math.ceil(this.targets()[0].innerText) + '+';
              },
            },
            'start'
          );
          counterTl.to(
            facultyRef.current,
            {
              innerText: 100,
              duration: counterDuration,
              snap: { innerText: 10 },
              delay: 0.5,
              onUpdate: function () {
                facultyRef.current.innerText = Math.ceil(this.targets()[0].innerText) + '+';
              },
            },
            'start'
          );

          observer.disconnect();
        }
      },
      { threshold: 0.5 }
    );

    if (statsRef.current) {
      observer.observe(statsRef.current);
    }

    return () => {
      tl.kill();
      if (statsRef.current) {
        observer.unobserve(statsRef.current);
      }
    };
  }, []);

  return (
    <section className="md:py-16 py-10 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col-reverse lg:flex-row gap-12 items-start">
          <div className="relative w-full lg:w-1/2 z-10">
            <img
              src="/logo_full.png"
              alt="background_logo"
              className="absolute right-28 blur-[1px] -bottom-10 z-1 hidden sm:block"
            />
            <div className="notifications-panel bg-white/80 rounded-lg shadow-lg p-6 max-w-md !z-10 relative mx-auto lg:mx-0">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-gray-900">
                  Notifications
                </h3>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="cursor-pointer"
                >
                  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                  <path d="M10 5a2 2 0 1 1 4 0a7 7 0 0 1 4 6v3a4 4 0 0 0 2 3h-16a4 4 0 0 0 2 -3v-3a7 7 0 0 1 4 -6" />
                  <path d="M9 17v1a3 3 0 0 0 6 0v-1" />
                </svg>
              </div>

              <div className="space-y-4">
                {[1, 2, 3, 4, 5, 6].map((item) => (
                  <div
                    key={item}
                    className="notification-item flex items-center justify-between py-1 border-b border-gray-100 last:border-b-0"
                  >
                    <div>
                      <p className="font-semibold text-sm text-gray-900">
                        PCS Exam Result
                      </p>
                      <p className="text-xs text-gray-500">
                        10 Apr 2025 10:25pm
                      </p>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-xs px-3 py-1 text-cyan-600 bg-[#098B9F33] hover:text-cyan-800 cursor-pointer hover:bg-[#098B9F55]"
                    >
                      View Result
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="w-full lg:w-1/2">
            <h2 className="about-heading text-3xl md:text-4xl font-bold mb-2 text-gray-900">
              About Us
            </h2>
            <h3 className="about-subheading text-2xl md:text-3xl font-bold mb-6 text-cyan-600">
              Ace Institutions
            </h3>
            <p className="about-text text-lg text-gray-600 mb-8 leading-relaxed">
              Academy for Competitive Examination was established in the year
              2003 at Manjeri, Malappuram district of Kerala.
            </p>

            <div ref={statsRef} className="about-stats grid grid-cols-3 gap-8 mb-8">
              <div className="about-stat text-center">
                <div ref={yearsRef} className="md:text-5xl text-2xl font-bold bg-gradient-to-r from-[#098B9F] to-[#63C2CD] bg-clip-text text-transparent mb-2">
                  0
                </div>
                <div className="text-sm text-gray-600">Years of Excellence</div>
              </div>
              <div className="about-stat text-center">
                <div ref={studentsRef} className="md:text-5xl text-2xl font-bold bg-gradient-to-r from-[#00A0E3] to-[#1F67A5] bg-clip-text text-transparent mb-2">
                  0
                </div>
                <div className="text-sm text-gray-600">Successful Students</div>
              </div>
              <div className="about-stat text-center">
                <div ref={facultyRef} className="md:text-5xl text-2xl font-bold bg-gradient-to-r from-[#63C2CD] to-[#098B9F] bg-clip-text text-transparent mb-2">
                  0
                </div>
                <div className="text-sm text-gray-600">Expert Faculty</div>
              </div>
            </div>

            <Button
              size="lg"
              className="about-button cursor-pointer bg-gradient-to-r from-[#1F67A5] to-[#00A0E3] hover:from-[#176090] hover:to-[#0088c7] text-white px-8 py-3"
            >
              Explore More
            </Button>
          </div>
        </div>

        <div className="md:mt-16 mt-8">
          <div className="flex gap-4 overflow-x-auto no-scrollbar px-2 py-2 sm:px-0 snap-x">
            {tabs.map((tab) => (
              <button
                key={tab.text}
                className={`about-tab flex-shrink-0 snap-start px-6 py-2 cursor-pointer rounded-lg shadow-md transition 
                  ${tab.textColor} ${tab.bg} ${tab.hover}`}
              >
                {tab.text}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}