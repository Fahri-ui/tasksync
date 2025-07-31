"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { UserHeader } from "@/components/user/header"
import { dummyProjects, dummyTasks } from "@/lib/dummy-data"
import Link from "next/link"
import { ArrowLeft, Calendar, CheckCircle2, Folder, Info, ListTodo, User } from "lucide-react"

interface ProjectDetailPageProps {
  params: {
    id: string
  }
}

export default function ProjectDetailPage({ params }: ProjectDetailPageProps) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const projectId = params.id


  const project = dummyProjects.find((p) => p.id.toString() === projectId)
  const projectTasks = dummyTasks.filter((task) => task.project === project?.name)

  if (!project) {
    // Handle project not found
    return (
      <>
        <UserHeader title="Proyek Tidak Ditemukan" />
        <main className="p-4 sm:p-6 lg:p-8 flex flex-col items-center justify-center min-h-[calc(100vh-120px)]">
          <div className="text-center bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Proyek Tidak Ditemukan 😔</h3>
            <p className="text-gray-600 mb-6">Maaf, proyek dengan ID &quot;{projectId}&quot; tidak dapat ditemukan.</p>
            <Link
              href="/user/proyek-saya"
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Kembali ke Daftar Proyek
            </Link>
          </div>
        </main>
      </>
    )
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "aktif":
        return "bg-green-100 text-green-800"
      case "selesai":
        return "bg-blue-100 text-blue-800"
      case "tertunda":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
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

  const getDaysUntilDeadline = (deadline: string) => {
    const days = Math.ceil((new Date(deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
    if (days < 0) return "Terlambat"
    if (days === 0) return "Hari ini"
    if (days === 1) return "Besok"
    return `${days} hari lagi`
  }

  return (
    <>
      <UserHeader title={`Detail Proyek: ${project.name}`} />

      <main className="p-4 sm:p-6 lg:p-8">
        <div className="space-y-6">
          {/* Back Button */}
          <div className="mb-6">
            <Link
              href="/user/proyek-saya"
              className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Kembali ke Daftar Proyek
            </Link>
          </div>

          {/* Project Details Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-2xl font-bold text-gray-900 flex items-center">
                <Folder className="w-7 h-7 mr-3 text-blue-600" />
                {project.name}
              </h3>
              <span
                className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusBadge(project.status)}`}
              >
                {project.status === "aktif" && "🟢 Aktif"}
                {project.status === "selesai" && "✅ Selesai"}
                {project.status === "tertunda" && "⏸️ Tertunda"}
              </span>
            </div>

            <p className="text-gray-700 mb-6">{project.description}</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="flex items-center text-gray-600">
                <Calendar className="w-5 h-5 mr-2 text-gray-500" />
                <span className="font-medium">Deadline:</span>{" "}
                {new Date(project.deadline).toLocaleDateString("id-ID", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </div>
              <div className="flex items-center text-gray-600">
                <User className="w-5 h-5 mr-2 text-gray-500" />
                <span className="font-medium">Manajer:</span> {project.manager}
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Progress Proyek</label>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-blue-600 h-3 rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${project.progress}%` }}
                ></div>
              </div>
              <p className="text-right text-sm text-gray-600 mt-1">{project.progress}% Selesai</p>
            </div>

            {/* Action Buttons (Optional) */}
            <div className="flex space-x-3">
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
                ✏️ Edit Proyek
              </button>
              <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium">
                🗑️ Hapus Proyek
              </button>
            </div>
          </div>

          {/* Project Tasks Section */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h4 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <ListTodo className="w-6 h-6 mr-2 text-green-600" />
              Tugas-tugas dalam Proyek Ini
            </h4>
            <div className="space-y-4">
              {projectTasks.length > 0 ? (
                projectTasks.map((task) => (
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
                        {/* Checkbox */}
                        <div
                          className={`mt-1 w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                            task.status === "selesai" ? "bg-green-500 border-green-500 text-white" : "border-gray-300"
                          }`}
                        >
                          {task.status === "selesai" && <CheckCircle2 className="w-3 h-3" />}
                        </div>

                        {/* Task Info */}
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h5
                              className={`font-semibold ${
                                task.status === "selesai" ? "text-gray-500 line-through" : "text-gray-900"
                              }`}
                            >
                              {task.title}
                            </h5>
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityBadge(task.priority)}`}
                            >
                              {task.priority}
                            </span>
                          </div>

                          <p className="text-sm text-gray-600 mb-2">{task.description}</p>

                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <span className="flex items-center">
                              <Calendar className="w-4 h-4 mr-1" />
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
                              <Info className="w-4 h-4 mr-1" />
                              {getDaysUntilDeadline(task.deadline)}
                            </span>
                            <span className="flex items-center">
                              <User className="w-4 h-4 mr-1" />
                              {task.assignee}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Status Icon */}
                      <div className="ml-4">
                        <span className="text-2xl">{task.status === "selesai" ? "✅" : "⏳"}</span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 bg-gray-50 rounded-lg border border-gray-200">
                  <p className="text-gray-500 mb-2">Tidak ada tugas yang terkait dengan proyek ini.</p>
                  <p className="text-sm text-gray-400">
                    Anda bisa menambahkan tugas baru melalui halaman 'Buat Proyek Baru'.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
