import NextAuth from "next-auth";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import { z } from "zod";
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const prisma = new PrismaClient();

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // ✅ Buat schema validasi
        const schema = z.object({
          email: z.string().email({ message: "Format email tidak valid" }),
          password: z.string().min(6, { message: "Kata sandi minimal 6 karakter" }),
        });

        try {
          // ✅ Validasi Zod (kalau gagal akan masuk ke catch)
          const { email, password } = schema.parse(credentials);

          const user = await prisma.user.findUnique({ where: { email } });

          if (!user) throw new Error("Pengguna tidak ditemukan");
          if (!user.password) throw new Error("Password belum disetel");
          if (!user.verifiedAt) throw new Error("Akun belum diverifikasi");

          const valid = await bcrypt.compare(password, user.password);
          if (!valid) throw new Error("Kata sandi salah");

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            nomor: user.nomor ?? null,
            gender: user.gender ? String(user.gender) : null,
            tanggal_lahir: user.tanggal_lahir ? user.tanggal_lahir.toISOString() : null,
          };
        } catch (error: any) {
          // ✅ Jika error dari Zod, ambil hanya pesan (tidak seluruh JSON)
          if (error.name === "ZodError") {
            throw new Error(error.issues[0].message); 
          }

          // ✅ Jika error biasa, lempar apa adanya
          throw new Error(error.message || "Terjadi kesalahan saat login");
        }
      }
    }),
  ],

  // ✅ Session pakai JWT
  session: { strategy: "jwt" },

  // ✅ Tambahkan callbacks di sini
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.user = user;
        token.role = (user as any).role; 
      }
      return token;
    },

    async session({ session, token }) {
      session.user = token.user as any;
      if (token.role) {
        (session.user as any).role = token.role as "ADMIN" | "USER";
      }

      return session;
    },
  },

  pages: {
    signIn: "/login", // bisa tetap /login kalau mau
  },

  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
