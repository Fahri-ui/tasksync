"use client";

import { SessionProvider } from "next-auth/react";

export default function SessionProviderWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  /**
   * SessionProvider akan menyediakan context session
   * ke semua komponen anaknya, sehingga `useSession()`
   * bisa digunakan di mana saja.
   */
  return <SessionProvider>{children}</SessionProvider>;
}
