"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { getEventById } from "@/lib/api/events";
import { Home } from "lucide-react";
import Loader from "@/components/loader";

export default function EventDetailsPage() {
  const { id } = useParams(); 
  const [event, setEvent] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchEvent = async () => {
      try {
        setLoading(true);
        const response = await getEventById(Number(id));
        if (response?.data) {
          setEvent(response.data);
        }
      } catch (error) {
        console.error("Error fetching event:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id]);

  return (
    <section className="bg-[#f7fbff] min-h-screen py-10 px-6 md:px-12">
      <div className="max-w-4xl mx-auto">
        {/* Breadcrumb */}
        <nav className="text-sm text-gray-500 mb-6">
          <ol className="flex items-center space-x-2">
            <li>
              <Link href="/public/home" className="hover:text-cyan-600">
                <Home className="w-4 h-4" />
              </Link>
            </li>
            <li>/</li>
            <li>
              <Link href="/public/highlights" className="hover:text-cyan-600">
                Highlights
              </Link>
            </li>
            <li>/</li>
            <li className="text-gray-700 font-medium">
              {loading ? "Loading..." : event?.event_title || "Event Details"}
            </li>
          </ol>
        </nav>

        {loading && (
          <Loader />
        )}

        {!loading && event && (
          <>
            <div className="mb-8">
              <h1 className="text-2xl md:text-4xl font-bold text-gray-900 mb-2">
                {event.event_title}
              </h1>
              <p className="text-cyan-600 font-medium">
                {new Date(event.date_time).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
              {event.event_location && (
                <p className="text-gray-600 text-sm mt-1">
                  📍 {event.event_location}
                </p>
              )}
            </div>

            {event.event_image && (
              <div className="rounded-xl overflow-hidden border border-cyan-200 mb-8">
                <img
                  src={event.event_image}
                  alt={event.event_title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            <div className="text-gray-700 leading-relaxed space-y-4 text-[15px] md:text-base">
              <p>{event.event_description}</p>
            </div>
          </>
        )}

        {/* No Data */}
        {!loading && !event && (
         <div className="flex justify-center items-center min-h-[70vh] md:min-h-auto">
            <img src="../../no_data.png" alt="no data" className="opacity-30" />
          </div>
        )}
      </div>
    </section>
  );
}
