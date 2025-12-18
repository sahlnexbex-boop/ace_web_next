"use client";

import { useEffect, useState } from "react";
import { getStudyServices } from "@/lib/api/studyService";

const LIMIT = 9;

export default function StudyServiceList({
  activeCategory,
  serviceType,
}: {
  activeCategory: number | null;
  serviceType: number;
}) {
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const server_url = process.env.NEXT_PUBLIC_API_BASE_URL;

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

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

  //  Reset page when category or tab changes
  useEffect(() => {
    setPage(1);
  }, [activeCategory, serviceType]);

  useEffect(() => {
    const fetchServices = async () => {
      setLoading(true);
      try {
        const res = await getStudyServices(
          page,
          LIMIT,
          "",
          1,
          serviceType,
          activeCategory || undefined
        );

        setServices(res?.data || []);
        setTotalPages(res?.totalPages || 1);
      } catch (err) {
        console.error("Error fetching study services:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, [page, activeCategory, serviceType]);

  if (loading) return <p>Loading...</p>;

  if (!services.length)
    return (
      <div className="flex md:justify-start justify-center items-center">
        <img src="../no_data.png" alt="" className="w-52 opacity-40" />
      </div>
    );

  return (
    <>
      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((item) => (
          <div
            key={item.service_id}
            className="bg-white p-5 rounded-xl shadow hover:shadow-lg transition"
          >
            <img src="/pdf.png" alt="" className="mb-2 w-8" />
            <h3 className="font-semibold text-gray-800">
              {item.service_title}
            </h3>
            <p className="text-sm text-gray-500 mb-3">
              {item.category?.category_name || ""}
            </p>
            <a
              href={server_url + item.service_file}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-blue-500 text-white px-4 py-2 rounded-lg text-sm hover:opacity-90 inline-block"
            >
              Download
            </a>
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
