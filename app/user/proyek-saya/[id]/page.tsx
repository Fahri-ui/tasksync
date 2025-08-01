"use client";

import { useSession } from "next-auth/react";
import { useRouter, useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { UserHeader } from "@/components/user/header";
import Link from "next/link";
import { ArrowLeft, Calendar, Folder, Info, ListTodo, User, Trash2, Pencil } from "lucide-react";

interface Task {
  id: string;
  title: string;
  description: string;
  deadline: string;
  status: "BELUM_SELESAI" | "SELESAI";
  assignedUser: {
    id: string;
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

interface Friend {
  id: string;
  name: string;
}

export default function ProjectDetailPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [friends, setFriends] = useState<Friend[]>([]);

  // Edit Mode
  const [isEditingProject, setIsEditingProject] = useState(false);
  const [editForm, setEditForm] = useState({
    name: "",
    description: "",
    deadline: "",
  });

  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [taskForm, setTaskForm] = useState({
    title: "",
    description: "",
    deadline: "",
    assignedTo: "", // userId
  });

  useEffect(() => {
   if (status === "authenticated" && id) {
      fetchProject();
      fetchFriends();
    }
  }, [status, id, router]);

  const fetchProject = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/users/proyek/${id}`);
      if (!res.ok) throw new Error("Gagal memuat proyek");
      const data = await res.json();
      setProject(data);
    } catch (err: any) {
      setError("Proyek tidak ditemukan atau Anda tidak memiliki akses.");
    } finally {
      setLoading(false);
    }
  };

  const fetchFriends = async () => {
    try {
      const res = await fetch("/api/users/friends");
      if (!res.ok) throw new Error("Gagal muat daftar teman");
      const data = await res.json();
      setFriends(data);
    } catch (err) {
      console.error("Gagal muat teman:", err);
    }
  };

  const startEditProject = () => {
    if (!project) return;
    setEditForm({
      name: project.name,
      description: project.description || "",
      deadline: project.deadline ? project.deadline.split("T")[0] : "", // ✅ Aman dari undefined
    });
    setIsEditingProject(true);
  };

  const cancelEditProject = () => {
    setIsEditingProject(false);
  };

  const saveEditProject = async () => {
    // ✅ Validasi input
    if (!editForm.name || !editForm.description || !editForm.deadline) {
      alert("Semua field wajib diisi.");
      return;
    }

    try {
      const res = await fetch(`/api/users/proyek/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editForm),
      });

      if (!res.ok) {
        const error = await res.json().catch(() => ({}));
        throw new Error(error.error || "Gagal menyimpan perubahan");
      }

      const updated = await res.json();
      setProject(updated);
      setIsEditingProject(false);

      document.cookie = "flash_success=Proyek berhasil diperbarui.; path=/; max-age=30";
    } catch (err: any) {
      console.error("Save error:", err);
      alert("Gagal menyimpan perubahan: " + err.message);
    }
  };

  const deleteProject = async () => {
    if (!confirm("Yakin ingin menghapus proyek ini?")) return;

    try {
      const res = await fetch(`/api/users/proyek/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Gagal menghapus proyek");

      document.cookie = "flash_success=Proyek berhasil dihapus.; path=/; max-age=30";
      router.push("/user/proyek-saya");
    } catch (err) {
      alert("Gagal menghapus proyek.");
    }
  };

  const startEditTask = (task: Task) => {
    setEditingTaskId(task.id);
    setTaskForm({
      title: task.title,
      description: task.description || "",
      deadline: task.deadline.split("T")[0],
      assignedTo: task.assignedUser.id, // ✅ Simpan ID, bukan nama
    });
  };

  const cancelEditTask = () => {
    setEditingTaskId(null);
  };

  const saveEditTask = async (taskId: string) => {
    if (!taskForm.title || !taskForm.deadline || !taskForm.assignedTo) {
      alert("Semua field tugas wajib diisi.");
      return;
    }

    try {
      const res = await fetch(`/api/users/tugas/${taskId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: taskForm.title,
          description: taskForm.description,
          deadline: taskForm.deadline,
          assignedTo: taskForm.assignedTo, // ✅ Kirim userId
        }),
      });

      if (!res.ok) {
        const error = await res.json().catch(() => ({}));
        throw new Error(error.error || "Gagal menyimpan tugas");
      }

      const updatedTask = await res.json();
      setProject((prev) =>
        prev
          ? {
              ...prev,
              tasks: prev.tasks.map((t) => (t.id === taskId ? updatedTask : t)),
            }
          : null
      );
      setEditingTaskId(null);
    } catch (err: any) {
      console.error("Save task error:", err);
      alert("Gagal menyimpan perubahan tugas: " + err.message);
    }
  };

  const deleteTask = async (taskId: string) => {
    if (!confirm("Yakin ingin menghapus tugas ini?")) return;

    try {
      const res = await fetch(`/api/users/tugas/${taskId}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Gagal menghapus tugas");

      setProject((prev) =>
        prev
          ? {
              ...prev,
              tasks: prev.tasks.filter((t) => t.id !== taskId),
            }
          : null
      );
    } catch (err) {
      alert("Gagal menghapus tugas.");
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "aktif": return "bg-green-100 text-green-800";
      case "selesai": return "bg-blue-100 text-blue-800";
      case "tertunda": return "bg-yellow-100 text-yellow-800";
      default: return "bg-gray-100 text-gray-800";
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

  const totalTasks = project.tasks?.length || 0;
  const completedTasks = project.tasks.filter((t) => t.status === "SELESAI").length;
  const progress = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

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
                {isEditingProject ? (
                  <input
                    type="text"
                    value={editForm.name}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    className="px-2 py-1 border border-gray-300 rounded"
                  />
                ) : (
                  project.name
                )}
              </h3>
              <div className="flex space-x-2">
                {isEditingProject ? (
                  <>
                    <button
                      onClick={saveEditProject}
                      className="px-3 py-1 bg-blue-600 text-white rounded text-sm"
                    >
                      Simpan
                    </button>
                    <button
                      onClick={cancelEditProject}
                      className="px-3 py-1 bg-gray-500 text-white rounded text-sm"
                    >
                      Batal
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={startEditProject}
                      className="px-3 py-1 bg-blue-600 text-white rounded text-sm flex items-center"
                    >
                      <Pencil className="w-4 h-4 mr-1" />
                      Edit
                    </button>
                    <button
                      onClick={deleteProject}
                      className="px-3 py-1 bg-red-600 text-white rounded text-sm flex items-center"
                    >
                      <Trash2 className="w-4 h-4 mr-1" />
                      Hapus
                    </button>
                  </>
                )}
              </div>
            </div>

            {isEditingProject ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Deskripsi</label>
                  <textarea
                    value={editForm.description}
                    onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Deadline</label>
                  <input
                    type="date"
                    value={editForm.deadline}
                    onChange={(e) => setEditForm({ ...editForm, deadline: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded"
                  />
                </div>
              </div>
            ) : (
              <>
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
              </>
            )}

            {/* Progress Bar */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Progress Proyek</label>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-blue-600 h-3 rounded-full"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              <p className="text-right text-sm text-gray-600 mt-1">{progress}% Selesai</p>
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

                        {editingTaskId === task.id ? (
                          <div className="flex-1 space-y-3">
                            <input
                              type="text"
                              value={taskForm.title}
                              onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })}
                              className="w-full px-3 py-2 border border-gray-300 rounded"
                            />
                            <textarea
                              value={taskForm.description}
                              onChange={(e) => setTaskForm({ ...taskForm, description: e.target.value })}
                              rows={2}
                              className="w-full px-3 py-2 border border-gray-300 rounded"
                            />
                            <input
                              type="date"
                              value={taskForm.deadline}
                              onChange={(e) => setTaskForm({ ...taskForm, deadline: e.target.value })}
                              className="w-full px-3 py-2 border border-gray-300 rounded"
                            />
                            <select
                              value={taskForm.assignedTo}
                              onChange={(e) => setTaskForm({ ...taskForm, assignedTo: e.target.value })}
                              className="w-full px-3 py-2 border border-gray-300 rounded"
                            >
                              <option value="">Pilih Penanggung Jawab</option>
                              {friends.map((friend) => (
                                <option key={friend.id} value={friend.id}>
                                  {friend.name}
                                </option>
                              ))}
                            </select>
                            <div className="flex space-x-2">
                              <button
                                onClick={() => saveEditTask(task.id)}
                                className="px-3 py-1 bg-blue-600 text-white rounded text-sm"
                              >
                                Simpan
                              </button>
                              <button
                                onClick={cancelEditTask}
                                className="px-3 py-1 bg-gray-500 text-white rounded text-sm"
                              >
                                Batal
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <h5 className="font-semibold text-gray-900">{task.title}</h5>
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
                              <span className="flex items-center">
                                <User className="w-4 h-4 mr-1" />
                                {task.assignedUser.name}
                              </span>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Action */}
                      <div className="ml-4">
                        <button
                          onClick={() => startEditTask(task)}
                          className="text-blue-600 hover:text-blue-800 text-sm mr-2"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => deleteTask(task.id)}
                          className="text-red-600 hover:text-red-800 text-sm"
                        >
                          Hapus
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