"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { useUser } from "@/context/UserContext"

export default function Dashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const { setUser } = useUser()

  useEffect(() => {
    if (status === "authenticated" && session?.user) {

      localStorage.setItem("user", JSON.stringify(session.user))
      setUser(session.user)


      if (session.user.role === "admin") {
        router.replace("/admin")
      }
    }
  }, [status, session, setUser, router])


  if (status === "loading") {
    return <p className="p-6">Loading...</p>
  }
  if (status === "unauthenticated") {
    router.replace("/login") 
    return null
  }


  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <p>Welcome, {session.user?.email}</p>
      <p>Your role: {session.user?.role}</p>

      {session.user?.role === "admin" ? (
        <button className="text-red-500">Admin Access ✅</button>
      ) : (
        <p className="text-green-600">Member Access ✅</p>
      )}
    </div>
  )
}
