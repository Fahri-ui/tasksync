import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  const { email, otp } = await req.json();

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return Response.json({ message: "User not found" }, { status: 404 });

  const otpRecord = await prisma.otp.findFirst({
    where: {
      userId: user.id,
      code: otp,
      expiry: { gte: new Date() },
    },
  });

  if (!otpRecord) return Response.json({ message: "Invalid or expired OTP" }, { status: 400 });

  // OTP valid, delete it (optional)
  await prisma.otp.delete({ where: { id: otpRecord.id } });

   // ✅ update verifiedAt
  await prisma.user.update({
    where: { id: user.id },
    data: { verifiedAt: new Date() },
  });

  return Response.json({ message: "OTP verified" });
}