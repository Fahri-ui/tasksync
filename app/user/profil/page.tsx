"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { UserHeader } from "@/components/user/header"

export default function ProfilPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

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

  const user = session?.user

  return (
    <>
      <UserHeader title="Profil" />

      <main className="p-4 sm:p-6 lg:p-8">
        <div className="space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-start space-x-6">
              <div className="w-20 h-20 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-2xl flex items-center justify-center text-white font-bold text-2xl">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{user?.name}</h3>
                <p className="text-gray-600 mb-4">{user?.email}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h4 className="text-lg font-semibold text-gray-900 mb-6">Informasi Profil</h4>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">User ID</label>
                  <div className="bg-gray-50 rounded-lg p-3 text-sm text-gray-900 font-mono">{user?.id}</div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <div className="bg-gray-50 rounded-lg p-3 text-sm text-gray-900">{user?.email}</div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nomor Telepon</label>
                  <div className="bg-gray-50 rounded-lg p-3 text-sm text-gray-900">{user?.nomor || "-"}</div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Jenis Kelamin</label>
                  <div className="bg-gray-50 rounded-lg p-3 text-sm text-gray-900">
                    {user?.gender === "LAKI_LAKI" ? "Laki-laki" : user?.gender === "PEREMPUAN" ? "Perempuan" : "-"}
                  </div>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tanggal Lahir</label>
                  <div className="bg-gray-50 rounded-lg p-3 text-sm text-gray-900">
                    {user?.tanggal_lahir
                      ? new Date(user.tanggal_lahir).toLocaleDateString("id-ID", {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })
                      : "-"}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
