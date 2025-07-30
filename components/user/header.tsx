"use client"

import { useSession } from "next-auth/react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"

interface HeaderProps {
  title: string
}

export function UserHeader({ title }: HeaderProps) {
  const { data: session } = useSession()
  const user = session?.user

  return (
    <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
      <SidebarTrigger className="-ml-1 lg:hidden" />
      <Separator orientation="vertical" className="mr-2 h-4 lg:hidden" />
      <div className="flex items-center space-x-4">
        <h2 className="text-xl font-bold text-gray-900 capitalize">{title}</h2>
      </div>
      <div className="ml-auto flex items-center space-x-3 lg:hidden">
        {" "}
        <Avatar className="w-8 h-8 bg-gradient-to-br from-indigo-400 to-purple-500">
          <AvatarFallback className="text-white font-semibold text-sm">
            {user?.name?.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
      </div>
    </header>
  )
}
