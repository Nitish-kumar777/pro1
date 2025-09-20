"use client";
import { IoMdHome } from "react-icons/io";
import { FaRegHeart, FaUserCircle } from "react-icons/fa";
import { FiSettings, FiHelpCircle } from "react-icons/fi";
import { LuLibrary } from "react-icons/lu";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { signIn, signOut, useSession } from "next-auth/react";

const SideBar = ({ isOpen, onClose }) => {
  const pathname = usePathname();
  const { data: session } = useSession();
  const sidebarRef = useRef(null);

  // Base menu items
  const menuItems = [
    { name: "Discover", link: "/", icon: <IoMdHome size={20} /> },
    { name: "Category", link: "/category", icon: <LuLibrary size={20} /> },
    { name: "My Library", link: "/library", icon: <FaUserCircle size={20} /> },
    { name: "Favorite", link: "/favorites", icon: <FaRegHeart size={20} /> },
  ];

  // Add admin item if user has admin role
  if (session?.user?.role === "admin") {
    menuItems.push({
      name: "Admin",
      link: "/admin",
      icon: <FiSettings size={20} />,
    });
  }

  // Always add common items
  menuItems.push(
    { name: "Setting", link: "/settings", icon: <FiSettings size={20} /> },
    { name: "Help", link: "/help", icon: <FiHelpCircle size={20} /> },
  );

  // Close sidebar when clicking outside (only mobile)
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        isOpen &&
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target)
      ) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, onClose]);

  // Prevent body scroll when sidebar open on mobile
  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "unset";
    return () => (document.body.style.overflow = "unset");
  }, [isOpen]);

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-transparent bg-opacity-50 z-40 md:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <div
        ref={sidebarRef}
        className={`fixed h-screen inset-y-0 left-0 w-64 bg-white shadow-xl transform 
          ${isOpen ? "translate-x-0" : "-translate-x-full"} 
          md:translate-x-0 md:sticky md:top-0 transition-transform duration-300 ease-in-out z-50`}
        role="navigation"
      >
        <div className="flex sticky top-0 flex-col h-full justify-between border-none py-8">
          {/* Title */}
          <div className="px-6 py-4 font-bold text-2xl text-blue-700 flex items-center">
            <div className="w-8 h-8 bg-blue-600 rounded-md flex items-center justify-center mr-2">
              <span className="text-white font-bold text-lg">B</span>
            </div>
            THE BOOKS
          </div>

          {/* Navigation */}
          <nav className="flex flex-col px-4 mt-8 space-y-2">
            {menuItems.map((item) => {
              const isActive = pathname === item.link;
              return (
                <Link
                  key={item.name}
                  href={item.link}
                  className={`flex items-center gap-3 px-3 py-3 rounded-lg text-gray-700 transition-all
                    ${
                      isActive
                        ? "bg-blue-50 text-blue-700 font-semibold"
                        : "hover:bg-gray-100"
                    }`}
                  onClick={() => {
                    if (window.innerWidth < 768) onClose();
                  }}
                >
                  <span
                    className={`${isActive ? "text-blue-600" : "text-gray-500"}`}
                  >
                    {item.icon}
                  </span>
                  <span className="text-sm font-medium">{item.name}</span>
                  {isActive && (
                    <div className="ml-auto w-1 h-6 bg-blue-600 rounded-full"></div>
                  )}
                </Link>
              );
            })}

            {session ? (
              <button
                onClick={() => signOut()}
                className="flex items-center gap-3 px-3 py-3 rounded-lg text-gray-700 hover:bg-gray-100 transition-all"
              >
                <FaUserCircle size={20} className="text-gray-500" />
                <span className="text-sm font-medium">Log out</span>
              </button>
            ) : (
              <button
                onClick={() => signIn("/register")}
                className="flex items-center gap-3 px-3 py-3 rounded-lg text-gray-700 hover:bg-gray-100 transition-all"
              >
                <FaUserCircle size={20} className="text-gray-500" />
                <span className="text-sm font-medium">Login</span>
              </button>
            )}
          </nav>

          {/* Footer */}
          <div className="px-4 pt-4 border-t border-gray-200">
            <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 transition-colors">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
                {session?.user?.name?.charAt(0) || "U"}
              </div>
              <div>
                <h4 className="text-sm font-semibold text-gray-800">
                  {session?.user?.name || "Guest"}
                </h4>
                <p className="text-xs text-gray-500">
                  {session?.user?.role === "admin"
                    ? "Administrator"
                    : session?.user?.email || "Your reading space"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SideBar;