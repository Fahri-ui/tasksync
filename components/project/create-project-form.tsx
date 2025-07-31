"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { TaskInputCard } from "./task-input-card"
import type { Project, Task } from "@/lib/dummy-data"
import { dummyManagers } from "@/lib/dummy-data"
import { PlusCircle, FolderPlus, CheckCircle2 } from "lucide-react"

interface NewProjectDetails {
  name: string
  deadline: string
  manager: string
  description: string
}

interface NewTaskDetails {
  tempId: string // Temporary ID for client-side management
  title: string
  deadline: string
  priority: "tinggi" | "sedang" | "rendah" | ""
  description: string
  assignee: string // New: Penanggung Jawab
}

export function CreateProjectForm() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [projectDetails, setProjectDetails] = useState<NewProjectDetails>({
    name: "",
    deadline: "",
    manager: "",
    description: "",
  })
  const [tasks, setTasks] = useState<NewTaskDetails[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleProjectChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setProjectDetails((prev) => ({ ...prev, [name]: value }))
  }

  const handleAddTask = () => {
    setTasks((prev) => [
      ...prev,
      {
        tempId: Date.now().toString(), // Simple unique ID for now
        title: "",
        deadline: "",
        priority: "",
        description: "",
        assignee: "", // Initialize new assignee field
      },
    ])
  }

  const handleUpdateTask = (tempId: string, field: keyof NewTaskDetails, value: string) => {
    setTasks((prev) => prev.map((task) => (task.tempId === tempId ? { ...task, [field]: value } : task)))
  }

  const handleDeleteTask = (tempId: string) => {
    setTasks((prev) => prev.filter((task) => task.tempId !== tempId))
  }

  const validateStep1 = () => {
    const { name, deadline, manager, description } = projectDetails
    return name && deadline && manager && description
  }

  const validateStep2 = () => {
    if (tasks.length === 0) return false // Must have at least one task
    return tasks.every((task) => task.title && task.deadline && task.priority && task.description && task.assignee)
  }

  const handleNext = () => {
    if (validateStep1()) {
      setStep(2)
    } else {
      alert("Harap lengkapi semua detail proyek sebelum melanjutkan.")
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateStep2()) {
      alert("Harap lengkapi semua detail tugas sebelum membuat proyek.")
      return
    }

    setIsSubmitting(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))

    const newProject: Project = {
      id: `proj-${Date.now()}`, // Dummy ID
      name: projectDetails.name,
      deadline: projectDetails.deadline,
      status: "aktif", // Default status for new project
      manager: projectDetails.manager,
      description: projectDetails.description,
      progress: 0, // New project starts at 0 progress
    }

    const newTasks: Task[] = tasks.map((task) => ({
      id: `task-${Date.now()}-${task.tempId}`, // Dummy ID
      title: task.title,
      project: newProject.name, // Link task to the new project
      deadline: task.deadline,
      status: "belum_selesai", // Default status for new tasks
      priority: task.priority as Task["priority"],
      description: task.description,
      assignee: task.assignee, // Include assignee
    }))

    console.log("Proyek Baru:", newProject)
    console.log("Tugas-tugas Proyek:", newTasks)

    setIsSubmitting(false)
    alert("Proyek dan tugas berhasil dibuat!")
    router.push("/user/proyek-saya") // Redirect to projects list
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <h3 className="text-xl font-bold text-gray-900 mb-4">
        <FolderPlus className="inline-block mr-2 w-6 h-6 text-blue-600" />
        Buat Proyek Baru
      </h3>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
              step === 1 ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-600"
            }`}
          >
            1
          </div>
          <span className="text-sm font-medium text-gray-700">Detail Proyek</span>
        </div>
        <div className="flex-1 h-0.5 bg-gray-200 mx-4"></div>
        <div className="flex items-center space-x-2">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
              step === 2 ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-600"
            }`}
          >
            2
          </div>
          <span className="text-sm font-medium text-gray-700">Detail Tugas</span>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        {step === 1 && (
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Nama Proyek
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={projectDetails.name}
                onChange={handleProjectChange}
                placeholder="Contoh: Pengembangan Aplikasi Mobile"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Deskripsi Proyek
              </label>
              <textarea
                id="description"
                name="description"
                value={projectDetails.description}
                onChange={handleProjectChange}
                placeholder="Jelaskan tujuan dan ruang lingkup proyek"
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="deadline" className="block text-sm font-medium text-gray-700 mb-1">
                  Deadline Proyek
                </label>
                <input
                  type="date"
                  id="deadline"
                  name="deadline"
                  value={projectDetails.deadline}
                  onChange={handleProjectChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label htmlFor="manager" className="block text-sm font-medium text-gray-700 mb-1">
                  Manajer Proyek
                </label>
                <select
                  id="manager"
                  name="manager"
                  value={projectDetails.manager}
                  onChange={handleProjectChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="">Pilih Manajer</option>
                  {dummyManagers.map((manager) => (
                    <option key={manager.id} value={manager.name}>
                      {manager.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex justify-end mt-6">
              <button
                type="button"
                onClick={handleNext}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
              >
                <span>Lanjut ke Tugas</span>
                <PlusCircle className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <div className="space-y-4">
              {tasks.length === 0 && (
                <div className="text-center py-8 bg-gray-100 rounded-lg border border-gray-200">
                  <p className="text-gray-500 mb-2">Belum ada tugas ditambahkan.</p>
                  <p className="text-sm text-gray-400">Klik "Tambah Tugas" untuk memulai.</p>
                </div>
              )}
              {tasks.map((task) => (
                <TaskInputCard key={task.tempId} task={task} onUpdate={handleUpdateTask} onDelete={handleDeleteTask} />
              ))}
            </div>
            <button
              type="button"
              onClick={handleAddTask}
              className="w-full px-4 py-2 border border-dashed border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors flex items-center justify-center space-x-2"
            >
              <PlusCircle className="w-5 h-5" />
              <span>Tambah Tugas</span>
            </button>
            <div className="flex justify-between mt-6">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="px-6 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition-colors"
              >
                Kembali
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
                    <span>Membuat Proyek...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-5 h-5" />
                    <span>Konfirmasi Buat Proyek</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  )
}
