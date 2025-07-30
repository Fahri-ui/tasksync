"use client"

import { useEffect, useState } from "react"
import type React from "react"
import FlashMessage from "@/components/FlashMassage"

interface FlashMessageProps {
  // Props baru untuk menerima pesan secara langsung
  messageType?: "error" | "success" | null
  messageText?: string | null
}

export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <FlashMessage />
    </>
  )
}