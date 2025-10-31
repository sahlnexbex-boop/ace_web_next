import Image from "next/image";
import Link from "next/link";
import { getSocialServiceById, getSocialServices } from "@/lib/api/socialService";

export default async function ServiceDetail({ params }: { params: { id: string } }) {
  const { id } = params;

  let serviceData: any = null;
  try {
    const res = await getSocialServiceById(Number(id));
    serviceData = res?.data || null;
  } catch (error) {
    console.error("Error fetching service detail:", error);
  }

  let recentServices: any[] = [];
  try {
    const res = await getSocialServices(1, 6, "", "1");
    recentServices =
      res?.data?.filter((s: any) => s.service_id !== Number(id)) || [];
  } catch (error) {
    console.error("Error fetching recent services:", error);
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

          <div className="rounded-xl overflow-hidden mb-8">
            <Image
              src={service_image}
              alt={service_title}
              width={700}
              height={400}
              className="w-full object-cover"
            />
          </div>

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
                    <Image
                      src={img}
                      alt={`Gallery image ${idx + 1}`}
                      width={300}
                      height={200}
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

          <div className="flex flex-col gap-5">
            {recentServices.map((service) => (
              <Link
                key={service.service_id}
                href={`/public/social-service/${service.service_id}`}
                className="flex gap-3 items-start group"
              >
                <div className="w-20 h-16 overflow-hidden rounded-lg flex-shrink-0">
                  <Image
                    src={service.service_image}
                    alt={service.service_title}
                    width={80}
                    height={60}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>

                <div>
                  <p className="text-xs text-gray-500">
                    {new Date(service.service_date).toLocaleDateString("en-IN", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </p>
                  <p className="font-medium text-gray-800 group-hover:text-blue-600 text-sm line-clamp-2">
                    {service.service_title}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </aside>
      </div>
    </section>
  );
}
