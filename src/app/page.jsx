"use client";

import React, { useRef, useState, useEffect } from "react";
import Background from "@/components/background";
import NavBar from "@/components/navbar";
import Intro from "@/components/intro";
import ContactMe from "@/components/contact-me";
import { TracingBeam } from "@/ui/aceternity/tracing-beam";
import Experience from "@/components/experience";
import Projects from "@/components/projects";

export default function Home() {
  const [visibleSections, setVisibleSections] = useState([]);
  const [scrollIndicatorHidden, setScrollIndicatorHidden] = useState(false);
  const intro = useRef(null);
  const projects = useRef(null);
  const experience = useRef(null);
  const contactMe = useRef(null);

  useEffect(() => {
    const sections = [intro, projects, experience, contactMe];
    const sectionObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const section = entry.target;
            observer.unobserve(section);
            if (!visibleSections.includes(section)) {
              setVisibleSections((prevSections) => [...prevSections, section]);
            }
          }
        });
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.1 }
    );
    const indicatorObserver = new IntersectionObserver(
      ([entry]) => {
        setScrollIndicatorHidden(!entry.isIntersecting);
      },
      { rootMargin: "-100% 0px 0px 0px" }
    );

    sections.forEach((section) => {
      if (section.current) {
        sectionObserver.observe(section.current);
      }
    });

    if (intro.current) {
      indicatorObserver.observe(intro.current);
    }

    return () => {
      sectionObserver.disconnect();
      indicatorObserver.disconnect();
    };
  }, [visibleSections]);

  return (
    <main className="dark:bg-black bg-slate-50 relative overflow-y-hidden">
      <Background />
      <NavBar />
      <TracingBeam>
        <Intro ref={intro} scrollIndicatorHidden={scrollIndicatorHidden} />
        <Projects ref={projects} />
        <Experience ref={experience} />
        <ContactMe ref={contactMe} />
      </TracingBeam>
    </main>
  );
}
