"use client"

import Link from 'next/link'
import React, { useState } from 'react'

const ShowBook = ({ data }) => {
    const [availability, setAvailability] = useState("all")
    const [search, setSearch] = useState("");

    const filteredBooks = data?.filter(book => {
        if (availability === "all") return true;
        if (availability === "available") return book.available === true;
        if (availability === "unavailable") return book.available === false;
        book.title.toLowerCase().includes(search.toLowerCase()) ||
            book.author.toLowerCase().includes(search.toLowerCase()) ||
            book.isbn.toLowerCase().includes(search.toLowerCase());
    })

    if (!data || data.length === 0) {
        return <p>No books found</p>
    }

    const handleDelete = async () => {
        if (!confirm("Are you sure you want to delete this book?")) {
            return;
        }
        try {
            const response = await fetch(`/api/books/show-books/${id}`, {
                method: 'DELETE',
            })
            if (response.ok) {
                alert('Book deleted successfully');
                // Optionally, refresh the book list or remove the deleted book from state
            } else {
                alert('Failed to delete the book');
            }
        } catch (error) {
            console.error('Error deleting book:', error);
        }
    }

    return (
        <div className="bg-gray-50 min-h-screen p-6">
            <div className="max-w-6xl mx-auto bg-white shadow rounded-lg p-6">
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">Manage Books</h2>
                    <Link href="/admin/book">
                        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2">
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
                            onChange={e => setSearch(e.target.value)}
                            placeholder="Search by title, author, or ISBN"
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 pl-10 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        />
                        <i className="fas fa-search absolute left-3 top-3 text-gray-400"></i>
                    </div>
                    <select
                        value={availability}
                        onChange={e => setAvailability(e.target.value)}
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
                            {filteredBooks.length > 0 ? (
                                filteredBooks.map((book, index) => (
                                    <tr
                                        key={book.id}
                                        className={`${index % 2 === 0 ? "bg-white" : "bg-gray-50"} hover:bg-gray-100`}
                                    >
                                        <td className="px-4 py-3 text-sm font-medium text-gray-900">{book.title}</td>
                                        <td className="px-4 py-3 text-sm text-gray-700">{book.author}</td>
                                        <td className="px-4 py-3 text-sm text-gray-600">{book.isbn}</td>
                                        <td className="px-4 py-3 text-sm text-gray-600">{book.totalBook}</td>
                                        <td className="px-4 py-3 flex justify-center gap-4">
                                            <button className="text-blue-500 hover:text-blue-700 cursor-pointer">
                                                <i className="fas fa-edit"></i>
                                                Edit
                                            </button>
                                            <button
                                                onClick={handleDelete}
                                                className="text-red-500 hover:text-red-700 cursor-pointer">
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
            </div>
        </div>

    )
}

export default ShowBook
