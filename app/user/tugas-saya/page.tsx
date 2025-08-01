"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { UserHeader } from "@/components/user/header";
import Link from "next/link";
import { CheckCircle2, ListTodo, User, Calendar } from "lucide-react";

interface Task {
  id: string;
  title: string;
  description: string;
  deadline: string;
  status: "BELUM_SELESAI" | "SELESAI";
  project: {
    name: string;
    id: string;
  };
}

export default function ProyekSayaPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"semua" | "aktif" | "selesai">("semua");

  
  useEffect(() => {
    const fetchTasks = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("/api/users/tugas-saya");
        if (!res.ok) {
          throw new Error(`HTTP ${res.status}: Gagal memuat tugas`);
        }
        const data: Task[] = await res.json();
        setTasks(data);
      } catch (err: any) {
        setError(err.message || "Gagal memuat data tugas.");
        console.error("Error fetching tasks:", err);
      } finally {
        setLoading(false);
      }
    };

    if (status === "authenticated") {
      fetchTasks();
    }
  }, [status]);

  
  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.project.name.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = () => {
      if (statusFilter === "semua") return true;
      if (statusFilter === "aktif") return task.status === "BELUM_SELESAI";
      if (statusFilter === "selesai") return task.status === "SELESAI";
      return true;
    };

    return matchesSearch && matchesStatus();
  });

  
  const totalTasks = tasks.length;
  const activeTasks = tasks.filter((t) => t.status === "BELUM_SELESAI").length;
  const completedTasks = tasks.filter((t) => t.status === "SELESAI").length;

  
  const handleStatusChange = async (taskId: string, currentStatus: string) => {
    try {
      const res = await fetch(`/api/users/tugas-saya/${taskId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: currentStatus === "BELUM_SELESAI" ? "SELESAI" : "BELUM_SELESAI" }),
      });

      if (!res.ok) throw new Error("Gagal memperbarui status");

      
      setTasks((prev) =>
        prev.map((task) =>
          task.id === taskId
            ? { ...task, status: task.status === "BELUM_SELESAI" ? "SELESAI" : "BELUM_SELESAI" }
            : task
        )
      );
    } catch (err) {
      alert("Gagal memperbarui status tugas.");
    }
  };

  if (error) {
    return (
      <>
        <UserHeader title="Error" />
        <main className="p-4 sm:p-6 lg:p-8 flex items-center justify-center min-h-[calc(100vh-100px)]">
          <p className="text-red-500">Error: {error}</p>
        </main>
      </>
    );
  }

  return (
    <>
      <UserHeader title="Tugas Saya" />
      <main className="p-4 sm:p-6 lg:p-8">
        <div className="space-y-6">

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h3 className="text-xl font-bold text-gray-900">📋 Daftar Tugas Saya</h3>
                <p className="text-gray-600 mt-1">Kelola semua tugas yang diassign ke Anda</p>
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
                  onChange={(e) => setStatusFilter(e.target.value as any)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="semua">Semua Status</option>
                  <option value="aktif">Belum Selesai</option>
                  <option value="selesai">Selesai</option>
                </select>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Tugas</p>
                  <p className="text-2xl font-bold text-gray-900">{totalTasks}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <ListTodo className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Tugas Aktif</p>
                  <p className="text-2xl font-bold text-gray-900">{activeTasks}</p>
                </div>
                <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-yellow-600" />
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Tugas Selesai</p>
                  <p className="text-2xl font-bold text-gray-900">{completedTasks}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-white-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      🏷️ Tugas
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      📁 Proyek
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      📅 Deadline
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      🎯 Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {loading ? (
                    Array.from({ length: 3 }).map((_, index) => (
                      <tr key={`skeleton-${index}`} className="animate-pulse hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="mr-3 w-5 h-5 rounded border-2 border-gray-300 bg-gray-200"></div>
                            <div>
                              <div className="h-4 bg-gray-200 rounded w-32 mb-1"></div>
                              <div className="h-3 bg-gray-200 rounded w-48"></div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="h-4 bg-gray-200 rounded w-24"></div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="h-4 bg-gray-200 rounded w-32"></div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100">
                            <div className="h-3 bg-gray-200 rounded w-16"></div>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : filteredTasks.length > 0 ? (
                    
                    filteredTasks.map((task) => (
                      <tr key={task.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <button
                              onClick={() => handleStatusChange(task.id, task.status)}
                              className={`mr-3 w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                                task.status === "SELESAI"
                                  ? "bg-green-500 border-green-500 text-white"
                                  : "border-gray-300 hover:border-blue-500"
                              }`}
                            >
                              {task.status === "SELESAI" && <CheckCircle2 className="w-3 h-3" />}
                            </button>
                            <div>
                              <div className="text-sm font-medium text-gray-900">{task.title}</div>
                              <div className="text-sm text-gray-500">{task.description}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Link
                            href={`/user/proyek-saya/${task.project.id}`}
                            className="text-blue-600 hover:underline"
                          >
                            {task.project.name}
                          </Link>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {new Date(task.deadline).toLocaleDateString("id-ID", {
                              day: "numeric",
                              month: "long",
                              year: "numeric",
                            })}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              task.status === "BELUM_SELESAI"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-blue-100 text-blue-800"
                            }`}
                          >
                            {task.status === "BELUM_SELESAI" ? "🟡 Belum Selesai" : "✅ Selesai"}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    
                    <tr>
                      <td colSpan={4} className="text-center py-12">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                          <ListTodo className="w-8 h-8 text-gray-400" />
                        </div>
                        <p className="text-gray-500">Tidak ada tugas yang ditemukan</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </main>
    </>
  );
}