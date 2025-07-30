"use client"

import { useEffect, useState } from "react"
import Link from "next/link"

export default function NotFound() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleGoBack = () => {
    if (window.history.length > 1) {
      window.history.back()
    } else {

      window.location.href = "/"
    }
  }

  if (!mounted) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        <div className="relative mb-8">
          <div className="text-8xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 animate-pulse">
            404
          </div>
          <div className="absolute -top-4 -right-4 w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center animate-bounce">
            <span className="text-2xl">😵</span>
          </div>
        </div>

        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">🔍 Halaman Tidak Ditemukan</h1>
          <p className="text-gray-600 mb-2">
            Oops! Sepertinya halaman yang Anda cari tidak ada atau telah dipindahkan.
          </p>
          <p className="text-sm text-gray-500">
            Mungkin ada kesalahan pengetikan di URL atau halaman sudah tidak tersedia lagi.
          </p>
        </div>

        <div className="space-y-4">
          <button
            onClick={handleGoBack}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-6 rounded-xl font-medium hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span>Kembali ke Halaman Sebelumnya</span>
          </button>
        </div>

        <div className="mt-8 p-4 bg-white/50 backdrop-blur-sm rounded-xl border border-white/20">
          <p className="text-sm text-gray-600 mb-2">
            <span className="font-medium">💡 Tips:</span> Pastikan URL yang Anda masukkan sudah benar
          </p>
          <p className="text-xs text-gray-500">Jika masalah terus berlanjut, silakan hubungi administrator sistem</p>
        </div>

        <div className="fixed top-10 left-10 w-20 h-20 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full animate-pulse"></div>
        <div className="fixed top-20 right-20 w-16 h-16 bg-gradient-to-br from-pink-400/20 to-yellow-400/20 rounded-full animate-bounce"></div>
        <div className="fixed bottom-20 left-20 w-12 h-12 bg-gradient-to-br from-green-400/20 to-blue-400/20 rounded-full animate-ping"></div>
        <div className="fixed bottom-10 right-10 w-24 h-24 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full animate-pulse"></div>
      </div>
    </div>
  )
}
