"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { UserHeader } from "@/components/user/header"
import { dummyProjects, dummyTasks, dummyUser, dummyFriends } from "@/lib/dummy-data"
import Link from "next/link"
import { Briefcase, Clock, CheckCircle, AlertTriangle } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar" // Assuming these are available from shadcn/ui

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  // Jika tidak ada session, redirect ke login
  if (status === "unauthenticated") {
    router.push("/login")
    return null
  }

  const user = session?.user

  // Filter tugas yang deadline-nya mendekat (3 hari ke depan)
  const upcomingTasks = dummyTasks.filter((task) => {
    const taskDeadline = new Date(task.deadline)
    const today = new Date()
    const threeDaysFromNow = new Date(today.getTime() + 3 * 24 * 60 * 60 * 1000)
    return taskDeadline <= threeDaysFromNow && task.status === "belum_selesai"
  })

  // Proyek terakhir yang dikerjakan
  const recentProjects = dummyProjects.filter((project) => project.status === "aktif").slice(0, 3)

  const completedTasks = dummyTasks.filter((task) => task.status === "selesai").length
  const activeTasks = dummyTasks.filter((task) => task.status === "belum_selesai").length

  // Semua tugas diurutkan berdasarkan deadline terdekat
  const allTasksSortedByDeadline = [...dummyTasks].sort((a, b) => {
    const dateA = new Date(a.deadline).getTime()
    const dateB = new Date(b.deadline).getTime()
    return dateA - dateB
  })

  return (
    <>
      <UserHeader title="Dashboard" />
      <main className="p-4 sm:p-6 lg:p-8">
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold mb-2">Selamat Datang, {user?.name}! 👋</h3>
                <p className="text-blue-100">Kelola proyek dan tugas tim Anda dengan mudah di TaskSync</p>
                <div className="mt-4 flex items-center space-x-4">
                  <span className="px-3 py-1 bg-white/20 rounded-full text-sm font-medium">👤 {dummyUser.role}</span>
                  <span className="px-3 py-1 bg-white/20 rounded-full text-sm font-medium">
                    📅 Bergabung sejak{" "}
                    {new Date(dummyUser.joinedAt).toLocaleDateString("id-ID", { month: "long", year: "numeric" })}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">📊 Proyek Diikuti</p>
                  <p className="text-2xl font-bold text-gray-900">{dummyUser.totalProjects}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <Briefcase className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">⏳ Tugas Berjalan</p>
                  <p className="text-2xl font-bold text-gray-900">{activeTasks}</p>
                </div>
                <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                  <Clock className="w-6 h-6 text-orange-600" />
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">✅ Tugas Selesai</p>
                  <p className="text-2xl font-bold text-gray-900">{completedTasks}</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">🔔 Deadline Dekat</p>
                  <p className="text-2xl font-bold text-gray-900">{upcomingTasks.length}</p>
                </div>
                <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6 text-red-600" />
                </div>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg font-semibold text-gray-900">🔔 Deadline Mendekat</h4>
                <Link href="/user/tugas-saya" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                  Lihat Semua
                </Link>
              </div>
              <div className="space-y-3">
                {upcomingTasks.length > 0 ? (
                  upcomingTasks.slice(0, 3).map((task) => (
                    <div
                      key={task.id}
                      className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-100"
                    >
                      <div className="flex-1">
                        <h5 className="font-medium text-gray-900">{task.title}</h5>
                        <p className="text-sm text-gray-600">{task.project}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-red-600">
                          {new Date(task.deadline).toLocaleDateString("id-ID", { day: "numeric", month: "short" })}
                        </p>
                        <span
                          className={`px-2 py-1 text-xs rounded-full ${
                            task.priority === "tinggi"
                              ? "bg-red-100 text-red-800"
                              : task.priority === "sedang"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-green-100 text-green-800"
                          }`}
                        >
                          {task.priority}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-4">
                    <p className="text-gray-500">Tidak ada tugas dengan deadline mendekat</p>
                  </div>
                )}
              </div>
            </div>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg font-semibold text-gray-900">🔗 Proyek Terakhir</h4>
                <Link href="/user/proyek-saya" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                  Lihat Semua
                </Link>
              </div>
              <div className="space-y-3">
                {recentProjects.map((project) => (
                  <div
                    key={project.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                  >
                    <div className="flex-1">
                      <h5 className="font-medium text-gray-900">{project.name}</h5>
                      <p className="text-sm text-gray-600">Manager: {project.manager}</p>
                    </div>
                    <div className="text-right">
                      <div className="w-16 bg-gray-200 rounded-full h-2 mb-1">
                        <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${project.progress}%` }}></div>
                      </div>
                      <p className="text-xs text-gray-500">{project.progress}%</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* New Section: Daftar Pertemanan */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-semibold text-gray-900">👥 Daftar Pertemanan</h4>
              <Link href="/user/friends" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                Lihat Semua
              </Link>
            </div>
            <div className="space-y-3">
              {dummyFriends.length > 0 ? (
                dummyFriends.map((friend) => (
                  <div
                    key={friend.id}
                    className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                  >
                    <Avatar className="mr-3">
                      <AvatarImage src={`/placeholder.svg?text=${friend.avatar}`} alt={friend.name} />
                      <AvatarFallback>{friend.avatar}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h5 className="font-medium text-gray-900">{friend.name}</h5>
                      <p className={`text-sm ${friend.status === "Online" ? "text-green-600" : "text-gray-500"}`}>
                        {friend.status}
                      </p>
                    </div>
                    {friend.status === "Online" && (
                      <span className="relative flex h-2 w-2">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                      </span>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-center py-4">
                  <p className="text-gray-500">Tidak ada teman dalam daftar</p>
                </div>
              )}
            </div>
          </div>

          {/* New Section: Tugas dengan Urutan dari Deadline Terdekat */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-semibold text-gray-900">📋 Semua Tugas (Deadline Terdekat)</h4>
              <Link href="/user/tugas-saya" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                Lihat Semua
              </Link>
            </div>
            <div className="space-y-3">
              {allTasksSortedByDeadline.length > 0 ? (
                allTasksSortedByDeadline.map((task) => (
                  <div
                    key={task.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                  >
                    <div className="flex-1">
                      <h5 className="font-medium text-gray-900">{task.title}</h5>
                      <p className="text-sm text-gray-600">{task.project}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-700">
                        {new Date(task.deadline).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </p>
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${
                          task.priority === "tinggi"
                            ? "bg-red-100 text-red-800"
                            : task.priority === "sedang"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-green-100 text-green-800"
                        }`}
                      >
                        {task.priority}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-4">
                  <p className="text-gray-500">Tidak ada tugas yang tersedia</p>
                </div>
              )}
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">📅 Kalender Mini</h4>
            <div className="grid grid-cols-7 gap-2 text-center">
              {["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"].map((day) => (
                <div key={day} className="p-2 text-sm font-medium text-gray-600">
                  {day}
                </div>
              ))}
              {Array.from({ length: 31 }, (_, i) => i + 1).map((date) => (
                <div
                  key={date}
                  className={`p-2 text-sm rounded-lg cursor-pointer hover:bg-blue-50 ${
                    date === new Date().getDate() ? "bg-blue-600 text-white" : "text-gray-700"
                  }`}
                >
                  {date}
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </>
  )
}