import type { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import prisma from "@/lib/prisma"
import bcrypt from "bcryptjs"

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) {
          return null
        }

        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email,
          },
        })

        if (!user || !user.password) {
          return null
        }

        const isPasswordValid = await bcrypt.compare(credentials.password, user.password)

        if (!isPasswordValid) {
          return null
        }

        // Jika kredensial valid, kembalikan objek pengguna.
        // Objek ini akan tersedia di sesi.
        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role, // Sertakan peran pengguna
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = (user as any).role // Tambahkan peran ke token
      }
      return token
    },
    async session({ session, token }) {
      if (token.id) {
        session.user.id = token.id as string
      }
      if (token.role) {
        session.user.role = token.role as string // Tambahkan peran ke sesi
      }
      return session
    },
  },
  pages: {
    signIn: "/login", // Halaman login kustom Anda
  },
  secret: process.env.NEXTAUTH_SECRET,
}
