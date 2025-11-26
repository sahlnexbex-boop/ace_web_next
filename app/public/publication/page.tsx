"use client";

import React, { useState, useLayoutEffect, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { getPublications } from "@/lib/api/publication";
import { getCourseCategories } from "@/lib/api/courseCategory";
import { useDebounce } from "@/hooks/debounce";
import Loader from "@/components/loader";

gsap.registerPlugin(ScrollTrigger);

export default function PublicationsPage() {
  const router = useRouter();

  const [categories, setCategories] = useState<string[]>(["All"]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);

  const [books, setBooks] = useState<any[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const pageRef = useRef(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await getCourseCategories();
        if (res?.data) {
          const catNames = res.data.map((c: any) => c.category_name);
          setCategories(["All", ...catNames]);
        }
      } catch (err) {
        console.error("Error fetching categories:", err);
      }
    };
    fetchCategories();
  }, []);

  const fetchBooks = async () => {
    setLoading(true);
    try {
      const categoryObj = await getCourseCategories();
      const selectedCatObj = categoryObj.data?.find(
        (c: any) => c.category_name === selectedCategory
      );
      const category_id =
        selectedCategory !== "All" ? selectedCatObj?.category_id : undefined;

      const res = await getPublications(
        currentPage,
        6,
        debouncedSearch,
        1,
        category_id
      );
      if (res?.data) {
        setBooks(res.data);
        setTotalPages(res.totalPages);
      }
    } catch (err) {
      console.error("Error fetching books:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, [debouncedSearch, selectedCategory, currentPage]);

  useLayoutEffect(() => {
    if (!cardsRef.current || books.length === 0) return;

    const container = cardsRef.current;
    const ctx = gsap.context(() => {
      const cards = container.querySelectorAll(".book-card");
      if (cards.length === 0) return;

      gsap.fromTo(
        cards,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: container,
            start: "top 85%",
          },
        }
      );
    }, container);

    return () => ctx.revert();
  }, [books]);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <div
      ref={pageRef}
      className="max-w-7xl mx-auto px-6 md:px-10 md:py-16 py-8"
    >
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-gray-600 text-sm mb-6">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-4 h-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeWidth={2}
            d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0h6"
          />
        </svg>
        <span>/</span>
        <span>Publications</span>
      </div>

      <h1 className="text-2xl md:text-3xl font-bold text-center mb-4 text-gradient-to-r from-[#0197db] to-[#0c8da6]">
        Publications
      </h1>
      <p className="text-center text-gray-600 max-w-3xl mx-auto mb-10 text-sm md:text-base">
        ACE publishes authentic study materials, Super Rank Files, Books and
        Magazines which help candidates secure top ranks in many toughest
        competitive examinations.
      </p>

      <div className="md:hidden mb-6">
        <div className="flex overflow-x-auto gap-3 pb-2 scrollbar-hide snap-x no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setSelectedCategory(cat);
                setCurrentPage(1);
              }}
              className={`flex-shrink-0 snap-center px-4 py-2 text-sm rounded-full border ${
                selectedCategory === cat
                  ? "bg-cyan-600 text-white border-cyan-600"
                  : "bg-white text-gray-700 border-gray-300"
              } whitespace-nowrap transition`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        <div className="hidden md:block md:w-1/4 space-y-5">
          <input
            type="text"
            placeholder="Search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500"
          />
          <div>
            <h3 className="font-semibold text-gray-800 mb-3">Categories</h3>
            <ul className="space-y-2 text-sm">
              {categories.map((cat) => (
                <li
                  key={cat}
                  onClick={() => {
                    setSelectedCategory(cat);
                    setCurrentPage(1);
                  }}
                  className={`cursor-pointer hover:text-cyan-700 ${
                    selectedCategory === cat
                      ? "text-cyan-700 font-semibold"
                      : "text-gray-600"
                  }`}
                >
                  {cat}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Books Grid */}
        <div
          ref={cardsRef}
          className="flex-1 grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {loading ? (
            <p className="text-gray-500 col-span-full text-center py-10">
              <Loader />
            </p>
          ) : books.length > 0 ? (
            books.map((book) => (
              <div
                key={book.book_id}
                onClick={() =>
                  router.push(`/public/publication/${book.book_id}`)
                }
                className="book-card bg-white border rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 p-4 cursor-pointer flex flex-col h-[400px] justify-between"
              >
                <div className="flex-1 flex items-center justify-center">
                  <img
                    src={book.book_image || "/placeholder.svg"}
                    alt={book.book_title}
                    className="w-full h-64 object-contain transform transition-transform duration-500 hover:scale-105"
                  />
                </div>
                <div className="mt-3 text-center">
                  <h3 className="font-semibold text-gray-800 text-sm line-clamp-2">
                    {book.book_title}
                  </h3>
                  <p className="text-gray-500 mt-1">{book.book_author}</p>
                  <p className="font-bold text-gray-900 mt-1">
                    ₹{book.book_price}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="flex justify-center items-center">
              <img src="../no_data.png" alt="" className="w-52 md:w-72 opacity-40" />
            </div>
          )}
        </div>
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center mt-10 gap-3">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-4 py-2 rounded-md border border-gray-300 disabled:opacity-50"
          >
            Prev
          </button>

          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              onClick={() => handlePageChange(i + 1)}
              className={`px-4 py-2 rounded-md border ${
                currentPage === i + 1
                  ? "bg-cyan-600 text-white border-cyan-600"
                  : "border-gray-300"
              }`}
            >
              {i + 1}
            </button>
          ))}

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-4 py-2 rounded-md border border-gray-300 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
