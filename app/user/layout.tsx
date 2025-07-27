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
      <div className="flex-1 lg:ml-0">{children}</div>
    </div>
  )
}
