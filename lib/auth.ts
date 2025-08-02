// lib/auth.ts
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export { authOptions };
export const getSession = () => getServerSession(authOptions);