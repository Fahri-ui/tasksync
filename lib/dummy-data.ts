export interface Project {
  id: number | string
  name: string
  deadline: string // YYYY-MM-DD
  status: "aktif" | "selesai" | "tertunda"
  manager: string
  description: string
  progress: number // 0-100
}

export interface Task {
  id: number | string
  title: string
  project: string // Project name
  deadline: string // YYYY-MM-DD
  status: "belum_selesai" | "selesai"
  priority: "tinggi" | "sedang" | "rendah"
  description: string
  assignee: string // New: Penanggung Jawab
}

export interface User {
  id: string
  name: string
  email: string
  isFriend: boolean
}

export const dummyProjects: Project[] = [
  {
    id: 1,
    name: "Website E-Commerce",
    deadline: "2024-02-15",
    status: "aktif",
    manager: "John Doe",
    description: "Pengembangan website e-commerce untuk toko online",
    progress: 75,
  },
  {
    id: 2,
    name: "Mobile App TaskSync",
    deadline: "2024-03-01",
    status: "aktif",
    manager: "Jane Smith",
    description: "Aplikasi mobile untuk manajemen tugas",
    progress: 45,
  },
  {
    id: 3,
    name: "Dashboard Analytics",
    deadline: "2024-01-30",
    status: "selesai",
    manager: "Bob Wilson",
    description: "Dashboard untuk analisis data bisnis",
    progress: 100,
  },
  {
    id: 4,
    name: "API Integration",
    deadline: "2024-02-28",
    status: "aktif",
    manager: "Alice Brown",
    description: "Integrasi API dengan sistem eksternal",
    progress: 30,
  },
]

export const dummyTasks: Task[] = [
  {
    id: 1,
    title: "Desain UI Homepage",
    project: "Website E-Commerce",
    deadline: "2024-01-28",
    status: "belum_selesai",
    priority: "tinggi",
    description: "Membuat desain UI untuk halaman utama website",
    assignee: "Ahmad Rizki", // Added assignee
  },
  {
    id: 2,
    title: "Setup Database",
    project: "Website E-Commerce",
    deadline: "2024-01-25",
    status: "selesai",
    priority: "tinggi",
    description: "Konfigurasi database untuk aplikasi",
    assignee: "Budi Santoso", // Added assignee
  },
  {
    id: 3,
    title: "Implementasi Login",
    project: "Mobile App TaskSync",
    deadline: "2024-01-30",
    status: "belum_selesai",
    priority: "sedang",
    description: "Membuat fitur login untuk aplikasi mobile",
    assignee: "Citra Dewi", // Added assignee
  },
  {
    id: 4,
    title: "Testing API",
    project: "API Integration",
    deadline: "2024-02-05",
    status: "belum_selesai",
    priority: "rendah",
    description: "Testing semua endpoint API",
    assignee: "Dian Pratama", // Added assignee
  },
  {
    id: 5,
    title: "Dokumentasi",
    project: "Dashboard Analytics",
    deadline: "2024-01-20",
    status: "selesai",
    priority: "sedang",
    description: "Membuat dokumentasi lengkap project",
    assignee: "Eko Susanto", // Added assignee
  },
]

export const dummyUser = {
  id: "user123",
  name: "Ahmad Rizki",
  email: "ahmad.rizki@example.com",
  role: "User",
  joinedAt: "2023-06-15",
  avatar: "AR",
  totalProjects: 4,
  totalTasks: 5,
  completedTasks: 2,
}

export const dummyUsers: User[] = [
  {
    id: "user1",
    name: "Budi Santoso",
    email: "budi.s@example.com",
    isFriend: false,
  },
  {
    id: "user2",
    name: "Citra Dewi",
    email: "citra.d@example.com",
    isFriend: true,
  },
  {
    id: "user3",
    name: "Dian Pratama",
    email: "dian.p@example.com",
    isFriend: false,
  },
  {
    id: "user4",
    name: "Eko Susanto",
    email: "eko.s@example.com",
    isFriend: true,
  },
  {
    id: "user5",
    name: "Fatimah Azzahra",
    email: "fatimah.a@example.com",
    isFriend: false,
  },
  {
    id: "user6",
    name: "Gita Lestari",
    email: "gita.l@example.com",
    isFriend: false,
  },
  {
    id: "user7",
    name: "Hadi Wijaya",
    email: "hadi.w@example.com",
    isFriend: true,
  },
  {
    id: "user8",
    name: "Indah Permata",
    email: "indah.p@example.com",
    isFriend: false,
  },
]

export const dummyManagers: User[] = [
  { id: "mgr1", name: "John Doe", email: "john.d@example.com", isFriend: false },
  { id: "mgr2", name: "Jane Smith", email: "jane.s@example.com", isFriend: false },
  { id: "mgr3", name: "Bob Wilson", email: "bob.w@example.com", isFriend: false },
  { id: "mgr4", name: "Alice Brown", email: "alice.b@example.com", isFriend: false },
]
