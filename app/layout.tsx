import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import { ToastProvider } from "@/contexts/ToastContext";
import { Nunito_Sans } from "next/font/google";
import Script from "next/script";

export const metadata: Metadata = {
  metadataBase: new URL("https://aceinstitutions.com"),

  title: "Ace Institutions",
  description:
    "Tutorial offering exam assistance for exams like CTET, IAS, IBPS and tutoring subjects such as Civil Services",

  openGraph: {
    title: "Ace Institutions",
    description:
      "Tutorial offering exam assistance for exams like CTET, IAS, IBPS and tutoring subjects such as Civil Services",
    url: "https://aceinstitutions.com",
    siteName: "Ace Institutions",
    images: [
      {
        url: "https://aceinstitutions.com/ace_text.png",
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
      "Tutorial offering exam assistance for exams like CTET, IAS, IBPS and tutoring subjects such as Civil Services",
    images: ["https://aceinstitutions.com/ace_text.png"],
  },

  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.webp",
  },

  manifest: "/site.webmanifest",
};

const nunito = Nunito_Sans({
  subsets: ["latin"],
  variable: "--font-nunito",
  weight: [
    "200",
    "300",
    "400",
    "500",
    "600",
    "700",
    "800",
    "900",
  ],
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
      <body className="font-nunito">
        <Script
          async
          src={`https://www.googletagmanager.com/gtag/js?id=G-YRNGZYPFDN`}
        />
        <Script id="google-analytics">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-YRNGZYPFDN');
          `}
        </Script>
        <ToastProvider>{children}</ToastProvider>
        <Analytics />
      </body>
    </html>
  );
}
