import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const taskId = params.id;

    const task = await prisma.task.findUnique({
      where: { id: taskId },
      select: { assignedTo: true },
    });

    if (!task) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    if (task.assignedTo !== userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { status } = await request.json();

    if (!["BELUM_SELESAI", "SELESAI"].includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    const updatedTask = await prisma.task.update({
      where: { id: taskId },
      data: { status },
    });

    return NextResponse.json(updatedTask);
  } catch (error) {
    console.error("Error updating task status:", error);
    return NextResponse.json(
      { error: "Failed to update task" },
      { status: 500 }
    );
  }
}