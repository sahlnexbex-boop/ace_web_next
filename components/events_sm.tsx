"use client";
import React, { useState } from "react";

export default function Events() {
  const [filter, setFilter] = useState("All");

  const events = [
    { title: "Meetup 2020", date: "February 11, 2025", category: "Meetup", image: "/event_01.png" },
    { title: "Meetup", date: "February 11, 2025", category: "Events", image: "/event_02.png" },
    { title: "Rock Music", date: "February 11, 2025", category: "Events", image: "/event_03.png" },
    { title: "Meetup 2024", date: "February 11, 2025", category: "Meetup", image: "/event_04.png" },
  ];

  const filtered = filter === "All" ? events : events.filter((e) => e.category === filter);

  return (
    <section className="bg-[#daeef1] py-16 px-6 md:px-10">
      <div className="max-w-7xl mx-auto text-center">
        {/* Heading */}
        <h2 className="text-2xl md:text-3xl font-bold mb-6 text-cyan-900">ACE Events</h2>

        {/* Filter Buttons */}
        <div className="flex justify-center gap-4 mb-8 flex-wrap">
          {["All", "Events", "Meetup"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-1 rounded-full border transition-all duration-300 ${
                filter === f
                  ? "bg-cyan-600 text-white border-cyan-600"
                  : "border-gray-300 text-gray-700 hover:bg-cyan-100"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Event Cards */}
        <div className="grid sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
          {filtered.map((ev, i) => (
            <div
              key={i}
              className="bg-white rounded-xl shadow-md overflow-hidden cursor-pointer group transition-all duration-300 hover:shadow-lg"
            >
              <div className="overflow-hidden">
                <img
                  src={ev.image}
                  alt={ev.title}
                  className="w-full h-48 object-cover transform transition-transform duration-500 ease-in-out group-hover:scale-110"
                />
              </div>
              <div className="px-4 pb-6 pt-3 text-center">
                <h3 className="font-semibold text-lg text-[#087fc2]">{ev.title}</h3>
                <p className="text-sm text-gray-600">{ev.date}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
