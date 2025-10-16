"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { Card, CardContent } from "@/components/ui/card";

export default function LatestNews() {
  const news = [
    {
      id: 1,
      title: "New Computer Lab Inauguration, SM Building",
      description:
        "Our institute proudly opened a state-of-the-art computer lab equipped with 50 la...",
      image: "/computer_lab.png",
      date: "2024",
    },
    {
      id: 2,
      title: "Cultural Fest 2025 Announcement",
      description:
        "The annual cultural fest will be held in March 2025 featuring music, dance on st...",
      image: "/announcement.png",
      date: "2025",
    },
    {
      id: 3,
      title: "Placement Drive 2025 - Success Meeting",
      description:
        "Over 150 students got placed in top companies during the placement drive or...",
      image: "/meeting.png",
      date: "2025",
    },
  ];

  const gridRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          gsap.fromTo(
            ".news-card",
            { opacity: 0, y: 50 },
            {
              opacity: 1,
              y: 0,
              duration: 0.8,
              stagger: 0.2,
              ease: "power3.out",
            }
          );
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );

    if (gridRef.current) observer.observe(gridRef.current);

    return () => {
      if (gridRef.current) observer.unobserve(gridRef.current);
    };
  }, []);

  return (
    <section className="md:py-16 py-10 bg-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading with underline image */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            Latest News
          </h2>
          <div className="mt-2 flex justify-center ms-32">
            <img
              src="/line_02.png"
              alt="underline"
              className="h-2 w-32 md:w-40 object-contain"
            />
          </div>
        </div>

        <div
          ref={gridRef}
          className="grid md:grid-cols-3 md:gap-12 gap-8"
        >
          {news.map((item) => (
            <Card
              key={item.id}
              className="news-card opacity-0 overflow-hidden hover:shadow-lg transition-shadow rounded-xl cursor-pointer"
            >
              <div className="aspect-video overflow-hidden">
                <img
                  src={item.image || "/placeholder.svg"}
                  alt={item.title}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
              <CardContent className="px-6 pb-6">
                <h3 className="text-xl font-bold mb-2 text-gray-900">
                  {item.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {item.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
