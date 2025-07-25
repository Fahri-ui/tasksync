import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function Navigation() {
  return (
    <nav className="flex items-center justify-between px-6 py-4 shadow-md sticky top-0 bg-white z-50 border-b">
      <p className="text-2xl font-bold text-blue-600 hover:text-blue-700 transition-colors">
        TaskSync
      </p>
      <div className="hidden md:flex items-center space-x-6">
        <Link href="#beranda" className="text-sm text-gray-700 hover:text-blue-600 transition-colors">
          Beranda
        </Link>
        <Link href="#about" className="text-sm text-gray-700 hover:text-blue-600 transition-colors">
          Tentang
        </Link>
        <Link href="#features" className="text-sm text-gray-700 hover:text-blue-600 transition-colors">
          Fitur
        </Link>
        <Link href="/login" className="text-sm text-blue-600 font-semibold hover:text-blue-700 transition-colors">
          Login
        </Link>
        <Link href="/register" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full text-sm transition-colors">
          Register
        </Link>
      </div>

      {/* Mobile menu button */}
      <div className="md:hidden">
        <Button variant="ghost" size="sm">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </Button>
      </div>
    </nav>
  )
}
