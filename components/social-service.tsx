"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { gsap } from "gsap";
import { getSocialServices } from "@/lib/api/socialService";

export default function SocialService() {
  const router = useRouter();

  const [programmes, setProgrammes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const sectionRef = useRef<HTMLDivElement | null>(null);
  const rotatedLogoRef = useRef<HTMLImageElement | null>(null);
  const normalLogoRef = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getSocialServices(1, 4, "", "1"); 
        const list = res?.data || [];
        setProgrammes(list);
      } catch (error) {
        console.error("Error fetching social services:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
          if (rotatedLogoRef.current && normalLogoRef.current) {
            tl.fromTo(rotatedLogoRef.current, { opacity: 0, scale: 0.7 }, { opacity: 1, scale: 1, duration: 0.8 });
            tl.fromTo(normalLogoRef.current, { opacity: 0, scale: 0.7 }, { opacity: 1, scale: 1, duration: 0.8 }, "-=0.7");
          }
          observer.disconnect();
        }
      },
      { threshold: 0.5 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  if (loading) {
    return (
      <section className="md:py-16 py-10 bg-gray-50 text-center">
        <h2 className="text-2xl font-semibold text-gray-800">Loading...</h2>
      </section>
    );
  }

  if (!programmes.length) {
    return (
      <section className="md:py-16 py-10 bg-gray-50 text-center">
        <h2 className="text-2xl font-semibold text-gray-800">No Services Found</h2>
      </section>
    );
  }

  return (
    <section ref={sectionRef} className="md:py-16 py-10 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
        <div className="lg:grid lg:grid-cols-3 flex flex-col gap-6 items-start">
          <div className="md:col-span-2">
            <div className="relative inline-block mb-10">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                Social Service Programme
              </h2>
              <img
                src="/line_01.png"
                alt="underline"
                className="absolute left-32 -bottom-3 w-20 hidden lg:block"
              />
            </div>

            {/* Programme Cards */}
            <div className="grid grid-cols-2 gap-4 lg:gap-6 auto-rows-[90px] lg:auto-rows-[100px] max-w-full">
              {programmes.map((programme, index) => (
                <Button
                  key={programme.service_id}
                  variant="outline"
                  onClick={() =>
                    router.push(`/social-service/${programme.service_id}`)
                  }
                  className={`flex flex-col items-start justify-between text-left shadow-md rounded-3xl px-4 sm:px-6 py-4 sm:py-6 
                    transition-all duration-300 cursor-pointer h-full bg-white text-gray-800 
                    hover:text-white hover:bg-gradient-to-r hover:from-blue-500 hover:to-blue-700
                    ${index === 3 ? "row-span-2" : ""}
                  `}
                >
                  <span className="text-sm sm:text-base lg:text-base font-medium leading-snug whitespace-pre-line">
                    {programme.service_title}
                  </span>
                  {programme.service_image && (
                    <img
                      src={programme.service_image}
                      alt={programme.service_title}
                      className="hidden"
                    />
                  )}
                  <ArrowRight className="w-4 sm:w-5 h-4 sm:h-5 mt-2 sm:mt-3 ml-auto text-cyan-600 group-hover:text-white transition-colors" />
                </Button>
              ))}
            </div>
          </div>

          <div className="relative h-full flex items-stretch justify-center lg:justify-end mt-6 lg:mt-0">
            {/* Desktop logos */}
            <div className="hidden lg:block relative h-full w-full">
              <img
                ref={rotatedLogoRef}
                src="/logo_full.png"
                alt="rotated_logo"
                className="w-40 md:w-72 h-40 md:h-56 transform rotate-180 absolute left-0 top-16"
              />
              <img
                ref={normalLogoRef}
                src="/logo_full.png"
                alt="normal_logo"
                className="w-40 md:w-72 h-40 md:h-56 absolute right-0 bottom-0"
              />
            </div>

            {/* Mobile logos */}
            <div className="flex lg:hidden flex-row gap-4 justify-center w-full">
              <img ref={rotatedLogoRef} src="/logo_full.png" alt="rotated_logo" className="w-24 sm:w-32 h-auto" />
              <img ref={normalLogoRef} src="/logo_full.png" alt="normal_logo" className="w-24 sm:w-32 h-auto" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
