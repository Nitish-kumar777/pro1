"use client";

import React, { useEffect, useState } from "react";

const BookRecommendations = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchBooks() {
      try {
        const res = await fetch("/api/books/show-books");
        const data = await res.json();
        setBooks(data);
      } catch (error) {
        console.error("Error fetching books:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchBooks();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <div className="bg-gray-50 py-8 px-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-800">
          Book Recommendations
        </h2>
        <button className="text-sm font-medium text-blue-600 hover:underline flex items-center">
          View all <span className="ml-1">→</span>
        </button>
      </div>

      {/* Horizontal Scroll */}
      <div className="overflow-x-auto">
        <div className="flex space-x-6 gap-11 justify-center pb-2">
          {books?.slice(0, 4).map((book, index) => (
            <div
              key={index}
              className="flex-shrink-0 w-40 sm:w-48 bg-white rounded-xl shadow-sm hover:shadow-md transition overflow-hidden"
            >
              {/* Book Cover */}
              {book.imageUrl ? (
                <img
                  src={book.imageUrl}
                  alt={book.title}
                  className="w-full h-56 object-contain"
                />
              ) : (
                <div className="w-full h-56 bg-gray-200 flex items-center justify-center text-gray-400">
                  No Image
                </div>
              )}

              {/* Title */}
              <div className="p-3">
                <h3 className="text-sm font-semibold text-gray-800 truncate">
                  {book.title}
                </h3>
                <p className="text-xs text-gray-500 truncate">
                  {book.author || "Unknown Author"}
                </p>
              </div>
            </div>
          ))}

        </div>
      </div>
    </div>
  );
};

export default BookRecommendations;
