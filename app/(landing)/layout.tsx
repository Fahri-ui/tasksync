import type React from "react"
import type { Metadata } from "next"
import "@/app/globals.css"
import Navigation from "@/components/navigation"
import FlashMassage from "@/components/FlashMassage"

export const metadata: Metadata = {
  title: "TaskSync",
  description: "Aplikasi manajemen tugas berbasis web untuk membantu tim mengatur proyek secara efisien",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <Navigation />
      <FlashMassage />
      <main>{children}</main>
    </>
  )
}