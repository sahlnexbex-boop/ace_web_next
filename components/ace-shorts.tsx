"use client"

import { useEffect, useState } from "react"
import { Play, X } from "lucide-react"

export default function AceShorts() {
  const shorts = [
    { id: 1, title: "HSA", video: "/ace_01.mp4", thumbnail: "/thumbnail_01.jpeg" },
    { id: 2, title: "HSST", video: "/ace_02.mp4", thumbnail: "/thumbnail_02.jpeg" },
    { id: 3, title: "ONAM", video: "/ace_03.mp4", thumbnail: "/thumbnail_03.jpeg" },
    { id: 4, title: "Success Story", video: "/ace_04.mp4", thumbnail: "/thumbnail_04.jpeg" },
  ]

  const [selectedVideo, setSelectedVideo] = useState<string | null>(null)

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelectedVideo(null)
    }
    window.addEventListener("keydown", handleKey)
    return () => window.removeEventListener("keydown", handleKey)
  }, [])

  return (
    <section className="md:py-16 py-10 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
       <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            Ace Shorts
          </h2>
          <div className="mt-2 flex justify-center">
            <img
              src="/line_02.png"
              alt="underline"
              className="h-2 w-32 md:w-40 object-contain"
            />
          </div>
        </div>

        {/* Grid of shorts */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {shorts.map((short) => (
            <div
              key={short.id}
              className="relative group cursor-pointer"
              onClick={() => setSelectedVideo(short.video)}
            >
              <div className="rounded-lg aspect-[3/4] overflow-hidden shadow-lg transform transition-transform group-hover:scale-105">
                <img
                  src={short.thumbnail}
                  alt={short.title}
                  className="w-full h-full object-cover"
                />

                {/* Play button overlay */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center shadow-lg">
                    <Play
                      className="w-6 h-6 text-cyan-600 ml-1"
                      fill="currentColor"
                    />
                  </div>
                </div>

                {/* Ace logo */}
                <div className="absolute top-4 right-4">
                  <div className="flex items-center space-x-1 text-white text-xs">
                    <div className="w-4 h-4 bg-cyan-400 rounded transform rotate-45"></div>
                    <span className="font-bold">ace</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Modal */}
        {selectedVideo && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
            <div className="relative bg-black rounded-lg shadow-lg w-full max-w-4xl max-h-[90vh] flex flex-col">
              {/* Close button */}
              <button
                onClick={() => setSelectedVideo(null)}
                className="absolute top-3 right-3 z-50 text-white hover:text-gray-300 cursor-pointer"
              >
                <X className="w-6 h-6" />
              </button>

              {/* Video player */}
              <video
                src={selectedVideo}
                controls
                autoPlay
                className="w-full max-h-[85vh] rounded-lg object-contain"
              />
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
