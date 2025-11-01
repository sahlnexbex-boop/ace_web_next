"use client";

import { useEffect, useState } from "react";
import { getStudyServices } from "@/lib/api/studyService";

export default function StudyServiceList({
  activeCategory,
  serviceType,
}: {
  activeCategory: number | null;
  serviceType: number;
}) {
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await getStudyServices(1, 10, "", 1, serviceType, activeCategory || undefined);
        setServices(res?.data || []);
      } catch (err) {
        console.error("Error fetching study services:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, [activeCategory, serviceType]);

  if (loading) return <p>Loading...</p>;
  if (!services.length) return  <div className="flex md:justify-start justify-center items-center">
    <img src="../no_data.png" alt="" className="w-52 opacity-40" />
  </div>;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {services.map((item) => (
        <div key={item.service_id} className="bg-white p-5 rounded-xl shadow hover:shadow-lg transition">
          <img src="/pdf.png" alt="" className="mb-2 w-8" />
          <h3 className="font-semibold text-gray-800">{item.service_title}</h3>
          <p className="text-sm text-gray-500 mb-3">
            {item.category?.category_name || ""}
          </p>
          <a
            href={item.service_file}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-blue-500 text-white px-4 py-2 rounded-lg text-sm cursor-pointer hover:opacity-90 inline-block"
          >
            Download
          </a>
        </div>
      ))}
    </div>
  );
}
