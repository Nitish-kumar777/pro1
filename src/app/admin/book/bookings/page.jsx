"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const AdminBookingsPage = () => {
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const router = useRouter();

  useEffect(() => {
    fetchBookings();
  }, []);

  useEffect(() => {
    filterBookings();
  }, [bookings, searchTerm, statusFilter]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/bookings/admin");
      const data = await res.json();
      setBookings(data.bookings || []);
    } catch (err) {
      setBookings([]);
      showMessage("Failed to fetch bookings", "error");
    } finally {
      setLoading(false);
    }
  };

  const filterBookings = () => {
    let result = bookings;

    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (booking) =>
          booking.user?.name?.toLowerCase().includes(term) ||
          booking.user?.email?.toLowerCase().includes(term) ||
          booking.book?.title?.toLowerCase().includes(term) ||
          booking.book?.author?.toLowerCase().includes(term)
      );
    }

    // Apply status filter
    if (statusFilter !== "all") {
      const today = new Date();
      result = result.filter((booking) => {
        const deadline = calculateReturnDeadline(booking.createdAt);
        const daysRemaining = calculateDaysRemaining(deadline);
        
        if (statusFilter === "active") return daysRemaining >= 0;
        if (statusFilter === "overdue") return daysRemaining < 0;
        if (statusFilter === "returned") return booking.status === "returned";
        return true;
      });
    }

    setFilteredBookings(result);
  };

  const showMessage = (text, type) => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: "", type: "" }), 3000);
  };

  const handleReturnBook = async (bookingId, bookId) => {
    try {
      const res = await fetch("/api/bookings/return", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookingId, bookId }),
      });

      if (res.ok) {
        showMessage("Book returned successfully", "success");
        fetchBookings(); // Refresh the list
      } else {
        const data = await res.json();
        showMessage(data.error || "Failed to return book", "error");
      }
    } catch (err) {
      showMessage("Error returning book", "error");
    }
  };

  const handleDeleteBooking = async (bookingId) => {
    if (!confirm("Are you sure you want to delete this booking record?")) {
      return;
    }

    try {
      const res = await fetch(`/api/bookings/${bookingId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        showMessage("Booking deleted successfully", "success");
        fetchBookings(); // Refresh the list
      } else {
        const data = await res.json();
        showMessage(data.error || "Failed to delete booking", "error");
      }
    } catch (err) {
      showMessage("Error deleting booking", "error");
    }
  };

  const viewBookingDetails = (bookingId) => {
    router.push(`/admin/bookings/${bookingId}`);
  };

  // Calculate return deadline (1 month from booking date)
  const calculateReturnDeadline = (bookingDate) => {
    const date = new Date(bookingDate);
    date.setMonth(date.getMonth() + 1);
    return date;
  };

  // Calculate days remaining until return deadline
  const calculateDaysRemaining = (deadline) => {
    const today = new Date();
    const diffTime = deadline - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  // Format date to readable string
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="bg-blue-600 px-6 py-4">
            <h1 className="text-2xl font-bold text-white">Admin - Bookings Management</h1>
            <p className="text-blue-100 mt-1">Manage all user bookings and returns</p>
          </div>

          <div className="p-6">
            {message.text && (
              <div
                className={`mb-4 p-3 rounded-md ${
                  message.type === "error"
                    ? "bg-red-100 text-red-700"
                    : "bg-green-100 text-green-700"
                }`}
              >
                {message.text}
              </div>
            )}

            {/* Search and Filter Section */}
            <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
                  Search
                </label>
                <input
                  type="text"
                  id="search"
                  placeholder="Search by user or book..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                  Filter by Status
                </label>
                <select
                  id="status"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">All Bookings</option>
                  <option value="active">Active</option>
                  <option value="overdue">Overdue</option>
                  <option value="returned">Returned</option>
                </select>
              </div>
              
              <div className="flex items-end">
                <button
                  onClick={fetchBookings}
                  className="cursor-pointer w-full px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
                >
                  Refresh Data
                </button>
              </div>
            </div>

            {/* Stats Summary */}
            <div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                <h3 className="text-lg font-semibold text-blue-800">Total Bookings</h3>
                <p className="text-2xl font-bold text-blue-600">{bookings.length}</p>
              </div>
              
              <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                <h3 className="text-lg font-semibold text-green-800">Active</h3>
                <p className="text-2xl font-bold text-green-600">
                  {bookings.filter(b => calculateDaysRemaining(calculateReturnDeadline(b.createdAt)) >= 0 && b.status !== "returned").length}
                </p>
              </div>
              
              <div className="bg-red-50 p-4 rounded-lg border border-red-100">
                <h3 className="text-lg font-semibold text-red-800">Overdue</h3>
                <p className="text-2xl font-bold text-red-600">
                  {bookings.filter(b => calculateDaysRemaining(calculateReturnDeadline(b.createdAt)) < 0 && b.status !== "returned").length}
                </p>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-800">Returned</h3>
                <p className="text-2xl font-bold text-gray-600">
                  {bookings.filter(b => b.status === "returned").length}
                </p>
              </div>
            </div>

            {loading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              </div>
            ) : filteredBookings.length === 0 ? (
              <div className="text-center py-12">
                <div className="mx-auto h-24 w-24 text-gray-300 mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-1">
                  {bookings.length === 0 ? "No bookings found" : "No matching bookings"}
                </h3>
                <p className="text-gray-500">
                  {bookings.length === 0 
                    ? "When users book books, they will appear here" 
                    : "Try adjusting your search or filter criteria"}
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        User
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Book
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Booking Date
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Return Deadline
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredBookings.map((booking) => {
                      const deadline = calculateReturnDeadline(booking.createdAt);
                      const daysRemaining = calculateDaysRemaining(deadline);
                      const isOverdue = daysRemaining < 0 && booking.status !== "returned";
                      const isReturned = booking.status === "returned";
                      
                      return (
                        <tr key={booking.id} className={isOverdue ? "bg-red-50" : isReturned ? "bg-green-50" : ""}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              {booking.user?.name || "Unknown User"}
                            </div>
                            <div className="text-sm text-gray-500">{booking.user?.email}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              {booking.book?.title || "Untitled Book"}
                            </div>
                            <div className="text-sm text-gray-500">
                              by {booking.book?.author || "Unknown Author"}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatDate(booking.createdAt)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <span className={isOverdue ? "text-red-600 font-medium" : isReturned ? "text-green-600" : ""}>
                              {isReturned ? "Returned" : formatDate(deadline)}
                            </span>
                            {!isReturned && (
                              <div className="text-xs text-gray-400">
                                {isOverdue 
                                  ? `${Math.abs(daysRemaining)} days overdue` 
                                  : `${daysRemaining} days remaining`
                                }
                              </div>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                isReturned
                                  ? "bg-green-100 text-green-800"
                                  : isOverdue
                                  ? "bg-red-100 text-red-800"
                                  : "bg-blue-100 text-blue-800"
                              }`}
                            >
                              {isReturned ? "Returned" : isOverdue ? "Overdue" : "Active"}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                            <button
                              onClick={() => viewBookingDetails(booking.id)}
                              className="cursor-pointer text-indigo-600 hover:text-indigo-900"
                            >
                              Details
                            </button>
                            {!isReturned && (
                              <button
                                onClick={() => handleReturnBook(booking.id, booking.bookId)}
                                className="cursor-pointer text-green-600 hover:text-green-900"
                              >
                                Mark Returned
                              </button>
                            )}
                            <button
                              onClick={() => handleDeleteBooking(booking.id)}
                              className="text-red-600 hover:text-red-900 cursor-pointer"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminBookingsPage;