"use client";

import { useEffect, useState } from "react";
import { getVideoClasses } from "@/lib/api/videoClass";
import VideoModal from "@/components/videoModal";

const LIMIT = 9;

export default function VideoClasses({
  activeCategory,
}: {
  activeCategory: number | null;
}) {
  const [videos, setVideos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [videoUrl, setVideoUrl] = useState("");
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const server_url = process.env.NEXT_PUBLIC_API_BASE_URL;

  const openVideo = (url?: string) => {
    const normalizedUrl = url?.trim();
    if (!normalizedUrl) return;

    setVideoUrl(normalizedUrl);
    setIsVideoOpen(true);
  };

  const closeVideo = () => {
    setIsVideoOpen(false);
    setVideoUrl("");
  };

  const scrollPageToTop = () => {
    document.documentElement.scrollTo({
      top: 0,
      behavior: "smooth",
    });

    document.body.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    scrollPageToTop();
  }, [page]);

  useEffect(() => {
    setPage(1);
  }, [activeCategory]);

  useEffect(() => {
    const fetchVideos = async () => {
      setLoading(true);
      try {
        const res = await getVideoClasses(
          page,
          LIMIT,
          "",
          activeCategory || undefined,
          1
        );

        setVideos(res?.data || []);
        setTotalPages(res?.totalPages || 1);
      } catch (err) {
        console.error("Error fetching video classes:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, [page, activeCategory]);

  if (loading) return <p>Loading...</p>;

  if (!videos.length)
    return (
      <div className="flex md:justify-start justify-center items-center">
        <img src="../no_data.png" alt="" className="w-52 opacity-40" />
      </div>
    );

  return (
    <>
      {/* Video Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {videos.map((v) => (
          <div
            key={v.class_id}
            className="bg-white rounded-xl shadow hover:shadow-lg overflow-hidden transition cursor-pointer"
            onClick={() => openVideo(v.video_url)}
          >
            <img
              src={server_url + v.class_image}
              alt={v.class_title}
              className="w-full h-56 object-cover"
            />
            <div className="p-4">
              <h3 className="font-semibold text-gray-800">{v.class_title}</h3>
              <p className="text-sm text-gray-500 mt-2">
                {new Date(v.date_time).toLocaleDateString()}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/*  Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-8">
          <button
            onClick={() => {
              setPage((p) => p - 1);
              scrollPageToTop();
            }}
            disabled={page === 1}
            className={`px-4 py-2 rounded-lg border text-sm
              ${
                page === 1
                  ? "text-gray-400 border-gray-300 cursor-not-allowed"
                  : "border-cyan-500 text-cyan-600 hover:bg-cyan-500 hover:text-white cursor-pointer"
              }`}
          >
            Prev
          </button>

          <span className="text-sm text-gray-600">
            Page <b>{page}</b> of <b>{totalPages}</b>
          </span>

          <button
            onClick={() => {
              setPage((p) => p + 1);
              scrollPageToTop();
            }}
            disabled={page === totalPages}
            className={`px-4 py-2 rounded-lg border text-sm
              ${
                page === totalPages
                  ? "text-gray-400 border-gray-300 cursor-not-allowed"
                  : "border-cyan-500 text-cyan-600 hover:bg-cyan-500 hover:text-white cursor-pointer"
              }`}
          >
            Next
          </button>
        </div>
      )}

      {/* Video Modal */}
      <VideoModal
        videoUrl={videoUrl}
        isOpen={isVideoOpen}
        onClose={closeVideo}
      />
    </>
  );
}
