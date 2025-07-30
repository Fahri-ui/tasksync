import { type NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import bcrypt from "bcrypt"
import { z } from "zod"

const prisma = new PrismaClient()

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()

    // ✅ Validasi dengan Zod
    const schema = z.object({
      email: z.string().email({ message: "Format email tidak valid" }),
      password: z.string().min(6, { message: "Password minimal 6 karakter" }),
    })

    const { email, password } = schema.parse(body)

    // ✅ Cek user berdasarkan email
    const user = await prisma.user.findUnique({ where: { email } })

    if (!user) {
      const res = NextResponse.json({ error: "User tidak ditemukan" }, { status: 404 })
      res.cookies.set("flash_error", "Email tidak terdaftar!", {
        path: "/",
        maxAge: 30,
      })
      return res
    }

    // ✅ Hash password baru
    const hashedPassword = await bcrypt.hash(password, 12)

    // ✅ Update password
    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        updatedAt: new Date(),
      },
    })

    // ✅ Jika sukses
    const res = NextResponse.json({ success: true }, { status: 200 })
    res.cookies.set("flash_success", "Password berhasil direset. Silakan login.", {
      path: "/",
      maxAge: 7,
    })
    return res

  } catch (error: any) {
    console.error("Reset Password Error:", error)

    // ✅ Tangani error validasi Zod
    if (error.name === "ZodError") {
      const messages = error.issues.map((issue: any) => issue.message)
      const errorMessage = messages.join(", ")

      const res = NextResponse.json({ error: errorMessage }, { status: 400 })
      res.cookies.set("flash_error", errorMessage, {
        path: "/",
        maxAge: 7,
      })
      return res
    }

    // ✅ Tangani error server
    const res = NextResponse.json({ error: "Terjadi kesalahan server" }, { status: 500 })
    res.cookies.set("flash_error", "Terjadi kesalahan server", {
      path: "/",
      maxAge: 30,
    })
    return res
  } finally {
    await prisma.$disconnect()
  }
}
