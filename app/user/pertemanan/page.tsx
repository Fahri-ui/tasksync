"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useState, useEffect, useCallback } from "react"
import { UserHeader } from "@/components/user/header" // Asumsi komponen ini ada
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Search, UserPlus, CheckCircle } from "lucide-react"

// Definisikan tipe untuk pengguna yang diambil dari API
interface User {
  id: string
  name: string
  email: string
  role: string
}

export default function AddFriendPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")
  const [availableUsers, setAvailableUsers] = useState<User[]>([])
  const [loadingUsers, setLoadingUsers] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [friendRequestStatus, setFriendRequestStatus] = useState<{
    [key: string]: "idle" | "pending" | "sent" | "error"
  }>({})

  useEffect(() => {
    if (status === "loading") return

    if (status === "unauthenticated") {
      router.push("/login")
      return
    }

    const fetchUsers = async () => {
      setLoadingUsers(true)
      setError(null)
      try {
        const response = await fetch("/api/user/pertemanan")
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        const data: User[] = await response.json()
        setAvailableUsers(data)
      } catch (err) {
        console.error("Failed to fetch users:", err)
        setError("Gagal memuat daftar pengguna. Silakan coba lagi.")
      } finally {
        setLoadingUsers(false)
      }
    }

    fetchUsers()
  }, [status, router])

  const filteredUsers = availableUsers.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.role.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleAddFriend = useCallback(async (userToAdd: User) => {
    setFriendRequestStatus((prev) => ({ ...prev, [userToAdd.id]: "pending" }))
    try {
      const response = await fetch("/api/user/pertemanan/request", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ addresseeId: userToAdd.id }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`)
      }

      console.log(`Permintaan pertemanan dikirim ke: ${userToAdd.name}`)
      setFriendRequestStatus((prev) => ({ ...prev, [userToAdd.id]: "sent" }))
      // Opsional: Perbarui daftar pengguna yang tersedia setelah permintaan dikirim
      setAvailableUsers((prevUsers) => prevUsers.filter((user) => user.id !== userToAdd.id))
    } catch (err) {
      console.error(`Gagal mengirim permintaan pertemanan ke ${userToAdd.name}:`, err)
      setFriendRequestStatus((prev) => ({ ...prev, [userToAdd.id]: "error" }))
      // Tampilkan pesan error ke pengguna jika diperlukan
      alert(`Gagal mengirim permintaan pertemanan: ${err instanceof Error ? err.message : String(err)}`)
    }
  }, [])

  if (status === "loading" || loadingUsers) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Memuat pengguna...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen text-red-500">
        <p>{error}</p>
      </div>
    )
  }

  return (
    <>
      <UserHeader title="Tambah Teman" />
      <main className="p-4 sm:p-6 lg:p-8">
        <div className="space-y-6">
          <Card className="rounded-2xl shadow-sm border border-gray-100">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-gray-900 flex items-center">
                <UserPlus className="inline-block w-6 h-6 mr-2 text-gray-700" /> Cari Teman Baru
              </CardTitle>
              <p className="text-gray-600 mt-1">Temukan dan tambahkan teman ke jaringan Anda.</p>
            </CardHeader>
            <CardContent>
              <div className="relative mb-6">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Cari nama, email, atau peran..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="space-y-4">
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => (
                    <div
                      key={user.id}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg shadow-sm border border-gray-100"
                    >
                      <div className="flex items-center">
                        <Avatar className="mr-4">
                          <AvatarImage src={`/placeholder.svg?text=${user.name.charAt(0)}`} alt={user.name} />
                          <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <h5 className="font-medium text-gray-900">{user.name}</h5>
                          <p className="text-sm text-gray-600">{user.role}</p>
                          <p className="text-xs text-gray-500">{user.email}</p>
                        </div>
                      </div>
                      <Button
                        onClick={() => handleAddFriend(user)}
                        disabled={friendRequestStatus[user.id] === "pending" || friendRequestStatus[user.id] === "sent"}
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                      >
                        {friendRequestStatus[user.id] === "pending" ? (
                          <>
                            <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
                            Mengirim...
                          </>
                        ) : friendRequestStatus[user.id] === "sent" ? (
                          <>
                            <CheckCircle className="w-4 h-4 mr-2" /> Terkirim!
                          </>
                        ) : (
                          <>
                            <UserPlus className="w-4 h-4 mr-2" /> Tambah
                          </>
                        )}
                      </Button>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <UserPlus className="w-8 h-8 text-gray-400" />
                    </div>
                    <p className="text-gray-500">Tidak ada pengguna yang ditemukan.</p>
                    <p className="text-sm text-gray-400 mt-1">Coba kata kunci pencarian lain.</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </>
  )
}
