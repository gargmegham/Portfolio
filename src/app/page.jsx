"use client";

import React from "react";
import Background from "@/components/background";
import NavBar from "@/components/navbar";
import Intro from "@/components/intro";
import ContactMe from "@/components/contact-me";
import { TracingBeam } from "@/ui/aceternity/tracing-beam";
import Experience from "@/components/experience";
import Projects from "@/components/projects";

export default function Home() {
  return (
    <main className="dark:bg-black bg-slate-50 relative overflow-y-hidden">
      <Background />
      <NavBar />
      <TracingBeam>
        <Intro />
        <Projects />
        <Experience />
        <ContactMe />
      </TracingBeam>
    </main>
  );
}
