import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import { ToastProvider } from "@/contexts/ToastContext";
import { Nunito_Sans } from "next/font/google";

export const metadata: Metadata = {
  title: "Ace Institution",
  description: "Created by NexBex Solutions",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
    other: [
      {
        rel: "icon",
        url: "/favicon-32x32.png",
        sizes: "32x32",
      }
    ],
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
        <ToastProvider>{children}</ToastProvider>
        <Analytics />
      </body>
    </html>
  );
}
