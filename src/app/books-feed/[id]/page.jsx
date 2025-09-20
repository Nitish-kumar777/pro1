"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "react-toastify";
import { useUser } from "@/context/UserContext";

const Page = () => {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();
  const [isFavorite, setIsFavorite] = useState(false);


  useEffect(() => {
    const fetchBook = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/books/show-books/${id}`);

        if (!response.ok) {
          throw new Error(`Failed to fetch book: ${response.status}`);
        }

        const data = await response.json();
        setBook(data);
        setError(null);
      } catch (err) {
        console.error("Error fetching book:", err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBook();
  }, [id]);

  useEffect(() => {
    const checkFavorite = async () => {
      try {
        const res = await fetch(`/api/favorites/${book.id}`);
        if (res.ok) {
          const data = await res.json();
          setIsFavorite(data.isFavorite);
        }
      } catch (err) {
        console.error("Error checking favorite:", err);
      }
    };

    if (book?.id) checkFavorite();
  }, [book?.id]);

  const handleRentClick = () => {
    // Additional logic can be added here if needed
    router.push(`/books-feed/${id}/rent`);
  };


  const handleSaveClick = async () => {
    try {
      if (isFavorite) {
        // Remove favorite
        const res = await fetch(`/api/favorites/${book.id}`, { method: "DELETE" });
        const data = await res.json();

        if (res.ok) {
          toast.success("Removed from favorites!");
          setIsFavorite(false);
        } else {
          toast.error(data.error || "Failed to remove");
        }
      } else {
        // Add favorite
        const res = await fetch("/api/favorites", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ bookId: book.id }),
        });

        const data = await res.json();

        if (res.ok) {
          toast.success("Book saved to favorites!");
          setIsFavorite(true);
        } else {
          toast.error(data.error || data.message || "Failed to save");
        }
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-600">Loading book details...</p>
        </div>
      </div>
    );
  }

  if (error || !book) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md text-center">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Book Not Found</h2>
          <p className="text-gray-600 mb-6">
            {error || "We couldn't find the book you're looking for."}
          </p>
          <Link
            href="/books-feed"
            className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg shadow hover:bg-blue-700 transition"
          >
            Browse All Books
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header with back button */}
        <div className="mb-8">
          <button
            onClick={() => router.back()}
            className="flex items-center text-blue-600 hover:text-blue-800 font-medium transition group"
          >
            <svg className="w-5 h-5 mr-2 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Books
          </button>
        </div>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="flex flex-col md:flex-row">
            {/* Book Cover Section */}
            <div className="md:w-2/5 p-8  flex items-center justify-center">
              <div className="relative transform hover:scale-105 transition-transform duration-300">
                <div className="absolute -inset-4 bg-gradient-to-r from-blue-300/30 to-purple-300/30 rounded-2xl transform rotate-3 blur-sm"></div>
                <div className="relative w-64 h-80 z-10">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent rounded-lg"></div>
                  <img
                    src={book.imageUrl || "/placeholder-book.jpg"}
                    alt={book.title}
                    className="w-full h-full object-cover rounded-lg shadow-2xl"
                    onError={(e) => {
                      e.target.src = "/placeholder-book.jpg";
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Book Details Section */}
            <div className="md:w-3/5 p-8">
              <div className="mb-6">
                <div className="inline-block px-3 py-1 text-xs font-semibold text-blue-700 bg-blue-100 rounded-full mb-4">
                  {book.category || "Fiction"}
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">{book.title}</h1>
                <p className="text-xl text-gray-700 mb-4">by <span className="text-indigo-600 font-semibold">{book.author}</span></p>

                <div className="flex items-center mb-6">
                  <div className="flex text-yellow-400 mr-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <svg key={star} className="w-5 h-5 fill-current" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <span className="text-gray-600 ml-2">{book.ratings || 4.5} / 5.0</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100">
                  <p className="text-xs font-semibold text-blue-700 uppercase tracking-wide mb-1">ISBN</p>
                  <p className="font-medium text-gray-900">{book.isbn}</p>
                </div>
                <div className="bg-green-50/50 p-4 rounded-xl border border-green-100">
                  <p className="text-xs font-semibold text-green-700 uppercase tracking-wide mb-1">Status</p>
                  <p className="font-medium text-green-600 flex items-center">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
                    Available for Rent
                  </p>
                </div>
                <div className="bg-purple-50/50 p-4 rounded-xl border border-purple-100">
                  <p className="text-xs font-semibold text-purple-700 uppercase tracking-wide mb-1">Category</p>
                  <p className="font-medium text-gray-900">{book.category || "Available soon"}</p>
                </div>
                <div className="bg-amber-50/50 p-4 rounded-xl border border-amber-100">
                  <p className="text-xs font-semibold text-amber-700 uppercase tracking-wide mb-1">Published</p>
                  <p className="font-medium text-gray-900">{book.publishedYear || "Not Available"}</p>
                </div>
              </div>

              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Description
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {book.description || "No description available for this book."}
                </p>
              </div>

              <div className="flex flex-wrap gap-4">
                <button
                  onClick={handleRentClick}
                  className="flex-1 min-w-[200px] px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-700 text-white font-medium rounded-lg shadow-md hover:from-blue-700 hover:to-indigo-800 transition-all transform hover:-translate-y-0.5 flex items-center justify-center"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                  Rent This Book
                </button>

                <button
                  onClick={handleSaveClick}
                  className={`px-6 py-3 border font-medium rounded-lg shadow-sm transition-all flex items-center justify-center
    ${isFavorite
                      ? "border-red-300 text-red-600 bg-red-50 hover:bg-red-100"
                      : "border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-indigo-300"}`}
                >
                  <svg
                    className={`w-5 h-5 mr-2 ${isFavorite ? "text-red-500 fill-current" : "text-gray-500"}`}
                    fill={isFavorite ? "currentColor" : "none"}
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                  </svg>
                  {isFavorite ? "Remove from Favorites" : "Save for Later"}
                </button>



              </div>
            </div>
          </div>
        </div>

        {/* Rental Information Section */}
        <div className="mt-6 bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
            <svg className="w-5 h-5 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            Rental Information
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between border-b border-gray-100 pb-3">
              <span className="text-gray-600">Rental Period</span>
              <span className="font-medium">30 days</span>
            </div>
            <div className="flex justify-between border-b border-gray-100 pb-3">
              <span className="text-gray-600">Daily Rate</span>
              <span className="font-medium">0/day</span>
            </div>
            <div className="flex justify-between border-b border-gray-100 pb-3">
              <span className="text-gray-600">Total Copies Available</span>
              <span className="font-medium text-green-600">{book.totalBook || "not available"}</span>
            </div>
            <div className="flex justify-between pt-2">
              <span className="text-gray-600 font-semibold">Fine if late return</span>
              <span className="font-bold text-blue-600"> 20/per day</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;