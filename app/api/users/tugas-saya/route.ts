import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import prisma from "@/lib/prisma"

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const userId = session.user.id
    const { searchParams } = new URL(request.url)
    const searchTerm = searchParams.get("search") || ""

    // Fetch all project memberships for the current user
    const projectMemberships = await prisma.projectMember.findMany({
      where: {
        userId: userId,
        project: {
          OR: [
            {
              name: {
                contains: searchTerm,
                mode: "insensitive",
              },
            },
            {
              creator: {
                name: {
                  contains: searchTerm,
                  mode: "insensitive",
                },
              },
            },
          ],
        },
      },
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
        project: {
          createdAt: "desc", // Order by project creation date
        },
      },
    })

    const projectsData = projectMemberships.map((pm) => {
      const totalProjectTasks = pm.project.tasks.length
      const completedProjectTasks = pm.project.tasks.filter((task) => task.status === "SELESAI").length
      const progress = totalProjectTasks > 0 ? Math.round((completedProjectTasks / totalProjectTasks) * 100) : 0

      // Since Project model doesn't have a 'status' field, we derive it from progress
      let derivedStatus: "aktif" | "selesai" | "tertunda" = "aktif" // Default to aktif
      if (progress === 100) {
        derivedStatus = "selesai"
      }
      // 'tertunda' is hard to derive purely from tasks without a specific project status field.
      // For now, we'll only distinguish between 'aktif' and 'selesai'.
      // If you need 'tertunda', consider adding a 'status' field to your Project model.

      return {
        id: pm.project.id,
        name: pm.project.name,
        description: pm.project.description,
        deadline: pm.project.deadline,
        manager: pm.project.creator.name,
        progress: progress,
        status: derivedStatus, // Derived status
      }
    })

    // Calculate summary stats
    const totalProjectsCount = projectsData.length
    const activeProjectsCount = projectsData.filter((p) => p.status === "aktif").length
    const completedProjectsCount = projectsData.filter((p) => p.status === "selesai").length

    return NextResponse.json({
      projects: projectsData,
      summary: {
        total: totalProjectsCount,
        active: activeProjectsCount,
        completed: completedProjectsCount,
      },
    })
  } catch (error) {
    console.error("Error fetching projects data:", error)
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 })
  }
}
