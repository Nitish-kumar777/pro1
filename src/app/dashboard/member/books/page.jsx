"use client"

import React, { useEffect, useState } from 'react';

const Page = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBookings() {
      try {
        const res = await fetch('/api/bookings/me');
        const data = await res.json();
        setBookings(data.bookings || []);
      } catch (err) {
        console.error('Error fetching bookings:', err);
        setBookings([]);
      } finally {
        setLoading(false);
      }
    }
    fetchBookings();
  }, []);

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
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
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
                <div className="mx-auto h-24 w-24 text-gray-300 mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-1">No books booked yet</h3>
                <p className="text-gray-500">Books you rent will appear here</p>
                <button 
                  onClick={() => window.location.href = '/books-feed'}
                  className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Browse Books
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                {bookings.map((booking) => {
                  const deadline = calculateReturnDeadline(booking.createdAt);
                  const daysRemaining = calculateDaysRemaining(deadline);
                  const isOverdue = daysRemaining < 0;
                  
                  return (
                    <div key={booking.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors duration-150">
                      <div className="flex flex-col md:flex-row md:items-start">
                        <div className="flex-shrink-0 mb-4 md:mb-0 md:mr-6">
                          <div className="w-24 h-32 bg-blue-100 rounded-md flex items-center justify-center">
                            <img src={booking.book?.imageUrl || '/placeholder.png'} alt="" />
                          </div>
                        </div>
                        
                        <div className="flex-grow">
                          <h2 className="text-xl font-semibold text-gray-900">{booking.book?.title || 'Untitled Book'}</h2>
                          <p className="text-gray-600 mt-1">by {booking.book?.author || 'Unknown Author'}</p>
                          
                          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <h3 className="text-sm font-medium text-gray-500">Booking Date</h3>
                              <p className="text-gray-900">{formatDate(booking.createdAt)}</p>
                            </div>
                            
                            <div>
                              <h3 className="text-sm font-medium text-gray-500">Return Deadline</h3>
                              <p className={`font-medium ${isOverdue ? 'text-red-600' : 'text-gray-900'}`}>
                                {formatDate(deadline)}
                              </p>
                            </div>
                            
                            <div>
                              <h3 className="text-sm font-medium text-gray-500">Status</h3>
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${isOverdue ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                                {isOverdue ? 'Overdue' : 'Active'}
                              </span>
                            </div>
                            
                            <div>
                              <h3 className="text-sm font-medium text-gray-500">Days {isOverdue ? 'Overdue' : 'Remaining'}</h3>
                              <p className={isOverdue ? 'text-red-600 font-medium' : 'text-gray-900'}>
                                {isOverdue ? Math.abs(daysRemaining) : daysRemaining} days
                              </p>
                            </div>
                          </div>
                          
                          {isOverdue && (
                            <div className="mt-4 bg-red-50 border border-red-200 rounded-md p-3">
                              <div className="flex">
                                <div className="flex-shrink-0">
                                  <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                  </svg>
                                </div>
                                <div className="ml-3">
                                  <h3 className="text-sm font-medium text-red-800">Overdue Notice</h3>
                                  <div className="mt-2 text-sm text-red-700">
                                    <p>This book is overdue. Please return it as soon as possible to avoid penalties.</p>
                                  </div>
                                </div>
                              </div>
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