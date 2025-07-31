// components/project/task-input-card.tsx
"use client";

import { Trash2 } from "lucide-react";

interface TaskInputCardProps {
  task: {
    tempId: string;
    title: string;
    description: string;
    deadline: string;
    assignedTo: string;
  };
  onUpdate: (tempId: string, field: string, value: string) => void;
  onDelete: (tempId: string) => void;
  friends: { id: string; name: string }[]; // Daftar teman
}

export function TaskInputCard({ task, onUpdate, onDelete, friends }: TaskInputCardProps) {
  return (
    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 space-y-3">
      <div className="flex justify-between items-center">
        <h5 className="text-md font-semibold text-gray-800">Tugas Baru</h5>
        <button
          onClick={() => onDelete(task.tempId)}
          className="text-red-500 hover:text-red-700 transition-colors"
          aria-label="Hapus tugas"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </div>
      <div>
        <label htmlFor={`task-title-${task.tempId}`} className="block text-sm font-medium text-gray-700 mb-1">
          Judul Tugas
        </label>
        <input
          id={`task-title-${task.tempId}`}
          type="text"
          value={task.title}
          onChange={(e) => onUpdate(task.tempId, "title", e.target.value)}
          placeholder="Contoh: Desain UI Dashboard"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          required
        />
      </div>
      <div>
        <label htmlFor={`task-description-${task.tempId}`} className="block text-sm font-medium text-gray-700 mb-1">
          Deskripsi
        </label>
        <textarea
          id={`task-description-${task.tempId}`}
          value={task.description}
          onChange={(e) => onUpdate(task.tempId, "description", e.target.value)}
          placeholder="Detail tugas yang perlu dikerjakan"
          rows={2}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label htmlFor={`task-deadline-${task.tempId}`} className="block text-sm font-medium text-gray-700 mb-1">
            Deadline
          </label>
          <input
            id={`task-deadline-${task.tempId}`}
            type="date"
            value={task.deadline}
            onChange={(e) => onUpdate(task.tempId, "deadline", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
        <div>
          <label htmlFor={`task-assignee-${task.tempId}`} className="block text-sm font-medium text-gray-700 mb-1">
            Penanggung Jawab
          </label>
          <select
            id={`task-assignee-${task.tempId}`}
            value={task.assignedTo}
            onChange={(e) => onUpdate(task.tempId, "assignedTo", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            required
          >
            <option value="">Pilih Teman</option>
            {friends.map((friend) => (
              <option key={friend.id} value={friend.id}>
                {friend.name}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}