"use client";
import { removeToken } from "@/lib/auth";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const router = useRouter();

  const handleLogout = () => {
    removeToken();
    router.push("/admin/auth/login");
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
      <p className="text-gray-600 mb-4">Welcome, you are logged in successfully!</p>
      <button
        onClick={handleLogout}
        className="bg-red-600 cursor-pointer text-white px-4 py-2 rounded-lg hover:bg-red-700"
      >
        Logout
      </button>
    </div>
  );
}
