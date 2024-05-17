"use client";
import React from "react";
import { FloatingNav } from "@/ui/aceternity/floating-navbar";
import { IconHome, IconMessage, IconUser } from "@tabler/icons-react";

export default function FloatingNavBar() {
  const navItems = [
    {
      name: "About Me",
      link: "/",
      icon: <IconHome className="h-4 w-4 text-neutral-500 dark:text-white" />,
    },
    {
      name: "My Work",
      link: "#about",
      icon: <IconUser className="h-4 w-4 text-neutral-500 dark:text-white" />,
    },
    {
      name: "Contact",
      link: "#contact",
      icon: (
        <IconMessage className="h-4 w-4 text-neutral-500 dark:text-white" />
      ),
    },
  ];
  return <FloatingNav navItems={navItems} />;
}
