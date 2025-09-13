"use client";

import Link from "next/link";
import React, { useState, useMemo, useCallback } from "react";

const BookFeed = ({ data }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sortBy, setSortBy] = useState("title");
  const [sortOrder, setSortOrder] = useState("asc");
  const [selectedBook, setSelectedBook] = useState(null);

  // Memoized filtered and sorted books
  const filteredBooks = useMemo(() => {
    if (!data) return [];

    let filtered = data.filter((book) => {
      const searchString = `${book.title} ${book.author} ${book.isbn} ${book.description}`.toLowerCase();
      return searchString.includes(searchTerm.toLowerCase());
    });

    // Sort books
    filtered.sort((a, b) => {
      let aValue = a[sortBy] || "";
      let bValue = b[sortBy] || "";

      if (sortBy === "available") {
        aValue = parseInt(aValue);
        bValue = parseInt(bValue);
      }

      if (aValue < bValue) return sortOrder === "asc" ? -1 : 1;
      if (aValue > bValue) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [data, searchTerm, sortBy, sortOrder]);

  // Handle search with debounce
  const handleSearch = useCallback((e) => {
    setIsLoading(true);
    setSearchTerm(e.target.value);

    // Simulate loading for better UX
    setTimeout(() => setIsLoading(false), 300);
  }, []);

  // Toggle sort order
  const handleSort = useCallback((field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
  }, [sortBy, sortOrder]);


  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-blue-800 flex items-center">
        <span className="mr-2">📚</span> Book Library
      </h1>

      {/* Search and Filter Bar */}
      <div className="bg-white p-4 rounded-lg shadow-md mb-6">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-1/2">
            <input
              type="text"
              placeholder="Search by title, author, ISBN, or description..."
              value={searchTerm}
              onChange={handleSearch}
              className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <span className="absolute left-3 top-3 text-gray-400">🔍</span>
          </div>

          <div className="flex gap-2 items-center">
            <span className="text-sm font-medium text-gray-700">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => handleSort(e.target.value)}
              className="p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
            >
              <option value="title">Title</option>
              <option value="author">Author</option>
              <option value="available">Availability</option>
            </select>
            <button
              onClick={() => handleSort(sortBy)}
              className="p-2 bg-gray-200 rounded-md hover:bg-gray-300"
            >
              {sortOrder === "asc" ? "↑" : "↓"}
            </button>
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div className="mb-4 flex justify-between items-center">
        <p className="text-gray-600">
          {filteredBooks.length} book{filteredBooks.length !== 1 ? 's' : ''} found
        </p>
        {isLoading && (
          <div className="text-blue-500 flex items-center">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500 mr-2"></div>
            Searching...
          </div>
        )}
      </div>

      {/* Book Grid */}
      {filteredBooks.length === 0 && !isLoading ? (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <div className="text-6xl mb-4">📖</div>
          <h3 className="text-xl font-semibold text-gray-700">No books found</h3>
          <p className="text-gray-500">Try adjusting your search or filter</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredBooks.map((book) => (
            <div
              key={book.id}
              className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 flex flex-col"
            >
              <div className="relative">
                <img
                  src={book.imageUrl || "/placeholder-book.jpg"}
                  alt={book.title}
                  className="w-full h-48 object-cover"
                  onError={(e) => {
                    e.target.src = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2VlZSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkeT0iLjM1ZW0iIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZvbnQtc2l6ZT0iMjAiIGZvbnQtZmFtaWx5PSJtb25vc3BhY2UiPk5vIEltYWdlPC90ZXh0Pjwvc3ZnPg==";
                  }}
                />
                <div className="absolute top-2 right-2 bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded">
                  {book.available}/{book.total}
                </div>
              </div>

              <div className="p-4 flex-grow">
                <h2 className="text-lg font-semibold line-clamp-1">{book.title}</h2>
                <p className="text-gray-600 text-sm mt-1">by {book.author}</p>
                <p className="text-xs text-gray-500 mt-2 line-clamp-2">{book.description}</p>
              </div>

              <div className="px-4 pb-4 mt-auto">
                <div className="flex justify-between items-center">
                  <Link href={`/books-feed/${book.id}`}>
                    <button
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                      Rent
                    </button>
                  </Link>
                  <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                    ISBN: {book.isbn}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BookFeed;