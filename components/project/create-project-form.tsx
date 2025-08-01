// components/project/create-project-form.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { TaskInputCard } from "./task-input-card";
import { UserHeader } from "@/components/user/header";

interface Friend {
  id: string;
  name: string;
  email: string;
}

interface Task {
  tempId: string;
  title: string;
  description: string;
  deadline: string;
  assignedTo: string;
}

export function CreateProjectForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [deadline, setDeadline] = useState("");
  const [tasks, setTasks] = useState<Task[]>([]);
  const [friends, setFriends] = useState<Friend[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Ambil daftar teman
  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const res = await fetch("/api/users/friends");
        if (!res.ok) throw new Error("Gagal muat daftar teman");
        const data = await res.json();
        setFriends(data);
      } catch (err) {
        console.error(err);
        alert("Gagal memuat daftar teman");
      } finally {
        setLoading(false);
      }
    };
    fetchFriends();
  }, []);

  const addTask = () => {
    setTasks([
      ...tasks,
      {
        tempId: Date.now().toString(),
        title: "",
        description: "",
        deadline: "",
        assignedTo: "",
      },
    ]);
  };

  const updateTask = (tempId: string, field: string, value: string) => {
    setTasks(tasks.map(t => t.tempId === tempId ? { ...t, [field]: value } : t));
  };

  const deleteTask = (tempId: string) => {
    setTasks(tasks.filter(t => t.tempId !== tempId));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (tasks.length === 0) {
      alert("Minimal satu tugas harus ditambahkan");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/users/add-proyek", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          description,
          deadline,
          tasks,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Gagal membuat proyek");
      }

      router.push(`/user/proyek-saya/${data.projectId}`);
    } catch (err: any) {
      alert("Error: " + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <h3 className="text-xl font-bold text-gray-900 mb-6">Buat Proyek Baru</h3>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Form Proyek */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nama Proyek</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 text-black rounded-md"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border text-black border-gray-300 rounded-md"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Deadline Proyek</label>
            <input
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              className="text-black w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>
        </div>

        {/* Daftar Tugas */}
        <div className="space-y-4">
          <h4 className="font-semibold text-gray-800">Tugas dalam Proyek</h4>
          {tasks.length === 0 && (
            <p className="text-gray-500 text-sm">Belum ada tugas. Klik "Tambah Tugas" untuk menambahkan.</p>
          )}
          {tasks.map(task => (
            <TaskInputCard
              key={task.tempId}
              task={task}
              onUpdate={updateTask}
              onDelete={deleteTask}
              friends={friends}
            />
          ))}
        </div>

        <button
          type="button"
          onClick={addTask}
          className="px-4 py-2 border border-dashed border-gray-300 rounded text-gray-600 hover:bg-gray-50"
        >
          + Tambah Tugas
        </button>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={submitting}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {submitting ? "Membuat..." : "Buat Proyek"}
          </button>
        </div>
      </form>
    </div>
  );
}