"use client"

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'

const PAGE_SIZE = 10; // Number of books per page

const ShowBook = ({ data }) => {
    const [availability, setAvailability] = useState("all")
    const [search, setSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const router = useRouter();

    const filteredBooks = data?.filter(book => {
        if (availability === "all") return (
            book.title.toLowerCase().includes(search.toLowerCase()) ||
            book.author.toLowerCase().includes(search.toLowerCase()) ||
            book.isbn.toLowerCase().includes(search.toLowerCase())
        );
        if (availability === "available") return (
            book.available === true &&
            (book.title.toLowerCase().includes(search.toLowerCase()) ||
            book.author.toLowerCase().includes(search.toLowerCase()) ||
            book.isbn.toLowerCase().includes(search.toLowerCase()))
        );
        if (availability === "unavailable") return (
            book.available === false &&
            (book.title.toLowerCase().includes(search.toLowerCase()) ||
            book.author.toLowerCase().includes(search.toLowerCase()) ||
            book.isbn.toLowerCase().includes(search.toLowerCase()))
        );
        return false;
    }) || [];

    // Pagination logic
    const totalPages = Math.ceil(filteredBooks.length / PAGE_SIZE);
    const paginatedBooks = filteredBooks.slice(
        (currentPage - 1) * PAGE_SIZE,
        currentPage * PAGE_SIZE
    );

    if (!data || data.length === 0) {
        return <p>No books found</p>
    }

    const handleDelete = async (id) => {
        if (!confirm("Are you sure you want to delete this book?")) {
            return;
        }
        try {
            const response = await fetch(`/api/books/show-books/${id}`, {
                method: 'DELETE',
            })
            if (response.ok) {
                alert('Book deleted successfully');
                router.refresh();
            } else {
                alert('Check Booking Records');
            }
        } catch (error) {
            console.error('Error deleting book:', error);
        }
    }

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    return (
        <div className="bg-gray-50 min-h-screen p-6">
            <div className="max-w-6xl mx-auto bg-white shadow rounded-lg p-6">
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">Manage Books</h2>
                    <Link href="/admin/book">
                        <button className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2">
                            <i className="fas fa-plus"></i> Add New Book
                        </button>
                    </Link>
                </div>

                {/* Search + Filters */}
                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                    <div className="flex-1 relative">
                        <input
                            type="text"
                            value={search}
                            onChange={e => {
                                setSearch(e.target.value);
                                setCurrentPage(1); // Reset to first page on search
                            }}
                            placeholder="Search by title, author, or ISBN"
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 pl-10 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        />
                        <i className="fas fa-search absolute left-3 top-3 text-gray-400"></i>
                    </div>
                    <select
                        value={availability}
                        onChange={e => {
                            setAvailability(e.target.value);
                            setCurrentPage(1); // Reset to first page on filter
                        }}
                        className="border border-gray-300 rounded-lg px-4 py-2">
                        <option value="all">All</option>
                        <option value="available">Available</option>
                        <option value="unavailable">Unavailable</option>
                    </select>
                </div>

                {/* Books Table */}
                <div className="overflow-x-auto">
                    <table className="w-full border border-gray-200 rounded-lg overflow-hidden">
                        <thead className="bg-gray-100 text-gray-700">
                            <tr>
                                <th className="px-4 py-3 text-left text-sm font-semibold">Title</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold">Author</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold">ISBN</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold">Quantity</th>
                                <th className="px-4 py-3 text-center text-sm font-semibold">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedBooks.length > 0 ? (
                                paginatedBooks.map((book, index) => (
                                    <tr
                                        key={book.id}
                                        className={`${index % 2 === 0 ? "bg-white" : "bg-gray-50"} hover:bg-gray-100`}
                                    >
                                        <td className="px-4 py-3 text-sm font-medium text-gray-900">{book.title}</td>
                                        <td className="px-4 py-3 text-sm text-gray-700">{book.author}</td>
                                        <td className="px-4 py-3 text-sm text-gray-600">{book.isbn}</td>
                                        <td className="px-4 py-3 text-sm text-gray-600">{book.totalBook}</td>
                                        <td className="px-4 py-3 flex justify-center gap-4">
                                            <Link href={`/admin/book/book-show/${book.id}`}>
                                                <button className="cursor-pointer text-blue-500 hover:text-blue-700">
                                                    <i className="fas fa-edit"></i>
                                                    Edit
                                                </button>
                                            </Link>

                                            <button
                                                onClick={() => handleDelete(book.id)}
                                                className="cursor-pointer text-red-500 hover:text-red-700">
                                                <i className="fas fa-trash-alt"></i>
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="px-4 py-3 text-sm text-gray-600 text-center">
                                        No books found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination Controls */}
                {totalPages > 1 && (
                    <div className="flex justify-center items-center mt-6 gap-2">
                        <button
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="cursor-pointer px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
                        >
                            Prev
                        </button>
                        {[...Array(totalPages)].map((_, i) => (
                            <button
                                key={i + 1}
                                onClick={() => handlePageChange(i + 1)}
                                className={`px-3 py-1 rounded ${currentPage === i + 1 ? "bg-blue-500 text-white" : "bg-gray-200 hover:bg-gray-300"}`}
                            >
                                {i + 1}
                            </button>
                        ))}
                        <button
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
                        >
                            Next
                        </button>
                    </div>
                )}
            </div>
        </div>

    )
}

export default ShowBook
