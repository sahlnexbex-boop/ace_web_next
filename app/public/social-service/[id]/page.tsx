"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { getSocialServiceById, getSocialServices } from "@/lib/api/socialService";

export default function ServiceDetail() {
  const { id } = useParams();
  const server_url = process.env.NEXT_PUBLIC_API_BASE_URL;

  const [serviceData, setServiceData] = useState<any>(null);
  const [recentServices, setRecentServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServiceData = async () => {
      try {
        // Fetch service detail
        const serviceRes = await getSocialServiceById(Number(id));
        if (serviceRes?.data) {
          setServiceData(serviceRes.data);
        }

        // Fetch recent services
        const recentRes = await getSocialServices(1, 6, "", "1");
        if (recentRes?.data) {
          const filtered = recentRes.data.filter(
            (s: any) => s.service_id !== Number(id)
          );
          setRecentServices(filtered);
        }
      } catch (error) {
        console.error("Error fetching service data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchServiceData();
  }, [id]);

  if (loading) {
    return (
      <section className="py-12 text-center">
        <h2 className="text-2xl font-semibold text-gray-500">
          Loading service details...
        </h2>
      </section>
    );
  }

  if (!serviceData) {
    return (
      <section className="py-12 text-center">
        <h2 className="text-2xl font-semibold text-gray-700">
          Service not found.
        </h2>
      </section>
    );
  }

  const {
    service_title,
    service_description,
    service_image,
    service_date,
    service_location,
    other_images,
  } = serviceData;

  let galleryImages: string[] = [];
  try {
    galleryImages = JSON.parse(other_images || "[]");
  } catch {
    galleryImages = [];
  }

  return (
    <section className="py-12">
      <div className="max-w-7xl mx-auto px-4 lg:px-10 flex flex-col lg:flex-row gap-10">
        <div className="flex-1">
          <nav className="text-sm text-gray-500 mb-4">
            <Link href="/public/social-service" className="hover:text-blue-600">
              Social Service
            </Link>{" "}
            / {service_title}
          </nav>

          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            {service_title}
          </h1>

          <p className="text-blue-600 text-sm mb-6">
            {service_date
              ? new Date(service_date).toLocaleDateString("en-IN", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })
              : ""}
            {service_location ? ` • ${service_location}` : ""}
          </p>

          <img
            src={server_url + service_image}
            alt={service_title}
            className="rounded-lg w-full h-auto mb-6 border border-gray-200"
          />

          <div className="prose max-w-none text-gray-700 whitespace-pre-line leading-relaxed">
            {service_description}
          </div>

          {galleryImages.length > 0 && (
            <div className="mt-10">
              <h3 className="text-lg font-semibold mb-4">Gallery</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {galleryImages.map((img, idx) => (
                  <div
                    key={idx}
                    className="rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                  >
                    <img
                      src={server_url + img}
                      alt={`Gallery image ${idx + 1}`}
                      className="w-full h-40 object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <aside className="w-full lg:w-80 flex-shrink-0">
          <h3 className="text-lg font-semibold mb-4">Recent Services</h3>

          {recentServices.length === 0 ? (
            <p className="text-sm text-gray-500">No recent services found.</p>
          ) : (
            <div className="flex flex-col gap-5">
              {recentServices.map((service) => (
                <Link
                  key={service.service_id}
                  href={`/public/social-service/${service.service_id}`}
                  className="flex gap-3 items-start group"
                >
                  <div className="w-20 h-16 overflow-hidden rounded-lg flex-shrink-0">
                    <img
                      src={server_url + service.service_image}
                      alt={service.service_title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>

                  <div>
                    <p className="text-xs text-gray-500">
                      {new Date(service.service_date).toLocaleDateString(
                        "en-IN",
                        {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        }
                      )}
                    </p>
                    <p className="font-medium text-gray-800 group-hover:text-blue-600 text-sm line-clamp-2">
                      {service.service_title}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </aside>
      </div>
    </section>
  );
}