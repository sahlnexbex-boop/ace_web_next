"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { getToken, removeToken } from "@/lib/auth";
import Loader from "./loader";
import { verifyStudentToken } from "@/lib/api/studentAuth";

export default function StudentProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [checking, setChecking] = useState(true);

  const verifyToken = async () => {
    const token = getToken();

    if (!token) {
      removeToken();
      router.replace("/user-portal/login");
      return false;
    }

    try {
      await verifyStudentToken(token);
      return true;
    } catch (err) {
      console.error("Student token check failed:", err);
      removeToken();
      router.replace("/user-portal/login");
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
      <div className="flex items-center justify-center min-h-screen bg-gray-50 text-gray-500">
        <Loader />
      </div>
    );
  }

  return isAuthorized ? <>{children}</> : null;
}
