import type React from "react"
import type { Metadata } from "next"
import "@/app/globals.css"
import SessionProviderWrapper from "@/components/SessionProviderWraper"
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
    <html lang="en">
      <body>
        <SessionProviderWrapper>
          <FlashMassage />
          {children}
        </SessionProviderWrapper>
      </body>
    </html>
  )
}

