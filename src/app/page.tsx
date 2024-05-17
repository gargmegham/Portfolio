"use client";

import React from "react";
import Background from "@/components/background";
import NavBar from "@/components/navbar";

export default function Home() {
  return (
    <main className="dark:bg-black bg-slate-50">
      <Background />
      <NavBar />
    </main>
  );
}
