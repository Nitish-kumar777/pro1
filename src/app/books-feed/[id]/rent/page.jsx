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
        setTimeout(() => router.push("/books-feed"), 1500);
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
    <div className="flex flex-col items-center justify-center min-h-screen py-10 px-4 bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Rent Book
        </h1>
        
        <p className="text-gray-600 text-center mb-8">
          Are you sure you want to reserve this book?
        </p>

        <div className="flex flex-col space-y-4">
          <button
            onClick={handleRent}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Reserving...
              </span>
            ) : (
              "Confirm Reservation"
            )}
          </button>

          <button
            onClick={handleCancel}
            disabled={loading}
            className="bg-gray-300 hover:bg-gray-400 disabled:bg-gray-200 text-gray-800 font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
          >
            Cancel
          </button>
        </div>

        {message && (
          <div className={`mt-6 p-3 rounded-lg text-center ${
            message.includes("success") 
              ? "bg-green-100 text-green-800 border border-green-200" 
              : "bg-red-100 text-red-800 border border-red-200"
          }`}>
            {message}
          </div>
        )}
      </div>
    </div>
  );
};

export default RentPage;