import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import prisma from "@/lib/prisma"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const userId = session.user.id

    // 1. Fetch User Details
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        verifiedAt: true,
        createdAt: true,
        nomor: true,
        gender: true,
        tanggal_lahir: true,
      },
    })

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 })
    }

    // 2. Fetch Project Statistics
    const totalProjects = await prisma.projectMember.count({
      where: { userId: userId },
    })

    const activeProjectsCount = await prisma.projectMember.count({
      where: {
        userId: userId,
        project: {
          tasks: {
            some: {
              status: "BELUM_SELESAI",
            },
          },
        },
      },
    })

    const completedProjectsCount = await prisma.projectMember.count({
      where: {
        userId: userId,
        project: {
          tasks: {
            every: {
              status: "SELESAI",
            },
          },
        },
      },
    })

    const recentProjects = await prisma.projectMember.findMany({
      where: { userId: userId },
      include: {
        project: {
          include: {
            creator: {
              select: {
                name: true,
              },
            },
            tasks: {
              select: {
                id: true,
                status: true,
              },
            },
          },
        },
      },
      orderBy: {
        joinedAt: "desc",
      },
      take: 3,
    })

    const formattedRecentProjects = recentProjects.map((pm) => {
      const totalProjectTasks = pm.project.tasks.length
      const completedProjectTasks = pm.project.tasks.filter((task) => task.status === "SELESAI").length
      const progress = totalProjectTasks > 0 ? Math.round((completedProjectTasks / totalProjectTasks) * 100) : 0

      let derivedStatus: "aktif" | "selesai" = "aktif"
      if (progress === 100) {
        derivedStatus = "selesai"
      }

      return {
        id: pm.project.id,
        name: pm.project.name,
        manager: pm.project.creator.name,
        progress: progress,
        status: derivedStatus,
      }
    })

    // 3. Fetch Task Statistics
    const totalTasks = await prisma.task.count({
      where: { assignedTo: userId },
    })

    const activeTasks = await prisma.task.count({
      where: {
        assignedTo: userId,
        status: "BELUM_SELESAI",
      },
    })

    const completedTasks = await prisma.task.count({
      where: {
        assignedTo: userId,
        status: "SELESAI",
      },
    })

    const recentTasks = await prisma.task.findMany({
      where: { assignedTo: userId },
      include: {
        project: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 3,
    })

    const formattedRecentTasks = recentTasks.map((task) => ({
      id: task.id,
      title: task.title,
      project: task.project.name,
      status: task.status === "SELESAI" ? "selesai" : "belum_selesai",
    }))

    const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0

    return NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        verifiedAt: user.verifiedAt,
        createdAt: user.createdAt,
        nomor: user.nomor,
        gender: user.gender,
        tanggal_lahir: user.tanggal_lahir,
      },
      stats: {
        totalProjects: totalProjects,
        activeProjects: activeProjectsCount,
        completedProjects: completedProjectsCount,
        totalTasks: totalTasks,
        activeTasks: activeTasks,
        completedTasks: completedTasks,
        completionRate: completionRate,
      },
      recentProjects: formattedRecentProjects,
      recentTasks: formattedRecentTasks,
    })
  } catch (error) {
    console.error("Error fetching user profile data:", error)
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 })
  }
}
