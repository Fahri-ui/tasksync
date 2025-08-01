
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";


interface CreateProjectRequestBody {
  name: string;
  description: string;
  deadline: string; 
  tasks: {
    title: string;
    description: string;
    deadline: string; 
    assignedTo: string; 
  }[];
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const body: CreateProjectRequestBody = await request.json();

    const { name, description, deadline, tasks } = body;

    
    if (!name || !description || !deadline) {
      return NextResponse.json({ error: "Nama, deskripsi, dan deadline wajib diisi" }, { status: 400 });
    }

    
    if (!Array.isArray(tasks) || tasks.length === 0) {
      return NextResponse.json({ error: "Minimal satu tugas harus ditambahkan" }, { status: 400 });
    }

    
    const assigneeIds = tasks.map(t => t.assignedTo);
    const uniqueAssigneeIds = [...new Set(assigneeIds)];

    const assignees = await prisma.user.findMany({
      where: {
        id: { in: uniqueAssigneeIds },
      },
      select: { id: true },
    });

    if (assignees.length !== uniqueAssigneeIds.length) {
      return NextResponse.json({ error: "Salah satu penanggung jawab tidak ditemukan" }, { status: 400 });
    }

    
    const project = await prisma.$transaction(async (prisma) => {
      
      const newProject = await prisma.project.create({
        data: {
          name,
          description,
          startDate: new Date(),
          deadline: new Date(deadline),
          creatorId: userId,
        },
      });

      
      await prisma.projectMember.create({
        data: {
          projectId: newProject.id,
          userId: userId,
          role: "MANAGER",
        },
      });

      
      for (const task of tasks) {
        
        const existingMember = await prisma.projectMember.findUnique({
          where: {
            projectId_userId: {
              projectId: newProject.id,
              userId: task.assignedTo,
            },
          },
        });

        if (!existingMember) {
          await prisma.projectMember.create({
            data: {
              projectId: newProject.id,
              userId: task.assignedTo,
              role: "MEMBER",
            },
          });
        }

        
        await prisma.task.create({
          data: {
            title: task.title,
            description: task.description,
            deadline: new Date(task.deadline),
            projectId: newProject.id,
            assignedTo: task.assignedTo,
          },
        });
      }

      return newProject;
    });

    
    const res = NextResponse.json(
      { success: true, projectId: project.id },
      { status: 200 }
    );

    res.cookies.set("flash_success", "Proyek berhasil dibuat.", {
      path: "/",
      maxAge: 30, 
    });

    return res;
  } catch (error) {
    console.error("Error creating project:", error);
    return NextResponse.json({ error: "Gagal membuat proyek" }, { status: 500 });
  }
}