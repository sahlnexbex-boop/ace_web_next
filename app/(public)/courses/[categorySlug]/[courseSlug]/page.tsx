import type { Metadata } from "next";
import CourseDetailsClient from "./CourseDetailsClient";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "";
const SITE_URL = "https://aceinstitutions.com";

// ── Fetch course data server-side for metadata ──────────────────────────────
async function getCourseData(courseSlug: string) {
  try {
    const res = await fetch(`${BASE_URL}/api/courses/slug/${courseSlug}`, {
      next: { revalidate: 3600 }, // cache for 1 hour
    });
    if (!res.ok) return null;
    const json = await res.json();
    return json?.data || null;
  } catch {
    return null;
  }
}

// ── Dynamic Metadata ────────────────────────────────────────────────────────
export async function generateMetadata({
  params,
}: {
  params: { categorySlug: string; courseSlug: string };
}): Promise<Metadata> {
  const course = await getCourseData(params.courseSlug);

  if (!course) {
    return {
      title: "Course Not Found | Ace Institutions",
      description: "The course you are looking for could not be found.",
    };
  }

  const title = `${course.course_name} | Ace Institutions`;
  const description =
    course.course_description ||
    `Enroll in ${course.course_name} at Ace Institutions. Expert coaching for competitive exams. Online & Offline classes available.`;

  const imageUrl = course.course_image
    ? `${BASE_URL}${course.course_image}`
    : `${SITE_URL}/meta.jpeg`;

  const pageUrl = `${SITE_URL}/courses/${params.categorySlug}/${params.courseSlug}`;

  return {
    title,
    description,

    alternates: {
      canonical: pageUrl,
    },

    openGraph: {
      title,
      description,
      url: pageUrl,
      siteName: "Ace Institutions",
      type: "website",
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: course.course_name,
        },
      ],
      locale: "en_IN",
    },

    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
    },

    keywords: [
      course.course_name,
      course.category?.category_name,
      "Ace Institutions",
      "Kerala PSC coaching",
      "competitive exam coaching",
      "online coaching",
      "offline coaching",
    ]
      .filter(Boolean)
      .join(", "),
  };
}

// ── Page (Server Component) ─────────────────────────────────────────────────
export default function CourseDetailsPage({
  params,
}: {
  params: { categorySlug: string; courseSlug: string };
}) {
  return <CourseDetailsClient params={params} />;
}
