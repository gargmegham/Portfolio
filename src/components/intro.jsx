"use client";

import { forwardRef } from "react";
import {
  IconBrandLinkedin,
  IconBrandYoutube,
  IconBrandGithub,
} from "@tabler/icons-react";
import { RiScrollToBottomLine } from "react-icons/ri";
import { motion, AnimatePresence } from "framer-motion";
import { Highlight } from "@/ui/aceternity/hero-highlight";

const Intro = forwardRef(({ scrollIndicatorHidden }, ref) => {
  return (
    <AnimatePresence mode="wait">
      <motion.section
        ref={ref}
        id="about"
        initial={{
          opacity: 0,
          x: -100,
        }}
        animate={{
          x: 0,
          opacity: 1,
        }}
        transition={{
          duration: 0.5,
        }}
        className="md:text-4xl text-2xl bg-dot-white/[0.2] relative font-bold flex items-center text-teritiary-300 justify-center"
      >
        <div className="max-w-4xl mx-auto space-y-8 rounded-2xl p-4">
          {/* Header */}
          <div className="space-y-4">
            <h1 className="text-5xl md:text-7xl font-gotham-bold text-teritiary-300 leading-tight">
              hi, i&apos;m <span className="text-white">megham</span>.
            </h1>
            <p className="text-xl md:text-2xl text-teritiary-400 leading-relaxed max-w-3xl">
              i build software that solves real problems — and i{" "}
              <Highlight className="text-white font-semibold">
                ship fast
              </Highlight>
              .
            </p>
          </div>

          {/* Story */}
          <div className="space-y-6 text-lg md:text-xl text-teritiary-300 leading-relaxed">
            <p>
              senior full-stack engineer. i run a{" "}
              <Highlight className="text-white font-semibold">
                dev studio
              </Highlight>{" "}
              helping startups go from idea to MVP, and ship my own products on the side.
            </p>
            <p className="text-teritiary-400">
              i write about what i build — shipping fast, AI products, and the occasional mistake worth documenting.
            </p>
          </div>

          {/* Social Links */}
          <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center justify-between pt-8 border-t border-white/10">
            <div className="flex gap-4 items-center">
              <a
                href="https://www.linkedin.com/in/megham-garg/"
                target="_blank"
                aria-label="LinkedIn"
                rel="noreferrer"
                className="text-teritiary-400 hover:text-white transition-colors"
              >
                <IconBrandLinkedin className="size-5" />
              </a>
              <a
                href="https://github.com/gargmegham"
                target="_blank"
                aria-label="GitHub"
                rel="noreferrer"
                className="text-teritiary-400 hover:text-white transition-colors"
              >
                <IconBrandGithub className="size-5" />
              </a>
              <a
                href="https://youtube.com/@megham_"
                target="_blank"
                aria-label="YouTube"
                rel="noreferrer"
                className="text-teritiary-400 hover:text-white transition-colors"
              >
                <IconBrandYoutube className="size-5" />
              </a>
            </div>
          </div>
        </div>
        {!scrollIndicatorHidden && (
          <button
            aria-label="scroll-indicator"
            onClick={() => {
              window.scrollTo({
                top: window.innerHeight,
                behavior: "smooth",
              });
            }}
            className="absolute bottom-10 left-[50%] hidden md:block"
          >
            <RiScrollToBottomLine className="animate-pulse opacity-30 text-teritiary-400 size-8" />
          </button>
        )}
      </motion.section>
    </AnimatePresence>
  );
});

export default Intro;
