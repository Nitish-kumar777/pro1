"use client";

import { useUser } from "@/context/UserContext";
import { Menu } from "lucide-react";
import { IoMdNotifications } from "react-icons/io";
import { CiMail } from "react-icons/ci";
import React from "react";

const Header = ({ onMenuClick }) => {
  const { user } = useUser();

  return (
    <div className="flex items-center sticky top-0 justify-between p-4 bg-transparent shadow-none z-30">
      {/* Left: Menu + Icons */}
      <div className="flex items-center space-x-4">
        <button
          onClick={onMenuClick}
          className="p-2 rounded-full hover:bg-gray-100 transition-colors md:hidden"
        >
          <Menu size={24} />
        </button>

        <div className="relative cursor-pointer p-2 rounded-full hover:bg-gray-100 transition-colors">
          <IoMdNotifications size={22} />
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
            3
          </span>
        </div>

        <div className="cursor-pointer p-2 rounded-full hover:bg-gray-100 transition-colors">
          <CiMail size={22} />
        </div>
      </div>

      {/* Right: User Info */}
      <div className="flex items-center space-x-3">
        <div className="text-right hidden md:block">
          <h1 className="text-sm font-medium text-gray-800">
            {user?.name || "Guest"}
          </h1>
          <p className="text-xs text-gray-500">{user?.email || "No email"}</p>
        </div>
        <img
          className="w-8 h-8 rounded-full object-cover border-2 border-gray-200"
          src={user?.image || "/admin.png"}
          alt="Profile"
        />
      </div>
    </div>
  );
};

export default Header;
