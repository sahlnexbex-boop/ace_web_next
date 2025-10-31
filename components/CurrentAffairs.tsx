"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getCurrentAffairs } from "@/lib/api/current-affair";
import Loader from "./loader";

export default function CurrentAffairs({ activeCategory }: { activeCategory: number | null }) {
  const [affairs, setAffairs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchAffairs = async () => {
      try {
        const res = await getCurrentAffairs(1, 10, "", {
          status: 1,
          category_id: activeCategory || undefined,
        });
        setAffairs(res?.data || []);
      } catch (err) {
        console.error("Error fetching affairs:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAffairs();
  }, [activeCategory]);

  if (loading) return <Loader/>;
  if (!affairs.length) return <div className="flex justify-start items-center">
    <img src="../no_data.png" alt="" className="w-52 opacity-40" />
  </div>;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {affairs.map((item) => (
        <div key={item.affair_id} className="bg-white p-5 rounded-xl shadow hover:shadow-lg transition">
          {/* <img src={item.affair_file} alt={item.affair_title} className="rounded-md mb-3 w-full h-40 object-cover" /> */}
          <h3 className="font-semibold text-gray-800">{item.affair_title}</h3>
          <p className="text-sm text-[#087fc2]">
            Published: {new Date(item.publishing_date).toLocaleDateString()}
          </p>
          <div className="w-full flex justify-end px-3">
            <button
              onClick={() => router.push(`/public/learners/affaires/${item.affair_id}`)}
              className="border mt-5 rounded-full border-black px-2 py-1 hover:bg-gray-100 transition cursor-pointer"
            >
              ➜
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
