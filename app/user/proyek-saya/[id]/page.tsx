"use client"

import { Progress } from "@/components/ui/progress"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { UserHeader } from "@/components/user/header"
import { dummyProjects, dummyTasks as initialDummyTasks } from "@/lib/dummy-data"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { Calendar } from "@/components/ui/calendar"
import { cn } from "@/lib/utils"
import { useParams } from "next/navigation"
import { Plus, Edit, Trash2, CalendarDays, Info, ListTodo } from "lucide-react"

export default function ProjectDetailPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const params = useParams()
  const projectId = params.id as string

  const [project, setProject] = useState<(typeof dummyProjects)[0] | null>(null)
  const [tasks, setTasks] = useState<typeof initialDummyTasks>([])
  const [isAddTaskDialogOpen, setIsAddTaskDialogOpen] = useState(false)
  const [isEditTaskDialogOpen, setIsEditTaskDialogOpen] = useState(false)
  const [currentTask, setCurrentTask] = useState<(typeof initialDummyTasks)[0] | null>(null)
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    deadline: new Date(),
    priority: "rendah",
    status: "belum_selesai",
  })

  useEffect(() => {
    if (projectId) {
      const foundProject = dummyProjects.find((p) => p.id === projectId)
      if (foundProject) {
        setProject(foundProject)
        // Filter tasks relevant to this project
        setTasks(initialDummyTasks.filter((task) => task.projectId === projectId))
      } else {
        router.push("/user/proyek-saya") // Redirect if project not found
      }
    }
  }, [projectId, router])

  // Jika tidak ada session, redirect ke login
  if (status === "unauthenticated") {
    router.push("/login")
    return null
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-xl mx-auto mb-4">
            <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          </div>
          <p className="text-gray-600 font-medium">Loading project details...</p>
        </div>
      </div>
    )
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "aktif":
      case "belum_selesai":
        return "bg-yellow-100 text-yellow-800"
      case "selesai":
        return "bg-blue-100 text-blue-800"
      case "tertunda":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "tinggi":
        return "bg-red-100 text-red-800"
      case "sedang":
        return "bg-orange-100 text-orange-800"
      case "rendah":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const handleAddTask = () => {
    const newTaskId = `task-${initialDummyTasks.length + tasks.length + 1}` // Simple ID generation
    const taskToAdd = {
      id: newTaskId,
      projectId: project.id,
      project: project.name, // Assign project name
      ...newTask,
      deadline: format(newTask.deadline, "yyyy-MM-dd"),
    }
    setTasks((prevTasks) => [...prevTasks, taskToAdd])
    initialDummyTasks.push(taskToAdd) // Add to global dummy for persistence across pages
    setNewTask({
      title: "",
      description: "",
      deadline: new Date(),
      priority: "rendah",
      status: "belum_selesai",
    })
    setIsAddTaskDialogOpen(false)
  }

  const handleEditTask = () => {
    if (!currentTask) return
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === currentTask.id
          ? {
              ...task,
              ...currentTask,
              deadline: format(currentTask.deadline, "yyyy-MM-dd"),
            }
          : task,
      ),
    )
    // Update global dummyTasks as well
    const globalTaskIndex = initialDummyTasks.findIndex((t) => t.id === currentTask.id)
    if (globalTaskIndex !== -1) {
      initialDummyTasks[globalTaskIndex] = {
        ...initialDummyTasks[globalTaskIndex],
        ...currentTask,
        deadline: format(currentTask.deadline, "yyyy-MM-dd"),
      }
    }
    setCurrentTask(null)
    setIsEditTaskDialogOpen(false)
  }

  const handleDeleteTask = (taskId: string) => {
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId))
    // Remove from global dummyTasks as well
    const globalTaskIndex = initialDummyTasks.findIndex((t) => t.id === taskId)
    if (globalTaskIndex !== -1) {
      initialDummyTasks.splice(globalTaskIndex, 1)
    }
  }

  return (
    <>
      <UserHeader title={`Detail Proyek: ${project.name}`} />
      <main className="p-4 sm:p-6 lg:p-8">
      <div className="mb-4 flex items-center gap-2">
        <button
          type="button"
          onClick={() => router.push("/user/proyek-saya")}
          className="inline-flex items-center px-4 py-2 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold shadow transition-colors border border-blue-100"
        >
          ← Kembali
        </button>
      </div>
        <div className="space-y-6">
          {/* Project Details Card */}
          <Card className="rounded-2xl shadow-sm border border-gray-100">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-gray-900 flex items-center">
                <Info className="w-6 h-6 mr-2 text-blue-600" /> Detail Proyek
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">
              <div>
                <p className="text-sm font-medium text-gray-500">Nama Proyek:</p>
                <p className="text-lg font-semibold">{project.name}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Manager:</p>
                <p className="text-lg font-semibold">{project.manager}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Deadline:</p>
                <p className="text-lg font-semibold">
                  {new Date(project.deadline).toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Status:</p>
                <Badge className={`text-lg font-semibold ${getStatusBadge(project.status)}`}>{project.status}</Badge>
              </div>
              <div className="md:col-span-2">
                <p className="text-sm font-medium text-gray-500">Deskripsi:</p>
                <p className="text-base">{project.description}</p>
              </div>
              <div className="md:col-span-2">
                <p className="text-sm font-medium text-gray-500">Progress:</p>
                <div className="flex items-center mt-1">
                  <Progress value={project.progress} className="w-full h-3 mr-3" />
                  <span className="text-base font-semibold">{project.progress}%</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tasks within Project Card */}
          <Card className="rounded-2xl shadow-sm border border-gray-100">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl font-bold text-gray-900 flex items-center">
                  <ListTodo className="w-6 h-6 mr-2 text-green-600" /> Tugas dalam Proyek
                </CardTitle>
                <Button
                  onClick={() => setIsAddTaskDialogOpen(true)}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  <Plus className="w-4 h-4 mr-2" /> Tambah Tugas
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table className="w-full">
                  <TableHeader className="bg-gray-50">
                    <TableRow>
                      <TableHead className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Judul Tugas
                      </TableHead>
                      <TableHead className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Deadline
                      </TableHead>
                      <TableHead className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Prioritas
                      </TableHead>
                      <TableHead className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </TableHead>
                      <TableHead className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Aksi
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody className="bg-white divide-y divide-gray-200">
                    {tasks.length > 0 ? (
                      tasks.map((task) => (
                        <TableRow key={task.id} className="hover:bg-gray-50 transition-colors">
                          <TableCell className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <div className="text-sm font-medium text-gray-900">{task.title}</div>
                              <div className="text-sm text-gray-500">{task.description}</div>
                            </div>
                          </TableCell>
                          <TableCell className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {new Date(task.deadline).toLocaleDateString("id-ID", {
                                day: "numeric",
                                month: "long",
                                year: "numeric",
                              })}
                            </div>
                          </TableCell>
                          <TableCell className="px-6 py-4 whitespace-nowrap">
                            <Badge className={`text-xs ${getPriorityBadge(task.priority)}`}>{task.priority}</Badge>
                          </TableCell>
                          <TableCell className="px-6 py-4 whitespace-nowrap">
                            <Badge className={`text-xs ${getStatusBadge(task.status)}`}>{task.status}</Badge>
                          </TableCell>
                          <TableCell className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-blue-600 hover:text-blue-900 mr-2"
                              onClick={() => {
                                setCurrentTask({ ...task, deadline: new Date(task.deadline) }) // Convert deadline string to Date object
                                setIsEditTaskDialogOpen(true)
                              }}
                            >
                              <Edit className="w-4 h-4 mr-1" /> Edit
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-900">
                                  <Trash2 className="w-4 h-4 mr-1" /> Hapus
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Apakah Anda yakin?</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Tindakan ini tidak dapat dibatalkan. Ini akan menghapus tugas{" "}
                                    <span className="font-semibold">{task.title}</span> secara permanen.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Batal</AlertDialogCancel>
                                  <AlertDialogAction onClick={() => handleDeleteTask(task.id)}>Hapus</AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                          Tidak ada tugas untuk proyek ini.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Add Task Dialog */}
      <Dialog open={isAddTaskDialogOpen} onOpenChange={setIsAddTaskDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Tambah Tugas Baru</DialogTitle>
            <DialogDescription>Isi detail tugas baru untuk proyek ini.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="task-title" className="text-right">
                Judul Tugas
              </Label>
              <Input
                id="task-title"
                value={newTask.title}
                onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="task-description" className="text-right">
                Deskripsi
              </Label>
              <Textarea
                id="task-description"
                value={newTask.description}
                onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="task-deadline" className="text-right">
                Deadline
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "col-span-3 justify-start text-left font-normal",
                      !newTask.deadline && "text-muted-foreground",
                    )}
                  >
                    <CalendarDays className="mr-2 h-4 w-4" />
                    {newTask.deadline ? format(newTask.deadline, "PPP") : <span>Pilih tanggal</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={newTask.deadline}
                    onSelect={(date) => setNewTask({ ...newTask, deadline: date || new Date() })}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="task-priority" className="text-right">
                Prioritas
              </Label>
              <Select
                value={newTask.priority}
                onValueChange={(value) => setNewTask({ ...newTask, priority: value as "tinggi" | "sedang" | "rendah" })}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Pilih Prioritas" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="tinggi">Tinggi</SelectItem>
                  <SelectItem value="sedang">Sedang</SelectItem>
                  <SelectItem value="rendah">Rendah</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="task-status" className="text-right">
                Status
              </Label>
              <Select
                value={newTask.status}
                onValueChange={(value) => setNewTask({ ...newTask, status: value as "belum_selesai" | "selesai" })}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Pilih Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="belum_selesai">Belum Selesai</SelectItem>
                  <SelectItem value="selesai">Selesai</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddTaskDialogOpen(false)}>
              Batal
            </Button>
            <Button onClick={handleAddTask}>Tambah Tugas</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Task Dialog */}
      {currentTask && (
        <Dialog open={isEditTaskDialogOpen} onOpenChange={setIsEditTaskDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Edit Tugas</DialogTitle>
              <DialogDescription>Ubah detail tugas ini.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-task-title" className="text-right">
                  Judul Tugas
                </Label>
                <Input
                  id="edit-task-title"
                  value={currentTask.title}
                  onChange={(e) => setCurrentTask({ ...currentTask, title: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-task-description" className="text-right">
                  Deskripsi
                </Label>
                <Textarea
                  id="edit-task-description"
                  value={currentTask.description}
                  onChange={(e) => setCurrentTask({ ...currentTask, description: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-task-deadline" className="text-right">
                  Deadline
                </Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "col-span-3 justify-start text-left font-normal",
                        !currentTask.deadline && "text-muted-foreground",
                      )}
                    >
                      <CalendarDays className="mr-2 h-4 w-4" />
                      {currentTask.deadline ? format(currentTask.deadline, "PPP") : <span>Pilih tanggal</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={currentTask.deadline}
                      onSelect={(date) => setCurrentTask({ ...currentTask, deadline: date || new Date() })}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-task-priority" className="text-right">
                  Prioritas
                </Label>
                <Select
                  value={currentTask.priority}
                  onValueChange={(value) =>
                    setCurrentTask({ ...currentTask, priority: value as "tinggi" | "sedang" | "rendah" })
                  }
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Pilih Prioritas" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="tinggi">Tinggi</SelectItem>
                    <SelectItem value="sedang">Sedang</SelectItem>
                    <SelectItem value="rendah">Rendah</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-task-status" className="text-right">
                  Status
                </Label>
                <Select
                  value={currentTask.status}
                  onValueChange={(value) =>
                    setCurrentTask({ ...currentTask, status: value as "belum_selesai" | "selesai" })
                  }
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Pilih Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="belum_selesai">Belum Selesai</SelectItem>
                    <SelectItem value="selesai">Selesai</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditTaskDialogOpen(false)}>
                Batal
              </Button>
              <Button onClick={handleEditTask}>Simpan Perubahan</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </>
  )
}
