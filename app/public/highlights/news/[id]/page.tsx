"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";

export default function NewsDetailsPage() {
  return (
    <section className="bg-[#f7fbff] min-h-screen py-10 px-6 md:px-12">
      <div className="max-w-4xl mx-auto">
        {/* Breadcrumb */}
        <nav className="text-sm text-gray-500 mb-6">
          <ol className="flex items-center space-x-2">
            <li>
              <Link href="/public/home" className="hover:text-cyan-600">
                Home
              </Link>
            </li>
            <li>/</li>
            <li>
              <Link href="/public/highlights" className="hover:text-cyan-600">
                Highlights
              </Link>
            </li>
            <li>/</li>
            <li className="text-gray-700 font-medium">News & Updates</li>
          </ol>
        </nav>

        {/* Title Section */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            ACE announces new scholarship program 2025
          </h1>
          <p className="text-cyan-600 font-medium">February 11, 2025</p>
        </div>

        {/* Image */}
        <div className="rounded-xl overflow-hidden border border-cyan-200 mb-8">
         <img src="/news_01.png" alt="" className="w-full h-full" />
        </div>

        {/* Content */}
        <div className="text-gray-700 leading-relaxed space-y-4 text-[15px] md:text-base">
          <p>
            Lorem Ipsum is simply dummy text of the printing and typesetting
            industry. Lorem Ipsum has been the industry's standard dummy text
            ever since the 1500s, when an unknown printer took a galley of type
            and scrambled it to make a type specimen book. It has survived not
            only five centuries, but also the leap into electronic typesetting,
            remaining essentially unchanged.
          </p>
          <p>
            It is a long established fact that a reader will be distracted by
            the readable content of a page when looking at its layout. The point
            of using Lorem Ipsum is that it has a more-or-less normal
            distribution of letters, as opposed to using 'Content here, content
            here', making it look like readable English.
          </p>
        </div>
      </div>
    </section>
  );
}
