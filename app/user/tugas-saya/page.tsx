"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { UserHeader } from "@/components/user/header"
import { dummyTasks } from "@/lib/dummy-data"

export default function TugasSayaPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("semua")
  const [projectFilter, setProjectFilter] = useState("semua")
  const [sortBy, setSortBy] = useState("deadline")
  if (status === "unauthenticated") {
    router.push("/login")
    return null
  }

  const uniqueProjects = [...new Set(dummyTasks.map((task) => task.project))]

  let filteredTasks = dummyTasks.filter((task) => {
    const matchesSearch =
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.project.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "semua" || task.status === statusFilter
    const matchesProject = projectFilter === "semua" || task.project === projectFilter
    return matchesSearch && matchesStatus && matchesProject
  })

  filteredTasks = filteredTasks.sort((a, b) => {
    switch (sortBy) {
      case "deadline":
        return new Date(a.deadline).getTime() - new Date(b.deadline).getTime()
      case "priority":
        const priorityOrder = { tinggi: 3, sedang: 2, rendah: 1 }
        return (
          priorityOrder[b.priority as keyof typeof priorityOrder] -
          priorityOrder[a.priority as keyof typeof priorityOrder]
        )
      case "project":
        return a.project.localeCompare(b.project)
      default:
        return 0
    }
  })

  const handleToggleStatus = (taskId: number) => {
    console.log(`Toggle status untuk tugas ${taskId}`)
  }

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "tinggi":
        return "bg-red-100 text-red-800"
      case "sedang":
        return "bg-yellow-100 text-yellow-800"
      case "rendah":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case "tinggi":
        return "🔴"
      case "sedang":
        return "🟡"
      case "rendah":
        return "🟢"
      default:
        return "⚪"
    }
  }

  const getStatusIcon = (status: string) => {
    return status === "selesai" ? "✅" : "⏳"
  }

  const getDaysUntilDeadline = (deadline: string) => {
    const days = Math.ceil((new Date(deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
    if (days < 0) return "Terlambat"
    if (days === 0) return "Hari ini"
    if (days === 1) return "Besok"
    return `${days} hari lagi`
  }

  return (
    <>
      <UserHeader title="Tugas Saya" />

      <main className="p-4 sm:p-6 lg:p-8">
        <div className="space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div>
                <h3 className="text-xl font-bold text-gray-900">📌 Daftar Tugas</h3>
                <p className="text-gray-600 mt-1">Kelola semua tugas dari berbagai proyek</p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative">
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
                    placeholder="🔍 Cari tugas..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="semua">Semua Status</option>
                  <option value="belum_selesai">Belum Selesai</option>
                  <option value="selesai">Selesai</option>
                </select>

                <select
                  value={projectFilter}
                  onChange={(e) => setProjectFilter(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="semua">Semua Proyek</option>
                  {uniqueProjects.map((project) => (
                    <option key={project} value={project}>
                      {project}
                    </option>
                  ))}
                </select>

                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="deadline">Urutkan: Deadline</option>
                  <option value="priority">Urutkan: Prioritas</option>
                  <option value="project">Urutkan: Proyek</option>
                </select>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Tugas</p>
                  <p className="text-2xl font-bold text-gray-900">{dummyTasks.length}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">📝</div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Belum Selesai</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {dummyTasks.filter((t) => t.status === "belum_selesai").length}
                  </p>
                </div>
                <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">⏳</div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Selesai</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {dummyTasks.filter((t) => t.status === "selesai").length}
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">✅</div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Prioritas Tinggi</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {dummyTasks.filter((t) => t.priority === "tinggi").length}
                  </p>
                </div>
                <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">🔴</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
            <div className="p-6">
              <div className="space-y-4">
                {filteredTasks.map((task) => (
                  <div
                    key={task.id}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      task.status === "selesai"
                        ? "border-green-200 bg-green-50"
                        : "border-gray-200 bg-white hover:border-blue-200"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4 flex-1">
                        <button
                          onClick={() => handleToggleStatus(task.id)}
                          className={`mt-1 w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                            task.status === "selesai"
                              ? "bg-green-500 border-green-500 text-white"
                              : "border-gray-300 hover:border-blue-500"
                          }`}
                        >
                          {task.status === "selesai" && (
                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                              <path
                                fillRule="evenodd"
                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                clipRule="evenodd"
                              />
                            </svg>
                          )}
                        </button>

                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h4
                              className={`font-semibold ${
                                task.status === "selesai" ? "text-gray-500 line-through" : "text-gray-900"
                              }`}
                            >
                              {task.title}
                            </h4>
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityBadge(task.priority)}`}
                            >
                              {getPriorityIcon(task.priority)} {task.priority}
                            </span>
                          </div>

                          <p className="text-sm text-gray-600 mb-2">{task.description}</p>

                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <span className="flex items-center">📁 {task.project}</span>
                            <span className="flex items-center">
                              📅{" "}
                              {new Date(task.deadline).toLocaleDateString("id-ID", {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              })}
                            </span>
                            <span
                              className={`flex items-center ${
                                getDaysUntilDeadline(task.deadline) === "Terlambat"
                                  ? "text-red-600 font-medium"
                                  : getDaysUntilDeadline(task.deadline).includes("hari ini") ||
                                      getDaysUntilDeadline(task.deadline).includes("Besok")
                                    ? "text-orange-600 font-medium"
                                    : "text-gray-500"
                              }`}
                            >
                              ⏰ {getDaysUntilDeadline(task.deadline)}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="ml-4">
                        <span className="text-2xl">{getStatusIcon(task.status)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {filteredTasks.length === 0 && (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                      />
                    </svg>
                  </div>
                  <p className="text-gray-500">Tidak ada tugas yang ditemukan</p>
                  <p className="text-sm text-gray-400 mt-1">Coba ubah filter atau kata kunci pencarian</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
