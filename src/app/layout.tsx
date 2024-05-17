import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { useEffect } from "react";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Megham's Portfolio",
  description: "Portfolio of software projects by Megham Garg",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
