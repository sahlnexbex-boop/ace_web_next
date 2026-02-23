"use client";

import { useEffect, useState } from "react";
import Marquee from "react-fast-marquee";
import { getServiceCarousels } from "@/lib/api/serviceCarousel";

interface ServiceCarouselItem {
  service_carousel_id: number;
  image_url: string;
  status: number;
}

export default function ServiceCarousel() {
  const [items, setItems] = useState<ServiceCarouselItem[]>([]);
  const [loading, setLoading] = useState(true);
  const server_url = process.env.NEXT_PUBLIC_API_BASE_URL;

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const res = await getServiceCarousels(1, 10, "", 1);
        const data = res?.data || [];
        setItems(data);
      } catch (err) {
        console.error("Error fetching service carousels:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, []);

  return (
    <section className="md:py-16 py-10 bg-gray-50 overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Title */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
           Aces in Governance
          </h2>
          <div className="mt-2 flex justify-center">
            <img
              src="/line_02.png"
              alt="underline"
              className="h-2 w-32 md:w-40 object-contain"
            />
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="text-center text-gray-500">Loading services...</div>
        ) : items.length === 0 ? (
          <div className="w-full flex justify-center items-center py-10">
            <img
              src="/no_data.png"
              alt="No Services"
              className="w-52 opacity-50"
            />
          </div>
        ) : (
          <div>
            <Marquee
              speed={70}
              gradient={true}
              gradientColor="white"
              gradientWidth={40}
              pauseOnHover={true}
              className="pb-10"
            >
              {items.map((item) => (
                <div
                  key={item.service_carousel_id}
                  className="mx-4 flex-shrink-0"
                >
                  <img
                    src={
                      server_url
                        ? server_url + item.image_url
                        : item.image_url
                    }
                    alt="Service"
                    className="h-48 md:h-88 object-contain rounded-lg"
                  />
                </div>
              ))}
            </Marquee>
          </div>
        )}
      </div>
    </section>
  );
}