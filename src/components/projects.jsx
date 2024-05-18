"use client";

import React, { forwardRef } from "react";
import ProjectSummary from "@/ui/three/project-summary";

const Projects = forwardRef(({ visible }, ref) => {
  console.info("Projects component loaded", visible, ref);
  return (
    <div id="projects" className="max-lg:px-[10%] relative lg:pt-16 w-full">
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
    </div>
  );
});

export default Projects;
