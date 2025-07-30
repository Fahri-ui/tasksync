"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { UserHeader } from "@/components/user/header"
import { dummyProjects as initialDummyProjects } from "@/lib/dummy-data" // Rename to avoid conflict
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Search, FolderKanban, CheckCircle, PauseCircle, Plus, CalendarDays } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import Link from "next/link"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { Calendar } from "@/components/ui/calendar"
import { cn } from "@/lib/utils" // Assuming cn utility is available

export default function ProyekSayaPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("semua")
  const [isCreateProjectDialogOpen, setIsCreateProjectDialogOpen] = useState(false)
  const [newProject, setNewProject] = useState({
    name: "",
    description: "",
    deadline: new Date(),
    manager: "",
    status: "aktif",
    progress: 0,
  })
  const [dummyProjects, setDummyProjects] = useState(initialDummyProjects) // Use state for dummy projects

  // Jika tidak ada session, redirect ke login
  if (status === "unauthenticated") {
    router.push("/login")
    return null
  }

  // Filter proyek berdasarkan pencarian dan status
  const filteredProjects = dummyProjects.filter((project) => {
    const matchesSearch =
      project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.manager.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "semua" || project.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "aktif":
        return "bg-green-100 text-green-800"
      case "selesai":
        return "bg-blue-100 text-blue-800"
      case "tertunda":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "aktif":
        return <CheckCircle className="w-3 h-3 mr-1" />
      case "selesai":
        return <CheckCircle className="w-3 h-3 mr-1" />
      case "tertunda":
        return <PauseCircle className="w-3 h-3 mr-1" />
      default:
        return null
    }
  }

  const handleCreateProject = () => {
    const newProjectId = `proj-${dummyProjects.length + 1}` // Simple ID generation
    setDummyProjects((prevProjects) => [
      ...prevProjects,
      {
        id: newProjectId,
        ...newProject,
        deadline: format(newProject.deadline, "yyyy-MM-dd"), // Format date for consistency
      },
    ])
    setNewProject({
      name: "",
      description: "",
      deadline: new Date(),
      manager: "",
      status: "aktif",
      progress: 0,
    })
    setIsCreateProjectDialogOpen(false)
  }

  return (
    <>
      <UserHeader title="Proyek Saya" />
      <main className="p-4 sm:p-6 lg:p-8">
        <div className="space-y-6">
          <Card className="rounded-2xl shadow-sm border border-gray-100">
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <CardTitle className="text-xl font-bold text-gray-900">
                    <FolderKanban className="inline-block w-6 h-6 mr-2 text-gray-700" /> Daftar Proyek
                  </CardTitle>
                  <p className="text-gray-600 mt-1">Kelola semua proyek yang Anda ikuti</p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      type="text"
                      placeholder="Cari proyek..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                      <SelectValue placeholder="Semua Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="semua">Semua Status</SelectItem>
                      <SelectItem value="aktif">Aktif</SelectItem>
                      <SelectItem value="selesai">Selesai</SelectItem>
                      <SelectItem value="tertunda">Tertunda</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button
                    onClick={() => setIsCreateProjectDialogOpen(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    <Plus className="w-4 h-4 mr-2" /> Buat Proyek
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                {" "}
                {/* Added overflow-x-auto here */}
                <Table className="w-full">
                  <TableHeader className="bg-gray-50">
                    <TableRow>
                      <TableHead className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Nama Proyek
                      </TableHead>
                      <TableHead className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Deadline
                      </TableHead>
                      <TableHead className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </TableHead>
                      <TableHead className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Manager
                      </TableHead>
                      <TableHead className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Progress
                      </TableHead>
                      <TableHead className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Aksi
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody className="bg-white divide-y divide-gray-200">
                    {filteredProjects.map((project) => (
                      <TableRow key={project.id} className="hover:bg-gray-50 transition-colors">
                        <TableCell className="px-6 py-4 whitespace-nowrap">
                          <Link href={`/user/proyek-saya/${project.id}`} className="block hover:underline">
                            <div className="text-sm font-medium text-gray-900">{project.name}</div>
                            <div className="text-sm text-gray-500">{project.description}</div>
                          </Link>
                        </TableCell>
                        <TableCell className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {new Date(project.deadline).toLocaleDateString("id-ID", {
                              day: "numeric",
                              month: "long",
                              year: "numeric",
                            })}
                          </div>
                          <div className="text-xs text-gray-500">
                            {Math.ceil(
                              (new Date(project.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24),
                            )}{" "}
                            hari lagi
                          </div>
                        </TableCell>
                        <TableCell className="px-6 py-4 whitespace-nowrap">
                          <Badge
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(project.status)}`}
                          >
                            {getStatusIcon(project.status)} {project.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <Avatar className="w-8 h-8 bg-gradient-to-br from-purple-400 to-pink-500 mr-3">
                              <AvatarFallback className="text-white font-semibold text-xs">
                                {project.manager
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <div className="text-sm text-gray-900">{project.manager}</div>
                          </div>
                        </TableCell>
                        <TableCell className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <Progress value={project.progress} className="w-16 h-2 mr-3" />
                            <span className="text-sm text-gray-900">{project.progress}%</span>
                          </div>
                        </TableCell>
                        <TableCell className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          {/* Removed the explicit "Detail" button as the project name is now clickable */}
                          <Button variant="ghost" size="sm" className="text-green-600 hover:text-green-900">
                            {/* This button can remain for specific "Tasks" action */}
                            Tugas
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              {filteredProjects.length === 0 && (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FolderKanban className="w-8 h-8 text-gray-400" />
                  </div>
                  <p className="text-gray-500">Tidak ada proyek yang ditemukan</p>
                  <p className="text-sm text-gray-400 mt-1">Coba ubah filter atau kata kunci pencarian</p>
                </div>
              )}
            </CardContent>
          </Card>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="p-6 rounded-2xl shadow-sm border border-gray-100">
              <CardContent className="flex items-center justify-between p-0">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Proyek</p>
                  <p className="text-2xl font-bold text-gray-900">{dummyProjects.length}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <FolderKanban className="w-6 h-6 text-blue-600" />
                </div>
              </CardContent>
            </Card>
            <Card className="p-6 rounded-2xl shadow-sm border border-gray-100">
              <CardContent className="flex items-center justify-between p-0">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Proyek Aktif</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {dummyProjects.filter((p) => p.status === "aktif").length}
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
              </CardContent>
            </Card>
            <Card className="p-6 rounded-2xl shadow-sm border border-gray-100">
              <CardContent className="flex items-center justify-between p-0">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Proyek Selesai</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {dummyProjects.filter((p) => p.status === "selesai").length}
                  </p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-blue-600" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* Create Project Dialog */}
      <Dialog open={isCreateProjectDialogOpen} onOpenChange={setIsCreateProjectDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Buat Proyek Baru</DialogTitle>
            <DialogDescription>Isi detail proyek baru Anda di sini.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Nama Proyek
              </Label>
              <Input
                id="name"
                value={newProject.name}
                onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Deskripsi
              </Label>
              <Textarea
                id="description"
                value={newProject.description}
                onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="deadline" className="text-right">
                Deadline
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "col-span-3 justify-start text-left font-normal",
                      !newProject.deadline && "text-muted-foreground",
                    )}
                  >
                    <CalendarDays className="mr-2 h-4 w-4" />
                    {newProject.deadline ? format(newProject.deadline, "PPP") : <span>Pilih tanggal</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={newProject.deadline}
                    onSelect={(date) => setNewProject({ ...newProject, deadline: date || new Date() })}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="manager" className="text-right">
                Manager
              </Label>
              <Input
                id="manager"
                value={newProject.manager}
                onChange={(e) => setNewProject({ ...newProject, manager: e.target.value })}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateProjectDialogOpen(false)}>
              Batal
            </Button>
            <Button onClick={handleCreateProject}>Buat Proyek</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
