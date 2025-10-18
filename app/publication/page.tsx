"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function PublicationsPage() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [search, setSearch] = useState("");

  const categories = [
    "All",
    "12TH PRELIMS",
    "ACE PUBLICATIONS",
    "Bank Clerk/PO",
    "Bank Online",
    "DEGREE LEVEL",
    "CPSC",
    "HSA English",
    "HSA Malayalam",
    "HSA Maths",
    "HSA SS",
    "Junior Cooperative Inspector",
    "Lab Technician",
    "LDC",
    "LGS",
    "LPUP",
    "Secretariat Asst",
  ];

  const books = [
    { id: 1, title: "Mathematics Super Rank File", category: "HSA Maths", price: 160, image: "/book_01.png" },
    { id: 2, title: "Mission LP/UP Super Rank File 7th Edition", category: "LPUP", price: 180, image: "/book_02.png" },
    { id: 3, title: "HIGH SCHOOL TEACHER MATHEMATICS", category: "HSA Maths", price: 580, image: "/book_03.png" },
    { id: 4, title: "Malayalam Grammar File", category: "HSA Malayalam", price: 160, image: "/book_04.png" },
    { id: 5, title: "HSA Social Studies Rank File", category: "HSA SS", price: 180, image: "/book_05.png" },
    { id: 6, title: "High School Study Material", category: "ACE PUBLICATIONS", price: 580, image: "/book_06.png" },
    { id: 7, title: "LDC Previous Questions", category: "LDC", price: 160, image: "/book_07.png" },
    { id: 8, title: "LP/UP Assistant Rank File", category: "LPUP", price: 180, image: "/book_08.png" },
    { id: 9, title: "HSA Maths Super Rank File", category: "HSA Maths", price: 580, image: "/book_09.png" },
    { id: 10, title: "LP/UP Abbreviation File", category: "LPUP", price: 180, image: "/book_10.png" },
    { id: 11, title: "English Grammar Guide", category: "HSA English", price: 160, image: "/book_11.png" },
    { id: 12, title: "Current Affairs Book", category: "ACE PUBLICATIONS", price: 580, image: "/book_12.png" },
  ];

  const filteredBooks = books.filter(
    (b) =>
      (selectedCategory === "All" || b.category === selectedCategory) &&
      b.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-6 md:px-10 md:py-16 py-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-gray-600 text-sm mb-6">
        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0h6" />
        </svg>
        <span>/</span>
        <span>Publications</span>
      </div>

      <h1 className="text-2xl md:text-3xl font-bold text-center text-gradient-to-r from-[#0197db] to-[#0c8da6] mb-4">Publications</h1>
      <p className="text-center text-gray-600 max-w-3xl mx-auto mb-10 text-sm md:text-base">
        ACE publishes authentic study materials, Super Rank Files, Books and Magazines which help the candidates
        to secure top ranks in many toughest competitive examinations.
      </p>

      <div className="md:hidden mb-6">
        <div className="flex overflow-x-auto gap-3 pb-2 scrollbar-hide snap-x">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
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
                  onClick={() => setSelectedCategory(cat)}
                  className={`cursor-pointer hover:text-cyan-700 ${
                    selectedCategory === cat ? "text-cyan-700 font-semibold" : "text-gray-600"
                  }`}
                >
                  {cat}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex-1 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBooks.length > 0 ? (
            filteredBooks.map((book) => (
              <div
                key={book.id}
                onClick={() => router.push(`/publication/${book.id}`)}
                className="bg-white border rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 p-4 cursor-pointer flex flex-col h-[400px] justify-between"
              >
                <div className="flex-1 flex items-center justify-center">
                  <img src={book.image} alt={book.title} className="w-full h-64 object-contain" />
                </div>
                <div className="mt-3 text-center">
                  <h3 className="font-semibold text-gray-800 text-sm line-clamp-2">{book.title}</h3>
                  <p className="font-bold text-gray-900 mt-1">₹{book.price.toFixed(2)}</p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500 col-span-full text-center py-10">No books found.</p>
          )}
        </div>
      </div>
    </div>
  );
}
