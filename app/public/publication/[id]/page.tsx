"use client";
import { useParams, useRouter } from "next/navigation";
import React, { useLayoutEffect, useRef, useEffect, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { getPublicationById } from "@/lib/api/publication";
import { IconBook } from "@tabler/icons-react";

gsap.registerPlugin(ScrollTrigger);

export default function PublicationDetails() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const containerRef = useRef<HTMLDivElement>(null);
  const relatedRef = useRef<HTMLDivElement>(null);

  const [book, setBook] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBook = async () => {
      if (!id) return;
      try {
        const response = await getPublicationById(Number(id));
        setBook(response?.data || null);
      } catch (error) {
        console.error("Failed to fetch publication details:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBook();
  }, [id]);

  useLayoutEffect(() => {
    if (!book) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        containerRef.current,
        { autoAlpha: 0, y: 40 },
        { autoAlpha: 1, y: 0, duration: 0.8, ease: "power2.out" }
      );

      gsap.fromTo(
        ".book-image",
        { opacity: 0, x: -40 },
        {
          opacity: 1,
          x: 0,
          duration: 0.8,
          ease: "power2.out",
          scrollTrigger: { trigger: ".book-image", start: "top 85%" },
        }
      );

      gsap.fromTo(
        ".book-info",
        { opacity: 0, x: 40 },
        {
          opacity: 1,
          x: 0,
          duration: 0.8,
          delay: 0.2,
          ease: "power2.out",
          scrollTrigger: { trigger: ".book-info", start: "top 85%" },
        }
      );

      if (relatedRef.current) {
        const cards = relatedRef.current.querySelectorAll(".related-card");
        gsap.fromTo(
          cards,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            stagger: 0.15,
            ease: "power2.out",
            scrollTrigger: { trigger: relatedRef.current, start: "top 85%" },
          }
        );
      }
    }, containerRef);

    return () => ctx.revert();
  }, [book]);

  if (loading) return <div className="p-10 text-center text-gray-600">Loading publication...</div>;
  if (!book) return <div className="p-10 text-center text-red-500">Book not found.</div>;

  return (
    <div ref={containerRef} className="max-w-7xl mx-auto px-6 md:px-10 md:py-16 py-8">
      {/* Breadcrumb */}
      <div className="flex items-start gap-2 text-gray-600 text-sm mb-6">
        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0h6" />
        </svg>
        <span>/</span>
        <span>Publications</span>
        <span>/</span>
        <span>{book.book_title}</span>
      </div>

      {/* Book Section */}
      <div className="flex flex-col md:flex-row md:gap-32 gap-6 md:mt-12">
        <img
          src={book.book_image}
          alt={book.book_title}
          className="book-image w-full md:w-1/4 object-contain rounded-lg shadow-sm"
        />

        <div className="book-info flex-1 flex flex-col justify-center items-start">
          <h1 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">{book.book_title}</h1>
          <p className="text-gray-700 mb-4 text-justify leading-relaxed">
            {book.book_description}
          </p>
          <p className="text-lg text-gray-700 mb-2">
            Author: <span className="font-semibold">{book.book_author}</span>
          </p>
          <p className="md:text-3xl text-xl font-bold text-cyan-700 mb-6">₹{book.book_price}</p>

          <div className="text-sm text-gray-700 space-y-3 mb-8">
            <p><strong>Category:</strong> {book.category?.category_name || "—"}</p>
            <p><strong>Language:</strong> {book.book_language}</p>
            <p><strong>Paper:</strong> PAPER BACK</p>
          </div>

          {/* Download / Wishlist buttons */}
          <div className="flex flex-wrap gap-4">
            <a
              href={book.book_file}
              target="_blank"
              rel="noopener noreferrer"
              className="cursor-pointer bg-cyan-600 text-white border border-cyan-600 rounded-lg px-5 py-2 flex items-center gap-2 hover:bg-cyan-700 transition-all duration-300"
            >
              <IconBook stroke={2} /> View Book
            </a>
            {/* <button className="cursor-pointer border rounded-lg px-5 py-2 flex items-center gap-2 hover:bg-gray-100 transition-all duration-300 hover:shadow-md">
              ❤️ Add To Wishlist
            </button> */}
          </div>
        </div>
      </div>

      {/* Related Books (optional future addition) */}
      <div ref={relatedRef} className="mt-12"></div>
    </div>
  );
}
