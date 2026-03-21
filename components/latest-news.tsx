"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { gsap } from "gsap";
import { Card, CardContent } from "@/components/ui/card";
import { getNews } from "@/lib/api/news";
import Loader from "./loader";

export default function LatestNews() {
  const router = useRouter();
  const gridRef = useRef<HTMLDivElement | null>(null);
  const server_url = process.env.NEXT_PUBLIC_API_BASE_URL;


  const [news, setNews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const res = await getNews(1, 3, "", 1);
        setNews(res?.data?.rows || res?.data || []);
      } catch (error) {
        console.error("Error fetching news:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  useEffect(() => {
    if (!news.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          gsap.fromTo(
            ".news-card",
            { opacity: 0, y: 50 },
            {
              opacity: 1,
              y: 0,
              duration: 0.8,
              stagger: 0.2,
              ease: "power3.out",
            }
          );
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );

    if (gridRef.current) observer.observe(gridRef.current);

    return () => {
      if (gridRef.current) observer.unobserve(gridRef.current);
    };
  }, [news]);

  return (
    <section className="md:py-16 py-10 bg-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            Latest News
          </h2>
          <div className="mt-2 flex justify-center ms-32">
            <img
              src="/line_02.png"
              alt="underline"
              className="h-2 w-32 md:w-40 object-contain"
            />
          </div>
        </div>

        {/* Loader or Grid */}
        {loading ? (
          <Loader />
        ) : news.length === 0 ? (
          <div className="w-full flex justify-center items-center py-10">
            <img src="/no_data.png" alt="No Data" className="w-52 opacity-50" />
          </div>
        ) : (
          <div ref={gridRef} className="grid md:grid-cols-3 md:gap-12 gap-8">
            {news.map((item) => (
              <Card
                onClick={() =>
                  router.push(`/highlights/news/${item.news_id}`)
                }
                key={item.news_id}
                className="news-card opacity-0 overflow-hidden hover:shadow-lg transition-shadow rounded-xl cursor-pointer"
              >
                <div className="w-full h-60 overflow-hidden">
                  <img
                    src={server_url + item.news_image || "/placeholder.svg"}
                    alt={item.news_title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <CardContent className="px-6 pb-6">
                  <h3 className="text-xl font-bold mb-2 text-gray-900 line-clamp-2">
                    {item.news_title}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed line-clamp-2">
                    {item.news_description || "No description available."}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
