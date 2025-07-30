import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth" // Asumsi Anda memiliki file auth.ts
import prisma from "@/lib/prisma"
import { z } from "zod"

const friendRequestSchema = z.object({
  addresseeId: z.string().cuid(),
})

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const currentUserId = session.user.id
    const body = await request.json()

    const { addresseeId } = friendRequestSchema.parse(body)

    if (currentUserId === addresseeId) {
      return new NextResponse("Cannot send friend request to yourself", { status: 400 })
    }

    // Periksa apakah pertemanan sudah ada atau permintaan sudah dikirim
    const existingFriendship = await prisma.friendship.findFirst({
      where: {
        OR: [
          {
            requesterId: currentUserId,
            addresseeId: addresseeId,
          },
          {
            requesterId: addresseeId,
            addresseeId: currentUserId,
          },
        ],
      },
    })

    if (existingFriendship) {
      return new NextResponse("Friend request already sent or users are already friends", { status: 409 })
    }

    // Buat permintaan pertemanan baru
    const newFriendship = await prisma.friendship.create({
      data: {
        requesterId: currentUserId,
        addresseeId: addresseeId,
      },
    })

    return NextResponse.json(newFriendship, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new NextResponse("Invalid request payload", { status: 400 })
    }
    console.error("[API_POST_FRIEND_REQUEST]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}
