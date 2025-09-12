"use client"

import { useState } from "react"
import { signIn, getSession } from "next-auth/react"
import { useRouter } from "next/navigation"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    // Check if user is already logged in within a month
    const loginExpiry = localStorage.getItem("loginExpiry")
    if (loginExpiry && Date.now() < Number(loginExpiry)) {
      alert("You are already logged in.")
      setIsLoading(false)
      router.push("/dashboard")
      return
    }

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      })

      if (result?.error) {
        alert("Invalid credentials")
        setIsLoading(false)
        return
      }

      // Get session and save token/role to localStorage
      const session = await getSession()
      if (session?.user?.role) {
        localStorage.setItem("role", session.user.role)
        // Set expiry for 1 month (30 days)
        localStorage.setItem("loginExpiry", Date.now() + 30 * 24 * 60 * 60 * 1000)
      }

      router.push("/dashboard")
      router.refresh()
      
    } catch (error) {
      console.error("Login error:", error)
      alert("An error occurred during login")
      setIsLoading(false)
    }
  }

  return (
    <div className="flex justify-center items-center h-screen bg-gray-50">
      <form
        onSubmit={handleLogin}
        className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm max-w-md w-full space-y-4"
      >
        <h2 className="text-2xl font-bold text-center text-gray-800">Login</h2>
        
        <div className="space-y-2">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            id="email"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
            disabled={isLoading}
          />
        </div>
        
        <div className="space-y-2">
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            Password
          </label>
          <input
            id="password"
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
            disabled={isLoading}
          />
        </div>
        
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? "Signing in..." : "Sign in"}
        </button>
        
        {isLoading && (
          <p className="text-sm text-gray-500 text-center">
            Checking credentials...
          </p>
        )}
      </form>
    </div>
  )
}