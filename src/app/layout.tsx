import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/next"
import "./globals.css";
import { Suspense } from "react";
import { GoogleAnalytics } from '@next/third-parties/google'
import { ToastContainer } from "react-toastify";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const _inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Copiloto",
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const keyGa = process.env.NEXT_PUBLIC_KEY_GOOGLE_ANALYTICS as string
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased ${_inter.className}`}
      >
        <ToastContainer />
        <GoogleAnalytics gaId={keyGa} />
        <Suspense fallback={<></>}>
          {children}
          <Analytics />
        </Suspense>
      </body>
    </html>
  );
}