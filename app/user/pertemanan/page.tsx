"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { UserHeader } from "@/components/user/header"
import { dummyUsers } from "@/lib/dummy-data"
import { UserPlus, UserCheck, Users } from "lucide-react" // Import Lucide icons

export default function PertemananPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")
  const [users, setUsers] = useState(dummyUsers) // State untuk mengelola status pertemanan

  // Jika masih loading session
  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-xl mx-auto mb-4">
            <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          </div>
          <p className="text-gray-600 font-medium">Loading session...</p>
        </div>
      </div>
    )
  }

  // Jika tidak ada session, redirect ke login
  if (status === "unauthenticated") {
    router.push("/login")
    return null
  }

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleAddFriend = (userId: string) => {
    setUsers((prevUsers) =>
      prevUsers.map((user) => (user.id === userId ? { ...user, isFriend: !user.isFriend } : user)),
    )
    // Di sini Anda akan mengintegrasikan logika API untuk menambahkan/menghapus teman
    console.log(`Toggle pertemanan untuk user ID: ${userId}`)
  }

  return (
    <>
      <UserHeader title="Pertemanan" />

      <main className="p-4 sm:p-6 lg:p-8">
        <div className="space-y-6">
          {/* Header Section */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h3 className="text-xl font-bold text-gray-900">🤝 Daftar Pengguna</h3>
                <p className="text-gray-600 mt-1">Temukan dan tambahkan teman baru di TaskSync</p>
              </div>
              {/* Search Input */}
              <div className="relative w-full sm:w-auto">
                <svg
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                <input
                  type="text"
                  placeholder="🔍 Cari pengguna..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full"
                />
              </div>
            </div>
          </div>

          {/* User List */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <div
                  key={user.id}
                  className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col items-center text-center"
                >
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-00 rounded-full flex items-center justify-center text-white font-bold text-3xl mb-4">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-1">{user.name}</h4>
                  <p className="text-sm text-gray-600 mb-4">{user.email}</p>
                  <button
                    onClick={() => handleAddFriend(user.id)}
                    className={`flex items-center justify-center px-4 py-2 rounded-lg transition-colors duration-200 text-sm font-medium ${
                      user.isFriend
                        ? "bg-green-100 text-green-700 hover:bg-green-200"
                        : "bg-blue-600 text-white hover:bg-blue-700"
                    }`}
                  >
                    {user.isFriend ? (
                      <>
                        <UserCheck className="w-4 h-4 mr-2" />
                        <span>Teman</span>
                      </>
                    ) : (
                      <>
                        <UserPlus className="w-4 h-4 mr-2" />
                        <span>Tambahkan Teman</span>
                      </>
                    )}
                  </button>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-gray-500">Tidak ada pengguna ditemukan</p>
                <p className="text-sm text-gray-400 mt-1">Coba ubah kata kunci pencarian</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  )
}
