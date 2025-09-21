"use client"

import Link from "next/link";
import React, { useEffect, useState } from "react";

const Category = () => {
  const [books, setBooks] = useState([]);
  const [allBooks, setAllBooks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [search, setSearch] = useState("");

  // Fetch all books + categories
  useEffect(() => {
    async function fetchData() {
      try {
        const [booksRes, catRes] = await Promise.all([
          fetch("/api/books/show-books"),
          fetch("/api/category"),
        ]);

        const booksData = await booksRes.json();
        const catData = await catRes.json();

        setBooks(booksData);
        setAllBooks(booksData);
        setCategories(catData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  // Filter logic (category + search)
  useEffect(() => {
    let filtered = [...allBooks];

    if (selectedCategory !== "all") {
      filtered = filtered.filter(
        (book) => book.category === selectedCategory
      );
    }

    if (search.trim() !== "") {
      filtered = filtered.filter(
        (book) =>
          book.title.toLowerCase().includes(search.toLowerCase()) ||
          book.author.toLowerCase().includes(search.toLowerCase()) ||
          book.isbn.toLowerCase().includes(search.toLowerCase())
      );
    }

    setBooks(filtered);
  }, [selectedCategory, search, allBooks]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row">
          {/* Main Content */}
          <main className="flex-1 p-6">
            {/* Header with Catalog, Category Dropdown, Search */}
            <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-8">
              <h1 className="text-2xl font-bold text-gray-900 mb-4 md:mb-0">
                Book Catalog
              </h1>

              <div className="flex flex-col md:flex-row gap-4">
                {/* Category Dropdown */}
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full md:w-60 px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-gray-700"
                >
                  <option value="all">All Books</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>

                {/* Search Box */}
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg
                      className="h-5 w-5 text-gray-400"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <input
                    type="text"
                    placeholder="Search by title, author, ISBN..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full md:w-80"
                  />
                </div>
              </div>
            </div>

            {/* Active filters */}
            <div className="mb-6 flex items-center flex-wrap gap-2">
              <span className="text-sm text-gray-500 mr-2">Active filters:</span>
              {selectedCategory !== "all" && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                  {categories.find((c) => c.id === selectedCategory)?.name ||
                    "Selected Category"}
                  <button
                    onClick={() => setSelectedCategory("all")}
                    className="ml-2 text-blue-600 hover:text-blue-800"
                  >
                    <svg
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </span>
              )}
              {search && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
                  Search: "{search}"
                  <button
                    onClick={() => setSearch("")}
                    className="ml-2 text-gray-600 hover:text-gray-800"
                  >
                    <svg
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </span>
              )}
              {(selectedCategory !== "all" || search) && (
                <button
                  onClick={() => {
                    setSelectedCategory("all");
                    setSearch("");
                  }}
                  className="text-sm text-blue-600 hover:text-blue-800 ml-2"
                >
                  Clear all
                </button>
              )}
            </div>

            {/* Books Grid */}
            {books.length === 0 ? (
              <div className="text-center py-12">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />
                </svg>
                <h3 className="mt-2 text-lg font-medium text-gray-900">
                  No books found
                </h3>
                <p className="mt-1 text-gray-500">
                  Try adjusting your search or filter to find what you're looking
                  for.
                </p>
                <div className="mt-6">
                  <button
                    onClick={() => {
                      setSelectedCategory("all");
                      setSearch("");
                    }}
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Clear all filters
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {books.map((book) => (
                  <div
                    key={book.id}
                    className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
                  >
                    <div className="relative">
                      <img
                        src={book.imageUrl || "/placeholder-book.jpg"}
                        alt={book.title}
                        className="w-full h-69 object-contain"
                      />
                      <div className="absolute top-2 right-2 bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-1 rounded">
                        {categories.find((c) => c.id === book.category)?.name ||
                          "Uncategorized"}
                      </div>
                    </div>

                    <div className="p-4">
                      <h2 className="text-lg font-semibold text-gray-900 mb-1 line-clamp-1">
                        {book.title}
                      </h2>
                      <p className="text-sm text-gray-600 mb-2">By {book.author}</p>

                      <div className="flex justify-between text-sm text-gray-500 mb-3">
                        <span>ISBN: {book.isbn}</span>
                      </div>

                      <div className="flex justify-between items-center mt-4">
                        <div>
                          <span className="text-xs font-medium text-gray-500">
                            Total: {book.totalBook}
                          </span>
                          <span className="mx-2 text-gray-300">|</span>
                          <span className="text-xs font-medium text-green-600">
                            Available: {book.available}
                          </span>
                          <span className="mx-2 text-gray-300">|</span>
                          <Link href={`/books-feed/${book.id}`}>
                            <button className="text-sm font-medium text-green-600">
                              Detalis
                            </button>
                          </Link>
                        </div>
                      </div>

                      {book.description && (
                        <p className="text-sm text-gray-700 mt-3 line-clamp-2">
                          {book.description}
                        </p>
                      )}

                      <Link href={`/books-feed/${book.id}`}>
                        <button
                          className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 px-4 rounded-lg transition-colors duration-300"
                          onClick={() => handleRent(book.id)}
                          disabled={book.available === 0} // disable if not available
                        >
                          {book.available === 0 ? "Not Available" : "Rent"}
                        </button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>

  );
};

export default Category;