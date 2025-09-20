"use client";

import "./globals.css";
import { UserProvider } from "@/context/UserContext";
import { usePathname } from "next/navigation";
import { SessionProvider } from "next-auth/react";
import Header from "@/components/Header";
import SideBar from "@/components/SideBar";
import { useState } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function RootLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  const hiddenRoutes = ["/login", "/register", "/admin", "/dashboard"];
  const shouldShowNavbar = !hiddenRoutes.some((route) =>
    pathname.startsWith(route)
  );

  return (
    <html lang="en">
      <body>
        <SessionProvider>
          <UserProvider>
            {shouldShowNavbar ? (
              <div className="flex">
                {/* Desktop sidebar */}
                <div className="hidden md:block">
                  <SideBar isOpen={true} onClose={() => { }} />
                </div>

                {/* Mobile sidebar */}
                <div className="md:hidden">
                  <SideBar
                    isOpen={sidebarOpen}
                    onClose={() => setSidebarOpen(false)}
                  />
                </div>

                {/* Main content */}
                <div className="flex-1 flex flex-col">
                  <Header onMenuClick={() => setSidebarOpen(true)} />
                  <main className="p-4">{children}</main>
                  <ToastContainer position="top-right" autoClose={3000} />
                </div>
              </div>
            ) : (
              <><main>{children}</main><ToastContainer position="top-right" autoClose={3000} /></>
            )}
          </UserProvider>
        </SessionProvider>
      </body>
    </html>
  );
}