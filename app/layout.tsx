import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'
import Header from '@/components/header'
import Footer from "@/components/footer"

export const metadata: Metadata = {
  title: 'Ace Institution',
  description: 'Created by SahlCT',
  generator: 'Next Js',
   icons: {
    icon: './favicon.ico',
    shortcut: './logo_full.png',
    apple: './logo_full.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <Header/>
        {children}
        <Footer/>
        <Analytics />
      </body>
    </html>
  )
}
