"use client";

import React, { forwardRef } from "react";
import ProjectSummary from "@/ui/project-summary/index";

const projects = [
  {
    tags: ["Next.js", "Supabase", "AI Agents", "RAG", "Azure"],
    alternate: false,
    title: "Jotlify",
    caption: "Curated research for everyone",
    description:
      "An AI-powered research companion that transforms dense academic papers into engaging, digestible stories, key insights, and audio narrations—making complex research accessible on the go—ideal for students, professionals, and lifelong learners.",
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
      "A project‑tracking ecosystem tailored for freelance agencies—offering full visibility into deliverables, time, issues, inboxes, and budgets—to help streamline freelance operations and boost productivity.",
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
    tags: ["Next.js", "GCP", "Firebase"],
    alternate: false,
    title: "ShieldPeer",
    caption: "Optimize selling strategy for steam assets",
    description:
      "A secure, configurable trading bot for selling Steam/CS:GO skins via Waxpeer. Leveraging live pricing data (PriceEmpire), fractional undercutting, and integrations with Steam/Waxpeer APIs, it automates asset sales while protecting user credentials.",
    buttonText: "View project",
    buttonLink: "https://shieldpeer.meghamgarg.com",
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
