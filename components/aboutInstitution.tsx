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
      title: "Project-based learning",
      desc: "Students work on real projects that simulate workplace challenges — from ideation to deployment.",
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
      desc: "One-on-one mentorship, resume reviews, mock interviews and placement assistance for every graduating cohort.",
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
      title: "Industry-aligned curriculum",
      desc: "Curriculum designed with industry partners to ensure students learn tools and workflows used by employers today.",
    },
  ];

  const team = [
    { name: "Thomas Joe", role: "Founder & Director", image: "/lead_01.png" },
    { name: "Riya Kumar", role: "Head of Curriculum", image: "/lead_02.png" },
    { name: "Thomas Paul", role: "Placement Lead", image: "/lead_03.png" },
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
            <p className="text-gray-600 text-sm md:text-base leading-relaxed">
              To provide high-quality education and nurturing support that
              empowers students to excel academically, develop critical
              thinking, and achieve their full potential for a successful
              future.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h3 className="font-semibold text-lg text-gray-900 mb-2">
              Our Vision
            </h3>
            <p className="text-gray-600 text-sm md:text-base leading-relaxed">
              To be a leading institution recognized for excellence in
              education, fostering innovation, social responsibility, and
              lifelong learning among students.
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
              <p className="text-gray-600 text-sm md:text-base leading-relaxed">
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
