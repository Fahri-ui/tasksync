import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth" 
import prisma from "@/lib/prisma"

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const currentUserId = session.user.id

    // Ambil semua pengguna
    const allUsers = await prisma.user.findMany({
      where: {
        id: {
          not: currentUserId, // Kecualikan pengguna saat ini
        },
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    })

    // Ambil semua pertemanan yang melibatkan pengguna saat ini
    const friendships = await prisma.friendship.findMany({
      where: {
        OR: [{ requesterId: currentUserId }, { addresseeId: currentUserId }],
      },
      select: {
        requesterId: true,
        addresseeId: true,
      },
    })

    // Buat set ID pengguna yang sudah berteman atau memiliki permintaan yang tertunda
    const relatedUserIds = new Set<string>()
    friendships.forEach((f) => {
      relatedUserIds.add(f.requesterId)
      relatedUserIds.add(f.addresseeId)
    })
    // Pastikan untuk tidak menyertakan diri sendiri dalam daftar terkait
    relatedUserIds.delete(currentUserId)

    // Filter pengguna yang tersedia
    const availableUsers = allUsers.filter((user) => !relatedUserIds.has(user.id))

    return NextResponse.json(availableUsers)
  } catch (error) {
    console.error("[API_GET_PERTEMANAN]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}
