import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json({ message: "Logout berhasil" });

  response.cookies.set("next-auth.session-token", "", { maxAge: 0 });
  response.cookies.set("__Secure-next-auth.session-token", "", { maxAge: 0 });

  response.cookies.set("flash_success", encodeURIComponent("Logout berhasil!"), { path: "/", maxAge: 10 });

  return response;
}