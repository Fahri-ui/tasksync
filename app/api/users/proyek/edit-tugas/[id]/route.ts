// app/api/users/tugas/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function PATCH(request: NextRequest, { params }: any) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const taskId = params.id;

    const body = await request.json();
    const { title, description, deadline, assignedTo } = body;

    if (!title || !deadline || !assignedTo) {
      return NextResponse.json(
        { error: "Title, deadline, and assignedTo are required" },
        { status: 400 }
      );
    }

    // Cek apakah task ada & apakah user adalah creator proyek atau bagian dari proyek
    const task = await prisma.task.findUnique({
      where: { id: taskId },
      include: {
        project: {
          include: {
            members: true,
          },
        },
      },
    });

    if (!task) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    // Hanya creator proyek atau user yang ditugaskan bisa edit
    const isCreator = task.project.creatorId === userId;
    const isMember = task.project.members.some((m) => m.userId === userId);
    const isAssigned = task.assignedTo === assignedTo;

    // Di sini kita izinkan creator atau anggota proyek mengedit
    if (!isCreator && !isMember) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Update task
    const updatedTask = await prisma.task.update({
      where: { id: taskId },
      data: {
        title,
        description,
        deadline: new Date(deadline),
        assignedTo,
      },
      include: {
        assignedUser: { select: { id: true, name: true } },
      },
    });

    return NextResponse.json(updatedTask);
  } catch (error) {
    console.error("Error updating task:", error);
    return NextResponse.json({ error: "Failed to update task" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: any) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const taskId = params.id;

    const task = await prisma.task.findUnique({
      where: { id: taskId },
      include: { project: true },
    });

    if (!task) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    if (task.project.creatorId !== userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await prisma.task.delete({ where: { id: taskId } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting task:", error);
    return NextResponse.json({ error: "Failed to delete task" }, { status: 500 });
  }
}