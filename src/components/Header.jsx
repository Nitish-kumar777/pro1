"use client";

import { useUser } from "@/context/UserContext";
import { Menu } from "lucide-react";
import { IoMdNotifications } from "react-icons/io";
import { CiMail } from "react-icons/ci";
import React from "react";

const Header = ({ onMenuClick }) => {
  const { user } = useUser();

  return (
    <header className="flex items-center justify-between p-4 bg-white shadow-sm sticky top-0 z-30">
      {/* Left: Menu + Icons */}
      <div className="flex items-center space-x-3 sm:space-x-4">
        {/* Mobile Menu Button */}
        <button
          onClick={onMenuClick}
          className="p-2 rounded-full hover:bg-gray-100 transition-colors md:hidden"
        >
          <Menu size={24} />
        </button>

        {/* Notifications */}
        <div className="relative cursor-pointer p-2 rounded-full hover:bg-gray-100 transition-colors">
          <IoMdNotifications size={22} />
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-medium rounded-full h-4 w-4 flex items-center justify-center">
            3
          </span>
        </div>

        {/* Mail */}
        <div className="cursor-pointer p-2 rounded-full hover:bg-gray-100 transition-colors">
          <CiMail size={22} />
        </div>
      </div>

      {/* Right: User Info */}
      <div className="flex items-center space-x-3">
        {/* User Details (hidden on mobile) */}
        <div className="text-right hidden md:block">
          <h1 className="text-sm font-medium text-gray-800">
            {user?.name || "Guest"}
          </h1>
          <p className="text-xs text-gray-500">{user?.email || "No email"}</p>
        </div>

        {/* Profile Image */}
        <img
          className="w-8 h-8 sm:w-9 sm:h-9 rounded-full object-cover border-2 border-gray-200"
          src={user?.image || "/admin.png"}
          alt="Profile"
        />
      </div>
    </header>
  );
};

export default Header;
