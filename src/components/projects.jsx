"use client";

import React, { forwardRef } from "react";
import ProjectSummary from "@/ui/three/project-summary";

const Projects = forwardRef(({ ref, visible }) => {
  return (
    <div id="projects" className="max-lg:px-[10%] relative lg:pt-16 w-full">
      <ProjectSummary
        alternate={false}
        sectionRef={ref}
        visible={visible}
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
});

export default Projects;
