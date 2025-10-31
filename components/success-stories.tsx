"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import VideoModal from "./videoModal";

import { getTestimonials } from "@/lib/api/testimonial";
import { getSuccessStories } from "@/lib/api/successStories";
import { getShorts } from "@/lib/api/shorts";

export default function SuccessStories() {
  const router = useRouter();

  const [isModalOpen, setModalOpen] = useState(false);
  const [shorts, setShorts] = useState<any[]>([]);
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [successStories, setSuccessStories] = useState<any[]>([]);
  const [videoUrl, setVideoUrl] = useState<string>("");

  const openVideo = (url: string) => {
    setVideoUrl(url);
    setModalOpen(true);
  };
  const closeVideo = () => setModalOpen(false);

  // Fetch all API data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [shortsRes, testiRes, successRes] = await Promise.all([
          getShorts(1, 2, "", 1),
          getTestimonials(1, 3, "", { status: "1" }),
          getSuccessStories(1,2, "", "", 1),
        ]);

        setShorts(shortsRes?.data || []);
        setTestimonials(testiRes?.data || []);
        setSuccessStories(successRes?.data || []);
      } catch (error) {
        console.error("Error loading success stories:", error);
      }
    };

    fetchData();
  }, []);

  // Helper: safely get data or fallback
  const getItem = (arr: any[], index: number) => (arr && arr[index] ? arr[index] : null);

  const shorts1 = getItem(shorts, 0);
  const shorts2 = getItem(shorts, 1);
  const testi1 = getItem(testimonials, 0);
  const testi2 = getItem(testimonials, 1);
  const testi3 = getItem(testimonials, 2);
  const story1 = getItem(successStories, 0);
  const story2 = getItem(successStories, 1);

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="text-center mb-12">
          <h2
            className="text-3xl md:text-4xl font-bold text-gray-900 cursor-pointer"
            onClick={() => router.push("/highlights")}
          >
            Success Stories
          </h2>
          <div className="mt-2 flex justify-center">
            <img
              src="/line_02.png"
              alt="underline"
              className="h-2 w-32 md:w-40 object-contain"
            />
          </div>
        </div>

        {/* Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* ============================
              COLUMN 1
              Shorts (1) + Testimonial (1)
          ============================ */}
          <div className="flex flex-col gap-6">
            {shorts1 && (
              <Card
                onClick={() => openVideo(shorts1.shorts_link)}
                className="cursor-pointer overflow-hidden hover:shadow-lg transition-shadow rounded-3xl flex-7"
              >
                <CardContent className="p-0 h-full">
                  <div className="relative h-full">
                    <img
                      src={shorts1.shorts_file}
                      alt={shorts1.shorts_title}
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                    />
                    <div className="absolute bottom-14 bg-white rounded-xl left-0 right-0 px-6 py-3 mx-4">
                      <h3 className="text-gray-800 font-bold text-xl mb-1">
                        {shorts1.shorts_title}
                      </h3>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {testi1 && (
              <Card className="overflow-hidden hover:shadow-lg transition-shadow rounded-3xl bg-[#022935]">
                <CardContent className="p-6">
                  <img src="/quates_white.png" alt="" className="mb-2" />
                  <h3 className="font-bold text-lg text-white mb-2">
                    {testi1.name_of_candidate}
                  </h3>
                  <p className="text-sm mb-3 leading-relaxed text-gray-300">
                    {testi1.content}
                  </p>
                  <div className="flex items-center">
                    <img
                      src={testi1.image_of_candidate}
                      alt={testi1.name_of_candidate}
                      className="w-10 h-10 rounded-full mr-3"
                    />
                    <div>
                      <p className="font-semibold text-sm text-white">
                        {testi1.name_of_candidate}
                      </p>
                      <p className="text-xs opacity-70 text-gray-300">
                        {testi1.position_of_candidate}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* ============================
              COLUMN 2
              Testimonial (2) + SuccessStory (1)
          ============================ */}
          <div className="flex flex-col gap-6">
            {testi2 && (
              <Card className="overflow-hidden hover:shadow-lg transition-shadow rounded-3xl bg-[#d3f9ff]">
                <CardContent className="p-6">
                  <img src="/quates_blue.png" alt="" className="mb-10" />
                  <h3 className="font-bold text-lg mb-2 text-gray-800">
                    {testi2.name_of_candidate}
                  </h3>
                  <p className="text-sm mb-10 leading-relaxed text-gray-700">
                    {testi2.content}
                  </p>
                  <div className="flex items-center">
                    <img
                      src={testi2.image_of_candidate}
                      alt={testi2.name_of_candidate}
                      className="w-10 h-10 rounded-full mr-3"
                    />
                    <div>
                      <p className="font-semibold text-sm">{testi2.name_of_candidate}</p>
                      <p className="text-xs opacity-70">{testi2.position_of_candidate}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {story1 && (
              <Card
                onClick={() => openVideo(story1.youtube_video_link)}
                className="cursor-pointer overflow-hidden rounded-3xl hover:shadow-lg transition-shadow bg-[#ffeef7]"
              >
                <CardContent className="p-0">
                  <img
                    src={story1.thumbnail_image}
                    alt={story1.name_of_candidate}
                    className="w-full object-cover transition-transform duration-500 hover:scale-105"
                  />
                  <div className="p-4">
                    <h3 className="font-bold text-xl">{story1.stories_title}</h3>
                    <p>{story1.description}</p>
                    <div className="text-xs text-gray-100 bg-blue-500 w-fit px-3 py-1 mt-3 rounded-md">
                      {story1.year}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {testi3 && (
              <Card className="overflow-hidden hover:shadow-lg transition-shadow rounded-3xl bg-[#d3f9ff]">
                <CardContent className="p-6">
                  <img src="/quates_blue.png" alt="" className="mb-10" />
                  <h3 className="font-bold text-lg mb-2 text-gray-800">
                    {testi3.name_of_candidate}
                  </h3>
                  <p className="text-sm mb-10 leading-relaxed text-gray-700">
                    {testi3.content}
                  </p>
                  <div className="flex items-center">
                    <img
                      src={testi3.image_of_candidate}
                      alt={testi3.name_of_candidate}
                      className="w-10 h-10 rounded-full mr-3"
                    />
                    <div>
                      <p className="font-semibold text-sm">{testi3.name_of_candidate}</p>
                      <p className="text-xs opacity-70">{testi3.position_of_candidate}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* ============================
              COLUMN 3
              SuccessStory (2) + Shorts (2)
          ============================ */}
          <div className="flex flex-col gap-6">
            {story2 && (
              <Card
                onClick={() => openVideo(story2.youtube_video_link)}
                className="overflow-hidden rounded-3xl hover:shadow-lg transition-shadow bg-[#ffeef7]"
              >
                <CardContent className="p-0">
                  <img
                    src={story2.thumbnail_image}
                    alt={story2.stories_title}
                    className="w-full object-cover transition-transform duration-500 hover:scale-105"
                  />
                  <div className="p-4">
                    <h3 className="font-bold text-lg leading-[18px] text-gray-700">
                      {story2.name_of_candidate}
                    </h3>
                    <p className="text-sm my-3 text-gray-500">{story2.description}</p>
                    <div className="text-xs text-gray-100 bg-blue-500 w-fit px-3 py-1 mt-3 rounded-md">
                      {story2.year}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {shorts2 && (
              <Card
                onClick={() => openVideo(shorts2.shorts_link)}
                className="cursor-pointer overflow-hidden relative hover:shadow-lg rounded-3xl transition-shadow bg-cyan-500"
              >
                <CardContent className="p-0">
                  <img
                    src={shorts2.shorts_file}
                    alt={shorts2.shorts_title}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                  />
                  <div className="absolute flex items-end bottom-10 bg-blue-400 me-10 rounded-e-full">
                    <div className="px-6 py-3 md:py-5">
                      <p className="text-white font-bold sm:text-sm text-xs leading-relaxed">
                        {shorts2.shorts_title}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>

      <VideoModal isOpen={isModalOpen} onClose={closeVideo} videoUrl={videoUrl} />
    </section>
  );
}
