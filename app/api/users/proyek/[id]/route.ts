import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return getServerSession(authOptions)
    .then((session) => {
      if (!session || !session.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
      const userId = session.user.id;
      const projectId = params.id;
      return prisma.project.findFirst({
        where: {
          id: projectId,
          OR: [
            { creatorId: userId },
            { members: { some: { userId } } },
          ],
        },
        include: {
          creator: { select: { name: true } },
          tasks: {
            include: {
              assignedUser: { select: { name: true } },
            },
          },
        },
      }).then((project) => {
        if (!project) {
          return NextResponse.json({ error: "Project not found" }, { status: 404 });
        }
        return NextResponse.json({
          ...project,
          isCreator: project.creatorId === userId,
        });
      });
    })
    .catch((error) => {
      console.error("Error fetching project:", error);
      return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    })
    .finally(() => prisma.$disconnect());
}

// Tambahkan PATCH
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
    const projectId = params.id;

    const project = await prisma.project.findUnique({
      where: { id: projectId },
      select: { creatorId: true },
    });

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    if (project.creatorId !== userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { name, description, deadline } = await request.json();

    if (!name || !description || !deadline) {
      return NextResponse.json(
        { error: "Name, description, and deadline are required" },
        { status: 400 }
      );
    }


    const updatedProject = await prisma.project.update({
      where: { id: projectId },
      data: {
        name,
        description,
        deadline: new Date(deadline),
      },
      include: {
        creator: { select: { name: true } },
        tasks: {
          include: {
            assignedUser: { select: { name: true } },
          },
        },
      },
    });

    const res = NextResponse.json(updatedProject);
    res.cookies.set("flash", "Proyek berhasil diperbarui.", {
      path: "/",
      maxAge: 30,
    });
    return res;
  } catch (error) {
    console.error("Error updating project:", error);
    return NextResponse.json(
      { error: "Failed to update project" },
      { status: 500 }
    );
  }
}

// DELETE: Hapus proyek (hanya creator)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const projectId = params.id;

    const project = await prisma.project.findUnique({
      where: { id: projectId },
      select: { creatorId: true },
    });

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    if (project.creatorId !== userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await prisma.project.delete({
      where: { id: projectId },
    });

    const res = NextResponse.json({ success: true }, { status: 200 });
    res.cookies.set("flash_success", "Proyek berhasil dihapus.", {
      path: "/",
      maxAge: 30,
    });
    return res;
  } catch (error) {
    console.error("Error deleting project:", error);
    return NextResponse.json({ error: "Failed to delete project" }, { status: 500 });
  }
}