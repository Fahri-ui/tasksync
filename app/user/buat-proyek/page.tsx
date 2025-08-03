"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { UserHeader } from "@/components/user/header"
import { CreateProjectForm } from "@/components/project/create-project-form"

export default function BuatProyekPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  return (
    <>
      <UserHeader title="Buat Proyek Baru" />

      <main className="p-4 sm:p-6 lg:p-8">
        <div className="mb-6">
          <div className="bg-yellow-50 border-l-4 border-yellow-400 rounded-xl p-4 shadow-sm">
            <h4 className="font-semibold text-yellow-700 mb-2">Perhatian</h4>
            <p className="text-sm text-yellow-800">
              Anggota proyek akan otomatis ditambahkan saat tugas pertama kali dibagikan setelah proyek dibuat.<br />
              Pastikan setiap anggota proyek telah menerima tugas yang sesuai.<br />
              Setelah proyek dibuat, daftar anggota proyek tidak dapat diubah.
            </p>
          </div>
        </div>
        <CreateProjectForm />
      </main>
    </>
  )
}
