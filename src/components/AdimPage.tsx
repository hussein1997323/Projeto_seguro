"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowLevels: Array<"0" | "1" | "2">;
}

export default function ProtectedRoute({
  children,
  allowLevels,
}: ProtectedRouteProps) {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("sistema-cadastro-keite:user");
      if (!saved) {
        router.push("/login");
        return;
      }

      const user = JSON.parse(saved);
      if (!allowLevels.includes(user.nivel)) {
        router.push("/"); // ou "/cliente" se quiser que nível 0 vá pra lá
        return;
      }

      setIsAuthorized(true);
    }
  }, [allowLevels, router]);

  if (!isAuthorized) return null;

  return <>{children}</>;
}
