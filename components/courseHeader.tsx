"use client";
import React from 'react'

export default function CourseHeader() {
  return (
    <div
      className="w-full h-72 flex flex-col justify-center items-center text-center bg-gradient-to-r from-[#0197db] via-[#087fc2] to-[#0c8da6] px-8"
    >
        <h1 className='md:text-5xl text-3xl font-bold text-white mb-2'>Our Courses</h1>
        <p className='text-gray-100'>Expert coaching with quality study materials, regular tests, and <br />guidance for complete exam preparation.</p>
    </div>
  )
}
