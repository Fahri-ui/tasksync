import { type NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json({ message: "Email harus diisi" }, { status: 400 })
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ message: "Format email tidak valid" }, { status: 400 })
    }

    const user = await prisma.user.findUnique({
      where: { email },
    })

    if (!user) {
      return NextResponse.json({ message: "Email tidak terdaftar dalam sistem" }, { status: 404 })
    }

    const res = NextResponse.json({
      message: "Email ditemukan, silakan lanjutkan untuk reset password",
      success: true,
    })
    res.cookies.set("flash_success", encodeURIComponent("Email ditemukan, silakan lanjutkan untuk reset password"), { path: "/", maxAge: 10 })
    return res
  } catch (error) {
    console.error("Forgot password error:", error)
    return NextResponse.json({ message: "Terjadi kesalahan server" }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}
