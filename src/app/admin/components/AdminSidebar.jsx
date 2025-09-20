"use client"

import { ReceiptText, Settings, UserRound } from 'lucide-react'
import { useSession } from 'next-auth/react'
import React from 'react'
import { BiBookAdd } from 'react-icons/bi'
import { FaBookOpen } from 'react-icons/fa'
import { FaBookBookmark } from 'react-icons/fa6'
import { TfiDashboard } from 'react-icons/tfi'
import { signOut } from "next-auth/react";
import { FiLogOut } from 'react-icons/fi'

const AdminSidebar = ({ isOpen, handleClose }) => {
    const { data: session } = useSession()

    const menuItems = [
        { name: "Dashboard", icon: <TfiDashboard />, link: "/admin" },
        { name: "Total Books", icon: <FaBookOpen />, link: "/admin/book/book-show" },
        { name: "Add Books", icon: <BiBookAdd />, link: "/admin/book" },
        { name: "ISSUE BOOK", icon: <FaBookBookmark />, link: "/admin/book/bookings" },
        { name: "Members", icon: <UserRound />, link: "/admin/members" },
        { name: "Terms & Conditions", icon: <ReceiptText />, link: "/admin/terms" },
        { name: "Settings", icon: <Settings />, link: "/admin/settings" },
        { name: "Categories", icon: <FaBookOpen />, link: "/admin/category" }
    ]

    return (
        <>
            {/* Backdrop */}
            {isOpen && (
                <div
                    onClick={handleClose}
                    className="fixed inset-0 bg-transparent bg-opacity-40 z-40"
                />
            )}

            {/* Sidebar */}
            <div
                className={`fixed top-0 left-0 h-screen w-64 bg-white/90 backdrop-blur-md shadow-2xl p-4 transform transition-transform duration-300 z-50 border-r border-gray-200
          ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
            >
                {/* Header with Logo */}
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center space-x-2">
                        <img
                            src="/admin.png"
                            alt="Logo"
                            className="w-10 h-10 rounded-full shadow-md border"
                        />
                        <h2 className="text-lg font-bold text-gray-800 truncate max-w-[120px]">
                            {session?.user?.name}
                        </h2>
                    </div>
                    <button
                        onClick={handleClose}
                        className="text-gray-600 hover:text-gray-900 text-2xl"
                    >
                        ✕
                    </button>
                </div>

                {/* Nav */}
                <nav className="flex flex-col justify-between h-[85%]">
                    <ul>
                        {menuItems.map((item) => (
                            <li key={item.name} className="mb-2">
                                <a
                                    href={item.link}
                                    className="flex items-center px-3 py-2 rounded-lg text-gray-700 hover:bg-gradient-to-r hover:from-blue-500 hover:to-purple-500 hover:text-white transition-all duration-300"
                                >
                                    <span className="mr-3 text-lg">{item.icon}</span>
                                    <span className="font-medium">{item.name}</span>
                                </a>
                            </li>
                        ))}
                    </ul>
                    <button
                        onClick={() => {
                            signOut({ callbackUrl: "/" });
                        }}
                        className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-red-100 text-red-600 font-medium w-full text-left"
                    >
                        <FiLogOut /> Logout
                    </button>

                </nav>
            </div>
        </>
    )
}

export default AdminSidebar