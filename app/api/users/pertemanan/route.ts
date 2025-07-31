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

    // Fetch all users who are not the current user and not an ADMIN
    const allUsers = await prisma.user.findMany({
      where: {
        id: {
          not: userId, // Exclude the current user
        },
        role: {
          not: "ADMIN", // Exclude admin users
        },
        OR: [
          {
            name: {
              contains: searchTerm,
              mode: "insensitive",
            },
          },
          {
            email: {
              contains: searchTerm,
              mode: "insensitive",
            },
          },
        ],
      },
      select: {
        id: true,
        name: true,
        email: true,
      },
      orderBy: {
        name: "asc",
      },
    })

    // Fetch all friendships involving the current user
    const friendships = await prisma.friendship.findMany({
      where: {
        OR: [{ requesterId: userId }, { addresseeId: userId }],
      },
      select: {
        requesterId: true,
        addresseeId: true,
      },
    })

    // Create a Set of friend IDs for quick lookup
    const friendIds = new Set<string>()
    friendships.forEach((friendship) => {
      if (friendship.requesterId === userId) {
        friendIds.add(friendship.addresseeId)
      } else {
        friendIds.add(friendship.requesterId)
      }
    })

    // Map users and add isFriend status
    const usersWithFriendStatus = allUsers.map((user) => ({
      ...user,
      isFriend: friendIds.has(user.id),
    }))

    return NextResponse.json({ users: usersWithFriendStatus })
  } catch (error) {
    console.error("Error fetching users for friendship page:", error)
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 })
  }
}
