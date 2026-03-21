"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getCurrentAffairs } from "@/lib/api/current-affair";
import Loader from "./loader";

const LIMIT = 9;

export default function CurrentAffairs({
  activeCategory,
}: {
  activeCategory: number | null;
}) {
  const [affairs, setAffairs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const server_url = process.env.NEXT_PUBLIC_API_BASE_URL;


  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const router = useRouter();

  const scrollPageToTop = () => {
    document.documentElement.scrollTo({
      top: 0,
      behavior: "smooth",
    });

    document.body.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    scrollPageToTop();
  }, [page]);

  //  Reset page when category changes
  useEffect(() => {
    setPage(1);
  }, [activeCategory]);

  useEffect(() => {
    const fetchAffairs = async () => {
      setLoading(true);
      try {
        const res = await getCurrentAffairs(page, LIMIT, "", {
          status: 1,
          category_id: activeCategory || undefined,
        });

        setAffairs(res?.data || []);
        setTotalPages(res?.totalPages || 1);
      } catch (err) {
        console.error("Error fetching affairs:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAffairs();
  }, [page, activeCategory]);

  if (loading) return <Loader />;

  if (!affairs.length)
    return (
      <div className="flex md:justify-start justify-center items-center">
        <img src="../no_data.png" alt="" className="w-52 opacity-40" />
      </div>
    );

  return (
    <>
      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {affairs.map((item) => (
          <div
            key={item.affair_id}
            className="bg-white p-5 rounded-xl shadow hover:shadow-lg transition"
          >
            <h3 className="font-semibold text-gray-800">{item.affair_title}</h3>
            <p className="text-sm text-[#087fc2]">
              Published: {new Date(item.publishing_date).toLocaleDateString()}
            </p>

            <div className="w-full flex justify-end px-3">
              <button
                onClick={() =>
                  router.push(`/learners/affaires/${item.affair_id}`)
                }
                className="border mt-5 rounded-full border-black px-2 py-1 hover:bg-gray-100 transition cursor-pointer"
              >
                ➜
              </button>
            </div>
          </div>
        ))}
      </div>

      {/*  Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-8">
          <button
            onClick={() => {
              setPage((p) => p - 1);
              scrollPageToTop();
            }}
            disabled={page === 1}
            className={`px-4 py-2 rounded-lg border text-sm
              ${
                page === 1
                  ? "text-gray-400 border-gray-300 cursor-not-allowed"
                  : "border-cyan-500 text-cyan-600 hover:bg-cyan-500 hover:text-white cursor-pointer"
              }`}
          >
            Prev
          </button>

          <span className="text-sm text-gray-600">
            Page <b>{page}</b> of <b>{totalPages}</b>
          </span>

          <button
             onClick={() => {
              setPage((p) => p + 1);
              scrollPageToTop();
            }}
            disabled={page === totalPages}
            className={`px-4 py-2 rounded-lg border text-sm
              ${
                page === totalPages
                  ? "text-gray-400 border-gray-300 cursor-not-allowed"
                  : "border-cyan-500 text-cyan-600 hover:bg-cyan-500 hover:text-white cursor-pointer"
              }`}
          >
            Next
          </button>
        </div>
      )}
    </>
  );
}
