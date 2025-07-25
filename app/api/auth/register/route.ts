import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { z } from "zod";
import { PrismaClient, Role } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const data = await req.json();

    // Validasi input
    const schema = z.object({
      email: z.string().email(),
      password: z.string().min(6),
      name: z.string().min(2),
    });

    const { email, password, name } = schema.parse(data);

    // Cek apakah user sudah ada
    const exist = await prisma.user.findUnique({
      where: { email },
    });

    if (exist) {
      return NextResponse.json({ error: "User already exists" }, { status: 400 });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Simpan user baru
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        role: Role.USER,   // default role
        verifiedAt: null,  // belum diverifikasi
      },
    });

    // Kirim OTP ke email
    await fetch(`${process.env.BASE_URL}/api/auth/send-otp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    return NextResponse.json({ user });
  } catch (error: any) {
    console.error("Register Error:", error);
    return NextResponse.json({ error: error.message || "Register failed" }, { status: 500 });
  }
}
