"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { UserHeader } from "@/components/user/header";
import Link from "next/link";

// Tipe data dari API /api/user/proyek
type ProjectApiResponse = {
  id: string;
  name: string;
  description: string | null;
  deadline: string; // ISO string
  progress: number;
  status: "aktif" | "selesai" | "tertunda";
  manager: string;
};

export default function ProyekSayaPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"semua" | "aktif" | "selesai" | "tertunda">("semua");
  const [projects, setProjects] = useState<ProjectApiResponse[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch data dari API
  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/users/proyek");
        if (!res.ok) {
          throw new Error("Gagal memuat data proyek");
        }
        const data: ProjectApiResponse[] = await res.json();
        setProjects(data);
      } catch (err) {
        console.error("Error fetching projects:", err);
        // Opsional: redirect ke login atau tampilkan error
      } finally {
        setLoading(false);
      }
    };

    if (status === "authenticated") {
      fetchProjects();
    } else if (status === "unauthenticated") {
      router.push("/login"); // Asumsi halaman login di /login
    }
  }, [status, router]);

  // Filter proyek berdasarkan pencarian dan status
  const filteredProjects = projects.filter((project) => {
    const matchesSearch =
      project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.manager.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "semua" || project.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Hitung statistik
  const totalProjects = projects.length;
  const activeProjects = projects.filter((p) => p.status === "aktif").length;
  const completedProjects = projects.filter((p) => p.status === "selesai").length;

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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "aktif":
        return "🟢";
      case "selesai":
        return "✅";
      case "tertunda":
        return "⏸️";
      default:
        return "⚪";
    }
  };
  
  return (
    <>
      <UserHeader title="Proyek Saya" />
      {/* Page Content */}
      <main className="p-4 sm:p-6 lg:p-8">
        <div className="space-y-6">
          {/* Header Section */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h3 className="text-xl font-bold text-gray-900">📁 Daftar Proyek</h3>
                <p className="text-gray-600 mt-1">Kelola semua proyek yang Anda ikuti</p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                {/* Search */}
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
                    placeholder="🔍 Cari proyek..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                {/* Filter Status */}
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as any)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="semua">Semua Status</option>
                  <option value="aktif">Aktif</option>
                  <option value="selesai">Selesai</option>
                  <option value="tertunda">Tertunda</option>
                </select>
              </div>
            </div>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Proyek</p>
                  <p className="text-2xl font-bold text-gray-900">{totalProjects}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">📁</div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Proyek Aktif</p>
                  <p className="text-2xl font-bold text-gray-900">{activeProjects}</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">🟢</div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Proyek Selesai</p>
                  <p className="text-2xl font-bold text-gray-900">{completedProjects}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">✅</div>
              </div>
            </div>
          </div>

          {/* Projects Table */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      🏷️ Nama Proyek
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      📅 Deadline
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      🎯 Status
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      👨‍💼 Manager
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      📊 Progress
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredProjects.map((project) => (
                    <tr key={project.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Link href={`/user/proyek-saya/${project.id}`} className="block">
                          <div className="text-sm font-medium text-gray-900 hover:text-blue-600">{project.name}</div>
                          <div className="text-sm text-gray-500">{project.description}</div>
                        </Link>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {new Date(project.deadline).toLocaleDateString("id-ID", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          })}
                        </div>
                        <div className="text-xs text-gray-500">
                          {Math.ceil(
                            (new Date(project.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
                          )}{" "}
                          hari lagi
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(
                            project.status
                          )}`}
                        >
                          {getStatusIcon(project.status)} {project.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full flex items-center justify-center text-white font-semibold text-xs mr-3">
                            {project.manager
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </div>
                          <div className="text-sm text-gray-900">{project.manager}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-16 bg-gray-200 rounded-full h-2 mr-3">
                            <div
                              className="bg-blue-600 h-2 rounded-full"
                              style={{ width: `${project.progress}%` }}
                            ></div>
                          </div>
                          <span className="text-sm text-gray-900">{project.progress}%</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {filteredProjects.length === 0 && !loading && (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                    />
                  </svg>
                </div>
                <p className="text-gray-500">Tidak ada proyek yang ditemukan</p>
                <p className="text-sm text-gray-400 mt-1">Coba ubah filter atau kata kunci pencarian</p>
              </div>
            )}
          </div>

        </div>
      </main>
    </>
  );
}