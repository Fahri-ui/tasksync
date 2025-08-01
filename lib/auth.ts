import type { NextAuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import prisma from "@/lib/prisma" // Tetap diperlukan untuk operasi database langsung

export const authOptions: NextAuthOptions = {
  // PrismaAdapter tidak digunakan lagi
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  session: {
    strategy: "jwt", // Menggunakan strategi JWT untuk sesi
    maxAge: 30 * 24 * 60 * 60, // Sesi berlaku selama 30 hari
  },
  jwt: {
    // Anda bisa menambahkan fungsi encode/decode kustom di sini jika diperlukan.
    // Untuk sebagian besar kasus, default sudah cukup.
  },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async jwt({ token, user, account, profile }) {
      // 'user' object hanya tersedia saat sign-in pertama kali atau setelah refresh token
      // 'profile' object hanya tersedia saat sign-in pertama kali
      // 'account' object hanya tersedia saat sign-in pertama kali

      // Jika pengguna baru saja login (user object ada)
      if (user) {
        // Pastikan user.id dari database ada di token
        // Jika menggunakan CredentialsProvider, user.id akan langsung dari database.
        // Jika menggunakan OAuth (Google), kita perlu memastikan user ini ada di DB kita.
        let dbUser = await prisma.user.findUnique({
          where: { email: user.email! },
          select: { id: true },
        })

        if (!dbUser) {
          // Jika pengguna OAuth belum ada di database kita, buat entri baru
          dbUser = await prisma.user.create({
            data: {
              email: user.email!,
              name: user.name || "Pengguna Baru",
              // Anda bisa menambahkan default role atau data lain di sini
              role: "USER",
              verifiedAt: new Date(), // Asumsi terverifikasi saat login OAuth
            },
          })
        }
        token.id = dbUser.id // Tambahkan ID pengguna dari database ke token
      } else if (token.email && !token.id) {
        // Jika token sudah ada (misalnya, setelah refresh halaman) tetapi ID belum ada,
        // coba ambil ID dari database menggunakan email
        const dbUser = await prisma.user.findUnique({
          where: { email: token.email },
          select: { id: true },
        })
        if (dbUser) {
          token.id = dbUser.id
        }
      }
      return token
    },
    async session({ session, token }) {
      // Kirim properti ke klien, seperti ID pengguna dari JWT
      if (token.id) {
        session.user!.id = token.id as string
      }
      return session
    },
    // Callback signIn ini akan memastikan pengguna OAuth disimpan ke database Anda
    async signIn({ user, account, profile }) {
      if (account?.provider === "google") {
        // Cek apakah pengguna sudah ada di database Anda berdasarkan email
        let existingUser = await prisma.user.findUnique({
          where: { email: user.email! },
        })

        if (!existingUser) {
          // Jika belum ada, buat pengguna baru di database Anda
          existingUser = await prisma.user.create({
            data: {
              email: user.email!,
              name: user.name || "Pengguna Baru",
              role: "USER", // Set default role
              verifiedAt: new Date(), // Asumsi terverifikasi saat login OAuth
            },
          })
        }
        // Penting: Pastikan objek 'user' yang diteruskan ke callback JWT memiliki ID dari database
        user.id = existingUser.id
      }
      return true // Izinkan proses sign in berlanjut
    },
  },
}
