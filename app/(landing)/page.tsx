import Image from "next/image"
import Link from "next/link"

export default function HomePage() {
  const features = [
    {
      icon: "✅",
      title: "Manajemen Tugas",
      description:
        "Buat, ubah, dan centang tugas dengan mudah. Organisir pekerjaan tim dengan sistem yang intuitif dan powerful.",
      color: "from-blue-500 to-blue-600",
    },
    {
      icon: "👥",
      title: "Kolaborasi Tim",
      description: "Tambahkan anggota dan atur peran per proyek. Komunikasi yang efektif untuk hasil maksimal.",
      color: "from-indigo-500 to-indigo-600",
    },
    {
      icon: "📅",
      title: "Deadline Jelas",
      description: "Atur deadline untuk proyek dan tiap tugas. Pantau progres dengan timeline yang mudah dipahami.",
      color: "from-purple-500 to-purple-600",
    },
    {
      icon: "🔐",
      title: "Akses Aman",
      description: "Kontrol akses berdasarkan peran. Keamanan data terjamin dengan sistem autentikasi multi-role.",
      color: "from-pink-500 to-pink-600",
    },
  ]

  return (
    <div className="min-h-screen">
      <section className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 sm:w-72 md:w-96 h-48 sm:h-72 md:h-96 bg-blue-200 rounded-full -translate-y-24 sm:-translate-y-36 md:-translate-y-48 translate-x-24 sm:translate-x-36 md:translate-x-48 opacity-30"></div>
        <div className="absolute bottom-0 left-0 w-40 sm:w-60 md:w-80 h-40 sm:h-60 md:h-80 bg-indigo-200 rounded-full translate-y-20 sm:translate-y-30 md:translate-y-40 -translate-x-20 sm:-translate-x-30 md:-translate-x-40 opacity-20"></div>
        
        <div className="max-w-7xl mx-auto w-full">
          <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-center">
            <div className="order-1 lg:order-2 relative">
              <div className="relative z-10 mx-auto max-w-md sm:max-w-lg lg:max-w-none">
                <Image
                  src="/image/landing/s1-lndg.png"
                  alt="TaskSync Dashboard Preview"
                  width={600}
                  height={500}
                  className="w-full h-auto rounded-2xl sm:rounded-3xl"
                  priority
                />
              </div>
              
              <div className="absolute -top-3 -right-3 sm:-top-6 sm:-right-6 w-16 sm:w-20 md:w-24 h-16 sm:h-20 md:h-24 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl sm:rounded-2xl flex items-center justify-center text-white text-xl sm:text-2xl md:text-3xl shadow-xl rotate-12 hover:rotate-0 transition-transform duration-300">
                ✅
              </div>
              <div className="absolute -bottom-3 -left-3 sm:-bottom-6 sm:-left-6 w-14 sm:w-16 md:w-20 h-14 sm:h-16 md:h-20 bg-white rounded-xl sm:rounded-2xl flex items-center justify-center text-blue-500 text-lg sm:text-xl md:text-2xl shadow-xl border-2 border-blue-100 -rotate-12 hover:rotate-0 transition-transform duration-300">
                👥
              </div>
              <div className="absolute top-1/2 -left-4 sm:-left-6 md:-left-8 w-12 sm:w-14 md:w-16 h-12 sm:h-14 md:h-16 bg-gradient-to-br from-indigo-400 to-indigo-500 rounded-full flex items-center justify-center text-white text-base sm:text-lg md:text-xl shadow-lg">
                📅
              </div>
            </div>

            <div className="order-2 lg:order-1 text-center lg:text-left px-4 sm:px-0">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-gray-900 mb-4 sm:mb-6 leading-tight">
                TASK
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">SYNC</span>
              </h1>
              <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-600 mb-6 sm:mb-8 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                Kelola Tugas Tim Tanpa Ribet. Tingkatkan produktivitas tim dengan manajemen proyek yang
                <span className="text-blue-600 font-semibold"> sederhana dan efektif</span>.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="about" className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 sm:mb-6">
              Tentang{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">TaskSync</span>
            </h2>
            <div className="w-16 sm:w-24 h-1 bg-gradient-to-r from-blue-600 to-indigo-600 mx-auto rounded-full"></div>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-center mb-12 sm:mb-16">
            <div className="space-y-4 sm:space-y-6">
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 sm:p-8 rounded-2xl sm:rounded-3xl border border-blue-100">
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4 flex items-center">
                  <span className="w-2 sm:w-3 h-2 sm:h-3 bg-blue-600 rounded-full mr-2 sm:mr-3"></span>
                  Solusi Manajemen Modern
                </h3>
                <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                  TaskSync adalah aplikasi manajemen tugas berbasis web yang dirancang untuk membantu tim mengatur proyek
                  secara efisien dan profesional dengan pendekatan yang user-friendly.
                </p>
              </div>

              <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-6 sm:p-8 rounded-2xl sm:rounded-3xl border border-indigo-100">
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4 flex items-center">
                  <span className="w-2 sm:w-3 h-2 sm:h-3 bg-indigo-600 rounded-full mr-2 sm:mr-3"></span>
                  Multi-Role System
                </h3>
                <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                  Sistem autentikasi dengan dua role utama, <strong>Admin</strong> dan <strong>User</strong>. 
                  Setelah login, User dapat memiliki peran berbeda di setiap proyek, seperti <strong>Manager</strong> 
                  yang mengatur proyek dan merekrut anggota, atau <strong>Anggota</strong> yang hanya fokus 
                  menyelesaikan tugas yang diberikan.
                </p>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 sm:p-8 rounded-2xl sm:rounded-3xl border border-purple-100">
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4 flex items-center">
                  <span className="w-2 sm:w-3 h-2 sm:h-3 bg-purple-600 rounded-full mr-2 sm:mr-3"></span>
                  Untuk Semua Tim
                </h3>
                <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                  Cocok untuk tim kecil, startup, organisasi, atau mahasiswa yang ingin mengelola pekerjaan bersama dengan
                  efisien tanpa kompleksitas yang berlebihan.
                </p>
              </div>
            </div>

            <div className="relative order-first lg:order-last">
              <div className="relative z-10 mx-auto max-w-md sm:max-w-lg lg:max-w-none">
                <Image
                  src="/image/landing/s2-lndg.png"
                  alt="Tim Kolaborasi TaskSync"
                  width={500}
                  height={500}
                  className="w-full h-auto rounded-2xl sm:rounded-3xl"
                />
              </div>

              <div className="absolute -top-4 -left-4 sm:-top-6 sm:-left-6 md:-top-8 md:-left-8 w-16 sm:w-24 md:w-32 h-16 sm:h-24 md:h-32 bg-gradient-to-br from-blue-200 to-indigo-200 rounded-2xl sm:rounded-3xl opacity-60 -rotate-12"></div>
              <div className="absolute -bottom-4 -right-4 sm:-bottom-6 sm:-right-6 md:-bottom-8 md:-right-8 w-12 sm:w-18 md:w-24 h-12 sm:h-18 md:h-24 bg-gradient-to-br from-indigo-200 to-purple-200 rounded-xl sm:rounded-2xl opacity-60 rotate-12"></div>

              <div className="absolute -bottom-3 -left-3 sm:-bottom-4 sm:-left-4 md:-bottom-6 md:-left-6 bg-white p-4 sm:p-6 rounded-xl sm:rounded-2xl shadow-xl border border-gray-100">
                <div className="flex items-center space-x-2 sm:space-x-4">
                  <div className="w-8 sm:w-10 md:w-12 h-8 sm:h-10 md:h-12 bg-gradient-to-br from-green-400 to-green-500 rounded-lg sm:rounded-xl flex items-center justify-center text-white text-base sm:text-lg md:text-xl">
                    📈
                  </div>
                  <div>
                    <div className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900">85%</div>
                    <div className="text-xs sm:text-sm text-gray-600">Peningkatan Produktivitas</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 sm:mb-6">
              Fitur{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Unggulan</span>
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Semua yang Anda butuhkan untuk mengelola proyek tim dengan efisien, profesional, dan tanpa ribet
            </p>
            <div className="w-16 sm:w-24 h-1 bg-gradient-to-r from-blue-600 to-indigo-600 mx-auto rounded-full mt-4 sm:mt-6"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 mb-12 sm:mb-16">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white p-6 sm:p-8 rounded-2xl sm:rounded-3xl shadow-lg transition-all duration-300 border border-gray-100"
              >
                <div
                  className={`w-12 sm:w-14 md:w-16 h-12 sm:h-14 md:h-16 bg-gradient-to-br ${feature.color} rounded-xl sm:rounded-2xl flex items-center justify-center text-white text-xl sm:text-2xl mb-4 sm:mb-6`}
                >
                  {feature.icon}
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">
                  {feature.title}
                </h3>
                <p className="text-sm sm:text-base text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="bg-gray-900 text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
            <div className="col-span-1 sm:col-span-2 md:col-span-2">
              <h3 className="text-xl sm:text-2xl font-bold text-blue-400 mb-3 sm:mb-4">TaskSync</h3>
              <p className="text-sm sm:text-base text-gray-300 mb-3 sm:mb-4 max-w-md">
                Solusi manajemen tugas terbaik untuk tim modern. Tingkatkan produktivitas dan kolaborasi dengan TaskSync.
              </p>
            </div>

            <div>
              <h4 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Navigasi</h4>
              <ul className="space-y-2 text-sm sm:text-base text-gray-300">
                <li>
                <Link href="#beranda" className="hover:text-blue-400 transition-colors">
                  Beranda
                </Link>
              </li>
              <li>
                <Link href="#about" className="hover:text-blue-400 transition-colors">
                  Tentang
                </Link>
              </li>
              <li>
                <Link href="#features" className="hover:text-blue-400 transition-colors">
                  Fitur
                </Link>
              </li>
              </ul>
            </div>

            <div>
              <h4 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Aksi Cepat</h4>
              <ul className="space-y-2 text-sm sm:text-base text-gray-300">
                <li>
                  <Link href="/login" className="hover:text-blue-400 transition-colors">
                    Masuk
                  </Link>
                </li>
                <li>
                  <Link href="/register" className="hover:text-blue-400 transition-colors">
                    Daftar
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-6 sm:mt-8 pt-6 sm:pt-8 text-center text-sm sm:text-base text-gray-400">
            <p>&copy; {new Date().getFullYear()} TaskSync. Dibuat dengan ❤️ oleh Fahri.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}