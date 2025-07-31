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
        <CreateProjectForm />
      </main>
    </>
  )
}
