"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SignIn() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState(1);
  const [isSending, setIsSending] = useState(false);
  const [emailError, setEmailError] = useState<string | null>(null);

  // ✅ Fungsi set cookie flash message agar bisa dibaca FlashMessage.tsx
  const setFlashMessage = (type: "flash_success" | "flash_error", message: string) => {
    document.cookie = `${type}=${encodeURIComponent(message)}; path=/; max-age=10`;
  };

  const sendOtp = async () => {
    setEmailError(null);
    if (!email) {
      setEmailError("Email tidak boleh kosong!");
      return;
    }
    // Validasi format email sederhana
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setEmailError("Format email tidak valid!");
      return;
    }

    setIsSending(true);

    const res = await fetch("/api/auth/send-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    setIsSending(false);

    if (res.ok) {
      // ✅ Kirim flash message sukses
      setFlashMessage("flash_success", "Kode OTP telah dikirim ke email Anda.");
      // ✅ Lanjut ke step 2
      setStep(2);
    } else {
      const data = await res.json();
      // Tangani error email tidak ditemukan
      if (data.message && data.message.toLowerCase().includes("not found")) {
        setEmailError("Email tidak ditemukan");
        return;
      }
      setFlashMessage("flash_error", data.message || "Gagal mengirim OTP");
      // Tetap di step 1
    }
  };

  const verifyOtp = async () => {
    if (!otp) {
      setFlashMessage("flash_error", "Masukkan kode OTP!");
      return;
    }

    const res = await fetch("/api/auth/verify-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, otp }),
    });

    const data = await res.json();

    if (res.ok) {
      // ✅ Berhasil verifikasi OTP
      setFlashMessage("flash_success", "Verifikasi berhasil! Silakan login.");
      // Redirect ke halaman login setelah beberapa saat (biar flash muncul dulu)
      setTimeout(() => {
        router.push("/login");
      }, 500);
    } else {
      // ✅ OTP salah atau expired
      setFlashMessage("flash_error", data.message || "OTP salah atau sudah kadaluarsa.");
      // Tetap di step 2
    }
  };

  return (
    <>
      <div className="bg-white/80 backdrop-blur-sm p-8 rounded-3xl shadow-2xl border border-white/50">
        {step === 1 && (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Verifikasi email</h2>
              <p className="text-gray-600">Kirim kan email anda untuk mendapatkan kode otp.</p>
            </div>

            <div>
              <label htmlFor="email" className="block mb-3 text-sm font-semibold text-gray-900">
                Alamat Email
              </label>
              <div className="relative">
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ketikan email disini"
                  className={`bg-gray-50/50 border ${emailError ? 'border-red-500' : 'border-gray-200'} text-gray-900 text-sm rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent block w-full p-4 transition-all duration-300 placeholder-gray-500`}
                />
                <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                  </svg>
                </div>
              </div>
              {emailError && (
                <p className="text-red-600 text-xs mt-2">{emailError}</p>
              )}
            </div>

            <button
              onClick={sendOtp}
              disabled={isSending}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-xl text-sm px-6 py-4 text-center flex items-center justify-center gap-3 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-[1.02] disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isSending ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Mengirim...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  Kirim OTP
                </>
              )}
            </button>

            <div className="bg-gradient-to-r from-green-50 to-blue-50 p-4 rounded-xl border border-green-200">
              <div className="flex items-start space-x-3">
                <div className="text-sm text-gray-700 ">
                  <p className="mb-2">Verifikasi email dengan kode otp</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Verifikasi OTP</h2>
              <p className="text-gray-600">
                Masukkan kode OTP yang sudah dikirim ke email{" "}
                <span className="font-semibold text-blue-600">{email}</span>
              </p>
            </div>

            <div>
              <label htmlFor="otp" className="block mb-3 text-sm font-semibold text-gray-900">
                Kode OTP
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="otp"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="Masukkan 6 digit kode OTP"
                  className="bg-gray-50/50 border border-gray-200 text-gray-900 text-lg rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent block w-full p-4 text-center font-mono tracking-widest transition-all duration-300 placeholder-gray-500"
                  maxLength={6}
                />
                <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m0 0a2 2 0 012 2 2 2 0 01-2 2m-2-4a2 2 0 00-2-2m0 0a2 2 0 00-2 2m0 0V9a2 2 0 012-2 2 2 0 012 2v1.13M9 13h6" />
                  </svg>
                </div>
              </div>
            </div>

            <button
              onClick={verifyOtp}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-xl text-sm px-6 py-4 text-center flex items-center justify-center gap-3 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Verifikasi OTP
            </button>

            <div className="text-center">
              <button
                onClick={() => setStep(1)}
                className="text-sm text-gray-600 hover:text-blue-600 font-medium transition-colors"
              >
                ← Kembali ke input email
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}