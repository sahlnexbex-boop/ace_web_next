"use client";
import React, { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function AboutInstitution() {
  const sectionRef = useRef<HTMLDivElement | null>(null);

  const features = [
    {
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-6 h-6 text-rose-500"
        >
          <path stroke="none" d="M0 0h24v24H0z" fill="none" />
          <path d="M12 4l-8 4l8 4l8 -4l-8 -4" />
          <path d="M4 12l8 4l8 -4" />
          <path d="M4 16l8 4l8 -4" />
        </svg>
      ),
      title: "Practical-based learning",
      desc: "Our PSC coaching centre in Kerala specializes in offering affordable PSC coaching in Kerala without compromising on training quality, faculty experience, or student support. Students learn through practical, exam-focused tasks that mirror real question patterns and problem-solving scenarios, helping them build accuracy, speed, and confidence.",
    },
    {
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-6 h-6 text-blue-500"
        >
          <path stroke="none" d="M0 0h24v24H0z" fill="none" />
          <path d="M9 7m-4 0a4 4 0 1 0 8 0a4 4 0 1 0 -8 0" />
          <path d="M3 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
          <path d="M21 21v-2a4 4 0 0 0 -3 -3.85" />
        </svg>
      ),
      title: "Mentorship & career support",
      desc: "Your choice of Kerala PSC coaching campus can have a huge impact on how you view KeralaPSC and other competitive examinations. At ACE, we offer one-on-one mentoring, doubt clearance sessions, exam strategy tips and more to ensure that you are on your top game. Our team stays with you every step of the way so that you can achieve your dream job with ease.",
    },
    {
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-6 h-6 text-purple-500"
        >
          <path stroke="none" d="M0 0h24v24H0z" fill="none" />
          <path d="M3 19a9 9 0 0 1 9 0a9 9 0 0 1 9 0" />
          <path d="M3 6a9 9 0 0 1 9 0a9 9 0 0 1 9 0" />
          <path d="M3 6l0 13" />
          <path d="M12 6l0 13" />
          <path d="M21 6l0 13" />
        </svg>
      ),
      title: "Exam-aligned curriculum",
      desc: "From well-organized study materials to modern classrooms and digital resources, every part of our PSC coaching centre in Kerala is created to support long hours of focused preparation and training. Our Kerala PSC coaching curriculum is developed in accordance with the latest trends in PSC, SSC, and central/state recruitment so that every aspirant can make the most of their coaching.",
    },
  ];

  const team = [
    { name: "Najmunneesa", role: "Director", image: "/profile-3.webp" },
    { name: "Umaira", role: "Managing Director", image: "/profile-4.webp" },
    { name: "Aboobacker Siddeeque", role: "Principal", image: "/profile-6.webp" },
  ];

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>(".feature-card").forEach((card) => {
        gsap.fromTo(
          card,
          { opacity: 0, y: 50 },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            ease: "power2.out",
            scrollTrigger: {
              trigger: card,
              start: "top 85%",
              toggleActions: "play none none none",
              once: true,
            },
          }
        );
      });

      gsap.utils.toArray<HTMLElement>(".team-card").forEach((card) => {
        gsap.fromTo(
          card,
          { opacity: 0, y: 60 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power2.out",
            scrollTrigger: {
              trigger: card,
              start: "top 85%",
              toggleActions: "play none none none",
              once: true,
            },
          }
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="bg-blue-50 md:py-16 py-8 px-6 md:px-10"
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-6 mb-10">
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h3 className="font-semibold text-lg text-gray-900 mb-2">
              Our Mission
            </h3>
            <p className="text-gray-500 text-sm md:text-base leading-relaxed">
              To empower students through comprehensive training that helps them
              ace competitive examinations, develop critical thinking abilities,
              and realize their full potential.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h3 className="font-semibold text-lg text-gray-900 mb-2">
              Our Vision
            </h3>
            <p className="text-gray-500 text-sm md:text-base leading-relaxed">
              To be India’s best coaching centre for competitive examinations
              that sets benchmarks in quality education by leveraging technology
              and fostering innovation and academic rigor.
            </p>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 mb-16">
          {features.map((f, i) => (
            <div
              key={i}
              className="feature-card bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition"
            >
              <div className="mb-3">{f.icon}</div>
              <h4 className="font-semibold text-gray-900 mb-2">{f.title}</h4>
              <p className="text-gray-500 text-sm md:text-base leading-relaxed">
                {f.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Leadership & Team */}
        <div className="md:px-10">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8">
            Leadership & Team
          </h2>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8 lg:gap-20">
            {team.map((member, index) => (
              <div
                key={index}
                className="team-card bg-white/40 p-6 rounded-xl shadow-sm text-center hover:shadow-lg transition"
              >
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-28 h-28 md:w-32 md:h-32 mx-auto rounded-full object-cover mb-4"
                />
                <h3 className="font-semibold text-gray-900 text-lg">
                  {member.name}
                </h3>
                <p className="text-cyan-600 text-sm mt-1">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
