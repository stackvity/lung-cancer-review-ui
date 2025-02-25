import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import IntlProviders from "./IntlProviders"; // <-- Import the IntlProviders Client Component

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AI Lung Cancer Review System", // More descriptive title
  description:
    "Patient-Centric AI Lung Cancer Diagnosis and Treatment Recommendation System Frontend", // More descriptive description
};

// RootLayout is now a Server Component again (no "use client")
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      {" "}
      {/* Set lang attribute - you can adjust this if needed, or let LocaleProvider handle it */}
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <IntlProviders>
          {" "}
          {/* Wrap children with IntlProviders */}
          {children}
        </IntlProviders>
      </body>
    </html>
  );
}
