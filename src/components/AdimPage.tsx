"use client";
import { useEffect, useState, useMemo } from "react";
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

  const normalizedLevels = useMemo(
    () => JSON.stringify(allowLevels.map(String).sort()),
    [allowLevels]
  );

  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("sistema-cadastro-keite:user");
      if (!saved) {
        router.push("/login");
        return;
      }

      const user = JSON.parse(saved);
      if (!allowLevels.map(String).includes(user.nivel)) {
        router.push("/");
        return;
      }

      setIsAuthorized(true);
    }
  }, [normalizedLevels]);

  if (!isAuthorized) return null;

  return <>{children}</>;
}
