"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { UserHeader } from "@/components/user/header"
import { dummyUser, dummyProjects, dummyTasks } from "@/lib/dummy-data"

export default function ProfilPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [showChangePassword, setShowChangePassword] = useState(false)
  const [showEditProfile, setShowEditProfile] = useState(false)


  // Jika tidak ada session, redirect ke login
  if (status === "unauthenticated") {
    router.push("/login")
    return null
  }

  const user = session?.user

  return (
    <>
      <UserHeader title="Profil" />

      {/* Page Content */}
      <main className="p-4 sm:p-6 lg:p-8">
        <div className="space-y-6">
          {/* Profile Header */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-start space-x-6">
              <div className="w-24 h-24 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-2xl flex items-center justify-center text-white font-bold text-3xl">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">👤 {user?.name}</h3>
                <p className="text-gray-600 mb-4">{user?.email}</p>
              </div>
            </div>
          </div>

          {/* Profile Details */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h4 className="text-lg font-semibold text-gray-900 mb-6">ℹ️ Informasi Profil</h4>
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nama Lengkap</label>
                  <div className="bg-gray-50 rounded-lg p-3 text-sm text-gray-900">{user?.name}</div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
                  <div className="bg-gray-50 rounded-lg p-3 text-sm text-gray-900">{dummyUser.role}</div>
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