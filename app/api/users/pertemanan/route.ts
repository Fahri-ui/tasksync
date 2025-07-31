// app/api/users/pertemanan/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route"; // Sesuaikan path
import prisma from "@/lib/prisma";

// GET: Ambil daftar user + status pertemanan
export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const { searchParams } = new URL(request.url);
    const searchTerm = searchParams.get("search") || "";

    // Ambil semua user (kecuali diri sendiri dan admin)
    const allUsers = await prisma.user.findMany({
      where: {
        id: { not: userId },
        role: { not: "ADMIN" },
        OR: [
          { name: { contains: searchTerm, mode: "insensitive" } },
          { email: { contains: searchTerm, mode: "insensitive" } },
        ],
      },
      select: { id: true, name: true, email: true },
      orderBy: { name: "asc" },
    });

    // Ambil semua pertemanan user
    const friendships = await prisma.friendship.findMany({
      where: {
        OR: [{ requesterId: userId }, { addresseeId: userId }],
      },
      select: { requesterId: true, addresseeId: true },
    });

    const friendIds = new Set<string>();
    friendships.forEach((f) => {
      if (f.requesterId === userId) friendIds.add(f.addresseeId);
      else friendIds.add(f.requesterId);
    });

    const usersWithFriendStatus = allUsers.map((user) => ({
      ...user,
      isFriend: friendIds.has(user.id),
    }));

    return NextResponse.json({ users: usersWithFriendStatus });
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

// POST: Tambah atau hapus pertemanan
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const { friendId } = await request.json();

    if (!friendId) {
      return NextResponse.json({ message: "Friend ID is required" }, { status: 400 });
    }

    // Pastikan friendId bukan diri sendiri
    if (friendId === userId) {
      return NextResponse.json({ message: "Cannot add yourself as a friend" }, { status: 400 });
    }

    // Cek apakah user yang dituju ada dan bukan admin
    const targetUser = await prisma.user.findUnique({
      where: { id: friendId },
      select: { id: true, role: true },
    });

    if (!targetUser) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    if (targetUser.role === "ADMIN") {
      return NextResponse.json({ message: "Cannot add admin as friend" }, { status: 403 });
    }

    // Cek apakah sudah berteman
    const existingFriendship = await prisma.friendship.findFirst({
      where: {
        OR: [
          { requesterId: userId, addresseeId: friendId },
          { requesterId: friendId, addresseeId: userId },
        ],
      },
    });

    if (existingFriendship) {
      // Sudah berteman → hapus (unfriend)
      await prisma.friendship.delete({
        where: { id: existingFriendship.id },
      });

      return NextResponse.json({
        message: "Friend removed successfully",
        isFriend: false,
      });
    } else {
      // Belum berteman → tambah
      await prisma.friendship.create({
        data: {
          requesterId: userId,
          addresseeId: friendId,
        },
      });

      return NextResponse.json({
        message: "Friend added successfully",
        isFriend: true,
      });
    }
  } catch (error) {
    console.error("Error handling friendship:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}