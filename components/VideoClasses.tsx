"use client";

import { useEffect, useState } from "react";
import { getVideoClasses } from "@/lib/api/videoClass";
import VideoModal from "@/components/videoModal";

export default function VideoClasses({ activeCategory }: { activeCategory: number | null }) {
  const [videos, setVideos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [videoUrl, setVideoUrl] = useState<string>("");
  const [isVideoOpen, setIsVideoOpen] = useState(false);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const res = await getVideoClasses(1, 10, "", activeCategory || undefined, 1);
        setVideos(res?.data || []);
      } catch (err) {
        console.error("Error fetching video classes:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchVideos();
  }, [activeCategory]);

  if (loading) return <p>Loading...</p>;
  if (!videos.length) return  <div className="flex justify-start items-center">
    <img src="../no_data.png" alt="" className="w-52 opacity-40" />
  </div>;

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {videos.map((v, i) => (
          <div
            key={v.class_id}
            className="bg-white rounded-xl shadow hover:shadow-lg overflow-hidden transition cursor-pointer"
            onClick={() => {
              setVideoUrl(v.video_url);
              setIsVideoOpen(true);
            }}
          >
            <img src={v.class_image} alt={v.class_title} className="w-full h-40 object-cover" />
            <div className="p-4">
              <h3 className="font-semibold text-gray-800">{v.class_title}</h3>
              <p className="text-sm text-gray-500 mt-2">
                {new Date(v.date_time).toLocaleDateString()}
              </p>
            </div>
          </div>
        ))}
      </div>

      <VideoModal
        videoUrl={videoUrl}
        isOpen={isVideoOpen}
        onClose={() => setIsVideoOpen(false)}
      />
    </>
  );
}
