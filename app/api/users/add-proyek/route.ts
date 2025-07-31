// app/api/proyek/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

// Tipe request body
interface CreateProjectRequestBody {
  name: string;
  description: string;
  deadline: string; // ISO string
  tasks: {
    title: string;
    description: string;
    deadline: string; // ISO string
    assignedTo: string; // userId
  }[];
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const body: CreateProjectRequestBody = await request.json();

    const { name, description, deadline, tasks } = body;

    // Validasi dasar
    if (!name || !description || !deadline) {
      return NextResponse.json({ error: "Nama, deskripsi, dan deadline wajib diisi" }, { status: 400 });
    }

    // Validasi tugas
    if (!Array.isArray(tasks) || tasks.length === 0) {
      return NextResponse.json({ error: "Minimal satu tugas harus ditambahkan" }, { status: 400 });
    }

    // Ambil userId dari assignee dan pastikan mereka ada
    const assigneeIds = tasks.map(t => t.assignedTo);
    const uniqueAssigneeIds = [...new Set(assigneeIds)];

    const assignees = await prisma.user.findMany({
      where: {
        id: { in: uniqueAssigneeIds },
      },
      select: { id: true },
    });

    if (assignees.length !== uniqueAssigneeIds.length) {
      return NextResponse.json({ error: "Salah satu penanggung jawab tidak ditemukan" }, { status: 400 });
    }

    // Buat proyek dan relasi
    const project = await prisma.$transaction(async (prisma) => {
      // 1. Buat proyek
      const newProject = await prisma.project.create({
        data: {
          name,
          description,
          startDate: new Date(),
          deadline: new Date(deadline),
          creatorId: userId,
        },
      });

      // 2. Tambahkan creator sebagai MANAGER
      await prisma.projectMember.create({
        data: {
          projectId: newProject.id,
          userId: userId,
          role: "MANAGER",
        },
      });

      // 3. Tambahkan anggota dan tugas
      for (const task of tasks) {
        // Pastikan anggota sudah jadi anggota proyek
        const existingMember = await prisma.projectMember.findUnique({
          where: {
            projectId_userId: {
              projectId: newProject.id,
              userId: task.assignedTo,
            },
          },
        });

        if (!existingMember) {
          await prisma.projectMember.create({
            data: {
              projectId: newProject.id,
              userId: task.assignedTo,
              role: "MEMBER",
            },
          });
        }

        // Buat tugas
        await prisma.task.create({
          data: {
            title: task.title,
            description: task.description,
            deadline: new Date(task.deadline),
            projectId: newProject.id,
            assignedTo: task.assignedTo,
          },
        });
      }

      return newProject;
    });

    // Menjadi:
    const res = NextResponse.json(
      { success: true, projectId: project.id },
      { status: 200 }
    );

    res.cookies.set("flash_success", "Proyek berhasil dibuat.", {
      path: "/",
      maxAge: 30, // 30 detik
    });

    return res;
  } catch (error) {
    console.error("Error creating project:", error);
    return NextResponse.json({ error: "Gagal membuat proyek" }, { status: 500 });
  }
}