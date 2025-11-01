"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { getToken, removeToken } from "@/lib/auth";
import Loader from "./loader";

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [checking, setChecking] = useState(true);

  const verifyToken = async () => {
    const token = getToken();

    if (!token) {
      removeToken();
      router.replace("/admin/auth/login");
      return false;
    }

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/verify-token`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        return true;
      } else {
        removeToken();
        router.replace("/admin/auth/login");
        return false;
      }
    } catch (err) {
      console.error("Token check failed:", err);
      removeToken();
      router.replace("/admin/auth/login");
      return false;
    }
  };

  useEffect(() => {
    const check = async () => {
      setChecking(true);
      const valid = await verifyToken();
      setIsAuthorized(valid);
      setChecking(false);
    };

    check();
  }, [pathname]); 

  if (checking) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 text-gray-500 h-full overflow-y-auto">
       <Loader />
      </div>
    );
  }

  return isAuthorized ? <>{children}</> : null;
}
