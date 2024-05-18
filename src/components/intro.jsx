"use client";

import { forwardRef } from "react";
import { DecoderText } from "@/ui/decoder-text";
import {
  IconMapPin,
  IconBrandLinkedin,
  IconBrandYoutube,
  IconBrandTwitter,
  IconBrandGithub,
} from "@tabler/icons-react";
import { RiScrollToBottomLine } from "react-icons/ri";
import { motion, AnimatePresence } from "framer-motion";
import { Highlight } from "@/ui/aceternity/hero-highlight";

const Intro = forwardRef(({ ref, scrollIndicatorHidden }) => {
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
          duration: 0.2,
        }}
        className="max-lg:px-[10%] py-20 md:text-4xl text-2xl relative font-bold h-screen flex items-center text-teritiary-300"
      >
        <div className="space-y-4">
          <div className="flex gap-x-4 font-gotham-bold">
            <img
              src="/svgs/logo.svg"
              width={160}
              alt="Me"
              className="p-2 bg-secondary-200 rounded-xl custom-shadow-200"
            />
            <div className="self-end space-y-1">
              <DecoderText text="Megham Garg" delay={500} />
              <div className="font-sans text-base flex gap-x-1 items-center">
                <IconMapPin className="size-4" />
                <DecoderText text="India" delay={500} />
              </div>
              <div className="font-sans text-base flex gap-x-2 items-center text-teritiary-400">
                <a
                  href="https://www.linkedin.com/in/megham-garg/"
                  target="_blank"
                  rel="noreferrer"
                >
                  <IconBrandLinkedin className="size-4 hover:text-teritiary-700 cursor-pointer" />
                </a>
                <a
                  href="https://x.com/garg_megham"
                  target="_blank"
                  rel="noreferrer"
                >
                  <IconBrandTwitter className="size-4 hover:text-teritiary-700 cursor-pointer" />
                </a>
                <a
                  href="https://github.com/gargmegham"
                  target="_blank"
                  rel="noreferrer"
                >
                  <IconBrandGithub className="size-4 hover:text-teritiary-700 cursor-pointer" />
                </a>
                <a
                  href="https://youtube.com/@megham_"
                  target="_blank"
                  rel="noreferrer"
                >
                  <IconBrandYoutube className="size-4 hover:text-teritiary-700 cursor-pointer" />
                </a>
              </div>
            </div>
          </div>
          <div className="text-teritiary-800 text-5xl font-gotham-book">
            Building software{" "}
            <Highlight className="text-black dark:text-white">
              one line at a time
            </Highlight>
          </div>
        </div>
        {!scrollIndicatorHidden && (
          <RiScrollToBottomLine
            className="absolute bottom-10 left-[50%] cursor-pointer animate-pulse opacity-30 text-teritiary-400 size-8 hidden md:block"
            onClick={() => {
              window.scrollTo({
                top: window.innerHeight,
                behavior: "smooth",
              });
            }}
          />
        )}
      </motion.section>
    </AnimatePresence>
  );
});

export default Intro;
