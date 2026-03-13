import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import { ToastProvider } from "@/contexts/ToastContext";
import { Nunito_Sans } from "next/font/google";
import GoogleAnalytics from "@/components/GoogleAnalytics";

export const metadata: Metadata = {
  metadataBase: new URL("https://aceinstitutions.com"),

  title: "Ace Institutions",
  description:
    "Join Ace Institutions - Kerala's leading PSC coaching center since 2003. Expert guidance for Kerala PSC, SSC, Banking, RRB & Teaching exams. 25,000+ successful students. Online & Offline courses available.",

  openGraph: {
    title: "Ace Institutions - Kerala PSC Coaching Since 2003",
    description:
      "Kerala's leading PSC coaching since 2003. 25,000+ successful students. Expert training for Kerala PSC, SSC, Banking exams. Online & offline courses.",
    url: "https://aceinstitutions.com",
    siteName: "Ace Institutions",
    images: [
      {
        url: "https://aceinstitutions.com/meta.jpeg",
        width: 1200,
        height: 630,
        alt: "Ace Institutions",
      },
    ],
    locale: "en_US",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "Ace Institutions",
    description:
      "Join Ace Institutions - Kerala's leading PSC coaching center since 2003. Expert guidance for Kerala PSC, SSC, Banking, RRB & Teaching exams. 25,000+ successful students. Online & Offline courses available.",
    images: ["https://aceinstitutions.com/meta.jpeg"],
  },

  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.webp",
  },

  manifest: "/site.webmanifest",
  alternates: {
    canonical: "https://aceinstitutions.com",
  },
};

const nunito = Nunito_Sans({
  subsets: ["latin"],
  variable: "--font-nunito",
  display: "swap",
  weight: ["200", "300", "400", "500", "600", "700", "800", "900"],
});


export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en"
      className={`
        ${nunito.variable}
        ${GeistSans.variable}
        ${GeistMono.variable}
      `}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "Ace Institutions",
              "url": "https://aceinstitutions.com",
              "logo": "https://aceinstitutions.com/logo_blue.png",
              "contactPoint": {
                "@type": "ContactPoint",
                "telephone": "+91-9995076789",
                "contactType": "customer service"
              },
              "sameAs": [
                "https://www.facebook.com/aceinstitutions",
                "https://www.instagram.com/aceinstitutions"
              ]
            })
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "url": "https://aceinstitutions.com",
              "potentialAction": {
                "@type": "SearchAction",
                "target": "https://aceinstitutions.com/public/search?q={search_term_string}",
                "query-input": "required name=search_term_string"
              }
            })
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "ItemList",
              "itemListElement": [
                {
                  "@type": "SiteNavigationElement",
                  "position": 1,
                  "name": "Courses",
                  "url": "https://aceinstitutions.com/public/courses"
                },
                {
                  "@type": "SiteNavigationElement",
                  "position": 2,
                  "name": "Learners Portal",
                  "url": "https://aceinstitutions.com/public/learners"
                },
                {
                  "@type": "SiteNavigationElement",
                  "position": 3,
                  "name": "Rank Holders",
                  "url": "https://aceinstitutions.com/public/exams"
                },
                {
                  "@type": "SiteNavigationElement",
                  "position": 4,
                  "name": "Highlights",
                  "url": "https://aceinstitutions.com/public/highlights"
                },
                {
                  "@type": "SiteNavigationElement",
                  "position": 5,
                  "name": "About Us",
                  "url": "https://aceinstitutions.com/public/about"
                },
                {
                  "@type": "SiteNavigationElement",
                  "position": 6,
                  "name": "Contact Us",
                  "url": "https://aceinstitutions.com/public/contact"
                }
              ]
            })
          }}
        />
      </head>
      <body className="font-nunito">
        <GoogleAnalytics GA_MEASUREMENT_ID={process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || "G-YRNGZYPFDN"} />
        <ToastProvider>{children}</ToastProvider>
        <Analytics />
      </body>
    </html>
  );
}
