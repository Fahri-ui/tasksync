"use client"

import { useEffect, useState } from "react"
import { usePathname } from "next/navigation" // Import usePathname

export default function FlashMessage() {
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [showError, setShowError] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const pathname = usePathname() // Get the current pathname

  const getCookie = (name: string) => {
    const value = `; ${document.cookie}`
    const parts = value.split(`; ${name}=`)
    if (parts.length === 2) return decodeURIComponent(parts.pop()!.split(";").shift()!)
    return null
  }

  useEffect(() => {
    // Reset states before checking for new cookies
    setErrorMessage(null)
    setSuccessMessage(null)
    setShowError(false)
    setShowSuccess(false)

    const flashError = getCookie("flash_error")
    const flashSuccess = getCookie("flash_success")

    if (flashError) {
      setErrorMessage(flashError)
      setShowError(true)
      const timer = setTimeout(() => setShowError(false), 6000)
      document.cookie = "flash_error=; path=/; max-age=0" // Clear the cookie
      return () => clearTimeout(timer)
    }

    if (flashSuccess) {
      setSuccessMessage(flashSuccess)
      setShowSuccess(true)
      const timer = setTimeout(() => setShowSuccess(false), 6000)
      document.cookie = "flash_success=; path=/; max-age=0" // Clear the cookie
      return () => clearTimeout(timer)
    }
  }, [pathname]) // Add pathname to dependency array

  // Only render the container if there's a message to show and it's currently visible
  if (!showError && !showSuccess) return null

  return (
    <div className="fixed top-4 right-4 z-50 space-y-3">
      {showSuccess && successMessage && (
        <div
          className={`transition-all duration-500 ease-in-out transform p-4 rounded-lg shadow-lg text-white bg-green-500 ${
            showSuccess ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
          }`}
          aria-live="polite"
        >
          <strong>Sukses! </strong> {successMessage}
        </div>
      )}
      {showError && errorMessage && (
        <div
          className={`transition-all duration-500 ease-in-out transform p-4 rounded-lg shadow-lg text-white bg-red-500 ${
            showError ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
          }`}
          aria-live="polite"
        >
          <strong>Error! </strong> {errorMessage}
        </div>
      )}
    </div>
  )
}
