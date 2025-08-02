import type React from "react"
import { UserNavbar } from "@/components/user/navbar"

export default function UserLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gray-50 flex">
      <UserNavbar />
      <div className="flex-1 lg:ml-0">
        {children}
      <footer>
        <div className="p-4 text-center text-sm text-gray-500">
          &copy; 2025 TaskSync. di buat oleh Fahri Abdurohman Soleh.
        </div>
      </footer>
      </div>
    </div>
  )
}
