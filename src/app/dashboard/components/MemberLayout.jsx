"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { FiHome, FiBook, FiUser, FiLogOut } from "react-icons/fi"; // icons

export default function MemberLayout({ children }) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return;
    if (!session) {
      router.push("/login");
    }
  }, [session, status, router]);

  if (status === "loading") {
    return <p className="text-center mt-10">Loading...</p>;
  }

  if (!session) {
    return <p className="text-center mt-10">You must be logged in to view this content.</p>;
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-lg p-6 flex flex-col">
        <h2 className="text-xl font-bold text-blue-600 mb-8">📚 My Library</h2>
        <nav className="flex-1 space-y-4">
          <button
            onClick={() => router.push("/dashboard/member")}
            className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-blue-100 text-gray-700 font-medium w-full text-left"
          >
            <FiHome className="text-blue-600" /> Dashboard
          </button>
          <button
            onClick={() => router.push("/dashboard/member/books")}
            className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-blue-100 text-gray-700 font-medium w-full text-left"
          >
            <FiBook className="text-blue-600" /> My Books
          </button>
          <button
            onClick={() => router.push("/dashboard/member/profile")}
            className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-blue-100 text-gray-700 font-medium w-full text-left"
          >
            <FiUser className="text-blue-600" /> Profile
          </button>
        </nav>

        <div className="mt-auto">
          <button
            onClick={() => router.push("/api/auth/signout")}
            className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-red-100 text-red-600 font-medium w-full text-left"
          >
            <FiLogOut /> Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        <header className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Welcome, {session.user.name}</h1>
          {session.user.image && (
            <img
              src={session.user.image}
              alt="User Avatar"
              className="w-12 h-12 rounded-full border"
            />
          )}
        </header>

        <div className="bg-white p-6 rounded-2xl shadow">
          {children}
        </div>
      </main>
    </div>
  );
}
