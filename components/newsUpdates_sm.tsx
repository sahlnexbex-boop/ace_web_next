"use client";
import React from "react";

export default function NewsUpdates() {
  const news = [
    { title: "ACE announces new scholarship program 2025", date: "September 16, 2025", image: "/news1.jpg" },
    { title: "Results declared for Semester 1 Exams", date: "September 16, 2025", image: "/news2.jpg" },
    { title: "ACE announces new scholarship program 2025", date: "September 16, 2025", image: "/news3.jpg" },
  ];

  return (
    <section className="bg-white py-16 px-6 md:px-10">
      <div className="max-w-7xl mx-auto text-center">
        <h2 className="text-2xl md:text-3xl font-bold mb-10 text-cyan-900">
          News & Updates
        </h2>

        <div className="grid md:grid-cols-3 gap-8">
          {news.map((n, i) => (
            <div key={i} className="bg-white rounded-xl shadow-md overflow-hidden">
              <img src={n.image} alt={n.title} className="w-full h-44 object-cover" />
              <div className="p-4 text-left">
                <p className="text-sm text-gray-500 mb-2">{n.date}</p>
                <h3 className="font-semibold text-gray-800">{n.title}</h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
