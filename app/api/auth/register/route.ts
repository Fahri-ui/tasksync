import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { z } from "zod";
import { PrismaClient, Role, Gender } from "@prisma/client";

const prisma = new PrismaClient();

// Tipe untuk error Zod
interface ZodIssue {
  message: string;
}

export async function POST(req: Request) {
  try {
    const data = await req.json();

    const schema = z.object({
      name: z.string().min(3, { message: "Nama lengkap minimal 3 karakter" }),
      email: z.string().email({ message: "Format email tidak valid" }),
      password: z.string().min(6, { message: "Kata sandi minimal 6 karakter" }),
      nomor: z.string().min(8, { message: "Nomor telepon minimal 8 digit" }),
      gender: z.enum(["LAKI_LAKI", "PEREMPUAN"], {
        message: "Jenis kelamin harus dipilih (Laki-laki atau Perempuan)",
      }),
      tanggal_lahir: z
        .string()
        .refine((val) => !isNaN(Date.parse(val)), {
          message: "Tanggal lahir tidak valid",
        })
        .transform((val) => new Date(val)),
    });

    // ✅ Validasi Zod
    const { email, password, name, nomor, gender, tanggal_lahir } = schema.parse(data);

    // ✅ Cek user sudah ada
    const exist = await prisma.user.findUnique({
      where: { email },
    });

    if (exist) {
      const res = NextResponse.json(
        { error: "Email sudah terdaftar, gunakan email lain!" },
        { status: 400 }
      );
      return res;
    }

    // ✅ Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        nomor,
        gender: gender as Gender,
        tanggal_lahir,
        role: Role.USER,
        verifiedAt: null,
      },
    });

    // ✅ Jika sukses register → set flash_success
    const res = NextResponse.json(
      { success: true, message: "Registrasi berhasil! Silakan login." },
      { status: 200 }
    );
    res.cookies.set("flash_success", "Registrasi berhasil! Silakan verifikasi email anda.", {
      path: "/",
      maxAge: 30,
    });
    return res;
  } catch (error) {
    console.error("Register Error:", error);

    // ✅ Tangani error validasi Zod
    if (error instanceof z.ZodError) {
      const messages = error.issues.map((issue) => issue.message);
      const errorMessage = messages.join(", ");
      const res = NextResponse.json({ error: errorMessage }, { status: 400 });
      return res;
    }

    // ✅ Tangani error dari Prisma atau runtime
    let errorMessage = "Terjadi kesalahan saat registrasi";
    if (error instanceof Error) {
      errorMessage = error.message;
    }

    const res = NextResponse.json({ error: errorMessage }, { status: 500 });

    // ⛔ Set cookie flash_error untuk error server
    res.cookies.set("flash_error", errorMessage, {
      path: "/",
      maxAge: 30,
    });

    return res;
  }
}