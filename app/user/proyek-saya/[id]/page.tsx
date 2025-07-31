// app/user/proyek-saya/[id]/page.tsx
"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { UserHeader } from "@/components/user/header";
import Link from "next/link";
import { ArrowLeft, Calendar, CheckCircle2, Folder, Info, ListTodo, User, Trash2, Pencil } from "lucide-react";

interface Task {
  id: string;
  title: string;
  description: string;
  deadline: string;
  status: "BELUM_SELESAI" | "SELESAI";
  assignedUser: {
    name: string;
  };
}

interface Project {
  id: string;
  name: string;
  description: string;
  deadline: string;
  creator: {
    name: string;
  };
  tasks: Task[];
}

export default function ProjectDetailPage({ params }: { params: { id: string } }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { id } = params;
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    } else if (status === "authenticated" && id) {
      fetchProject();
    }
  }, [status, id, router]);

  const fetchProject = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/user/proyek/${id}`);
      if (!res.ok) throw new Error("Gagal memuat proyek");
      const data = await res.json();
      setProject(data);
    } catch (err) {
      setError("Proyek tidak ditemukan atau Anda tidak memiliki akses.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProject = async () => {
    if (!confirm("Yakin ingin menghapus proyek ini? Semua tugas akan ikut terhapus.")) return;

    try {
      const res = await fetch(`/api/user/proyek/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Gagal menghapus proyek");

      // Set flash message via cookie
      document.cookie = "flash_success=Proyek berhasil dihapus.; path=/; max-age=30";

      router.push("/user/proyek-saya");
    } catch (err) {
      alert("Gagal menghapus proyek.");
    }
  };

  const handleUpdateTaskStatus = async (taskId: string, currentStatus: string) => {
    const newStatus = currentStatus === "BELUM_SELESAI" ? "SELESAI" : "BELUM_SELESAI";

    try {
      const res = await fetch(`/api/user/tugas-saya/${taskId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) throw new Error("Gagal memperbarui status tugas");

      // Update UI langsung
      setProject((prev) =>
        prev
          ? {
              ...prev,
              tasks: prev.tasks.map((task) =>
                task.id === taskId ? { ...task, status: newStatus } : task
              ),
            }
          : null
      );
    } catch (err) {
      alert("Gagal memperbarui status tugas.");
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    if (!confirm("Yakin ingin menghapus tugas ini?")) return;

    try {
      const res = await fetch(`/api/user/tugas-saya/${taskId}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Gagal menghapus tugas");

      // Update UI
      setProject((prev) =>
        prev
          ? {
              ...prev,
              tasks: prev.tasks.filter((task) => task.id !== taskId),
            }
          : null
      );
    } catch (err) {
      alert("Gagal menghapus tugas.");
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "aktif":
        return "bg-green-100 text-green-800";
      case "selesai":
        return "bg-blue-100 text-blue-800";
      case "tertunda":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getDaysUntilDeadline = (deadline: string) => {
    const days = Math.ceil(
      (new Date(deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
    );
    if (days < 0) return "Terlambat";
    if (days === 0) return "Hari ini";
    if (days === 1) return "Besok";
    return `${days} hari lagi`;
  };

  if (loading) {
    return (
      <>
        <UserHeader title="Memuat..." />
        <main className="p-4 sm:p-6 lg:p-8 flex items-center justify-center min-h-[calc(100vh-100px)]">
          <p>Memuat detail proyek...</p>
        </main>
      </>
    );
  }

  if (error || !project) {
    return (
      <>
        <UserHeader title="Proyek Tidak Ditemukan" />
        <main className="p-4 sm:p-6 lg:p-8 flex flex-col items-center justify-center min-h-[calc(100vh-120px)]">
          <div className="text-center bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Proyek Tidak Ditemukan 😔</h3>
            <p className="text-gray-600 mb-6">{error}</p>
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
    );
  }

  // Hitung progress
  const totalTasks = project.tasks.length;
  const completedTasks = project.tasks.filter((t) => t.status === "SELESAI").length;
  const progress = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

  // Status proyek
  let projectStatus: "aktif" | "selesai" | "tertunda" = "aktif";
  if (progress === 100) {
    projectStatus = "selesai";
  } else if (new Date(project.deadline) < new Date()) {
    projectStatus = "tertunda";
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
                className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusBadge(
                  projectStatus
                )}`}
              >
                {projectStatus === "aktif" && "🟢 Aktif"}
                {projectStatus === "selesai" && "✅ Selesai"}
                {projectStatus === "tertunda" && "⏸️ Tertunda"}
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
                <span className="font-medium">Manajer:</span> {project.creator.name}
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Progress Proyek</label>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-blue-600 h-3 rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              <p className="text-right text-sm text-gray-600 mt-1">{progress}% Selesai</p>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-3">
              <Link
                href={`/user/proyek-saya/edit/${id}`}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium flex items-center"
              >
                <Pencil className="w-4 h-4 mr-2" />
                Edit Proyek
              </Link>
              <button
                onClick={handleDeleteProject}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium flex items-center"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Hapus Proyek
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
              {project.tasks.length > 0 ? (
                project.tasks.map((task) => (
                  <div
                    key={task.id}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      task.status === "SELESAI"
                        ? "border-green-200 bg-green-50"
                        : "border-gray-200 bg-white hover:border-blue-200"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4 flex-1">
                        {/* Checkbox */}
                        <div
                          className={`mt-1 w-5 h-5 rounded border-2 flex items-center justify-center transition-colors cursor-pointer ${
                            task.status === "SELESAI"
                              ? "bg-green-500 border-green-500 text-white"
                              : "border-gray-300"
                          }`}
                          onClick={() => handleUpdateTaskStatus(task.id, task.status)}
                        >
                          {task.status === "SELESAI" && <CheckCircle2 className="w-3 h-3" />}
                        </div>
                        {/* Task Info */}
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h5
                              className={`font-semibold ${
                                task.status === "SELESAI" ? "text-gray-500 line-through" : "text-gray-900"
                              }`}
                            >
                              {task.title}
                            </h5>
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
                              {task.assignedUser.name}
                            </span>
                          </div>
                        </div>
                      </div>
                      {/* Delete Task */}
                      <div className="ml-4 flex flex-col space-y-2">
                        <button
                          onClick={() => handleDeleteTask(task.id)}
                          className="text-red-500 hover:text-red-700 transition-colors"
                          aria-label="Hapus tugas"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 bg-gray-50 rounded-lg border border-gray-200">
                  <p className="text-gray-500 mb-2">Tidak ada tugas yang terkait dengan proyek ini.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}