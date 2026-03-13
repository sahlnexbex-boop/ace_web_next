"use client";
import React from 'react'

export default function CourseHeader(data: any) {
  // console.log("data", data)
  return (
    <div
      className="relative overflow-hidden w-full h-72 flex flex-col justify-center items-center text-center bg-gradient-to-r from-[#0197db] via-[#087fc2] to-[#0c8da6] px-8"
    >
      {/* absolute backgroundImage  */}
      <img src="/logo_full.png" alt="" className='absolute -right-10 z-0' />

      <h1 className='md:text-5xl text-3xl font-bold text-white mb-2 relative z-10'>{data?.data.header}</h1>
      {/* <p className='text-gray-100'>Expert coaching with quality study materials, regular tests, and <br />guidance for complete exam preparation.</p> */}
      <p className='text-gray-100 relative z-10 lg:px-96'>{data?.data.content_01}</p>
    </div>
  )
}
