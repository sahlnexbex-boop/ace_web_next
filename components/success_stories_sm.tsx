"use client";
import React from "react";

export default function SuccessStories() {
  return (
    <section className="relative bg-gradient-to-r from-[#1599ab] to-[#69c7d2] py-20 px-6 md:px-10 overflow-hidden">
      {/* Background Image Layer */}
      <div className="absolute inset-0">
        <img
          src="/highlight_abstract.png"
          alt="Abstract Background"
          className="w-full h-full object-cover opacity-50"
        />
      </div>

      {/* Content Layer */}
      <div className="relative max-w-7xl mx-auto grid md:grid-cols-2 gap-10 items-center md:ps-20 z-10">
        {/* Left Side */}
        <div>
          <h2 className="text-2xl md:text-3xl font-bold mb-4 text-white">
            Success Stories Ace
          </h2>
          <p className="text-gray-200 mb-6">
            Lorem Ipsum is simply dummy text of the printing and typesetting
            industry. Lorem Ipsum has been the industry's standard dummy text.
          </p>

          <div className="flex flex-wrap gap-4 bg-white py-5 rounded-3xl shadow-md">
            <div className="rounded-lg p-4 flex-1 min-w-[120px] text-center">
              <p className="text-3xl font-bold text-cyan-700">20+</p>
              <p className="text-xs text-gray-600">Years of Excellence</p>
            </div>
            <div className="rounded-lg p-4 flex-1 min-w-[120px] text-center">
              <p className="text-3xl font-bold text-cyan-700">5000+</p>
              <p className="text-xs text-gray-600">Successful Students</p>
            </div>
            <div className="rounded-lg p-4 flex-1 min-w-[120px] text-center">
              <p className="text-3xl font-bold text-cyan-700">100+</p>
              <p className="text-xs text-gray-600">Expert Faculty</p>
            </div>
          </div>
        </div>

        {/* Right Side */}
        <div className="flex justify-center relative z-10">
          <div className="relative">
            <img
              src="/highlight_thumbnail.png"
              alt="Success Stories"
              className="rounded-xl shadow-lg w-full max-w-md"
            />
            <button className="absolute inset-0 flex justify-center items-center">
              <div className="bg-white cursor-pointer rounded-full p-4 shadow-md">
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
  );
}
