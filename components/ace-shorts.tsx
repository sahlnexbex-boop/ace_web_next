"use client";

import { useEffect, useState } from "react";
import { Play } from "lucide-react";
import { getShorts } from "@/lib/api/shorts";
import DynamicVideoModal from "@/components/dynamicVideoModal";

interface ShortItem {
  shorts_id: number;
  shorts_title: string;
  shorts_file: string; // Thumbnail
  shorts_link: string; // Video URL (YouTube/Vimeo/Direct)
  status: number;
}

export default function AceShorts() {
  const [shorts, setShorts] = useState<ShortItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  const server_url = process.env.NEXT_PUBLIC_API_BASE_URL;


  useEffect(() => {
    const fetchShorts = async () => {
      try {
        const response = await getShorts(1, 4, "", 1);
        const data = response?.data || [];
        setShorts(data);
      } catch (err) {
        console.error("Error fetching shorts:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchShorts();
  }, []);

  return (
    <section className="md:py-16 py-10 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Heading */}
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

        {/* Loading or Empty */}
        {loading ? (
          <div className="text-center text-gray-500">Loading shorts...</div>
        ) : shorts.length === 0 ? (
          <div className="text-center text-gray-500">No shorts available</div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {shorts.map((short) => (
              <div
                key={short.shorts_id}
                className="relative group cursor-pointer"
                onClick={() => setSelectedVideo(short.shorts_link)}
              >
                <div className="rounded-lg  overflow-hidden shadow-lg transform transition-transform group-hover:scale-105">
                  <img
                    src={server_url + short.shorts_file || "/placeholder.svg"}
                    alt={short.shorts_title}
                    className="w-full h-full object-cover"
                  />

                  {/* Play button overlay */}
                  <div className="absolute inset-0 md:top-52 flex items-center justify-center">
                    <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center shadow-lg">
                      <Play
                        className="w-6 h-6 text-cyan-600 ml-1"
                        fill="currentColor"
                      />
                    </div>
                  </div>

                  {/* Ace logo */}
                  {/* <div className="absolute top-4 right-4">
                    <div className="flex items-center space-x-1 text-white text-xs">
                      <div className="w-4 h-4 bg-cyan-400 rounded transform rotate-45"></div>
                      <span className="font-bold">ace</span>
                    </div>
                  </div> */}
                </div>

                {/* <p className="text-center mt-2 text-sm font-medium text-gray-800">
                  {short.shorts_title}
                </p> */}
              </div>
            ))}
          </div>
        )}

        {/* Video Modal */}
        <DynamicVideoModal
          isOpen={!!selectedVideo}
          onClose={() => setSelectedVideo(null)}
          videoUrl={selectedVideo || ""}
        />
      </div>
    </section>
  );
}
