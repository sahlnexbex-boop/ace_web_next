"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { getNewsById } from "@/lib/api/news";

export default function NewsDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const [news, setNews] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const server_url = process.env.NEXT_PUBLIC_API_BASE_URL;

  useEffect(() => {
    if (!id) return;

    const fetchNews = async () => {
      try {
        const res = await getNewsById(Number(id));
        setNews(res?.data || null);
      } catch (error) {
        console.error("Error fetching news:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, [id]);

  if (loading) {
    return (
      <section className="bg-[#f7fbff] min-h-screen flex justify-center items-center">
        <p className="text-gray-600 text-lg">Loading news details...</p>
      </section>
    );
  }

  if (!news) {
    return (
      <section className="bg-[#f7fbff] min-h-screen flex justify-center items-center">
        <p className="text-gray-600 text-lg">News not found.</p>
      </section>
    );
  }

  return (
    <section className="bg-[#f7fbff] min-h-screen py-10 px-6 md:px-12">
      <div className="max-w-4xl mx-auto">
        {/* Breadcrumb */}
        <nav className="text-sm text-gray-500 mb-6">
          <ol className="flex items-center space-x-2">
            <li>
              <Link href="/" className="hover:text-cyan-600">
                Home
              </Link>
            </li>
            <li>/</li>
            <li>
              <Link href="/highlights" className="hover:text-cyan-600">
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
            {news.news_title}
          </h1>
          <p className="text-cyan-600 font-medium">
            {new Date(news.date_time).toLocaleDateString("en-IN", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>

        {/* Image */}
        {news.news_image && (
          <div className="rounded-xl overflow-hidden border border-cyan-200 mb-8">
            <img
              src={server_url + news.news_image}
              alt={news.news_title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Content */}
        <div className="text-gray-700 leading-relaxed space-y-4 text-[15px] md:text-base">
          {news.news_description
            ?.split(/\r?\n\r?\n/) 
            .map((para: string, idx: number) => (
              <p key={idx} className="whitespace-pre-line">
                {para.trim()}
              </p>
            ))}
        </div>
      </div>
    </section>
  );
}
