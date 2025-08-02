import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth" 
import prisma from "@/lib/prisma" 

export async function GET()

{
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user?.id) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const userId = session.user.id

    
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
      take: 3, 
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
        joinedAt: 'desc', 
      },
      take: 3, 
    })

    
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
      
      return friendship.requesterId === userId
        ? friendship.addressee
        : friendship.requester
    }).slice(0, 3) 

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
        project: task.project.name, 
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
