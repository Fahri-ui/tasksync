"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { UserHeader } from "@/components/user/header"

// Define types for the fetched data
interface UserProfileData {
  id: string
  name: string
  email: string
  role: string
  verifiedAt: string | null
  createdAt: string
  nomor: string | null
  gender: "LAKI_LAKI" | "PEREMPUAN" | null
  tanggal_lahir: string | null
}

interface ProfileStats {
  totalProjects: number
  activeProjects: number
  completedProjects: number
  totalTasks: number
  activeTasks: number
  completedTasks: number
  completionRate: number
}

interface RecentProject {
  id: string
  name: string
  manager: string
  progress: number
  status: "aktif" | "selesai"
}

interface RecentTask {
  id: string
  title: string
  project: string
  status: "selesai" | "belum_selesai"
}

interface ProfilePageData {
  user: UserProfileData
  stats: ProfileStats
  recentProjects: RecentProject[]
  recentTasks: RecentTask[]
}

export default function ProfilPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [showChangePassword, setShowChangePassword] = useState(false)
  const [showEditProfile, setShowEditProfile] = useState(false)
  const [profileData, setProfileData] = useState<ProfilePageData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Redirect if not authenticated
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login") // Adjust your login page path
    }
  }, [status, router])

  // Fetch data from API
  useEffect(() => {
    const fetchProfileData = async () => {
      setLoading(true)
      setError(null)
      try {
        const response = await fetch("/api/users/profil")
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        const data: ProfilePageData = await response.json()
        setProfileData(data)
      } catch (err: any) {
        setError(err.message || "Gagal memuat data profil.")
        console.error("Failed to fetch profile data:", err)
      } finally {
        setLoading(false)
      }
    }

    if (status === "authenticated") {
      fetchProfileData()
    }
  }, [status]) // Refetch when auth status becomes authenticated

  if (error) {
    return (
      <>
        <UserHeader title="Profil" />
        <main className="p-4 sm:p-6 lg:p-8">
          <div className="flex items-center justify-center min-h-[calc(100vh-100px)] text-red-500">
            <p>Error: {error}</p>
          </div>
        </main>
      </>
    )
  }

  if (!profileData) {
    return (
      <>
        <UserHeader title="Profil" />
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
            <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-xl mx-auto mb-4">
                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            </div>
            <p className="text-gray-600 font-medium">Memuat...</p>
            </div>
        </div>
      </>
    )
  }

  // Destructure profileData only after ensuring it's not null
  const { user, stats, recentProjects, recentTasks } = profileData

  // User data for UserHeader (ensure it's only accessed after profileData is available)
  const userForHeader = {
    id: user.id,
    name: user.name,
    email: user.email,
    joinedAt: new Date(user.createdAt),
    totalProjects: stats.totalProjects,
  }

  return (
    <>
      <UserHeader title="Profil" />
      {/* Page Content */}
      <main className="p-4 sm:p-6 lg:p-8">
        <div className="space-y-6">
          {/* Profile Header */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-start space-x-6">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center text-white font-bold text-3xl">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">👤 {user?.name}</h3>
                <p className="text-gray-600 mb-4">{user?.email}</p>
                <div className="flex items-center space-x-3 mb-4">
                  <span className="px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full">
                    ✅ Aktif
                  </span>
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                    👤 {user.role}
                  </span>
                  <span className="px-3 py-1 bg-purple-100 text-purple-800 text-sm font-medium rounded-full">
                    📅 Bergabung sejak{" "}
                    {new Date(user.createdAt).toLocaleDateString("id-ID", { month: "long", year: "numeric" })}
                  </span>
                </div>
              </div>
            </div>
          </div>
          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">📊 Total Proyek</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.totalProjects}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {stats.activeProjects} aktif, {stats.completedProjects} selesai
                  </p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">📁</div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">📝 Total Tugas</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.totalTasks}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {stats.activeTasks} berjalan, {stats.completedTasks} selesai
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">✅</div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">📈 Tingkat Penyelesaian</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.completionRate}%</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {stats.completedTasks} dari {stats.totalTasks} tugas
                  </p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">🎯</div>
              </div>
            </div>
          </div>
          {/* Profile Details as Edit Form */}
          <form className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4">
            <h4 className="text-lg font-semibold text-gray-900 mb-6">ℹ️ Edit Informasi Profil</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">User ID</label>
                <input
                  type="text"
                  value={user.id}
                  disabled
                  className="bg-gray-50 rounded-lg p-3 text-sm text-gray-900 font-mono w-full border border-gray-200"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  defaultValue={user.email}
                  className="bg-gray-50 rounded-lg p-3 text-sm text-gray-900 w-full border border-gray-200"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nama Lengkap</label>
                <input
                  type="text"
                  defaultValue={user.name}
                  className="bg-gray-50 rounded-lg p-3 text-sm text-gray-900 w-full border border-gray-200"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
                <input
                  type="text"
                  value={user.role}
                  disabled
                  className="bg-gray-50 rounded-lg p-3 text-sm text-gray-900 w-full border border-gray-200"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nomor Telepon</label>
                <input
                  type="tel"
                  defaultValue={user.nomor || ""}
                  className="bg-gray-50 rounded-lg p-3 text-sm text-gray-900 w-full border border-gray-200"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Jenis Kelamin</label>
                <select
                  defaultValue={user.gender || ""}
                  className="bg-gray-50 rounded-lg p-3 text-sm text-gray-900 w-full border border-gray-200"
                >
                  <option value="">Pilih</option>
                  <option value="LAKI_LAKI">Laki-laki</option>
                  <option value="PEREMPUAN">Perempuan</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Tanggal Lahir</label>
                <input
                  type="date"
                  defaultValue={user.tanggal_lahir ? new Date(user.tanggal_lahir).toISOString().split("T")[0] : ""}
                  className="bg-gray-50 rounded-lg p-3 text-sm text-gray-900 w-full border border-gray-200"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Bergabung Sejak</label>
                <input
                  type="text"
                  value={new Date(user.createdAt).toLocaleDateString("id-ID", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                  disabled
                  className="bg-gray-50 rounded-lg p-3 text-sm text-gray-900 w-full border border-gray-200"
                />
              </div>
            </div>
            <div className="flex justify-end pt-4">
              <button
                type="submit"
                className="bg-blue-600 text-white py-2 px-6 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
              >
                Konfirmasi Edit Profil
              </button>
            </div>
          </form>
          {/* Activity Summary */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h4 className="text-lg font-semibold text-gray-900 mb-6">📊 Ringkasan Aktivitas</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Recent Projects */}
              <div>
                <h5 className="font-medium text-gray-900 mb-3">📁 Proyek Terbaru</h5>
                <div className="space-y-2">
                  {recentProjects.length > 0 ? (
                    recentProjects.map((project) => (
                      <div key={project.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="text-sm font-medium text-gray-900">{project.name}</p>
                          <p className="text-xs text-gray-500">{project.manager}</p>
                        </div>
                        <span
                          className={`px-2 py-1 text-xs rounded-full ${
                            project.status === "aktif" ? "bg-green-100 text-green-800" : "bg-blue-100 text-blue-800"
                          }`}
                        >
                          {project.status}
                        </span>
                      </div>
                    ))
                  ) : (
                    <div className="text-center text-gray-500 text-sm py-2">Tidak ada proyek terbaru.</div>
                  )}
                </div>
              </div>
              {/* Recent Tasks */}
              <div>
                <h5 className="font-medium text-gray-900 mb-3">📝 Tugas Terbaru</h5>
                <div className="space-y-2">
                  {recentTasks.length > 0 ? (
                    recentTasks.map((task) => (
                      <div key={task.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="text-sm font-medium text-gray-900">{task.title}</p>
                          <p className="text-xs text-gray-500">{task.project}</p>
                        </div>
                        <span
                          className={`px-2 py-1 text-xs rounded-full ${
                            task.status === "selesai" ? "bg-green-100 text-green-800" : "bg-orange-100 text-orange-800"
                          }`}
                        >
                          {task.status === "selesai" ? "✅" : "⏳"}
                        </span>
                      </div>
                    ))
                  ) : (
                    <div className="text-center text-gray-500 text-sm py-2">Tidak ada tugas terbaru.</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Modal Edit Profile */}
        {showEditProfile && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-6 w-full max-w-md mx-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">✏️ Edit Profil</h3>
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nama Lengkap</label>
                  <input
                    type="text"
                    defaultValue={user.name}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    defaultValue={user.email}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nomor Telepon</label>
                  <input
                    type="tel"
                    defaultValue={user.nomor || ""}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div className="flex space-x-3 pt-4">
                  <button
                    type="submit"
                    className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    💾 Simpan
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowEditProfile(false)}
                    className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition-colors"
                  >
                    ❌ Batal
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
        {/* Modal Change Password */}
        {showChangePassword && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-6 w-full max-w-md mx-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">🔒 Ubah Password</h3>
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Password Lama</label>
                  <input
                    type="password"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Password Baru</label>
                  <input
                    type="password"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Konfirmasi Password Baru</label>
                  <input
                    type="password"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div className="flex space-x-3 pt-4">
                  <button
                    type="submit"
                    className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    🔄 Ubah Password
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowChangePassword(false)}
                    className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition-colors"
                  >
                    ❌ Batal
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </>
  )
}
