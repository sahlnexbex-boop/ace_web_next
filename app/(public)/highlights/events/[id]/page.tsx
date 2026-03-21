"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { getEventById } from "@/lib/api/events";
import { Home, MapPin } from "lucide-react";
import Loader from "@/components/loader";

export default function EventDetailsPage() {
  const { id } = useParams();
  const [event, setEvent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const server_url = process.env.NEXT_PUBLIC_API_BASE_URL;

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
      <div className="max-w-7xl mx-auto md:px-16">
        {/* Breadcrumb */}
        <nav className="text-sm text-gray-500 mb-6">
          <ol className="flex items-center space-x-2">
            <li>
              <Link href="/" className="hover:text-cyan-600">
                <Home className="w-4 h-4" />
              </Link>
            </li>
            <li>/</li>
            <li>
              <Link href="/highlights" className="hover:text-cyan-600">
                Highlights
              </Link>
            </li>
            <li>/</li>
            <li className="text-gray-700 font-medium">
              {loading ? "Loading..." : event?.event_title || "Event Details"}
            </li>
          </ol>
        </nav>

        {loading && <Loader />}

        {!loading && event && (
          <>
            {(() => {
              let otherImages: string[] = [];
              if (event.other_images) {
                try {
                  otherImages =
                    typeof event.other_images === "string"
                      ? JSON.parse(event.other_images)
                      : Array.isArray(event.other_images)
                        ? event.other_images
                        : [];
                } catch (err) {
                  console.error("Failed to parse other_images:", err);
                  otherImages = [];
                }
              }

              const hasOtherImages = otherImages.length > 0;

              return (
                <>
                  {/* Title and Header Section */}
                  <div className={`mb-8 ${hasOtherImages ? '' : 'flex justify-center'}`}>
                    <div className={`${hasOtherImages ? '' : 'w-full max-w-2xl'}`}>
                      <h1 className="text-2xl md:text-4xl font-bold text-gray-900 mb-2">
                        {event.event_title}
                      </h1>
                      <div className="flex items-center gap-5">
                        {event.event_location && (
                          <div className="text-gray-600 flex items-center text-sm">
                            <MapPin className="w-4 h-4 inline mr-1" />{" "}
                            <span>{event.event_location}</span>
                          </div>
                        )}
                        <p className="text-cyan-600 font-medium">
                          {new Date(event.date_time).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Main Content with Sidebar Images */}
                  <div className={`mb-8 ${hasOtherImages ? 'grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-16' : 'flex justify-center'}`}>
                    {/* Main Content */}
                    <div className={`${hasOtherImages ? 'md:col-span-2' : 'w-full max-w-2xl'}`}>
                      {event.event_image && (
                        <div className="rounded-xl overflow-hidden border border-cyan-200 mb-8">
                          <img
                            src={server_url + event.event_image}
                            alt={event.event_title}
                            className="w-full h-auto object-cover"
                          />
                        </div>
                      )}

                      <div className="text-gray-700 leading-relaxed space-y-4 text-[15px] md:text-base">
                        <p>{event.event_description}</p>
                      </div>
                    </div>

                    {/* Right Sidebar - Other Images */}
                    {hasOtherImages && (
                      <div className="md:col-span-1">
                        <div className="rounded-xl sticky top-4">
                          <h3 className="text-lg font-semibold text-gray-900 mb-4">
                            Event Gallery
                          </h3>
                          <div className="grid grid-cols-1 gap-3">
                            {otherImages.map((img, idx) => (
                              <div
                                key={idx}
                                className="group relative rounded-lg overflow-hidden border border-cyan-100 hover:border-cyan-400 transition-all cursor-pointer"
                              >
                                <img
                                  src={server_url + img}
                                  alt={`Gallery ${idx + 1}`}
                                  className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                                />
                                <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </>
              );
            })()}
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
