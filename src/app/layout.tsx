// NOTE: Do NOT add 'use client' to this file. This layout must be a server component to export metadata in Next.js App Router.
// The LockScreen client component can still be rendered from here.

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import LockScreen from "@/components/ui/LockScreen";
import LockScreenProvider from "@/components/ui/LockScreenProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`min-h-screen w-full ${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* Provide lock state to all components via client provider */}
        <LockScreenProvider>
          {/* MacBook-style LockScreen overlay (renders above all content) */}
          <LockScreen />
          {/* Main app content */}
          {children}
        </LockScreenProvider>
      </body>
    </html>
  );
}
