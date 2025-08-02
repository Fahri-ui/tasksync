// lib/auth.ts
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/route";

export { authOptions };
export const getSession = () => getServerSession(authOptions);