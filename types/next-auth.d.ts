import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name: string;
      email: string;
      role?: "ADMIN" | "USER";
      nomor?: string | null;
      gender?: string | null;
      tanggal_lahir?: string | null;
    };
  }

  interface User {
    id: string;
    name: string;
    email: string;
    role: "ADMIN" | "USER";
    nomor?: string | null;
    gender?: string | null;
    tanggal_lahir?: string | null;
  }
}