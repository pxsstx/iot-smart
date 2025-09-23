import type React from "react";
import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { Analytics } from "@vercel/analytics/next";
import { LiffProvider } from "@/components/liff-provider";
import { Suspense } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "Grow a Gerden",
  description: "Grow a Gerden",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <Suspense fallback={<div>Loading...</div>}>
          <LiffProvider>{children}</LiffProvider>
        </Suspense>
        <Analytics />
      </body>
    </html>
  );
}
