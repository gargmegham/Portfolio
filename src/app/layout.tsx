import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/assets/css/globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://meghamgarg.com"),
  title: "Megham's Portfolio",
  description: "Portfolio of software projects by Megham Garg",
  applicationName: "Portfolio",
  authors: [
    {
      name: "Megham Garg",
      url: "mailto:meghamgarg@gmail.com",
    },
  ],
  keywords: [
    "portfolio",
    "software",
    "projects",
    "Megham Garg",
    "freelancer",
    "web developer",
    "AI expert",
  ],
  robots: "index, follow",
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
