import type { Metadata, Viewport } from "next";

import {
  Geist,
  Geist_Mono,
} from "next/font/google";

import { CartProvider } from "@/components/CartContext";

import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "THARU Watches",
  description: "Modern luxury watches built with bold restraint.",

  verification: {
    google: "Kp8W21hRvdD_W6LySEKsTO9IbV4QMc87LHk5Zn0aPrQ",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable}`}
    >

      <body>

        <CartProvider>

          {children}

        </CartProvider>

      </body>

    </html>
  );
}