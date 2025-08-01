"use client"

import { useSession } from "next-auth/react"

interface HeaderProps {
  title: string
}

export function UserHeader({ title }: HeaderProps) {
  const { data: session } = useSession()
  const user = session?.user

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 px-4 sm:px-6 lg:px-8 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4 ml-12 lg:ml-0">
          <h2 className="text-xl font-bold text-gray-900 capitalize">{title}</h2>
        </div>

        {/* User Avatar */}
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-400 rounded-full flex items-center justify-center text-white font-semibold text-sm">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
        </div>
      </div>
    </header>
  )
}
