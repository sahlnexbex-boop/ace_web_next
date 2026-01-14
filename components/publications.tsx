"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { gsap } from "gsap";
import { Card, CardContent } from "@/components/ui/card";
import { getPublications } from "@/lib/api/publication";

interface Publication {
  book_id: number;
  book_title: string;
  book_price: string;
  book_image: string;
  book_file: string;
  book_author: string;
}

export default function Publications() {
  const router = useRouter();
  const gridRef = useRef<HTMLDivElement | null>(null);
  const [publications, setPublications] = useState<Publication[]>([]);
  const server_url = process.env.NEXT_PUBLIC_API_BASE_URL;


  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getPublications(1, 4, "", 1); 
        if (res?.data) setPublications(res.data);
      } catch (error) {
        console.error("Error fetching publications:", error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (!gridRef.current || publications.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          const isMobile = window.matchMedia("(max-width: 767px)").matches;

          if (isMobile) {
            gsap.fromTo(
              ".pub-card",
              { opacity: 0, x: (i) => (i % 2 === 0 ? -50 : 50) },
              { opacity: 1, x: 0, duration: 0.9, stagger: 0.18, ease: "power3.out" }
            );
          } else {
            gsap.fromTo(
              ".pub-card",
              { opacity: 0, y: 60 },
              { opacity: 1, y: 0, duration: 0.9, stagger: 0.18, ease: "power3.out" }
            );
          }

          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );

    if (gridRef.current) observer.observe(gridRef.current);

    return () => {
      if (gridRef.current) observer.unobserve(gridRef.current);
    };
  }, [publications]);

  return (
    <section className="md:py-16 py-10 bg-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative mb-12 flex justify-center">
          <h2
            className="text-3xl md:text-4xl font-bold text-center text-gray-900 cursor-pointer"
            onClick={() => router.push("/public/publication")}
          >
            Publications or Book
          </h2>
          <img
            src="/line_03.png"
            alt="underline"
            className="absolute left-1/2 -translate-x-1/2 -bottom-3 w-24 sm:w-28 md:w-36"
          />
        </div>

        {/* Books Grid */}
        <div
          ref={gridRef}
          className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8 lg:gap-10"
        >
          {publications.map((book) => (
            <Card
              key={book.book_id}
              className="pub-card bg-white hover:shadow-2xl shadow-lg transition-shadow rounded-xl pt-3 sm:pt-10 cursor-pointer opacity-0"
              onClick={() => router.push(`/public/publication/${book.book_id}`)}
            >
              <CardContent className="pb-3 sm:pb-6 text-center px-3">
                <div className="mb-4 sm:mb-6">
                  <div className="h-36 sm:w-32 sm:h-40 rounded-lg mx-auto flex items-center justify-center shadow-md">
                    <img
                      src={server_url + book.book_image || "/placeholder.svg"}
                      alt={book.book_title}
                      className="w-full h-full object-cover rounded-sm"
                    />
                  </div>
                </div>
                <h3 className="font-semibold line-clamp-1 md:line-clamp-2 text-sm sm:text-base mb-1 sm:mb-2 text-gray-700 leading-tight">
                  {book.book_title}
                </h3>
                <p className="line-clamp-1">Author: {book.book_author}</p>
                <p className="text-base sm:text-lg font-bold text-gray-900 line-clamp-1">
                  ₹{book.book_price}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
