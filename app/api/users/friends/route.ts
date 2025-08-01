// app/api/user/friends/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    // Ambil teman-teman (dari tabel Friendship)
    const friendships = await prisma.friendship.findMany({
      where: {
        OR: [
          { requesterId: userId },
          { addresseeId: userId },
        ],
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
    });

    // Ekstrak user teman (kecuali diri sendiri)
    const friends = friendships.map(friendship => {
      const friend = friendship.requesterId === userId ? friendship.addressee : friendship.requester;
      return {
        id: friend.id,
        name: friend.name,
        email: friend.email,
      };
    });

    return NextResponse.json(friends);
  } catch (error) {
    console.error("Error fetching friends:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}