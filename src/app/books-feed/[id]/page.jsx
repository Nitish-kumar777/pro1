"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

const Page = () => {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchBook = async () => {
      const response = await fetch(`/api/books/show-books/${id}`);
      const data = await response.json();
      setBook(data);
    };
    fetchBook();
  }, [id]);

  const handleButtonClick = (data) => {
    setBook(data);
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-10 px-4 bg-gray-50">
      <h1 className="text-3xl font-bold mb-8 text-gray-800 tracking-wide">
        Book Details
      </h1>

      {book ? (
        <div className="flex flex-col md:flex-row bg-white shadow-xl rounded-2xl overflow-hidden w-full max-w-4xl border border-gray-100">
          {/* Image left side */}
          <div className="flex-shrink-0 flex items-center justify-center bg-gray-100 md:w-1/3 p-4">
            <img
              src={book.imageUrl}
              alt={book.title}
              className="w-44 h-64 object-cover rounded-lg shadow-md"
            />
          </div>

          {/* Details right side */}
          <div className="flex flex-col justify-between p-6 md:w-2/3">
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-3">
                {book.title}
              </h2>
              <p className="text-gray-700 mb-1">
                <span className="font-medium text-gray-800">Author:</span> {book.author}
              </p>
              <p className="text-gray-700 mb-1">
                <span className="font-medium text-gray-800">ISBN:</span> {book.isbn}
              </p>
              <p className="text-gray-600 mt-3 leading-relaxed">
                {book.description}
              </p>
            </div>

            {/* Buttons */}
            <div className="mt-6 flex space-x-4">
              <Link href={`/books-feed/${id}/rent`}>
                <button
                  type="button"
                  onClick={() => handleButtonClick(book)}
                  className="px-5 py-2.5 bg-blue-600 text-white font-medium rounded-lg shadow hover:bg-blue-700 transition"
                >
                  Rent / Book
                </button>
              </Link>
              <button className="px-5 py-2.5 bg-gray-100 text-gray-800 font-medium rounded-lg shadow hover:bg-gray-200 transition">
                Save
              </button>
            </div>
          </div>
        </div>
      ) : (
        <p className="text-gray-600 mt-6">Loading...</p>
      )}
    </div>
  );
};

export default Page;