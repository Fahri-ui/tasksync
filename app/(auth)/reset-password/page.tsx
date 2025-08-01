"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import LoaderSpinner from "@/components/loader-spinner"
import BaseAlert from "@/components/base-alert"

export default function ResetPasswordPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [alert, setAlert] = useState({
    type: "",
    message: "",
    isShow: false,
  })
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  useEffect(() => {
    // Ambil email dari sessionStorage
    const resetEmail = sessionStorage.getItem("reset_email")

    if (!resetEmail) {
      // Jika tidak ada email, redirect ke forgot-password
      setAlert({
        type: "error",
        message: "Sesi telah berakhir. Silakan mulai dari halaman lupa password.",
        isShow: true,
      })

      setTimeout(() => {
        router.push("/forgot-password")
      }, 2000)
      return
    }

    setEmail(resetEmail)
  }, [router])

  const validatePassword = (password: string) => {
    if (password.length < 6) {
      return "Password minimal 6 karakter"
    }
    return null
  }

  const handleResetPassword = async () => {
    if (!email) {
      setAlert({
        type: "error",
        message: "Email tidak ditemukan. Silakan mulai dari halaman lupa password.",
        isShow: true,
      })
      return
    }

    if (!password || !confirmPassword) {
      setAlert({
        type: "error",
        message: "Semua field harus diisi",
        isShow: true,
      })
      return
    }

    const passwordError = validatePassword(password)
    if (passwordError) {
      setAlert({
        type: "error",
        message: passwordError,
        isShow: true,
      })
      return
    }

    if (password !== confirmPassword) {
      setAlert({
        type: "error",
        message: "Password dan konfirmasi password tidak sama",
        isShow: true,
      })
      return
    }

    setIsLoading(true)
    setAlert({ type: "", message: "", isShow: false })

    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Terjadi kesalahan")
      }

      // Hapus email dari sessionStorage
      sessionStorage.removeItem("reset_email")

      setAlert({
        type: "success",
        message: "Password berhasil direset! Anda akan diarahkan ke halaman login.",
        isShow: true,
      })

      setTimeout(() => {
        router.push("/login")
      }, 2000)
    } catch (error) {
      const message = error instanceof Error ? error.message : "Terjadi kesalahan, silakan coba lagi";
      setAlert({
        type: "error",
        message,
        isShow: true,
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Jika email belum ada, tampilkan loading
  if (!email) {
    return (
      <div className="bg-white/80 backdrop-blur-sm p-8 rounded-3xl shadow-2xl border border-white/50">
        <div className="flex items-center justify-center py-12">
          <LoaderSpinner />
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white/80 backdrop-blur-sm p-8 rounded-3xl shadow-2xl border border-white/50">
      <div className="space-y-6">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">RESET PASSWORD</h2>
          <p className="text-gray-600 text-sm">
            Masukkan password baru untuk akun: <span className="font-semibold text-blue-600">{email}</span>
          </p>
        </div>

        {alert.isShow && (
          <div className="mb-6">
            <BaseAlert alert={alert} />
          </div>
        )}

        <div>
          <label htmlFor="password" className="block mb-3 text-sm font-semibold text-gray-900">
            Password Baru
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              id="password"
              className="bg-gray-50/50 border border-gray-200 text-gray-900 text-sm rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent block w-full p-4 pr-12 transition-all duration-300 placeholder-gray-500"
              placeholder="masukan password baru"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-4 flex items-center"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
                  />
                </svg>
              ) : (
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>

        <div>
          <label htmlFor="confirmPassword" className="block mb-3 text-sm font-semibold text-gray-900">
            Konfirmasi Password
          </label>
          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              id="confirmPassword"
              className="bg-gray-50/50 border border-gray-200 text-gray-900 text-sm rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent block w-full p-4 pr-12 transition-all duration-300 placeholder-gray-500"
              placeholder="konfirmasi password baru"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleResetPassword()}
              required
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-4 flex items-center"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? (
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
                  />
                </svg>
              ) : (
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>

        <button
          type="button"
          className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-xl text-sm px-6 py-4 text-center flex items-center justify-center gap-3 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-[1.02] disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
          disabled={isLoading}
          onClick={handleResetPassword}
        >
          {isLoading ? (
            <>
              <LoaderSpinner />
              Memproses...
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
              Reset Password
            </>
          )}
        </button>

        <div className="text-center space-y-2">
          <button
            onClick={() => {
              sessionStorage.removeItem("reset_email")
              router.push("/forgot-password")
            }}
            className="text-sm text-gray-500 hover:text-blue-600 transition-colors"
          >
            Ganti Email
          </button>

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