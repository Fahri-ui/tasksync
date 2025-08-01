import Link from "next/link"
import { Button } from "@/components/ui/button"
import Image from "next/image"

export default function Navigation() {
  return (
    <nav className="flex items-center justify-between px-4 sm:px-6 lg:px-8 py-4 shadow-lg sticky top-0 bg-white/95 backdrop-blur-sm z-50 border-b border-gray-100">
      <div className="flex items-center space-x-3">
        <div className="relative">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
            <Image
              src="/image/landing/favicon.png"
              alt="Tim Kolaborasi TaskSync"
              width={500}
              height={500}
              className="w-6 h-6 text-white"
            />
          </div>
        </div>
        
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transition-all duration-300">
            TaskSync
          </h1>
          <div className="hidden sm:block w-16 h-0.5 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-full mt-0.5"></div>
        </div>
      </div>

      <div className="hidden md:flex items-center space-x-8">
        <Link 
          href="#beranda" 
          className="relative text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors duration-300 group"
        >
          Beranda
          <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-indigo-600 group-hover:w-full transition-all duration-300"></span>
        </Link>
        <Link 
          href="#about" 
          className="relative text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors duration-300 group"
        >
          Tentang
          <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-indigo-600 group-hover:w-full transition-all duration-300"></span>
        </Link>
        <Link 
          href="#features" 
          className="relative text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors duration-300 group"
        >
          Fitur
          <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-indigo-600 group-hover:w-full transition-all duration-300"></span>
        </Link>
        
        <div className="flex items-center space-x-3">
          <Link 
            href="/login" 
            className="text-sm font-medium text-blue-600 hover:text-blue-700 px-4 py-2 rounded-full border border-blue-200 hover:border-blue-300 hover:bg-blue-50 transition-all duration-300"
          >
            Masuk
          </Link>
          <Link 
            href="/register" 
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            Daftar
          </Link>
        </div>
      </div>

      <div className="md:hidden">
        <Button 
          variant="ghost" 
          size="sm" 
          className="w-10 h-10 rounded-xl hover:bg-gradient-to-br hover:from-blue-50 hover:to-indigo-50 hover:text-blue-600 transition-all duration-300"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </Button>
      </div>
    </nav>
  )
}