"use client"

import { useSession } from "next-auth/react"
import { usePathname, useRouter } from "next/navigation"
import Link from "next/link"
import { Home, FolderKanban, ClipboardList, User, LogOut, CheckCircle, UserCheck } from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

export function AppSidebar() {
  const { data: session } = useSession()
  const router = useRouter()
  const pathname = usePathname()

  const user = session?.user

  const handleLogout = async () => {
    try {
      const res = await fetch("/api/auth/logout", { method: "POST" })
      if (res.ok) {
        router.push("/")
      }
    } catch (error) {
      console.error("Logout gagal:", error)
    }
  }

  const menuItems = [
    {
      id: "dashboard",
      name: "Dashboard",
      href: "/user/dashboard",
      icon: Home,
    },
    {
      id: "proyek-saya",
      name: "Proyek Saya",
      href: "/user/proyek-saya",
      icon: FolderKanban,
    },
    {
      id: "tugas-saya",
      name: "Tugas Saya",
      href: "/user/tugas-saya",
      icon: ClipboardList,
    },
    {
      id: "profil",
      name: "Profil",
      href: "/user/profil",
      icon: User,
    },
    {
      id: "pertemanan",
      name: "Pertemanan",
      href: "/user/pertemanan",
      icon: UserCheck,
    },
  ]

  return (
    <Sidebar collapsible="offcanvas">
      <SidebarHeader>
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                <CheckCircle className="w-7 h-7 text-white" />
              </div>  
            </div>
            <div>
              <h1 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                TaskSync
              </h1>
            </div>
          </div>
        </div>
        
        <div className="px-6 py-4 border-b border-gray-100">
          <Link href="/user/profil" className="flex items-center space-x-4 hover:bg-gray-50 rounded-xl p-2 -m-2 transition-all duration-200 cursor-pointer">
            <Avatar className="w-12 h-12">
              <AvatarFallback className="bg-gradient-to-br from-blue-600 to-indigo-600 text-white font-semibold text-base">
                {user?.name?.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-base font-semibold text-gray-900 truncate">{user?.name}</p>
              <p className="text-sm text-gray-500 truncate">{user?.email}</p>
            </div>
          </Link>
        </div>
      </SidebarHeader>
      
      <SidebarContent>
        <nav className="flex-1 px-4 py-6">
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu className="space-y-3">
                {menuItems.map((item) => {
                  const isActive = pathname === item.href
                  return (
                    <SidebarMenuItem key={item.id}>
                      <SidebarMenuButton asChild isActive={isActive}>
                        <Link
                          href={item.href}
                          className={`w-full flex items-center space-x-4 px-5 py-4 text-base font-medium rounded-xl transition-all duration-300 ${
                            isActive
                              ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg transform scale-[1.02]"
                              : "text-gray-700 hover:bg-gray-100 hover:text-gray-900 hover:scale-[1.01]"
                          }`}
                        >
                          <item.icon className={`w-6 h-6 ${isActive ? 'text-white' : 'text-gray-600'}`} />
                          <span className={`font-medium ${isActive ? 'text-white' : ''}`}>{item.name}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  )
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </nav>
      </SidebarContent>
      
      <SidebarFooter>
        <div className="px-4 py-4 border-t border-gray-100">
          <Button
            onClick={handleLogout}
            className="w-full flex items-center space-x-4 px-5 py-4 text-base font-medium text-red-600 hover:bg-red-50 hover:text-red-700 rounded-xl transition-all duration-300 hover:scale-[1.01]"
            variant="ghost"
          >
            <LogOut className="w-6 h-6" />
            <span className="font-medium">Logout</span>
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}