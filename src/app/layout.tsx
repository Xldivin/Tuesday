"use client";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { GlobalStateProvider } from "@/context/GlobalStateContext";

const inter = Inter({ subsets: ["latin"] });

const metadata: Metadata = {
  title: "Tuesday Dashboard",
  description: "Tuesday Customer Dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <link href="https://fonts.cdnfonts.com/css/lufga" rel="stylesheet" />
      <body className={inter.className}>
        <GlobalStateProvider>
          {children}
        </GlobalStateProvider>
      </body>
    </html>
  );
}
