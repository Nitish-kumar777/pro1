"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { CiMail } from "react-icons/ci"
import { IoMdNotifications } from "react-icons/io"
import { Menu } from "lucide-react"

const AdminHeader = ({ onMenuClick }) => {
    const { data: session, status } = useSession()
    const router = useRouter()

    useEffect(() => {
        if (status === "loading") return
        if (!session || session.user?.role !== "admin") {
            router.push("/login")
        }
    }, [session, status, router])

    if (!session || session.user?.role !== "admin") {
        return null
    }

    return (
        <div className="flex items-center justify-between p-4 bg-white shadow-md">
            <div className="flex items-center space-x-4">
                <button
                    onClick={onMenuClick}
                    className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                >
                    <Menu size={24} />
                </button>
                <div className="relative cursor-pointer p-2 rounded-full hover:bg-gray-100 transition-colors">
                    <IoMdNotifications size={22} />
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">3</span>
                </div>
                <div className="cursor-pointer p-2 rounded-full hover:bg-gray-100 transition-colors">
                    <CiMail size={22} />
                </div>
            </div>
            <div className="flex items-center space-x-3">
                <div className="text-right hidden md:block">
                    <h1 className="text-sm font-medium text-gray-800">{session.user?.name}</h1>
                    <p className="text-xs text-gray-500">{session.user?.email}</p>
                </div>
                <img
                    className="w-8 h-8 rounded-full object-cover border-2 border-gray-200"
                    src={session.user?.imageUrl || "/admin.png"}
                    alt="Profile"
                />
            </div>
        </div>
    )
}

export default AdminHeader
