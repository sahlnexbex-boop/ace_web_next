"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getToken } from "@/lib/auth";

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true); // <-- new state
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const token = getToken();

    if (!token) {
      router.replace("/admin/auth/login");
    } else {
      setIsAuthorized(true);
    }

    // Wait until token check done
    setIsChecking(false);
  }, [router]);

  // While checking token — show nothing or a loader
  if (isChecking) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <p className="text-gray-500 text-sm">Checking authentication...</p>
      </div>
    );
  }

  // If authorized → show page
  return isAuthorized ? <>{children}</> : null;
}
