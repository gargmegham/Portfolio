"use client";

import React, { useRef } from "react";
import { ProjectSummary } from "@/ui/three/project-summary";

export default function Projects() {
  const projectOne = useRef();
  return (
    <div id="projects" className="max-lg:px-[10%] relative lg:pt-16 w-full">
      <ProjectSummary
        alternate={false}
        sectionRef={projectOne}
        visible={true}
        index={1}
        title="Project Tracker For Agencies"
        description="A project management tool for agencies to track their projects timeline, budget, and resources."
        buttonText="View project"
        buttonLink="https://servcy.com"
        model={{
          type: "laptop",
          alt: "Servcy: Project Tracker For Agencies",
          textures: [
            {
              srcSet: "/images/servcy.png 1280w",
              placeholder: "/images/placeholder.jpg",
            },
          ],
        }}
      />
    </div>
  );
}
