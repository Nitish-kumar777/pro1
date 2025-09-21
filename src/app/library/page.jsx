"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const Page = () => {
  const { data: session, status } = useSession();

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBookings() {
      try {
        const res = await fetch("/api/bookings/me");
        const data = await res.json();
        setBookings(data.bookings || []);
      } catch (err) {
        console.error("Error fetching bookings:", err);
        setBookings([]);
      } finally {
        setLoading(false);
      }
    }
    fetchBookings();
  }, []);

  // Format date
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Calculate days between dates
  const calculateDaysBetween = (date1, date2) => {
    const oneDay = 24 * 60 * 60 * 1000;
    return Math.round(Math.abs((new Date(date1) - new Date(date2)) / oneDay));
  };

  if (status !== "authenticated") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Authentication Required</h1>
          <p className="text-gray-600 mb-6">Please log in to view your favorite books</p>
          <button
            onClick={() => router.push("/login")}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 text-white font-semibold py-3 px-6 rounded-lg hover:from-blue-700 hover:to-indigo-800 transition-all duration-200"
          >
            Sign In
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-6 py-5">
            <h1 className="text-2xl font-bold text-white">My Book Rentals</h1>
            <p className="text-blue-100 mt-1">Manage your current and past book rentals</p>
          </div>

          <div className="p-6">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
                <p className="text-gray-600">Loading your rentals...</p>
              </div>
            ) : bookings.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-20 h-20 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
                  <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No books rented yet
                </h3>
                <p className="text-gray-500 mb-6">Books you rent will appear here</p>
                <Link href="/books-feed">
                  <button
                    className="inline-flex items-center px-5 py-3 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 transition-all"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                    Browse Books
                  </button>
                </Link>
              </div>
            ) : (
              <div className="space-y-6">
                {bookings.map((booking) => {
                  const isOverdue = booking.status === "overdue";
                  const isReturned = booking.status === "returned";
                  const isActive = booking.status === "active";
                  const rentalDays = calculateDaysBetween(booking.createdAt, new Date());

                  return (
                    <div key={booking.id} className="border border-gray-200 rounded-xl p-5 bg-white hover:shadow-md transition-shadow">
                      <div className="flex flex-col md:flex-row">
                        <div className="flex-shrink-0 mb-4 md:mb-0 md:mr-6">
                          <div className="w-28 h-36 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-lg flex items-center justify-center overflow-hidden shadow-sm">
                            <img
                              src={booking.book?.imageUrl || "/placeholder-book.jpg"}
                              alt={booking.book?.title}
                              className="object-contain w-full h-full"
                            />
                          </div>
                        </div>

                        <div className="flex-grow">
                          <div className="flex flex-col md:flex-row md:items-start md:justify-between">
                            <div>
                              <h2 className="text-xl font-bold text-gray-900">
                                {booking.book?.title || "Untitled Book"}
                              </h2>
                              <p className="text-gray-600 mt-1">
                                by {booking.book?.author || "Unknown Author"}
                              </p>
                            </div>

                            <div className="mt-3 md:mt-0">
                              <span
                                className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${isReturned
                                    ? "bg-green-100 text-green-800"
                                    : isOverdue
                                      ? "bg-red-100 text-red-800"
                                      : "bg-blue-100 text-blue-800"
                                  }`}
                              >
                                {isReturned && (
                                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                  </svg>
                                )}
                                {isOverdue && (
                                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                  </svg>
                                )}
                                {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                              </span>
                            </div>
                          </div>

                          <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            <div className="bg-gray-50 p-3 rounded-lg">
                              <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wide">Rental Date</h3>
                              <p className="text-gray-900 font-medium">{formatDate(booking.createdAt)}</p>
                            </div>

                            <div className="bg-gray-50 p-3 rounded-lg">
                              <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wide">Return By</h3>
                              <p className="text-gray-900 font-medium">{formatDate(booking.returnDeadline)}</p>
                            </div>

                            <div className="bg-gray-50 p-3 rounded-lg">
                              <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wide">Days {isReturned ? "Rented" : "Remaining"}</h3>
                              <p className={`font-medium ${isOverdue ? "text-red-600" : "text-gray-900"}`}>
                                {isReturned ? rentalDays : Math.abs(booking.daysRemaining)} days
                              </p>
                            </div>

                            <div className="bg-gray-50 p-3 rounded-lg">
                              <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wide">Fine Amount</h3>
                              <p className={booking.fine > 0 ? "text-red-600 font-bold" : "text-gray-900 font-medium"}>
                                ₹{booking.fine || 0}
                                {isOverdue && <span className="text-xs font-normal text-red-500 ml-1">(₹20/day)</span>}
                              </p>
                            </div>
                          </div>

                          {/* Status-specific messages */}
                          {isReturned && (
                            <div className="mt-4 bg-green-50 border border-green-200 rounded-lg p-4">
                              <div className="flex items-center">
                                <svg className="w-5 h-5 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <h3 className="text-sm font-medium text-green-800">Book Returned Successfully</h3>
                              </div>
                              <p className="text-sm text-green-700 mt-2">
                                Thank you for returning the book on time. No fines were applied.
                              </p>
                            </div>
                          )}

                          {isOverdue && (
                            <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-4">
                              <div className="flex items-center">
                                <svg className="w-5 h-5 text-red-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <h3 className="text-sm font-medium text-red-800">Overdue Notice</h3>
                              </div>
                              <p className="text-sm text-red-700 mt-2">
                                This book is overdue by {Math.abs(booking.daysRemaining)} days.
                                A fine of ₹{booking.fine} has been applied (₹20 per day).
                                Please return the book as soon as possible to avoid additional charges.
                              </p>
                            </div>
                          )}

                          {isActive && booking.daysRemaining <= 7 && (
                            <div className="mt-4 bg-amber-50 border border-amber-200 rounded-lg p-4">
                              <div className="flex items-center">
                                <svg className="w-5 h-5 text-amber-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <h3 className="text-sm font-medium text-amber-800">Return Reminder</h3>
                              </div>
                              <p className="text-sm text-amber-700 mt-2">
                                Please return this book within {booking.daysRemaining} days to avoid a late fee of ₹20 per day.
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Fine Policy Information Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-amber-500 to-orange-600 px-6 py-4">
            <h2 className="text-lg font-bold text-white">Fine Policy</h2>
          </div>
          <div className="p-6">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <svg className="w-6 h-6 text-amber-500 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-md font-medium text-gray-900">₹20 per day late fee</h3>
                <p className="mt-2 text-sm text-gray-600">
                  Books are due 30 days after rental. A fine of ₹20 per day will be applied for each day past the due date.
                  Please return books on time to avoid additional charges.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;