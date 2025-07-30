"use client"

import Link from "next/link"
import { useState } from "react"
import { useRouter } from "next/navigation"
import LoaderSpinner from "@/components/loader-spinner"
import BaseAlert from "@/components/base-alert"

export default function ForgotPasswordPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [alert, setAlert] = useState({
    type: "",
    message: "",
    isShow: false,
  })
  const [isLoading, setIsLoading] = useState(false)

  const handleForgotPassword = async () => {
    if (!email) {
      setAlert({
        type: "error",
        message: "Email harus diisi",
        isShow: true,
      })
      return
    }

    // Validasi format email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      setAlert({
        type: "error",
        message: "Format email tidak valid",
        isShow: true,
      })
      return
    }

    setIsLoading(true)
    setAlert({ type: "", message: "", isShow: false })

    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Terjadi kesalahan")
      }

      // Simpan email ke sessionStorage untuk digunakan di halaman reset-password
      sessionStorage.setItem("reset_email", email)

      // Redirect ke halaman reset password
      router.push("/reset-password")
    } catch (error: any) {
      setAlert({
        type: "error",
        message: error.message || "Terjadi kesalahan, silakan coba lagi",
        isShow: true,
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="bg-white/80 backdrop-blur-sm p-8 rounded-3xl shadow-2xl border border-white/50">
      <div className="space-y-6">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">LUPA PASSWORD</h2>
          <p className="text-gray-600 text-sm">Masukkan email Anda untuk melanjutkan ke halaman reset password</p>
        </div>

        {alert.isShow && (
          <div className="mb-6">
            <BaseAlert alert={alert} />
          </div>
        )}

        <div>
          <label htmlFor="email" className="block mb-3 text-sm font-semibold text-gray-900">
            Alamat Email
          </label>
          <div className="relative">
            <input
              type="email"
              name="email"
              id="email"
              className="bg-gray-50/50 border border-gray-200 text-gray-900 text-sm rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent block w-full p-4 transition-all duration-300 placeholder-gray-500"
              placeholder="masukan alamat email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleForgotPassword()}
              required
            />
            <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                />
              </svg>
            </div>
          </div>
        </div>

        <button
          type="button"
          className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-xl text-sm px-6 py-4 text-center flex items-center justify-center gap-3 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-[1.02] disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
          disabled={isLoading}
          onClick={handleForgotPassword}
        >
          {isLoading ? (
            <>
              <LoaderSpinner />
              Memverifikasi...
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
              Lanjutkan Reset Password
            </>
          )}
        </button>

        <div className="text-center">
          <p className="text-sm text-gray-600">
            Ingat password Anda?{" "}
            <Link
              href="/login"
              className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transition-all duration-300"
            >
              Kembali ke Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}