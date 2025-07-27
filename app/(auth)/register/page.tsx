"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

import LoaderSpinner from "@/components/loader-spinner";
import BaseAlert from "@/components/base-alert";

export default function Page() {
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [registerName, setRegisterName] = useState("");
  const [registerNomor, setRegisterNomor] = useState("");
  const [registerGender, setRegisterGender] = useState("LAKI_LAKI");
  const [registerTanggalLahir, setRegisterTanggalLahir] = useState("");
  const [alert, setAlert] = useState({
    type: "",
    message: "",
    isShow: false,
  });
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  const handleRegister = async () => {
    if (!registerEmail || !registerPassword || !registerName || !registerNomor || !registerTanggalLahir) {
      setAlert({
        type: "error",
        message: "Mohon lengkapi semua data yang diperlukan!",
        isShow: true,
      });
      return;
    }

    setIsLoading(true);

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: registerEmail,
        password: registerPassword,
        name: registerName,
        nomor: registerNomor,
        gender: registerGender,
        tanggal_lahir: registerTanggalLahir,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      const data = await res.json();
      setAlert({ type: "error", message: data.error, isShow: true });
    } else {
      router.push("/verify");
    }
    
    setIsLoading(false);
  };

  return (
    <>
      <div className="bg-white/80 backdrop-blur-sm p-8 rounded-3xl shadow-2xl border border-white/50">
        <div className="space-y-6">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Registrasi</h2>
          </div>

          {alert.isShow && (
            <div className="mb-6">
              <BaseAlert alert={{ type: alert.type, message: alert.message }} />
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label htmlFor="name" className="block mb-3 text-sm font-semibold text-gray-900">
                Nama Lengkap
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="name"
                  className="bg-gray-50/50 border border-gray-200 text-gray-900 text-sm rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent block w-full p-4 transition-all duration-300 placeholder-gray-500"
                  placeholder="Masukkan nama lengkap Anda"
                  value={registerName}
                  onChange={(e) => setRegisterName(e.target.value)}
                  required
                />
                <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="md:col-span-2">
              <label htmlFor="email" className="block mb-3 text-sm font-semibold text-gray-900">
                Alamat Email
              </label>
              <div className="relative">
                <input
                  type="email"
                  id="email"
                  className="bg-gray-50/50 border border-gray-200 text-gray-900 text-sm rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent block w-full p-4 transition-all duration-300 placeholder-gray-500"
                  placeholder="Masukan email Anda"
                  value={registerEmail}
                  onChange={(e) => setRegisterEmail(e.target.value)}
                  required
                />
                <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="md:col-span-2">
              <label htmlFor="password" className="block mb-3 text-sm font-semibold text-gray-900">
                Kata Sandi
              </label>
              <div className="relative">
                <input
                  type="password"
                  id="password"
                  placeholder="Masukan passward anda"
                  className="bg-gray-50/50 border border-gray-200 text-gray-900 text-sm rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent block w-full p-4 transition-all duration-300 placeholder-gray-500"
                  value={registerPassword}
                  onChange={(e) => setRegisterPassword(e.target.value)}
                  required
                />
                <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
                </div>
              </div>
            </div>

            <div>
              <label htmlFor="nomor" className="block mb-3 text-sm font-semibold text-gray-900">
                Nomor Telepon
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="nomor"
                  className="bg-gray-50/50 border border-gray-200 text-gray-900 text-sm rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent block w-full p-4 transition-all duration-300 placeholder-gray-500"
                  placeholder="Masukkan nomor telepon Anda"
                  value={registerNomor}
                  onChange={(e) => setRegisterNomor(e.target.value)}
                  required
                />
                <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
                </div>
              </div>
            </div>

            <div>
              <label htmlFor="gender" className="block mb-3 text-sm font-semibold text-gray-900">
                Jenis Kelamin
              </label>
              <div className="relative">
                <select
                  id="gender"
                  className="bg-gray-50/50 border border-gray-200 text-gray-900 text-sm rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent block w-full p-4 transition-all duration-300 appearance-none"
                  value={registerGender}
                  onChange={(e) => setRegisterGender(e.target.value)}
                >
                  <option value="LAKI_LAKI">Laki-laki</option>
                  <option value="PEREMPUAN">Perempuan</option>
                </select>
                <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                </div>
              </div>
            </div>

            <div className="md:col-span-2">
              <label htmlFor="tanggal_lahir" className="block mb-3 text-sm font-semibold text-gray-900">
                Tanggal Lahir
              </label>
              <div className="relative">
                <input
                  type="date"
                  id="tanggal_lahir"
                  className="bg-gray-50/50 border border-gray-200 text-gray-900 text-sm rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent block w-full p-4 transition-all duration-300"
                  value={registerTanggalLahir}
                  onChange={(e) => setRegisterTanggalLahir(e.target.value)}
                  required
                />
                <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={handleRegister}
            type="button"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-xl text-sm px-6 py-4 text-center flex items-center justify-center gap-3 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-[1.02] disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none mt-6"
          >
            {isLoading ? (
              <>
                <LoaderSpinner />
                Memproses Registrasi...
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
                Buat Akun Sekarang
              </>
            )}
          </button>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-500 font-medium">atau</span>
            </div>
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-600">
              Sudah memiliki akun?{" "}
              <Link 
                href="/login" 
                className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transition-all duration-300"
              >
                Masuk di sini
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}