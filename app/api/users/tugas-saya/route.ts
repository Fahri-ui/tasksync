// app/api/user/tugas-saya/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth"; 
import prisma from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    // Ambil semua tugas yang diassign ke user
    const tasks = await prisma.task.findMany({
      where: {
        assignedTo: userId,
      },
      include: {
        project: {
          select: {
            name: true,
            id: true,
          },
        },
      },
      orderBy: {
        deadline: "asc",
      },
    });

    // Format untuk frontend
    const formattedTasks = tasks.map((task) => ({
      id: task.id,
      title: task.title,
      description: task.description,
      deadline: task.deadline.toISOString(),
      status: task.status,
      project: {
        name: task.project.name,
        id: task.project.id,
      },
    }));

    return NextResponse.json(formattedTasks);
  } catch (error) {
    console.error("Error fetching user tasks:", error);
    return NextResponse.json(
      { error: "Failed to fetch tasks" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const { title, description, deadline, projectId, assignedTo } = await request.json();

    // Validasi input
    if (!title || !deadline || !projectId || !assignedTo) {
      return NextResponse.json(
        { error: "Semua field wajib diisi" },
        { status: 400 }
      );
    }

    // Cek apakah user adalah creator proyek
    const project = await prisma.project.findUnique({
      where: { id: projectId },
      select: { creatorId: true },
    });

    if (!project) {
      return NextResponse.json({ error: "Proyek tidak ditemukan" }, { status: 404 });
    }

    if (project.creatorId !== userId) {
      return NextResponse.json({ error: "Hanya creator yang bisa menambah tugas" }, { status: 403 });
    }

    // Cek apakah assignedTo adalah anggota proyek
    const isMember = await prisma.projectMember.findUnique({
      where: {
        projectId_userId: {
          projectId,
          userId: assignedTo,
        },
      },
    });

    if (!isMember) {
      return NextResponse.json(
        { error: "Penanggung jawab harus menjadi anggota proyek" },
        { status: 400 }
      );
    }

    // Buat tugas baru
    const newTask = await prisma.task.create({
      data: {
        title,
        description,
        deadline: new Date(deadline),
        projectId,
        assignedTo,
      },
    });

    // Ambil nama assignee untuk response
    const assignedUser = await prisma.user.findUnique({
      where: { id: assignedTo },
      select: { name: true },
    });

    // Response dengan data lengkap
    const responseData = {
      ...newTask,
      assignedUser: { name: assignedUser?.name || "Unknown" },
    };

    return NextResponse.json(responseData);
  } catch (error) {
    console.error("Error creating task:", error);
    return NextResponse.json(
      { error: "Gagal membuat tugas" },
      { status: 500 }
    );
  }
}