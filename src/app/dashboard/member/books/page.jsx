"use client";

import React, { useEffect, useState } from "react";

const Page = () => {
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
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="bg-blue-600 px-6 py-4">
            <h1 className="text-2xl font-bold text-white">My Booked Books</h1>
            <p className="text-blue-100 mt-1">Manage your current book rentals</p>
          </div>

          <div className="p-6">
            {loading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              </div>
            ) : bookings.length === 0 ? (
              <div className="text-center py-12">
                <h3 className="text-lg font-medium text-gray-900 mb-1">
                  No books booked yet
                </h3>
                <p className="text-gray-500">Books you rent will appear here</p>
                <button
                  onClick={() => (window.location.href = "/books-feed")}
                  className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                >
                  Browse Books
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                {bookings.map((booking) => {
                  const isOverdue = booking.status === "overdue";
                  const isReturned = booking.status === "returned";

                  return (
                    <div key={booking.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex flex-col md:flex-row md:items-start">
                        <div className="flex-shrink-0 mb-4 md:mb-0 md:mr-6">
                          <div className="w-24 h-32 bg-blue-100 rounded-md flex items-center justify-center">
                            <img
                              src={booking.book?.imageUrl || "/placeholder.png"}
                              alt=""
                              className="object-cover w-full h-full rounded-md"
                            />
                          </div>
                        </div>

                        <div className="flex-grow">
                          <h2 className="text-xl font-semibold text-gray-900">
                            {booking.book?.title || "Untitled Book"}
                          </h2>
                          <p className="text-gray-600 mt-1">
                            by {booking.book?.author || "Unknown Author"}
                          </p>

                          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <h3 className="text-sm font-medium text-gray-500">Booking Date</h3>
                              <p className="text-gray-900">{formatDate(booking.createdAt)}</p>
                            </div>

                            <div>
                              <h3 className="text-sm font-medium text-gray-500">Return Deadline</h3>
                              <p className="font-medium">
                                {formatDate(booking.returnDeadline)}
                              </p>
                            </div>

                            <div>
                              <h3 className="text-sm font-medium text-gray-500">Status</h3>
                              <span
                                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                  booking.status === "active"
                                    ? "bg-green-100 text-green-800"
                                    : booking.status === "overdue"
                                    ? "bg-red-100 text-red-800"
                                    : "bg-gray-100 text-gray-800"
                                }`}
                              >
                                {booking.status}
                              </span>
                            </div>

                            <div>
                              <h3 className="text-sm font-medium text-gray-500">Days Remaining</h3>
                              <p className="text-gray-900">
                                {booking.status === "returned"
                                  ? "-"
                                  : `${Math.abs(booking.daysRemaining)} days`}
                              </p>
                            </div>

                            <div>
                              <h3 className="text-sm font-medium text-gray-500">Fine</h3>
                              <p
                                className={
                                  booking.fine > 0
                                    ? "text-red-600 font-bold"
                                    : "text-gray-900"
                                }
                              >
                                ₹{booking.status === "returned" ? 0 : booking.fine}
                              </p>
                            </div>
                          </div>

                          {/* Special messages */}
                          {isReturned && (
                            <div className="mt-4 bg-gray-50 border border-gray-200 rounded-md p-3">
                              <h3 className="text-sm font-medium text-gray-800">
                                Your booking has been returned.
                              </h3>
                              <p className="text-sm text-gray-600 mt-2">
                                Your booking record will reset soon.
                              </p>
                            </div>
                          )}

                          {isOverdue && (
                            <div className="mt-4 bg-red-50 border border-red-200 rounded-md p-3">
                              <h3 className="text-sm font-medium text-red-800">Overdue Notice</h3>
                              <p className="text-sm text-red-700 mt-2">
                                Fine pending: <strong>₹{booking.fine}</strong>. Please return the
                                book as soon as possible.
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
      </div>
    </div>
  );
};

export default Page;