"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

const RentPage = ({ params }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const bookId = params.id;

  const handleRent = async () => {
    setLoading(true);
    setMessage("");
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookId }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage("Book reserved successfully!");
        setTimeout(() => router.push("/"), 1000);
      } else {
        setMessage(data.error || "Failed to reserve book.");
      }
    } catch (err) {
      setMessage("Error occurred while reserving the book.");
    }
    setLoading(false);
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden w-full max-w-md">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-white/20 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-white">Confirm Your Rental</h1>
          <p className="text-blue-100 mt-2">Reserve this book for 30 days</p>
        </div>
        
        {/* Content Section */}
        <div className="p-8">
          <div className="flex items-center justify-center mb-6">
            <div className="mr-4 bg-blue-100 rounded-lg p-2">
              <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div className="text-left">
              <h2 className="font-semibold text-gray-800">Rental Details</h2>
              <p className="text-sm text-gray-600">30 days • 20Rs/day if you don't return on time</p>
            </div>
          </div>

          <p className="text-gray-600 text-center mb-8 border-t border-b border-gray-100 py-4">
            Are you sure you want to reserve this book for 30 days? Your rental will start immediately after confirmation.
          </p>

          <div className="flex flex-col space-y-4">
            <button
              onClick={handleRent}
              disabled={loading}
              className="relative bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 disabled:from-blue-400 disabled:to-indigo-300 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg disabled:shadow-none flex items-center justify-center"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </span>
              ) : (
                <>
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Confirm Reservation
                </>
              )}
            </button>

            <button
              onClick={handleCancel}
              disabled={loading}
              className="bg-white border border-gray-300 hover:border-gray-400 disabled:border-gray-200 text-gray-800 font-semibold py-3 px-6 rounded-lg transition-all duration-200 hover:bg-gray-50 disabled:bg-gray-100 flex items-center justify-center"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              Cancel
            </button>
          </div>

          {message && (
            <div className={`mt-6 p-4 rounded-lg text-center border ${
              message.includes("success") 
                ? "bg-green-50 text-green-800 border-green-200" 
                : "bg-red-50 text-red-800 border-red-200"
            }`}>
              <div className="flex items-center justify-center">
                {message.includes("success") ? (
                  <svg className="w-5 h-5 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5 mr-2 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                )}
                {message}
              </div>
            </div>
          )}
        </div>
        
        {/* Footer Note */}
        <div className="bg-gray-50 p-4 text-center">
          <p className="text-xs text-gray-500">
            You can extend your rental period later if needed
          </p>
        </div>
      </div>
    </div>
  );
};

export default RentPage;