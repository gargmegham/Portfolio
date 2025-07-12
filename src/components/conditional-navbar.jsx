"use client";

import { usePathname } from "next/navigation";
import NavBar from "@/components/navbar";

export default function ConditionalNavBar() {
  const pathname = usePathname();

  // Hide navbar on admin routes
  if (pathname.startsWith("/admin")) {
    return null;
  }

  return <NavBar />;
}
