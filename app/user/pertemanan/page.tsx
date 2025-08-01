"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { UserHeader } from "@/components/user/header";
import { UserPlus, UserCheck, Users } from "lucide-react";

interface UserData {
  id: string;
  name: string;
  email: string;
  isFriend: boolean;
}

export default function PertemananPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`/api/users/pertemanan?search=${searchTerm}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setUsers(data.users);
      } catch (err: any) {
        setError(err.message || "Gagal memuat data pengguna.");
        console.error("Failed to fetch users:", err);
      } finally {
        setLoading(false);
      }
    };

    if (status === "authenticated") {
      fetchUsers();
    }
  }, [searchTerm, status]);

  const handleAddFriend = async (userId: string) => {
    try {
      const response = await fetch("/api/users/pertemanan", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ friendId: userId }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Gagal mengubah status pertemanan");
      }

      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === userId
            ? { ...user, isFriend: data.isFriend }
            : user
        )
      );
    } catch (err: any) {
      console.error("Error updating friendship:", err);
      alert("Gagal: " + err.message);
    }
  };

  const userForHeader = session?.user
    ? {
        id: session.user.id || "",
        name: session.user.name || "Pengguna",
        email: session.user.email || "",
        joinedAt: new Date(),
        totalProjects: 0,
      }
    : {
        id: "",
        name: "Pengguna",
        email: "",
        joinedAt: new Date(),
        totalProjects: 0,
      };

  return (
    <>
      <UserHeader title="Pertemanan" />
      <main className="p-4 sm:p-6 lg:p-8">
        <div className="space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h3 className="text-xl font-bold text-gray-900">🤝 Daftar Pengguna</h3>
                <p className="text-gray-600 mt-1">Temukan dan tambahkan teman baru di TaskSync</p>
              </div>
              <div className="relative w-full sm:w-auto">
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
                  placeholder="🔍 Cari pengguna..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="text-black pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {loading ? (
              // 🟨 Loading State: Skeleton Cards
              Array.from({ length: 8 }).map((_, index) => (
                <div
                  key={`skeleton-${index}`}
                  className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col items-center text-center animate-pulse">
                  <div className="w-20 h-20 bg-gray-200 rounded-full mb-4"></div>

                  <div className="h-5 bg-gray-200 rounded w-24 mb-2"></div>

                  <div className="h-4 bg-gray-200 rounded w-32 mb-4"></div>

                  <div className="h-9 bg-gray-200 rounded-lg w-36"></div>
                </div>
              ))
            ) : users.length > 0 ? (
              // ✅ Data tersedia
              users.map((user) => (
                <div
                  key={user.id}
                  className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col items-center text-center"
                >
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-400 rounded-full flex items-center justify-center text-white font-bold text-3xl mb-4">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-1">{user.name}</h4>
                  <p className="text-sm text-gray-600 mb-4">{user.email}</p>
                  <button
                    onClick={() => handleAddFriend(user.id)}
                    className={`flex items-center justify-center px-4 py-2 rounded-lg transition-colors duration-200 text-sm font-medium ${
                      user.isFriend
                        ? "bg-green-100 text-green-700 hover:bg-green-200"
                        : "bg-blue-600 text-white hover:bg-blue-700"
                    }`}
                  >
                    {user.isFriend ? (
                      <>
                        <UserCheck className="w-4 h-4 mr-2" />
                        <span>Teman</span>
                      </>
                    ) : (
                      <>
                        <UserPlus className="w-4 h-4 mr-2" />
                        <span>Tambahkan Teman</span>
                      </>
                    )}
                  </button>
                </div>
              ))
            ) : (
              // 🟡 Data kosong
              <div className="col-span-full text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-gray-500">Tidak ada pengguna ditemukan</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  );
}