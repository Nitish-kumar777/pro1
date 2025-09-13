"use client"

import { SessionProvider } from "next-auth/react";
import MemberLayout from "./components/MemberLayout";

export default function Layout({ children }) {
  return (
    <SessionProvider>
      <MemberLayout>
        {children}
      </MemberLayout>
    </SessionProvider>
  );
}
