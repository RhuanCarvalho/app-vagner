import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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

export const metadata: Metadata = {
  title: "Car"
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const keyGa = process.env.NEXT_PUBLIC_KEY_GOOGLE_ANALYTICS as string
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ToastContainer />
        <GoogleAnalytics gaId={keyGa} />
        <Suspense fallback={<></>}>
          {children}
        </Suspense>
      </body>
    </html>
  );
}
