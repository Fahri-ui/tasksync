import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth" // Asumsi Anda memiliki file ini untuk konfigurasi Next-Auth
import prisma from "@/lib/prisma" // Import instance Prisma Client singleton

export async function GET()

{
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user?.id) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const userId = session.user.id

    // 1. Fetch User Details
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
      },
    })

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 })
    }

    // 2. Fetch Project & Task Statistics
    const totalProjects = await prisma.projectMember.count({
      where: { userId: userId },
    })

    const activeTasks = await prisma.task.count({
      where: {
        assignedTo: userId,
        status: 'BELUM_SELESAI',
      },
    })

    const completedTasks = await prisma.task.count({
      where: {
        assignedTo: userId,
        status: 'SELESAI',
      },
    })

    // Calculate upcoming tasks (within 3 days from now)
    const today = new Date()
    const threeDaysFromNow = new Date(today.getTime() + 3 * 24 * 60 * 60 * 1000)

    const upcomingTasksList = await prisma.task.findMany({
      where: {
        assignedTo: userId,
        status: 'BELUM_SELESAI',
        deadline: {
          lte: threeDaysFromNow,
        },
      },
      include: {
        project: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        deadline: 'asc',
      },
      take: 3, // Limit to 3 for dashboard display
    })

    // 3. Fetch Recent Projects
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
        joinedAt: 'desc', // Order by when the user joined the project
      },
      take: 3, // Limit to 3 for dashboard display
    })

    // Map recent projects to include manager name and calculate progress
    const formattedRecentProjects = recentProjects.map((pm) => {
      const totalProjectTasks = pm.project.tasks.length
      const completedProjectTasks = pm.project.tasks.filter(
        (task) => task.status === 'SELESAI'
      ).length
      const progress =
        totalProjectTasks > 0
          ? Math.round((completedProjectTasks / totalProjectTasks) * 100)
          : 0

      return {
        id: pm.project.id,
        name: pm.project.name,
        manager: pm.project.creator.name,
        progress: progress,
      }
    })

    // 4. Fetch Friends
    const friendships = await prisma.friendship.findMany({
      where: {
        OR: [{ requesterId: userId }, { addresseeId: userId }],
      },
      include: {
        requester: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        addressee: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    })

    const myFriends = friendships.map((friendship) => {
      // Return the user who is NOT the current user
      return friendship.requesterId === userId
        ? friendship.addressee
        : friendship.requester
    }).slice(0, 3) // Limit to 3 for dashboard display

    return NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        joinedAt: user.createdAt,
        totalProjects: totalProjects,
      },
      stats: {
        activeTasks: activeTasks,
        completedTasks: completedTasks,
        upcomingTasksCount: upcomingTasksList.length,
      },
      upcomingTasks: upcomingTasksList.map((task) => ({
        id: task.id,
        title: task.title,
        project: task.project.name, // Assuming project name is enough
        deadline: task.deadline,
      })),
      recentProjects: formattedRecentProjects,
      myFriends: myFriends,
    })
  } catch (error) {
    console.error('Error fetching dashboard data:', error)
    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 }
    )
  }
}
