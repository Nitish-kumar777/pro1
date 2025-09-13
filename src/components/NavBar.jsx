"use client";

import { useRouter } from "next/navigation";
import { FiUser } from "react-icons/fi";
import { useUser } from "@/context/UserContext"; // apka global user context

export default function Navbar() {
  const { user } = useUser(); // global user
  const router = useRouter();

  return (
    <nav className="bg-white shadow-md fixed top-0 left-0 right-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
        {/* Left: Company Name */}
        <div
          onClick={() => router.push("/")}
          className="text-xl font-bold text-blue-600 cursor-pointer hover:text-blue-700"
        >
          Find Book
        </div>

        {/* Center: Navigation Links */}
        <div className="hidden md:flex gap-6 text-gray-700 font-medium">
          <button
            onClick={() => router.push("/books-feed")}
            className="hover:text-blue-600 transition"
          >
            Books
          </button>
          <button
            onClick={() => router.push("/about")}
            className="hover:text-blue-600 transition"
          >
            About
          </button>
          <button
            onClick={() => router.push("/contact")}
            className="hover:text-blue-600 transition"
          >
            Contact
          </button>
        </div>

        {/* Right: Profile */}
        <div>
          {user ? (
            <button
              onClick={() => router.push("/dashboard")}
              className="flex items-center gap-2 text-gray-700 hover:text-blue-600"
            >
              {user.image ? (
                <img
                  src={user.image}
                  alt="Profile"
                  className="w-10 h-10 rounded-full border"
                />
              ) : (
                <FiUser className="text-2xl" />
              )}
              <span className="hidden md:block font-medium">
                {user.name}
              </span>
            </button>
          ) : (
            <button
              onClick={() => router.push("/login")}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Login
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
