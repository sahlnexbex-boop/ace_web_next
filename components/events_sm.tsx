"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getEvents } from "@/lib/api/events";
import Loader from "./loader";

export default function Events() {
  const router = useRouter();
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const server_url = process.env.NEXT_PUBLIC_API_BASE_URL;

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const response = await getEvents(1, 4, "", 1);
        if (response?.data) {
          setEvents(response.data);
        } else {
          setEvents([]);
        }
      } catch (error) {
        console.error("Error fetching events:", error);
        setEvents([]);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  return (
    <section className="bg-[#daeef1] md:py-16 py-10 px-6 md:px-10">
      <div className="max-w-7xl mx-auto text-center">
        <h2 className="text-2xl md:text-3xl font-bold md:mb-10 mb-8 text-cyan-900">
          ACE Events
        </h2>

        {loading && <Loader />}

        {!loading && events.length === 0 && (
          <div className="flex justify-center items-center min-h-[70vh] md:min-h-auto">
            <img src="../../no_data.png" alt="no data" className="opacity-30" />
          </div>
        )}

        {/* Events Grid */}
        {!loading && events.length > 0 && (
          <div className="grid sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
            {events.map((ev) => (
              <div
                key={ev.event_id}
                onClick={() =>
                  router.push(`/highlights/events/${ev.event_id}`)
                }
                className="bg-white rounded-xl shadow-md overflow-hidden cursor-pointer group transition-all duration-300 hover:shadow-lg"
              >
                <div className="overflow-hidden">
                  <img
                    src={server_url + ev.event_image}
                    alt={ev.event_title}
                    className="w-full h-48 object-cover transform transition-transform duration-500 ease-in-out group-hover:scale-110"
                  />
                </div>
                <div className="px-4 pb-6 pt-3 text-center">
                  <h3 className="font-semibold text-lg text-[#087fc2]">
                    {ev.event_title}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {new Date(ev.date_time).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {ev.event_location}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
