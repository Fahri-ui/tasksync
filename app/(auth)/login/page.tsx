"use client";

import Link from "next/link"
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import LoaderSpinner from "@/components/loader-spinner";
import BaseAlert from "@/components/base-alert";
import { getSession } from "next-auth/react";

export default function Page(){
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [alert, setAlert] = useState({
    type: "",
    message: "",
    isShow: false
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    setIsLoading(true);

    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    if (res?.error) {
      console.log("Login error:", res.error);
      setAlert({
        type: "error",
        message: res.error,
        isShow: true
      });
      setIsLoading(false);
      return;
    }

    // ✅ Ambil session terbaru
    const session = await getSession();

    if (!session?.user) {
      console.error("Session not available after login");
      setAlert({
        type: "error",
        message: "Session error, please try again.",
        isShow: true,
      });
      setIsLoading(false);
      return;
    }

    console.log("✅ Session:", session);

    // ✅ Redirect sesuai role
    if (session.user.role === "ADMIN") {
      router.push("/admin/dashboard");
    } else {
      router.push("/user/dashboard");
    }

    setIsLoading(false);
  };

  return (
    <>
      <div className="bg-white/80 backdrop-blur-sm p-8 rounded-3xl shadow-2xl border border-white/50">
        <div className="space-y-6">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">MASUK</h2>
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
                required
              />
              <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                </svg>
              </div>
            </div>
          </div>

          <div>
            <label htmlFor="password" className="block mb-3 text-sm font-semibold text-gray-900">
              Password
            </label>
            <div className="relative">
              <input
                type="password"
                name="password"
                id="password"
                placeholder="masukan password"
                className="bg-gray-50/50 border border-gray-200 text-gray-900 text-sm rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent block w-full p-4 transition-all duration-300 placeholder-gray-500"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div className="text-right">
            <Link 
              href="/forgot-password" 
              className="text-sm text-blue-600 hover:text-blue-700 font-medium hover:underline transition-colors"
            >
              Lupa kata sandi?
            </Link>
          </div>

          <button
            type="button"
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-xl text-sm px-6 py-4 text-center flex items-center justify-center gap-3 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-[1.02] disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
            disabled={isLoading}
            onClick={handleLogin}
          >
            {isLoading ? (
              <>
                <LoaderSpinner />
                Memproses...
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                </svg>
                Masuk ke Akun Anda
              </>
            )}
          </button>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm"></div>
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-600">
              jika anda mengalami masalah, cobalah untuk muat ulang halaman
            </p>
            <br />
            <p className="text-sm text-gray-600">
              Belum memiliki akun?{" "}
              <Link 
                href="/register" 
                className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transition-all duration-300"
              >
                Daftar sekarang
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}