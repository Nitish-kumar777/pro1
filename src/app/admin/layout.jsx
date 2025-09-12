"use client"

import AdminLayout from "@/app/admin/components/AdminLayout"
import { SessionProvider } from "next-auth/react"

export default function Layout({ children }) {
  return <SessionProvider><AdminLayout>{children}</AdminLayout></SessionProvider>
}