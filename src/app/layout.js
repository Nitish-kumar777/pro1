"use client";

import Navbar from "@/components/NavBar";
import "./globals.css";
import { UserProvider } from "@/context/UserContext";
import { usePathname } from "next/navigation";



export default function RootLayout({ children }) {
  const pathname = usePathname();

  const hiddenRoutes = ["/login", "/register", "/admin" , "/dashboard"];

  const shouldShowNavbar = !hiddenRoutes.some(route => pathname.startsWith(route));
  return (
    <html lang="en">
      <body>
        <UserProvider>
          {shouldShowNavbar && <Navbar />}
          {children}
        </UserProvider>
      </body>
    </html>
  );
}
