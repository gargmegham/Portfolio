"use client";

import React, { forwardRef } from "react";
import ProjectSummary from "@/ui/project-summary/index";

const projects = [
  {
    tags: ["Next.js", "Supabase", "Python"],
    alternate: false,
    title: "Jotlify",
    caption: "Curated research for everyone",
    description:
      "Use AI to read or listen to curated research papers in your domain.",
    buttonText: "View project",
    buttonLink: "https://www.jotlify.com",
    model: {
      type: "laptop",
      alt: "Jotlify",
      textures: [
        {
          srcSet: "/images/jotlify.png 1280w",
          placeholder: "/images/placeholder.jpg",
        },
      ],
    },
  },
  {
    tags: ["Next.js", "Nuxt.js", "Django", "PostgreSQL", "AWS"],
    alternate: true,
    title: "Servcy",
    caption: "Project Tracker For Agencies",
    description:
      "Gain visibility over your project deliverables, costs and timeline.",
    buttonText: "View project",
    buttonLink: "https://servcy.com",
    model: {
      type: "laptop",
      alt: "Servcy",
      textures: [
        {
          srcSet: "/images/servcy.png 1280w",
          placeholder: "/images/placeholder.jpg",
        },
      ],
    },
  },
  {
    tags: ["Next.js", "Supabase", "Python"],
    alternate: false,
    title: "ShieldPeer",
    caption: "Optimize selling strategy for steam assets",
    description:
      "Sell your steam assets on marketplaces with granular parameters.",
    buttonText: "View project",
    buttonLink: "https://www.shieldpeer.in",
    model: {
      type: "laptop",
      alt: "ShieldPeer",
      textures: [
        {
          srcSet: "/images/shield-peer.png 1280w",
          placeholder: "/images/placeholder.jpg",
        },
      ],
    },
  },  
];

const Projects = forwardRef(({ visible }, ref) => {
  return (
    <>
      {projects.map((project, index) => (
        <section
          id={`project-${index + 1}`}
          key={index}
          className="relative bg-grid-white/[0.2] flex items-center justify-center"
        >
          <ProjectSummary
            tags={project.tags}
            alternate={project.alternate}
            sectionRef={ref?.[index]}
            visible={visible?.[index]}
            index={index + 1}
            title={project.title}
            caption={project.caption}
            description={project.description}
            buttonText={project.buttonText}
            buttonLink={project.buttonLink}
            model={project.model}
          />
        </section>
      ))}
    </>
  );
});

export default Projects;
