import { authOptions } from "@/lib/auth";
import NextAuth from "next-auth";

// Gunakan authOptions untuk membuat handler
const handler = NextAuth(authOptions);

// Export handler sebagai GET dan POST
export { handler as GET, handler as POST };