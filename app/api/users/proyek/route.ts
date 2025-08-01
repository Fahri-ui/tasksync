// app/api/user/proyek/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth"
import prisma from "@/lib/prisma";

// Tipe untuk response API
interface ProjectApiResponse {
  id: string;
  name: string;
  description: string | null;
  deadline: string; // ISO string
  progress: number;
  status: "aktif" | "selesai" | "tertunda";
  manager: string;
}

export async function GET(request: NextRequest) {
  try {
    // 1. Cek session
    const session = await getServerSession(authOptions)
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    // 2. Ambil semua proyek yang user ikuti (via ProjectMember) + proyek yang dia buat
    const userProjects = await prisma.project.findMany({
      where: {
        OR: [
          { creatorId: userId }, // Dia sebagai creator
          { members: { some: { userId } } }, // Dia sebagai anggota
        ],
      },
      include: {
        creator: {
          select: {
            name: true,
          },
        },
        members: {
          include: {
            user: {
              select: {
                id: true,
              },
            },
          },
        },
        tasks: {
          select: {
            status: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // 3. Format data untuk frontend
    const formattedProjects: ProjectApiResponse[] = userProjects.map((project) => {
      // Hitung progress: persentase tugas selesai
      const totalTasks = project.tasks.length;
      const completedTasks = project.tasks.filter(
        (task) => task.status === "SELESAI"
      ).length;
      const progress = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

      // Tentukan status proyek
      let status: "aktif" | "selesai" | "tertunda" = "aktif";
      if (progress === 100) {
        status = "selesai";
      } else {
        const now = new Date();
        if (new Date(project.deadline) < now) {
          status = "tertunda";
        }
      }

      return {
        id: project.id,
        name: project.name,
        description: project.description,
        deadline: project.deadline.toISOString(),
        progress,
        status,
        manager: project.creator.name || "Unknown",
      };
    });

    // 4. Kirim response
    return NextResponse.json(formattedProjects);
  } catch (error) {
    console.error("Error fetching user projects:", error);
    return NextResponse.json(
      { error: "Failed to fetch projects" },
      { status: 500 }
    );
  }
}