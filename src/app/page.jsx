"use client";

import React, { useRef, useState, useEffect } from "react";
import Background from "@/components/background";
import NavBar from "@/components/navbar";
import Intro from "@/components/intro";
import ContactMe from "@/components/contact-me";
import Experience from "@/components/experience";
import Projects from "@/components/projects";

export default function Home() {
  const [visibleSections, setVisibleSections] = useState([]);
  const [scrollIndicatorHidden, setScrollIndicatorHidden] = useState(false);
  const intro = useRef(null);
  const servcy = useRef(null);
  const experience = useRef(null);
  const contactMe = useRef(null);

  useEffect(() => {
    const sections = [intro, servcy, experience, contactMe];
    const sectionObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          // if section is intersecting, and not already in visibleSections, add it to visibleSections
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
      // if section is visible, add it to the visibleSections
      if (section.current) {
        sectionObserver.observe(section.current);
      }
    });
    if (intro.current) {
      // if intro is visible, hide the scroll indicator
      indicatorObserver.observe(intro.current);
    }
    return () => {
      sectionObserver.disconnect();
      indicatorObserver.disconnect();
    };
  }, [visibleSections]);

  return (
    <main className="dark:bg-black bg-slate-50 relative overflow-x-hidden">
      <Background />
      <NavBar />
      <Intro ref={intro} scrollIndicatorHidden={scrollIndicatorHidden} />
      <Projects
        ref={[servcy]}
        visible={visibleSections.includes(servcy.current)}
      />
      <Experience
        ref={experience}
        visible={visibleSections.includes(experience.current)}
      />
      <ContactMe
        ref={contactMe}
        visible={visibleSections.includes(contactMe.current)}
      />
    </main>
  );
}
