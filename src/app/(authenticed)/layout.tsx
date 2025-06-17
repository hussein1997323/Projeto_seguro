"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Sidebar from "@/components/Sidebar";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();
  useEffect(() => {
    const value = localStorage.getItem("sistema-cadastro-keite:token");
    if (!value) {
      router.push("/login");
    }
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
      <div className="w-full flex">
        <Sidebar />
        {children}
      </div>
    </main>
  );
}
