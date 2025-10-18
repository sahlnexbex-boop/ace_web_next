"use client";
import { useParams, useRouter } from "next/navigation";
import React from "react";

export default function PublicationDetails() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const books = [
    { id: 1, title: "Mathematics Super Rank File", category: "HSA Maths", price: 160, author: "ACE Publication", language: "ENGLISH", image: "/book_01.png" },
    { id: 2, title: "Mission LP/UP Super Rank File 7th Edition", category: "LPUP", price: 180, author: "ACE Publication", language: "MALAYALAM", image: "/book_02.png" },
    { id: 3, title: "HIGH SCHOOL TEACHER MATHEMATICS", category: "HSA Maths", price: 580, author: "ACE Publication", language: "ENGLISH", image: "/book_03.png" },
    { id: 4, title: "Malayalam Grammar File", category: "HSA Maths", price: 160, author: "ACE Publication", language: "MALAYALAM", image: "/book_04.png" },
    { id: 11, title: "English Grammar Guide", category: "HSA Maths", price: 160, author: "ACE Publication", language: "ENGLISH", image: "/book_11.png" },
    { id: 12, title: "Current Affairs Book", category: "HSA Maths", price: 580, author: "ACE Publication", language: "ENGLISH", image: "/book_12.png" },
  ];

  const book = books.find((b) => b.id === Number(id));
  if (!book) return <div className="p-10 text-center">Book not found.</div>;

  const related = books.filter((b) => b.category === book.category && b.id !== book.id);

  return (
    <div className="max-w-7xl mx-auto px-6 md:px-10 md:py-16 py-8">
      {/* Breadcrumb */}
      <div className="flex items-start gap-2 text-gray-600 text-sm mb-6">
        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0h6" />
        </svg>
        <span>/</span>
        <span>Publications</span>
        <span>/</span>
        <span>{book.title}</span>
      </div>

      <div className="flex flex-col md:flex-row md:gap-32 gap-3 md:mt-12">
        <img src={book.image} alt={book.title} className="w-full md:w-1/4 object-contain rounded-lg" />
        <div className="flex-1 flex flex-col justify-center items-start">
          <h1 className="text-xl md:text-2xl font-bold text-gray-900 md:mb-3 mb-2">{book.title}</h1>
          <p className="text-xl font-bold text-gray-600 mb-2 ">Author: {book.author}</p>
          <p className="md:text-3xl text-xl  font-bold text-cyan-700 mb-10">₹{book.price}</p>
          <div className="text-sm text-gray-700 space-y-4 mb-8">
            <p><strong>Category:</strong> {book.category}</p>
            <p><strong>Language:</strong> {book.language}</p>
            <p><strong>Author:</strong> {book.author}</p>
            <p><strong>Paper:</strong> PAPER BACK</p>
          </div>
          <button className="cursor-pointer border rounded-lg px-5 py-2 flex items-center gap-2 hover:bg-gray-100 transition">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="red" className="icon icon-tabler icons-tabler-filled icon-tabler-heart"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M6.979 3.074a6 6 0 0 1 4.988 1.425l.037 .033l.034 -.03a6 6 0 0 1 4.733 -1.44l.246 .036a6 6 0 0 1 3.364 10.008l-.18 .185l-.048 .041l-7.45 7.379a1 1 0 0 1 -1.313 .082l-.094 -.082l-7.493 -7.422a6 6 0 0 1 3.176 -10.215z" /></svg> Add To Wishlist
          </button>
        </div>
      </div>

      {related.length > 0 && (
        <>
          <h2 className="text-xl md:text-2xl font-bold text-center text-gray-900 my-8">Other Books</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 overflow-x-auto snap-x md:overflow-visible">
            {related.map((r) => (
              <div
                key={r.id}
                onClick={() => router.push(`/publication/${r.id}`)}
                className="bg-white border rounded-lg shadow-sm hover:shadow-lg transition-all p-3 cursor-pointer snap-center"
              >
                <img src={r.image} alt={r.title} className="w-full object-contain mb-2" />
                <h3 className="text-sm font-semibold text-center text-gray-800">{r.title}</h3>
                <p className="text-center text-gray-900 font-bold mt-1">₹{r.price}</p>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
