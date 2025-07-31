"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { UserHeader } from "@/components/user/header"
import { dummyProjects, dummyTasks, dummyUser, dummyUsers } from "@/lib/dummy-data" // Import dummyUsers
import Link from "next/link"
import { UserRoundCheck } from "lucide-react" // Import Lucide icon for friends

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
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

  // Filter teman
  const myFriends = dummyUsers.filter((u) => u.isFriend).slice(0, 3) // Ambil 3 teman pertama

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
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                    />
                  </svg>
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
                  <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
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
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">🔔 Deadline Tugas</p>
                  <p className="text-2xl font-bold text-gray-900">{upcomingTasks.length}</p>
                </div>
                <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg font-semibold text-gray-900">🔔 Deadline Tugas</h4>
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

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-semibold text-gray-900">
                <UserRoundCheck className="inline-block mr-2 w-5 h-5 text-purple-600" />
                Daftar Pertemanan Saya
              </h4>
              <Link href="/user/pertemanan" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                Lihat Semua
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {myFriends.length > 0 ? (
                myFriends.map((friend) => (
                  <div
                    key={friend.id}
                    className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg border border-gray-100"
                  >
                    <div className="w-10 h-10 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                      {friend.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900 truncate">{friend.name}</p>
                      <p className="text-xs text-gray-500 truncate">{friend.email}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full text-center py-4">
                  <p className="text-gray-500">Anda belum memiliki teman.</p>
                  <Link href="/user/pertemanan" className="text-blue-600 hover:text-blue-700 text-sm mt-2 block">
                    Cari teman sekarang!
                  </Link>
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
