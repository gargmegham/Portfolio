"use client";

import React, { forwardRef } from "react";
import ProjectSummary from "@/ui/three/project-summary";

const Projects = forwardRef(({ visible }, ref) => {
  console.info("Projects component loaded", visible, ref);
  return (
    <section
      id="projects"
      className="relative bg-grid-white/[0.2] lg:pt-16 flex items-center"
    >
      <ProjectSummary
        alternate={false}
        sectionRef={ref?.[0]}
        visible={visible}
        index={1}
        title="Servcy"
        caption="Project Tracker For Agencies"
        description="Gain visibility over your project deliverables, costs and timeline."
        buttonText="View project"
        buttonLink="https://servcy.com"
        model={{
          type: "laptop",
          alt: "Servcy",
          textures: [
            {
              srcSet: "/images/servcy.png 1280w",
              placeholder: "/images/placeholder.jpg",
            },
          ],
        }}
      />
    </section>
  );
});

export default Projects;
