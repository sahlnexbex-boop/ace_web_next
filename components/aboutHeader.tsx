"use client";
import React from "react";
import { Button } from "@/components/ui/button";

export default function AboutHeader() {
  return (
    <section className="relative bg-white md:py-20 py-8 px-6 md:px-10 overflow-hidden">
      <div
        className="
          relative max-w-7xl mx-auto grid gap-10 items-center md:ps-20 z-10
          grid-cols-1 md:grid-cols-2
        "
      >
        <div className="order-1 md:order-2 flex justify-center relative z-10">
          <div className="relative">
            <img
              src="/about_thumbnail.png"
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

        <div className="order-2 md:order-1">
          <h2 className="text-2xl md:text-3xl font-bold mb-4 text-gray-900">
            Success Stories Ace
          </h2>
          <p className="text-gray-700 mb-6">
            Lorem Ipsum is simply dummy text of the printing and typesetting
            industry. Lorem Ipsum has been the industry's standard dummy text.
          </p>

          <div className="flex flex-wrap gap-4 bg-white py-5 rounded-3xl">
            <div className="rounded-lg md:p-4 flex-1 text-center">
              <p className="md:text-5xl text-2xl font-bold text-cyan-700">20+</p>
              <p className="text-xs md:text-sm text-gray-600">Years of Excellence</p>
            </div>
            <div className="rounded-lg md:p-4 flex-1 text-center">
              <p className="md:text-5xl text-2xl font-bold text-cyan-700">5000+</p>
              <p className="text-xs md:text-sm text-gray-600">Successful Students</p>
            </div>
            <div className="rounded-lg md:p-4 flex-1 text-center">
              <p className="md:text-5xl text-2xl font-bold text-cyan-700">100+</p>
              <p className="text-xs md:text-sm text-gray-600">Expert Faculty</p>
            </div>
          </div>

          <Button
            size="lg"
            className="about-button cursor-pointer bg-gradient-to-r from-[#1F67A5] to-[#00A0E3] hover:from-[#176090] hover:to-[#0088c7] text-white px-8 py-3 mt-6"
          >
            Enquire Now
          </Button>
        </div>
      </div>
    </section>
  );
}
